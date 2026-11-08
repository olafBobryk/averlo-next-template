import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const CONTENT_MODES = new Set(["static", "payload-ready"]);

export function parseVerifyArgs(argv) {
	const options = {
		content: undefined,
		install: true,
		profile: undefined,
		projectDirectory: undefined,
	};
	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (arg === "--profile" || arg === "--content") {
			const value = argv[index + 1];
			if (!value || value.startsWith("--"))
				throw new Error(`${arg} requires a value.`);
			if (arg === "--content" && !CONTENT_MODES.has(value))
				throw new Error("--content requires static or payload-ready.");
			options[arg.slice(2)] = value;
			index += 1;
		} else if (arg === "--no-install") {
			options.install = false;
		} else if (arg.startsWith("--")) {
			throw new Error(`Unknown verify option: ${arg}`);
		} else if (options.projectDirectory) {
			throw new Error(
				"create-averlo verify accepts exactly one project directory.",
			);
		} else {
			options.projectDirectory = arg;
		}
	}
	if (!options.projectDirectory)
		throw new Error("create-averlo verify requires a project directory.");
	return options;
}

async function exists(targetPath) {
	try {
		await fs.access(targetPath);
		return true;
	} catch {
		return false;
	}
}

async function readJson(targetPath) {
	return JSON.parse(await fs.readFile(targetPath, "utf8"));
}

function git(args, cwd) {
	return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

/**
 * Checks a freshly created project. Returns a list of mismatches; an empty
 * list means the project passed every check.
 */
export async function verifyProject({
	projectDirectory,
	profile,
	content,
	install = true,
	cwd = process.cwd(),
}) {
	const root = path.resolve(cwd, projectDirectory);
	const failures = [];
	const check = (ok, message) => {
		if (!ok) failures.push(message);
	};
	if (!(await exists(root))) return [`Project directory is missing: ${root}`];

	// 1. Package name matches the destination basename.
	const pkgPath = path.join(root, "package.json");
	const pkg = (await exists(pkgPath)) ? await readJson(pkgPath) : {};
	check(
		pkg.name === path.basename(root),
		`package.json name is ${JSON.stringify(pkg.name)}, expected ${JSON.stringify(path.basename(root))}.`,
	);

	// 2. Schema-2 receipt with the selected profile and content.
	const receiptPath = path.join(root, ".template-profile.json");
	const receipt = (await exists(receiptPath))
		? await readJson(receiptPath)
		: {};
	check(receipt.schemaVersion === 2, ".template-profile.json is not schema 2.");
	if (profile)
		check(
			receipt.profile === profile,
			`Receipt profile is ${JSON.stringify(receipt.profile)}, expected ${JSON.stringify(profile)}.`,
		);
	if (content)
		check(
			receipt.content === content,
			`Receipt content is ${JSON.stringify(receipt.content)}, expected ${JSON.stringify(content)}.`,
		);

	// 3. Project documentation and Spec Kit ownership; no retired scaffolds.
	for (const required of [
		"PRODUCT.md",
		"AGENTS.md",
		"docs/README.md",
		".specify/memory/constitution.md",
		"specs/README.md",
	])
		check(await exists(path.join(root, required)), `Missing ${required}.`);
	for (const retired of ["docs/project", "openspec", "specs/template"])
		check(
			!(await exists(path.join(root, retired))),
			`Retired or template-only path is present: ${retired}.`,
		);

	// 4. Lockfile and dependency installation state.
	check(
		await exists(path.join(root, "package-lock.json")),
		"Missing package-lock.json.",
	);
	check(
		(await exists(path.join(root, "node_modules"))) === install,
		install
			? "node_modules is missing although dependencies should be installed."
			: "node_modules exists although --no-install was requested.",
	);

	// 5. Git: main, one initial commit, clean, no remotes.
	try {
		check(
			git(["branch", "--show-current"], root) === "main",
			"Branch is not main.",
		);
		check(
			git(["rev-list", "--count", "HEAD"], root) === "1",
			"Repository does not have exactly one commit.",
		);
		check(
			git(["status", "--porcelain"], root) === "",
			"Working tree is not clean.",
		);
		check(git(["remote"], root) === "", "Repository has a remote.");
	} catch (error) {
		failures.push(`Git inspection failed: ${error.message}`);
	}
	return failures;
}
