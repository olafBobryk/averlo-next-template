// Serve worker/font data from our origin; keep their version tied to the installed PDF.js.
import { cp, mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const root = dirname(require.resolve("pdfjs-dist/package.json"));
const { version } = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const destination = join(process.cwd(), "public", "file-viewer", "pdfjs", version);
await mkdir(destination, { recursive: true });
await Promise.all([
	cp(join(root, "build/pdf.worker.min.mjs"), join(destination, "pdf.worker.min.mjs")),
	...['cmaps', 'standard_fonts'].map(folder => cp(join(root, folder), join(destination, folder), { recursive: true })),
]);
