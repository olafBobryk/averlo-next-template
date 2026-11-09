import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import {
	HERO_CAPTURE_DIR,
	HERO_CAPTURE_MANIFEST,
	HERO_CAPTURE_TARGETS,
	HERO_CAPTURE_THEMES,
	HERO_CAPTURED_SOURCES,
	HERO_SOURCE_DIR,
	hashHeroSource,
	heroCaptureFileName,
} from "../_lib/hero-capture.mjs";

const root = process.cwd();
const recapture =
	"Start the development preview (`npm run dev`) and run `npm run hero:capture`, then commit the updated captures.";

function fail(message) {
	console.error(`Hero capture verification failed: ${message}\n${recapture}`);
	process.exit(1);
}

const manifestPath = path.join(root, HERO_CAPTURE_MANIFEST);
if (!existsSync(manifestPath)) fail(`${HERO_CAPTURE_MANIFEST} is missing.`);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

const expectedWidths = HERO_CAPTURE_TARGETS.map((target) => target.width);
if (JSON.stringify(manifest.widths) !== JSON.stringify(expectedWidths)) {
	fail(
		`manifest widths ${JSON.stringify(manifest.widths)} do not match ${JSON.stringify(expectedWidths)}.`,
	);
}
for (const width of expectedWidths) {
	for (const theme of HERO_CAPTURE_THEMES) {
		const file = heroCaptureFileName(width, theme);
		if (!existsSync(path.join(root, HERO_CAPTURE_DIR, file))) {
			fail(`${HERO_CAPTURE_DIR}/${file} is missing.`);
		}
	}
}

const source = await hashHeroSource(root);
if (manifest.source?.sha256 !== source.sha256) {
	fail(
		`the hero collage sources in ${HERO_SOURCE_DIR} (${HERO_CAPTURED_SOURCES.join(", ")}) changed since they were captured (manifest ${manifest.source?.sha256 ?? "none"}, source ${source.sha256}).`,
	);
}

console.log(
	`Hero capture verification passed: ${expectedWidths.length * HERO_CAPTURE_THEMES.length} captures match the collage sources in ${HERO_SOURCE_DIR} (${source.fileCount} files).`,
);
