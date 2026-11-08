import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

// Shared by `npm run hero:capture` and `npm run verify:hero-capture`.
export const HERO_SOURCE_DIR = "src/lib/marketing-content/sections/homeHero";
export const HERO_CAPTURE_DIR = `${HERO_SOURCE_DIR}/capture`;
export const HERO_CAPTURE_MANIFEST = `${HERO_CAPTURE_DIR}/manifest.json`;
export const HERO_CAPTURE_ROUTE = "/internal/hero-collage";
export const HERO_CAPTURE_THEMES = ["light", "dark"];

// What the capture fixture renders: the live library and everything it
// imports from this folder. The hero section text and the image renderer
// (HomeHeroSection.tsx, HomeHeroPreviewCollage.tsx) are deliberately excluded,
// so text or motion edits never invalidate the captures.
export const HERO_CAPTURED_SOURCES = [
	"HomeHeroChoices.tsx",
	"HomeHeroLibrary.tsx",
	"heroSpecimens.tsx",
	"pack.d.mts",
	"pack.mjs",
	"previews",
];

// One capture per hero layout range. The hero changes at Tailwind `sm` (640)
// and `lg` (1024); its background box is full-bleed, so wide screens beyond
// `2xl` (1536) get their own wider capture. Each viewport is a common device
// in its range; the captured box is the hero's measured background box there.
export const HERO_CAPTURE_TARGETS = [
	{ width: 390, viewportHeight: 844, range: "below sm (<640px)" },
	{ width: 768, viewportHeight: 1024, range: "sm to lg (640-1023px)" },
	{ width: 1440, viewportHeight: 900, range: "lg to 2xl (1024-1535px)" },
	{ width: 1920, viewportHeight: 1080, range: "2xl and wider (>=1536px)" },
];

export function heroCaptureFileName(width, theme) {
	return `hero-collage-${width}-${theme}.webp`;
}

async function listFiles(current) {
	const files = [];
	for (const entry of await fs.readdir(current, { withFileTypes: true })) {
		const absolutePath = path.join(current, entry.name);
		if (entry.isDirectory()) files.push(...(await listFiles(absolutePath)));
		else if (entry.isFile()) files.push(absolutePath);
	}
	return files;
}

// Hash the collage sources the capture renders.
export async function hashHeroSource(repoRoot) {
	const sourceRoot = path.join(repoRoot, HERO_SOURCE_DIR);
	const files = [];
	for (const entry of HERO_CAPTURED_SOURCES) {
		const absolutePath = path.join(sourceRoot, entry);
		const stat = await fs.stat(absolutePath);
		files.push(
			...(stat.isDirectory() ? await listFiles(absolutePath) : [absolutePath]),
		);
	}
	const entries = files
		.map((file) => ({
			absolutePath: file,
			relativePath: path.relative(sourceRoot, file).split(path.sep).join("/"),
		}))
		.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
	const hash = createHash("sha256");
	for (const file of entries) {
		hash.update(file.relativePath);
		hash.update("\0");
		hash.update(await fs.readFile(file.absolutePath));
		hash.update("\0");
	}
	return { fileCount: entries.length, sha256: hash.digest("hex") };
}
