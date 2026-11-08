// Fixture checks for the GritQL lint plugins in biome/plugins. Each rule runs
// alone against its fixtures in a disposable workspace, so the repository's
// own includes and the root lint never see the intentionally bad fixtures.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pluginsDir = path.join(here, "..", "plugins");
const fixturesDir = path.join(here, "fixtures");
const biomeCli = createRequire(import.meta.url).resolve(
	"@biomejs/biome/bin/biome",
);

const rules = fs
	.readdirSync(pluginsDir)
	.filter((file) => file.endsWith(".grit"))
	.map((file) => path.basename(file, ".grit"));

function lintWithRule(rule, sources) {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), `biome-${rule}-`));
	try {
		fs.writeFileSync(
			path.join(workspace, "biome.json"),
			JSON.stringify({
				linter: { enabled: true, rules: { preset: "none" } },
				plugins: [path.join(pluginsDir, `${rule}.grit`)],
			}),
		);
		for (const [name, source] of Object.entries(sources)) {
			fs.writeFileSync(path.join(workspace, name), source);
		}
		let output;
		try {
			output = execFileSync(
				process.execPath,
				[biomeCli, "lint", "--reporter=json", "--max-diagnostics=none", "."],
				{ cwd: workspace, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
			);
		} catch (error) {
			output = error.stdout;
		}
		const report = JSON.parse(output);
		return report.diagnostics;
	} finally {
		fs.rmSync(workspace, { recursive: true, force: true });
	}
}

function expectedCount(source) {
	const match = source.match(/^\/\/ expect (\d+)/);
	assert.ok(match, "fixtures start with `// expect <count>`");
	return Number(match[1]);
}

for (const rule of rules) {
	for (const kind of ["invalid", "valid"]) {
		const fixture = `${rule}.${kind}.tsx`;
		test(`${rule} reports the expected ${kind} fixture hits`, () => {
			const source = fs.readFileSync(path.join(fixturesDir, fixture), "utf8");
			const diagnostics = lintWithRule(rule, { [fixture]: source });
			const pluginErrors = diagnostics.filter(
				(diagnostic) => diagnostic.category === "plugin",
			);
			assert.deepEqual(
				pluginErrors
					.filter((diagnostic) => diagnostic.severity !== "error")
					.map((diagnostic) => diagnostic.message),
				[],
				"the plugin compiles and runs without errors",
			);
			assert.equal(
				pluginErrors.length,
				expectedCount(source),
				pluginErrors
					.map((diagnostic) => `${diagnostic.location.start.line}`)
					.join(","),
			);
		});
	}

	test(`${rule} diagnostics are suppressible per line`, () => {
		const source = fs.readFileSync(
			path.join(fixturesDir, `${rule}.invalid.tsx`),
			"utf8",
		);
		// The first statement of every invalid fixture is a single-line hit.
		const firstHit = source.split("\n")[1];
		const diagnostics = lintWithRule(rule, {
			"plain.tsx": `${firstHit}\n`,
			"ignored.tsx": `// biome-ignore lint/plugin/${rule}: fixture\n${firstHit}\n`,
		});
		const hitsIn = (file) =>
			diagnostics.filter(
				(diagnostic) =>
					diagnostic.category === "plugin" &&
					path.basename(diagnostic.location.path) === file,
			).length;
		assert.ok(hitsIn("plain.tsx") > 0);
		assert.equal(hitsIn("ignored.tsx"), 0);
	});
}
