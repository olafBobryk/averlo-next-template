#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const REPOSITORY_PATH_PREFIXES = [
	".storybook/",
	"AGENTS.md",
	"docs/",
	"openspec/",
	"WORKFLOWS.md",
	"package.json",
	"payload.config.ts",
	"plugins/",
	"scripts/",
	"src/",
	"template-assembly/",
	"template-profiles/",
	"template-surfaces/",
];
const WALK_EXCLUDED_DIRECTORIES = new Set([
	".git",
	".next",
	".template-instances",
	".thin-start",
	"node_modules",
]);

function walk(targetPath) {
	if (!fs.existsSync(targetPath)) return [];
	const stat = fs.statSync(targetPath);
	if (!stat.isDirectory()) return [targetPath];
	return fs
		.readdirSync(targetPath, { withFileTypes: true })
		.flatMap((entry) => {
			if (entry.isDirectory() && WALK_EXCLUDED_DIRECTORIES.has(entry.name)) {
				return [];
			}
			const entryPath = path.join(targetPath, entry.name);
			return entry.isDirectory()
				? [entryPath, ...walk(entryPath)]
				: [entryPath];
		});
}

function stripLinkDecoration(target) {
	return target
		.trim()
		.split(/\s+["']/u, 1)[0]
		.split("#", 1)[0];
}

function isExternalLink(target) {
	return /^[a-z][a-z0-9+.-]*:/iu.test(target) || target.startsWith("#");
}

function globPatternToRegExp(pattern) {
	const escaped = pattern.replace(/[.+^${}()|[\]\\]/gu, "\\$&");
	const source = escaped
		.replaceAll("**", "\0")
		.replaceAll("*", "[^/]*")
		.replaceAll("\0", ".*");
	return new RegExp(`^${source}$`, "u");
}

function extractSection(content, heading) {
	const start = content.indexOf(`${heading}\n`);
	if (start === -1) return "";
	const bodyStart = start + heading.length + 1;
	const nextHeading = content.indexOf("\n## ", bodyStart);
	return content.slice(bodyStart, nextHeading === -1 ? undefined : nextHeading);
}

function isRepositoryPath(value) {
	return REPOSITORY_PATH_PREFIXES.some(
		(prefix) => value === prefix || value.startsWith(prefix),
	);
}

function validatePath(root, value, allRepositoryPaths, markdownPath) {
	if (value.startsWith("references/")) {
		let owner = path.dirname(markdownPath);
		while (owner.startsWith(path.join(root, "plugins/averlo/skills"))) {
			if (fs.existsSync(path.join(owner, "SKILL.md")))
				return fs.existsSync(path.join(owner, value));
			owner = path.dirname(owner);
		}
		return false;
	}
	if (!isRepositoryPath(value)) return true;
	if (!value.includes("*")) return fs.existsSync(path.join(root, value));
	const matcher = globPatternToRegExp(value);
	return allRepositoryPaths.some((candidate) => matcher.test(candidate));
}

export function collectSkillReferenceErrors(root) {
	const errors = [];
	const skillsRoot = path.join(root, "plugins/averlo/skills");
	if (!fs.existsSync(skillsRoot)) return errors;
	const packageJson = JSON.parse(
		fs.readFileSync(path.join(root, "package.json")),
	);
	const packageScripts = new Set(Object.keys(packageJson.scripts ?? {}));
	const allRepositoryPaths = walk(root).map((entry) =>
		path.relative(root, entry).split(path.sep).join("/"),
	);
	const markdownFiles = walk(skillsRoot).filter((entry) =>
		entry.endsWith(".md"),
	);

	for (const markdownPath of markdownFiles) {
		const content = fs.readFileSync(markdownPath, "utf8");
		const relativeMarkdownPath = path.relative(root, markdownPath);

		for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/gu)) {
			const target = stripLinkDecoration(match[1]);
			if (!target || isExternalLink(target)) continue;
			if (!fs.existsSync(path.resolve(path.dirname(markdownPath), target))) {
				errors.push(`${relativeMarkdownPath}: missing Markdown link ${target}`);
			}
		}

		for (const match of content.matchAll(/npm run ([a-zA-Z0-9:_-]+)/gu)) {
			if (!packageScripts.has(match[1])) {
				errors.push(`${relativeMarkdownPath}: unknown npm script ${match[1]}`);
			}
		}
		const repositoryContext = extractSection(content, "## Repository context");
		const proseWithoutCode = repositoryContext.replace(/`[^`\n]+`/gu, "");
		for (const match of proseWithoutCode.matchAll(
			/(?:^|\s)((?:\.storybook|docs|openspec|plugins|references|scripts|src|template-(?:assembly|profiles|surfaces))\/[\w@./*()_-]+)/gu,
		)) {
			errors.push(
				`${relativeMarkdownPath}: repository path must be backticked ${match[1]}`,
			);
		}
		for (const match of repositoryContext.matchAll(/`([^`\n]+)`/gu)) {
			const target = match[1];
			if (!validatePath(root, target, allRepositoryPaths, markdownPath)) {
				errors.push(
					`${relativeMarkdownPath}: missing repository path ${target}`,
				);
			}
		}
	}

	return errors;
}

export function run(root = process.cwd()) {
	const errors = collectSkillReferenceErrors(root);
	if (errors.length > 0) throw new Error(errors.join("\n"));
	console.log(
		"Skill reference verification passed: local Markdown links, skill-local references, repository context paths and npm scripts resolve.",
	);
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(process.argv[1]).href
) {
	run();
}
