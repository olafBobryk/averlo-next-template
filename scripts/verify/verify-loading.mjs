#!/usr/bin/env node
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const args = process.argv.slice(2);
assert.equal(
	args.length,
	2,
	"Usage: npm run verify:loading -- --base-url <verified-local-preview-url>",
);
assert.equal(args[0], "--base-url");
const baseUrl = new URL(args[1]);
assert.ok(
	["http:", "https:"].includes(baseUrl.protocol) &&
		["localhost", "127.0.0.1", "[::1]"].includes(baseUrl.hostname) &&
		!baseUrl.username &&
		!baseUrl.password,
	"Loading verification requires a loopback Preview URL",
);
assert.equal(
	(await fetch(new URL("/api/health", baseUrl))).status,
	200,
	"Preview health must be reachable",
);
const dashboardInstalled = existsSync(
	"src/app/(site)/dashboard/records/page.tsx",
);
const cases = ["auth", "records"];
if (existsSync(".template-profile.json")) {
	const receipt = JSON.parse(
		await fs.readFile(".template-profile.json", "utf8"),
	);
	assert.equal(
		dashboardInstalled,
		receipt.assembly.surfaces.includes("dashboard"),
		"Loading pilot must match installed dashboard surfaces",
	);
	for (const name of [...cases, "shared"])
		assert.equal(
			existsSync(`scripts/verify/loading/${name}.mjs`),
			dashboardInstalled,
			"Omitted dashboard cases must not be retained",
		);
}
const output = path.resolve("test-results/loading");
await fs.mkdir(output, { recursive: true });
const results = [];
let failed = false;
if (!dashboardInstalled) {
	results.push({
		name: "dashboard-pilot",
		status: "omitted",
		reason:
			"Dashboard/authentication surfaces are not installed; no case modules imported.",
	});
} else {
	const browser = await chromium.launch({ headless: true });
	try {
		for (const viewport of [
			{ width: 1280, height: 900 },
			{ width: 390, height: 844 },
		]) {
			for (const name of cases) {
				const context = await browser.newContext({
					viewport,
					reducedMotion: "reduce",
				});
				const page = await context.newPage();
				// A fresh generated preview may compile its first detail/reference route.
				page.setDefaultTimeout(60_000);
				page.setDefaultNavigationTimeout(120_000);
				const scenarios = [];
				const id = `${name}-${viewport.width}`;
				try {
					const { verify } = await import(`./loading/${name}.mjs`);
					await verify({
						context,
						page,
						baseUrl: baseUrl.href,
						output,
						id,
						record: (scenario) => scenarios.push(scenario),
					});
					results.push({ name: id, status: "passed", scenarios });
					console.log(`ok ${id}: ${scenarios.length} scenario groups`);
				} catch (error) {
					failed = true;
					const screenshot = path.join(output, `${id}-failure.png`);
					await page
						.screenshot({ path: screenshot, fullPage: true })
						.catch(() => {});
					results.push({
						name: id,
						status: "failed",
						scenarios,
						error: error.message,
						screenshot,
					});
					console.error(`FAIL ${id}: ${error.stack}`);
				} finally {
					await context.close();
				}
			}
		}
	} finally {
		await browser.close();
	}
}
await fs.writeFile(
	path.join(output, "results.json"),
	`${JSON.stringify({ verifiedAt: new Date().toISOString(), baseUrl: baseUrl.href, results }, null, 2)}\n`,
);
if (failed) process.exitCode = 1;
else
	console.log(
		`Loading verification passed (${results.filter((result) => result.status === "passed").length} case/viewport combinations).`,
	);
