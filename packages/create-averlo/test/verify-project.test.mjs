import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { parseVerifyArgs, verifyProject } from "../lib/verify-project.mjs";

const git = (args, cwd) =>
	execFileSync("git", args, { cwd, encoding: "utf8", stdio: "pipe" });

async function createFixture(
	root,
	{ profile = "thin-start", content = "static" } = {},
) {
	await fs.mkdir(root, { recursive: true });
	const files = {
		"package.json": JSON.stringify({ name: path.basename(root) }),
		".template-profile.json": JSON.stringify({
			schemaVersion: 2,
			profile,
			content,
		}),
		"package-lock.json": "{}",
		"PRODUCT.md": "# Product\n",
		"AGENTS.md": "# Agents\n",
		"docs/README.md": "# Docs\n",
		".specify/memory/constitution.md": "# Constitution\n",
		"specs/README.md": "# Specs\n",
		".gitignore": "node_modules\n",
	};
	for (const [relativePath, text] of Object.entries(files)) {
		await fs.mkdir(path.dirname(path.join(root, relativePath)), {
			recursive: true,
		});
		await fs.writeFile(path.join(root, relativePath), text);
	}
	await fs.mkdir(path.join(root, "node_modules"));
	git(["init", "-q", "-b", "main"], root);
	git(["add", "-A"], root);
	git(
		[
			"-c",
			"user.name=Test",
			"-c",
			"user.email=test@example.com",
			"commit",
			"-q",
			"-m",
			"Initial project from Averlo",
		],
		root,
	);
}

test("parses the verify subcommand contract", () => {
	assert.deepEqual(
		parseVerifyArgs([
			"demo",
			"--profile",
			"full",
			"--content",
			"static",
			"--no-install",
		]),
		{
			content: "static",
			install: false,
			profile: "full",
			projectDirectory: "demo",
		},
	);
	assert.throws(() => parseVerifyArgs([]), /requires a project directory/u);
	assert.throws(
		() => parseVerifyArgs(["a", "--content", "x"]),
		/static or payload-ready/u,
	);
});

test("passes a correct project and reports every mismatch otherwise", async () => {
	const temp = await fs.mkdtemp(
		path.join(os.tmpdir(), "create-averlo-verify-"),
	);
	try {
		const root = path.join(temp, "demo-project");
		await createFixture(root);
		assert.deepEqual(
			await verifyProject({
				projectDirectory: root,
				profile: "thin-start",
				content: "static",
			}),
			[],
		);

		const wrongSelection = await verifyProject({
			projectDirectory: root,
			profile: "full",
			content: "payload-ready",
			install: false,
		});
		assert.equal(wrongSelection.length, 3);

		await fs.mkdir(path.join(root, "specs/template"), { recursive: true });
		await fs.writeFile(path.join(root, "specs/template/spec.md"), "leak\n");
		git(["remote", "add", "origin", "https://example.com/repo.git"], root);
		const leaked = await verifyProject({ projectDirectory: root });
		assert.ok(leaked.some((failure) => failure.includes("specs/template")));
		assert.ok(leaked.some((failure) => failure.includes("not clean")));
		assert.ok(leaked.some((failure) => failure.includes("remote")));
	} finally {
		await fs.rm(temp, { recursive: true, force: true });
	}
});
