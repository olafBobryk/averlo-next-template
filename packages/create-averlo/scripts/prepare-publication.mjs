import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

export function nextPatchVersion(version) {
	const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(version);
	if (!match || match[0] !== version)
		throw new Error(`Expected a stable npm version, received ${version}.`);
	return `${match[1]}.${match[2]}.${BigInt(match[3]) + 1n}`;
}

export async function setPublicationVersion(directory, version, commit) {
	nextPatchVersion(version);
	const manifestPath = path.join(directory, "package.json");
	const metadataPath = path.join(directory, "dist/template-metadata.json");
	const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
	const metadata = JSON.parse(await fs.readFile(metadataPath, "utf8"));
	if (
		metadata.sourceDirty ||
		metadata.templateCommit !== commit ||
		!/^[0-9a-f]{40}$/.test(commit)
	) {
		throw new Error(
			"Publication must retain the verified clean template commit.",
		);
	}
	manifest.version = version;
	metadata.packageVersion = version;
	await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, "\t")}\n`);
	await fs.writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
}

function run(command, args, cwd = packageRoot) {
	return execFileSync(command, args, {
		cwd,
		encoding: "utf8",
		stdio: ["ignore", "pipe", "inherit"],
	}).trim();
}

async function main() {
	const commit = run("git", ["rev-parse", "HEAD"]);
	// Generate metadata before staging: the committed source must remain clean.
	run(process.execPath, [path.join(packageRoot, "scripts/build-metadata.mjs")]);
	const registry = await fetch(
		"https://registry.npmjs.org/create-averlo/latest",
	);
	if (!registry.ok)
		throw new Error(`npm registry returned ${registry.status}.`);
	const published = await registry.json();
	const temporaryRoot = await fs.mkdtemp(
		path.join(os.tmpdir(), "create-averlo-publication-"),
	);
	const previousArchive = path.join(temporaryRoot, "previous.tgz");
	const archiveResponse = await fetch(published.dist.tarball);
	if (!archiveResponse.ok)
		throw new Error(`npm tarball returned ${archiveResponse.status}.`);
	await fs.writeFile(
		previousArchive,
		Buffer.from(await archiveResponse.arrayBuffer()),
	);
	const previousMetadata = JSON.parse(
		run("tar", [
			"-xOf",
			previousArchive,
			"package/dist/template-metadata.json",
		]),
	);
	if (
		previousMetadata.templateCommit === commit &&
		!previousMetadata.sourceDirty
	) {
		if (process.env.GITHUB_OUTPUT)
			await fs.appendFile(process.env.GITHUB_OUTPUT, "skipped=true\n");
		console.log(`npm latest already uses ${commit}; no release needed.`);
		await fs.rm(temporaryRoot, { recursive: true, force: true });
		return;
	}
	const version = nextPatchVersion(published.version);
	const [sourcePack] = JSON.parse(
		run("npm", [
			"pack",
			"--json",
			"--ignore-scripts",
			"--pack-destination",
			temporaryRoot,
		]),
	);
	const stagedRoot = path.join(temporaryRoot, "staged");
	await fs.mkdir(stagedRoot);
	run("tar", [
		"-xzf",
		path.join(temporaryRoot, sourcePack.filename),
		"-C",
		stagedRoot,
	]);
	const stagedPackage = path.join(stagedRoot, "package");
	await setPublicationVersion(stagedPackage, version, commit);
	const [publicationPack] = JSON.parse(
		run(
			"npm",
			["pack", "--json", "--ignore-scripts", "--pack-destination", stagedRoot],
			stagedPackage,
		),
	);
	const tarball = path.join(stagedRoot, publicationPack.filename);
	if (
		run(
			process.execPath,
			[path.join(stagedPackage, "bin/create-averlo.mjs"), "--version"],
			stagedPackage,
		) !== version
	) {
		throw new Error(
			"Staged initializer version does not match publication version.",
		);
	}
	if (process.env.GITHUB_OUTPUT)
		await fs.appendFile(
			process.env.GITHUB_OUTPUT,
			`skipped=false\nversion=${version}\ncommit=${commit}\ntarball=${tarball}\n`,
		);
	console.log(`Prepared create-averlo ${version} from ${commit}: ${tarball}`);
}

if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
	await main();
