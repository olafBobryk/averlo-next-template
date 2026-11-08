#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import sharp from "sharp";
import {
	HERO_CAPTURE_DIR,
	HERO_CAPTURE_MANIFEST,
	HERO_CAPTURE_ROUTE,
	HERO_CAPTURE_TARGETS,
	HERO_CAPTURE_THEMES,
	HERO_CAPTURED_SOURCES,
	HERO_SOURCE_DIR,
	hashHeroSource,
	heroCaptureFileName,
} from "./_lib/hero-capture.mjs";
import { buildCaptureUrls, readPreviewMetadata } from "./preview-capture.mjs";

// Must match APP_SETTINGS_STORAGE_KEY in src/components/ui/foundations/appearance.ts.
const APP_SETTINGS_STORAGE_KEY = "averlo-ui-settings";
const DEFAULT_SCALE = 2;
const DEFAULT_QUALITY = 80;
const DEFAULT_TIMEOUT_MS = 120_000;
const STABLE_MS = 1_500;

const HELP = `Usage: npm run hero:capture -- [options]

Render the live home hero collage on a running app and save it as the
pre-captured images the home page serves (${HERO_CAPTURE_TARGETS.length} widths x light/dark),
plus ${HERO_CAPTURE_MANIFEST}.

The app must already be running in development (the capture route
${HERO_CAPTURE_ROUTE} is not served in production). By default the base URL
comes from the repository preview metadata (.codex/preview.json, see
\`npm run dev\`); pass --base-url to use another development server.

Options:
  --base-url <url>   Development server base URL, e.g. http://localhost:3000
  --scale <n>        Device pixel ratio of the captures (default: ${DEFAULT_SCALE})
  --quality <n>      WebP quality 1-100 (default: ${DEFAULT_QUALITY})
  --timeout <ms>     Per-page timeout (default: ${DEFAULT_TIMEOUT_MS})
  --help             Show this help
`;

function parseArgs(argv) {
	const options = {
		baseUrl: null,
		help: false,
		quality: DEFAULT_QUALITY,
		scale: DEFAULT_SCALE,
		timeoutMs: DEFAULT_TIMEOUT_MS,
	};
	for (let index = 0; index < argv.length; index += 1) {
		const flag = argv[index];
		if (flag === "--help") {
			options.help = true;
			continue;
		}
		const value = argv[index + 1];
		if (!value || value.startsWith("--")) {
			throw new Error(`${flag} requires a value.`);
		}
		index += 1;
		if (flag === "--base-url") options.baseUrl = value;
		else if (flag === "--scale") options.scale = Number(value);
		else if (flag === "--quality") options.quality = Number.parseInt(value, 10);
		else if (flag === "--timeout") {
			options.timeoutMs = Number.parseInt(value, 10);
		} else throw new Error(`Unknown option: ${flag}`);
	}
	if (!(options.scale >= 1 && options.scale <= 3)) {
		throw new Error("--scale must be between 1 and 3.");
	}
	if (!(options.quality >= 1 && options.quality <= 100)) {
		throw new Error("--quality must be between 1 and 100.");
	}
	return options;
}

async function resolveBase(root, baseUrl) {
	if (baseUrl) return { automationUrl: null, localUrl: baseUrl };
	const metadata = await readPreviewMetadata(root);
	return {
		automationUrl: metadata.automationUrl ?? null,
		localUrl: metadata.localUrl,
	};
}

async function openPage(browser, { height, scale, width }) {
	const context = await browser.newContext({
		deviceScaleFactor: scale,
		viewport: { height, width },
	});
	const page = await context.newPage();
	const pageErrors = [];
	page.on("pageerror", (error) => pageErrors.push(error.message));
	return { context, page, pageErrors };
}

// Switch theme through the settings storage sync the app already listens to,
// the same path as a theme change in another tab.
async function applyTheme(page, theme, timeoutMs) {
	await page.evaluate(
		([key, appearance]) => {
			let settings = {};
			try {
				settings = JSON.parse(window.localStorage.getItem(key) || "{}") || {};
			} catch {}
			window.localStorage.setItem(
				key,
				JSON.stringify({ ...settings, appearance }),
			);
			window.dispatchEvent(new StorageEvent("storage", { key }));
		},
		[APP_SETTINGS_STORAGE_KEY, theme],
	);
	await page.waitForFunction(
		(dark) =>
			document.documentElement.classList.contains("dark") === dark &&
			!document.documentElement.dataset.themeSwitching,
		theme === "dark",
		{ timeout: timeoutMs },
	);
}

async function goto(page, url, timeoutMs) {
	const response = await page.goto(url, {
		timeout: timeoutMs,
		waitUntil: "load",
	});
	if (!response || response.status() >= 400) {
		throw new Error(
			`${url} returned ${response?.status() ?? "no response"}. Is a development server running?`,
		);
	}
}

// The hero background box at this viewport is the size the capture must fill.
async function measureHeroBox(browser, urls, target, timeoutMs) {
	const { context, page } = await openPage(browser, {
		height: target.viewportHeight,
		scale: 1,
		width: target.width,
	});
	try {
		await goto(page, urls.home, timeoutMs);
		const box = await page
			.locator("[data-fidelity-preview-collage]")
			.first()
			.evaluate((element) => {
				const rect = element.getBoundingClientRect();
				return {
					height: Math.round(rect.height),
					width: Math.round(rect.width),
				};
			});
		if (box.width !== target.width || box.height < 1) {
			throw new Error(
				`Hero background box at ${target.width}px measured ${box.width}x${box.height}.`,
			);
		}
		return box;
	} finally {
		await context.close();
	}
}

// Wait until packing ran, fonts loaded and no specimen moves or resizes.
async function waitForSettledCollage(page, timeoutMs) {
	await page.waitForSelector("[data-hero-library][data-packing-ready]", {
		timeout: timeoutMs,
	});
	await page.evaluate(async () => {
		await document.fonts.ready;
	});
	await page.waitForFunction(
		() => Array.from(document.images).every((image) => image.complete),
		undefined,
		{ timeout: timeoutMs },
	);
	const deadline = Date.now() + timeoutMs;
	let previous = "";
	let stableSince = Date.now();
	while (Date.now() < deadline) {
		const signature = await page.evaluate(() => {
			const root = document.querySelector("[data-hero-library]");
			const cluster = root?.querySelector("[data-hero-cluster]");
			const parts = [
				root?.getAttribute("data-packing-ready"),
				cluster?.getAttribute("style"),
				document.getAnimations().filter((a) => a.playState === "running")
					.length,
			];
			for (const element of root?.querySelectorAll(
				"[data-hero-specimen], [data-specimen-native]",
			) ?? []) {
				const rect = element.getBoundingClientRect();
				parts.push(
					rect.x.toFixed(1),
					rect.y.toFixed(1),
					rect.width.toFixed(1),
					rect.height.toFixed(1),
				);
			}
			return parts.join("|");
		});
		if (signature !== previous) {
			previous = signature;
			stableSince = Date.now();
		} else if (Date.now() - stableSince >= STABLE_MS) {
			return;
		}
		await page.waitForTimeout(150);
	}
	throw new Error("The hero collage did not settle before the timeout.");
}

async function captureCollage(browser, urls, box, theme, options) {
	const { context, page, pageErrors } = await openPage(browser, {
		height: box.height,
		scale: options.scale,
		width: box.width,
	});
	try {
		await goto(page, urls.capture, options.timeoutMs);
		// The Next.js development indicator is not part of the collage.
		await page.addStyleTag({
			content: "nextjs-portal{display:none!important}",
		});
		await applyTheme(page, theme, options.timeoutMs);
		await waitForSettledCollage(page, options.timeoutMs);
		const state = await page.evaluate(() => ({
			dark: document.documentElement.classList.contains("dark"),
			opacity: getComputedStyle(
				document.querySelector("[data-hero-cluster]") ?? document.body,
			).opacity,
			unavailable: document.querySelectorAll("[data-specimen-unavailable]")
				.length,
		}));
		if (state.dark !== (theme === "dark")) {
			throw new Error(`The ${theme} theme was not applied to the capture.`);
		}
		if (state.opacity !== "1") {
			throw new Error("The hero cluster is not fully visible.");
		}
		if (state.unavailable > 0) {
			throw new Error(
				`${state.unavailable} hero specimen(s) failed to render.`,
			);
		}
		if (pageErrors.length > 0) {
			throw new Error(`Browser page error: ${pageErrors[0]}`);
		}
		return await page.locator("[data-hero-capture-box]").screenshot({
			animations: "disabled",
			scale: "device",
			type: "png",
		});
	} finally {
		await context.close();
	}
}

async function main() {
	const options = parseArgs(process.argv.slice(2));
	if (options.help) {
		process.stdout.write(HELP);
		return;
	}
	const root = process.cwd();
	const base = await resolveBase(root, options.baseUrl);
	const urlFor = (route) =>
		buildCaptureUrls({ ...base, baseUrl: null, review: null, route })
			.captureUrl;
	const urls = { capture: urlFor(HERO_CAPTURE_ROUTE), home: urlFor("/") };
	const outputDir = path.join(root, HERO_CAPTURE_DIR);
	await fs.mkdir(outputDir, { recursive: true });

	const browser = await chromium.launch({ headless: true });
	const captures = [];
	try {
		for (const target of HERO_CAPTURE_TARGETS) {
			const box = await measureHeroBox(
				browser,
				urls,
				target,
				options.timeoutMs,
			);
			const images = {};
			for (const theme of HERO_CAPTURE_THEMES) {
				const png = await captureCollage(browser, urls, box, theme, options);
				const file = heroCaptureFileName(target.width, theme);
				const info = await sharp(png)
					.webp({ effort: 6, quality: options.quality })
					.toFile(path.join(outputDir, file));
				images[theme] = { file, height: info.height, width: info.width };
				console.log(
					`${file}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KiB`,
				);
			}
			captures.push({
				box,
				images,
				range: target.range,
				viewport: { height: target.viewportHeight, width: target.width },
				width: target.width,
			});
		}
	} finally {
		await browser.close();
	}

	const source = await hashHeroSource(root);
	const manifest = {
		schemaVersion: 1,
		generatedBy: "npm run hero:capture",
		source: {
			directory: HERO_SOURCE_DIR,
			files: HERO_CAPTURED_SOURCES,
			...source,
		},
		deviceScaleFactor: options.scale,
		format: { quality: options.quality, type: "webp" },
		widths: captures.map((capture) => capture.width),
		captures,
	};
	await fs.writeFile(
		path.join(root, HERO_CAPTURE_MANIFEST),
		`${JSON.stringify(manifest, null, "\t")}\n`,
	);
	// Keep the committed manifest in the repository's Biome format.
	spawnSync("npx", ["biome", "format", "--write", HERO_CAPTURE_MANIFEST], {
		cwd: root,
		stdio: "ignore",
	});
	console.log(`Wrote ${HERO_CAPTURE_MANIFEST} (source ${source.sha256}).`);
}

main().catch((error) => {
	console.error(`Hero capture failed: ${error.message}`);
	process.exitCode = 1;
});
