#!/usr/bin/env node

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { performance } from "node:perf_hooks";
import process from "node:process";
import {
	assembleTemplateProfile,
	assertPackageOwnership,
} from "../../template/assembly/assembler.mjs";
import {
	assemblyTemplateOnlyWorkflows,
	isAssemblySpecKitSkillPath,
	isWithinPath,
} from "../../template/assembly/manifest.mjs";
import {
	getProfileVerificationCommands,
	templateProfiles,
} from "../../template/profiles/index.mjs";
import { templateSurfaces } from "../../template/surfaces/index.mjs";

const PROFILE_CASES = [
	{ profileId: "full", content: "payload-ready" },
	{ profileId: "full", content: "static" },
	{ profileId: "app-only", content: "static" },
	{ profileId: "marketing-only", content: "payload-ready" },
	{ profileId: "marketing-only", content: "static" },
	{ profileId: "thin-start", content: "payload-ready" },
	{ profileId: "thin-start", content: "static" },
];

function parseArgs(argv) {
	const options = {
		integration: false,
		keep: false,
		performanceRuns: 1,
	};
	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (arg === "--integration") options.integration = true;
		else if (arg === "--keep") options.keep = true;
		else if (arg === "--performance-runs") {
			const value = Number.parseInt(argv[index + 1] ?? "", 10);
			if (!Number.isInteger(value) || value < 1 || value > 10) {
				throw new Error("--performance-runs requires an integer from 1 to 10.");
			}
			options.performanceRuns = value;
			index += 1;
		} else throw new Error(`Unknown flag: ${arg}`);
	}
	return options;
}

function run(
	command,
	args,
	cwd,
	{ allowFailure = false, silent = false } = {},
) {
	const result = spawnSync(command, args, {
		cwd,
		env: {
			...process.env,
			PATH: `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH ?? ""}`,
		},
		encoding: silent ? "utf8" : undefined,
		stdio: silent ? ["ignore", "pipe", "pipe"] : "inherit",
	});
	if (result.error) throw result.error;
	if (!allowFailure && result.status !== 0) {
		throw new Error(`${command} ${args.join(" ")} exited ${result.status}.`);
	}
	return result;
}

function runNpm(args, cwd, options) {
	if (process.env.npm_execpath) {
		return run(
			process.execPath,
			[process.env.npm_execpath, ...args],
			cwd,
			options,
		);
	}
	return run("npm", args, cwd, options);
}

function npmRunArgs(command) {
	const parts = command.trim().split(/\s+/);
	if (parts[0] !== "npm" || parts[1] !== "run" || !parts[2]) {
		throw new Error(`Unsupported profile verification command: ${command}`);
	}
	return ["run", ...parts.slice(2)];
}

async function readJson(filePath) {
	return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function pathExists(filePath) {
	return fs
		.access(filePath)
		.then(() => true)
		.catch(() => false);
}

async function collectTypeScriptFiles(directory) {
	const files = [];
	for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
		const absolutePath = path.join(directory, entry.name);
		if (entry.isDirectory())
			files.push(...(await collectTypeScriptFiles(absolutePath)));
		else if (/\.tsx?$/.test(entry.name)) files.push(absolutePath);
	}
	return files;
}

const removedPublicEnvironmentNames = [
	["NEXT", "PUBLIC", "ORGANIZATION", "IDENTITY", "VISUAL"].join("_"),
	["NEXT", "PUBLIC", "DASHBOARD", "ORGANIZATION", "SWITCHER"].join("_"),
	["NEXT", "PUBLIC", "DASHBOARD", "DEBUG"].join("_"),
	["NEXT", "PUBLIC", "SITE", "URL"].join("_"),
];

async function assertRemovedPublicEnvironmentAbsent(root, label) {
	const candidateFiles = [
		path.join(root, ".env.example"),
		path.join(root, "README.md"),
		path.join(root, "next-sitemap.config.js"),
		...(await collectTypeScriptFiles(path.join(root, "src"))),
	];
	for (const filePath of candidateFiles) {
		if (!(await pathExists(filePath))) continue;
		const source = await fs.readFile(filePath, "utf8");
		for (const environmentName of removedPublicEnvironmentNames) {
			if (source.includes(environmentName)) {
				throw new Error(
					`${label} retains removed public environment variable ${environmentName} in ${path.relative(root, filePath)}.`,
				);
			}
		}
	}
	if (await pathExists(path.join(root, "src/config/organization.ts"))) {
		throw new Error(
			`${label} retains the obsolete organization config module.`,
		);
	}
}

async function assertGeneratedSurfaceContract(outputRoot, profileCase) {
	const selectedSurfaces = new Set(
		templateProfiles[profileCase.profileId]?.assembly?.surfaces ?? [],
	);
	const expectedFamilies = new Set();
	if (selectedSurfaces.has("marketing")) expectedFamilies.add("marketing");
	if (selectedSurfaces.has("dashboard")) {
		expectedFamilies.add("auth");
		expectedFamilies.add("dashboard");
	}

	const generatedRegistry = await fs.readFile(
		path.join(outputRoot, "src/config/surfaces.ts"),
		"utf8",
	);
	const generatedSiteLayout = await fs.readFile(
		path.join(outputRoot, "src/app/(site)/_components/layout/siteLayout.ts"),
		"utf8",
	);
	const internalTestingPath = path.join(
		outputRoot,
		expectedFamilies.has("marketing")
			? "src/app/(site)/(marketing)/internal/testing/page.tsx"
			: "src/app/(site)/(dev)/internal/testing/page.tsx",
	);
	if (!(await pathExists(internalTestingPath))) {
		throw new Error(
			`${profileCase.profileId}/${profileCase.content} is missing the development-only Testing workbench.`,
		);
	}
	if (!generatedRegistry.includes('testing: "/internal/testing"')) {
		throw new Error(
			`${profileCase.profileId}/${profileCase.content} is missing the Testing internal route identity.`,
		);
	}
	const proxySource = await fs.readFile(
		path.join(outputRoot, "src/proxy.ts"),
		"utf8",
	);
	if (
		!proxySource.includes('"/internal/testing"') ||
		!proxySource.includes('"/internal/testing/:path*"')
	) {
		throw new Error(
			`${profileCase.profileId}/${profileCase.content} does not production-guard Testing.`,
		);
	}
	for (const forbiddenPath of [
		"src/app/(site)/(dev)/internal/dictionary",
		"src/app/(site)/(dev)/internal/playground",
		"src/app/(site)/(dev)/internal/reference",
		"src/app/(site)/(marketing)/repository-footprint",
	]) {
		if (await pathExists(path.join(outputRoot, forbiddenPath))) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} retained excluded developer or template-only surface ${forbiddenPath}.`,
			);
		}
	}
	const generatedPackage = await readJson(
		path.join(outputRoot, "package.json"),
	);
	for (const metadataPath of [
		"scripts/verify/verify-route-metadata.ts",
		"src/config/metadataConfig.ts",
		"src/lib/metadata.ts",
	]) {
		if (!(await pathExists(path.join(outputRoot, metadataPath)))) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} is missing ${metadataPath}.`,
			);
		}
	}
	if (typeof generatedPackage.scripts?.["verify:route-metadata"] !== "string") {
		throw new Error(
			`${profileCase.profileId}/${profileCase.content} is missing verify:route-metadata.`,
		);
	}
	if (
		generatedPackage.scripts?.["footprint:generate"] !== undefined ||
		generatedPackage.dependencies?.recharts !== undefined ||
		generatedPackage.devDependencies?.["js-tiktoken"] !== undefined
	) {
		throw new Error(
			`${profileCase.profileId}/${profileCase.content} retained template-only Repository Footprint tooling.`,
		);
	}
	if (generatedSiteLayout.includes("process.env.NODE_ENV")) {
		throw new Error(
			`${profileCase.profileId}/${profileCase.content} removes installed navigation in production.`,
		);
	}
	const registryFiles = {
		auth: "src/config/surfaces/auth.ts",
		dashboard: "src/config/surfaces/dashboard.ts",
		marketing: "src/config/surfaces/marketing.ts",
	};
	const installedIds = new Set();

	for (const [family, relativePath] of Object.entries(registryFiles)) {
		const absolutePath = path.join(outputRoot, relativePath);
		const expected = expectedFamilies.has(family);
		const exists = await fs
			.stat(absolutePath)
			.then(() => true)
			.catch(() => false);
		if (exists !== expected) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} ${family} registry installation mismatch.`,
			);
		}
		const importMarker = `@/config/surfaces/${family}`;
		if (generatedRegistry.includes(importMarker) !== expected) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} generated registry has the wrong ${family} composition.`,
			);
		}
		if (!exists) continue;
		const source = await fs.readFile(absolutePath, "utf8");
		for (const match of source.matchAll(/\bid:\s*["']([^"']+)["']/g)) {
			if (
				family === "marketing" &&
				match[1] === "marketing.settings" &&
				generatedRegistry.includes("marketingCoreSurfaceRegistry")
			) {
				continue;
			}
			installedIds.add(match[1]);
		}
	}

	const srcRoot = path.join(outputRoot, "src");
	for (const filePath of await collectTypeScriptFiles(srcRoot)) {
		const source = await fs.readFile(filePath, "utf8");
		const directReferencePattern =
			/(?:surfaceId\s*:\s*|(?:hrefFor|surfaceHref)\(\s*)["']((?:auth|dashboard|marketing)\.[^"']+)["']/g;
		for (const match of source.matchAll(directReferencePattern)) {
			if (!installedIds.has(match[1])) {
				throw new Error(
					`${profileCase.profileId}/${profileCase.content} references unavailable surface ${match[1]} in ${path.relative(outputRoot, filePath)}.`,
				);
			}
		}
	}

	if (expectedFamilies.has("marketing")) {
		for (const scriptName of [
			"verify:marketing",
			"verify:marketing-media",
			"verify:marketing-sections",
			"verify:site-layout",
		]) {
			if (typeof generatedPackage.scripts?.[scriptName] !== "string") {
				throw new Error(
					`${profileCase.profileId}/${profileCase.content} is missing ${scriptName}.`,
				);
			}
		}
		for (const verifierPath of [
			"scripts/verify/verify-marketing.mjs",
			"scripts/verify/verify-marketing-media-policy.mjs",
			"scripts/verify/verify-marketing-section-policy.ts",
			"scripts/verify/verify-marketing-site-layout.ts",
		]) {
			if (!(await pathExists(path.join(outputRoot, verifierPath)))) {
				throw new Error(
					`${profileCase.profileId}/${profileCase.content} is missing ${verifierPath}.`,
				);
			}
		}
		const fallbackSource = await fs.readFile(
			path.join(outputRoot, "src/lib/marketing-content/fallback.ts"),
			"utf8",
		);
		const expectedCtaId = expectedFamilies.has("auth")
			? "auth.login"
			: "marketing.contact";
		if (!fallbackSource.includes(expectedCtaId)) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} is missing hero CTA ${expectedCtaId}.`,
			);
		}

		const contentSource = await fs.readFile(
			path.join(outputRoot, "src/lib/marketing-content/source.ts"),
			"utf8",
		);
		const hasPayload = profileCase.content === "payload-ready";
		if (
			!contentSource.includes("getConfiguredMarketingPage") ||
			contentSource.includes("@/payload/siteLayoutSource") !== hasPayload ||
			contentSource.includes("@/payload/marketingPageSource") !== hasPayload
		) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} generated the wrong marketing content source bridge.`,
			);
		}

		const pkg = generatedPackage;
		const generatedMarketingRegistry = await fs.readFile(
			path.join(outputRoot, "src/config/surfaces/marketing.ts"),
			"utf8",
		);
		if (generatedMarketingRegistry.includes("marketing.repositoryFootprint")) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} retained the template-only Repository Footprint route.`,
			);
		}
		for (const scriptName of [
			"payload:seed:marketing-pages",
			"payload:seed:site-layout",
			"payload:verify:marketing-pages",
			"payload:verify:site-layout",
			"verify:payload-pages",
			"verify:payload-site-layout",
		]) {
			if ((typeof pkg.scripts?.[scriptName] === "string") !== hasPayload) {
				throw new Error(
					`${profileCase.profileId}/${profileCase.content} has the wrong ${scriptName} installation state.`,
				);
			}
		}

		if (
			profileCase.profileId !== "thin-start" &&
			(!fallbackSource.includes("publicSocialLinks") ||
				!fallbackSource.includes("getMarketingSiteLinks"))
		) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} does not compose its public shell from canonical marketing links.`,
			);
		}
	}
}

async function assertReceipt(outputRoot, profileCase, capabilities = []) {
	const receipt = await readJson(
		path.join(outputRoot, ".template-profile.json"),
	);
	if (
		receipt.profile !== profileCase.profileId ||
		receipt.content !== profileCase.content ||
		receipt.schemaVersion !== 2 ||
		receipt.engine !== undefined ||
		JSON.stringify(receipt.capabilities ?? []) !== JSON.stringify(capabilities)
	) {
		throw new Error(
			`Invalid profile receipt for ${profileCase.profileId}/${profileCase.content}.`,
		);
	}
}

async function assertGeneratedDocumentation(outputRoot, profileCase) {
	for (const requiredPath of ["AGENTS.md", "PRODUCT.md", "docs/README.md"]) {
		if (!(await pathExists(path.join(outputRoot, requiredPath)))) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} is missing generated documentation path ${requiredPath}.`,
			);
		}
	}
	for (const retiredPath of [
		"docs/project/README.md",
		"docs/project/source/README.md",
	]) {
		if (await pathExists(path.join(outputRoot, retiredPath))) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} retained retired documentation path ${retiredPath}.`,
			);
		}
	}

	const agentInstructions = await fs.readFile(
		path.join(outputRoot, "AGENTS.md"),
		"utf8",
	);
	for (const heading of ["## Read first", "## Structure"]) {
		if (!agentInstructions.includes(heading)) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} generated AGENTS.md is missing ${heading}.`,
			);
		}
	}
	for (const forbiddenText of [
		"ToastHost",
		"showToast",
		"ConfirmationModal",
		"useTailwindBreakpoints",
		"## Responsive Rendering",
	]) {
		if (agentInstructions.includes(forbiddenText)) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} generated AGENTS.md contains recipe text: ${forbiddenText}.`,
			);
		}
	}
	for (const requiredPolicy of [
		"`.specify/memory/constitution.md`",
		"`.specify/workflows/main/README.md`",
		"`.specify/workflows/write-spec/README.md`",
		"`specs/README.md` maps every spec",
		"this project's own copies of the selected Averlo platform specs",
		"`specs/product/` holds this project's real business requirements",
		"a conflict needs an explicit spec change",
		"the nearest `AGENTS.md`",
		"owner's Storybook stories",
		"`WORKFLOWS.md` (names-only menu)",
		"`.specify/workflows/compose/README.md`",
		"`.specify/workflows/systemize/README.md`",
		"npm run verify:marketing",
	]) {
		if (!agentInstructions.replace(/\s+/gu, " ").includes(requiredPolicy)) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} generated AGENTS.md is missing workflow-delivery policy: ${requiredPolicy}.`,
			);
		}
	}

	const product = await fs.readFile(
		path.join(outputRoot, "PRODUCT.md"),
		"utf8",
	);
	if (
		!product.includes(`\`${profileCase.profileId}\` profile`) ||
		!product.includes(`\`${profileCase.content}\` content mode`) ||
		!product.includes("Purpose: To be defined by the project owner.")
	) {
		throw new Error(
			`${profileCase.profileId}/${profileCase.content} generated PRODUCT.md does not preserve its setup facts and unfinished product definition.`,
		);
	}

	const documentation = await fs.readFile(
		path.join(outputRoot, "docs/README.md"),
		"utf8",
	);
	if (
		!documentation.includes(
			"`design-system/decisions/` contains human-approved, rejected, or deferred composition ownership decisions",
		)
	) {
		throw new Error(
			`${profileCase.profileId}/${profileCase.content} generated docs/README.md does not describe durable human design-system decisions.`,
		);
	}
}

async function assertCanonicalAgentContract(templateRoot) {
	const agentInstructions = await fs.readFile(
		path.join(templateRoot, "AGENTS.md"),
		"utf8",
	);
	for (const heading of ["## Read first", "## Structure"]) {
		if (!agentInstructions.includes(heading)) {
			throw new Error(`Canonical AGENTS.md is missing ${heading}.`);
		}
	}
	for (const forbiddenText of [
		"## Template Content Modes",
		"## Halo UI Primitives",
		"## Responsive Rendering",
		"ToastHost",
		"showToast",
		"ConfirmationModal",
		"useTailwindBreakpoints",
		"openspec",
		"OpenSpec",
	]) {
		if (agentInstructions.includes(forbiddenText)) {
			throw new Error(
				`Canonical AGENTS.md contains retired recipe text: ${forbiddenText}.`,
			);
		}
	}
	for (const requiredPolicy of [
		"`.specify/memory/constitution.md`",
		"`.specify/workflows/main/README.md`",
		"`.specify/workflows/write-spec/README.md`",
		"`specs/README.md` maps every spec",
		"`specs/template/` applies only to assembly or demo work",
		"nearest `AGENTS.md`",
		"owner's Storybook stories",
		"`WORKFLOWS.md` (names-only menu)",
		"`.specify/workflows/compose/README.md`",
		"`.specify/workflows/systemize/README.md`",
		"BEGIN:nextjs-agent-rules",
	]) {
		if (!agentInstructions.replace(/\s+/gu, " ").includes(requiredPolicy)) {
			throw new Error(
				`Canonical AGENTS.md is missing entry-point policy: ${requiredPolicy}.`,
			);
		}
	}
	const policyLines = agentInstructions
		.split("<!-- BEGIN:nextjs-agent-rules -->", 1)[0]
		.trimEnd()
		.split("\n").length;
	if (policyLines > 40) {
		throw new Error(
			`Canonical AGENTS.md must stay a thin entry point (${policyLines} > 40 lines before the Next.js block).`,
		);
	}
	for (const match of agentInstructions.matchAll(
		/`((?:\.specify|specs|docs|template-[a-z]+|packages|plugins)\/[^`\s]*|PRODUCT\.md|WORKFLOWS\.md)`/gu,
	)) {
		if (!(await pathExists(path.join(templateRoot, match[1])))) {
			throw new Error(`Canonical AGENTS.md names a missing path: ${match[1]}`);
		}
	}
}

async function verifyAssistantCapability(templateRoot, tempRoot) {
	const selectedRoot = path.join(tempRoot, "assistant-selected");
	run(
		process.execPath,
		[
			"scripts/create-template-profile.mjs",
			"--profile",
			"app-only",
			"--content",
			"static",
			"--with",
			"assistant",
			"--output",
			selectedRoot,
		],
		templateRoot,
		{ silent: true },
	);
	await assertReceipt(
		selectedRoot,
		{ content: "static", profileId: "app-only" },
		["assistant"],
	);
	for (const requiredPath of [
		"src/app/(site)/dashboard/_components/entities/record/RecordToolCall.tsx",
		"src/app/(site)/dashboard/chats",
		"src/app/api/assistant",
		"src/components/domain/assistant",
		"src/lib/assistant",
	]) {
		if (!(await pathExists(path.join(selectedRoot, requiredPath)))) {
			throw new Error(
				`Selected Assistant capability is missing ${requiredPath}.`,
			);
		}
	}
	const selectedPackage = await readJson(
		path.join(selectedRoot, "package.json"),
	);
	for (const dependency of ["@ai-sdk/openai", "ai", "streamdown"]) {
		if (!selectedPackage.dependencies?.[dependency]) {
			throw new Error(
				`Selected Assistant capability is missing ${dependency}.`,
			);
		}
	}

	const rejected = run(
		process.execPath,
		[
			"scripts/create-template-profile.mjs",
			"--profile",
			"marketing-only",
			"--content",
			"static",
			"--with",
			"assistant",
			"--dry-run",
		],
		templateRoot,
		{ allowFailure: true, silent: true },
	);
	assertFailure(
		rejected,
		"Dashboard-less profile accepted the Assistant capability.",
	);
	const unknown = run(
		process.execPath,
		["scripts/create-template-profile.mjs", "--with", "unknown", "--dry-run"],
		templateRoot,
		{ allowFailure: true, silent: true },
	);
	assertFailure(unknown, "Unknown capability was accepted.");
	console.log("Assistant capability checks passed.");
}

async function assertNoAssistantCapability(outputRoot) {
	for (const forbiddenPath of [
		"src/app/(site)/dashboard/chats",
		"src/app/api/assistant",
		"src/components/domain/assistant",
	]) {
		if (await pathExists(path.join(outputRoot, forbiddenPath))) {
			throw new Error(
				`Default project unexpectedly contains Assistant path: ${forbiddenPath}`,
			);
		}
	}
	const assistantLibraryRoot = path.join(outputRoot, "src/lib/assistant");
	if (await pathExists(assistantLibraryRoot)) {
		const assistantLibraryEntries = (
			await fs.readdir(assistantLibraryRoot)
		).sort();
		if (
			assistantLibraryEntries.length !== 1 ||
			assistantLibraryEntries[0] !== "contracts.ts"
		) {
			throw new Error(
				`Default project must retain only the shared Assistant contracts, found: ${assistantLibraryEntries.join(", ")}`,
			);
		}
	}
	const pkg = await readJson(path.join(outputRoot, "package.json"));
	for (const dependency of ["@ai-sdk/openai", "ai"]) {
		if (pkg.dependencies?.[dependency] !== undefined) {
			throw new Error(
				`Default project unexpectedly contains Assistant dependency: ${dependency}`,
			);
		}
	}
	if (
		(await pathExists(
			path.join(
				outputRoot,
				"src/components/composites/markdown/MarkdownRenderer.tsx",
			),
		)) &&
		!pkg.dependencies?.streamdown
	) {
		throw new Error(
			"Generated projects must retain streamdown for the shared Markdown renderer.",
		);
	}
}

async function walkRelativeFiles(root, relativeDirectory) {
	const files = [];
	async function visit(directory) {
		if (!(await pathExists(directory))) return;
		for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
			const target = path.join(directory, entry.name);
			if (entry.isDirectory()) await visit(target);
			else files.push(path.relative(root, target).split(path.sep).join("/"));
		}
	}
	await visit(path.join(root, relativeDirectory));
	return files.sort();
}

const GENERATED_SPECIFY_PATHS = new Set([
	".specify/workflows/workflow-registry.json",
	".specify/feature.json",
]);

async function assertProjectSpecKit(outputRoot) {
	for (const requiredPath of [
		".specify/memory/constitution.md",
		".specify/templates/spec-template.md",
		".specify/workflows/main/workflow.yml",
		".specify/workflows/write-spec/workflow.yml",
		".specify/workflows/verify/workflow.yml",
		"specs/README.md",
	]) {
		if (!(await pathExists(path.join(outputRoot, requiredPath))))
			throw new Error(
				`Generated project is missing Spec Kit path: ${requiredPath}`,
			);
	}
	for (const workflowId of assemblyTemplateOnlyWorkflows) {
		if (
			await pathExists(path.join(outputRoot, ".specify/workflows", workflowId))
		)
			throw new Error(
				`Generated project retains template-only workflow: ${workflowId}`,
			);
	}
	if (await pathExists(path.join(outputRoot, ".specify/feature.json")))
		throw new Error("Generated project retains per-checkout Spec Kit state.");
	const registryPath = path.join(
		outputRoot,
		".specify/workflows/workflow-registry.json",
	);
	if (
		await pathExists(path.resolve(".specify/workflows/workflow-registry.json"))
	) {
		const registry = JSON.parse(await fs.readFile(registryPath, "utf8"));
		for (const workflowId of Object.keys(registry.workflows ?? {})) {
			if (
				assemblyTemplateOnlyWorkflows.includes(workflowId) ||
				!(await pathExists(
					path.join(outputRoot, ".specify/workflows", workflowId),
				))
			)
				throw new Error(
					`Generated workflow registry lists an absent or template-only workflow: ${workflowId}`,
				);
		}
	}
	const [sourceSkills, outputSkills] = await Promise.all(
		[process.cwd(), outputRoot].map(async (root) =>
			[
				...(await walkRelativeFiles(root, ".agents")),
				...(await walkRelativeFiles(root, ".claude")),
			].filter(
				(file) => root === outputRoot || isAssemblySpecKitSkillPath(file),
			),
		),
	);
	if (
		outputSkills.some((file) => !isAssemblySpecKitSkillPath(file)) ||
		JSON.stringify(outputSkills) !== JSON.stringify(sourceSkills)
	)
		throw new Error(
			"Generated project must retain exactly the stock Spec Kit agent skills.",
		);
}

function surfaceForSpecPath(relativePath) {
	for (const [surfaceKey, surface] of Object.entries(templateSurfaces)) {
		for (const owned of surface.ownedPaths ?? []) {
			if (owned.startsWith("specs/") && isWithinPath(relativePath, owned))
				return surfaceKey;
		}
	}
	return null;
}

async function assertSpecReferences(outputRoot, file) {
	const text = await fs.readFile(file, "utf8");
	for (const match of text.matchAll(
		/(?<![a-z0-9-/.])(specs\/[a-z][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*(?:\.md)?)(?![a-z0-9-])/gu,
	)) {
		const reference = match[1];
		if (!/^specs\/(?:platform|product)(?:\/|$)/u.test(reference))
			throw new Error(
				`Generated capability has a template, legacy or unsupported-scope dependency: ${reference}`,
			);
		if (!(await pathExists(path.join(outputRoot, reference))))
			throw new Error(`Generated capability dependency missing: ${reference}`);
	}
}

async function assertIndependentCopy(outputRoot, relativePath) {
	const sourcePath = path.resolve(relativePath);
	const outputPath = path.join(outputRoot, relativePath);
	if (
		(await fs.readFile(sourcePath, "utf8")) !==
		(await fs.readFile(outputPath, "utf8"))
	)
		throw new Error(`Generated independent contract differs: ${relativePath}`);
	const [sourceStat, outputStat] = await Promise.all([
		fs.stat(sourcePath),
		fs.stat(outputPath),
	]);
	if (sourceStat.dev === outputStat.dev && sourceStat.ino === outputStat.ino)
		throw new Error(
			`Generated contract shares its source inode: ${relativePath}`,
		);
}

async function assertBehaviorContracts(outputRoot, surfaces) {
	await assertProjectSpecKit(outputRoot);
	const expected = new Set(
		(await walkRelativeFiles(process.cwd(), "specs")).filter((file) => {
			if (isWithinPath(file, "specs/template")) return false;
			const owner = surfaceForSpecPath(file);
			return owner === null || surfaces.has(owner);
		}),
	);
	if (await pathExists(path.join(outputRoot, "openspec")))
		throw new Error("Generated project retains retired OpenSpec contracts.");
	const actual = new Set(await walkRelativeFiles(outputRoot, "specs"));
	if (
		[...actual].some(
			(file) =>
				!/^specs\/(?:README\.md$|platform\/|product\/)/u.test(file) ||
				(isWithinPath(file, "specs/product") && !file.endsWith("/README.md")),
		)
	)
		throw new Error(
			"Generated specs retain template, product, legacy or unsupported namespaces.",
		);
	for (const [capability, shouldExist] of [
		["specs/platform/data/forms", true],
		["specs/platform/data/loading", true],
		["specs/platform/content/media", true],
		["specs/platform/services/delivery", true],
		["specs/platform/surfaces/marketing", surfaces.has("marketing")],
		["specs/platform/surfaces/dashboard", surfaces.has("dashboard")],
		["specs/platform/content/entities", surfaces.has("dashboard")],
		["specs/platform/services/files", surfaces.has("dashboard")],
	]) {
		if (
			[...expected].some((file) => isWithinPath(file, capability)) !==
			shouldExist
		)
			throw new Error(
				`Explicit capability surface ownership differs: ${capability}`,
			);
	}
	if (
		actual.size !== expected.size ||
		[...expected].some((file) => !actual.has(file))
	)
		throw new Error(
			`Generated behavioral capability ownership mismatch: ${[...actual].join(", ")}`,
		);
	const specifyFiles = (await walkRelativeFiles(outputRoot, ".specify")).filter(
		(file) => !GENERATED_SPECIFY_PATHS.has(file),
	);
	for (const relativePath of [
		...expected,
		...specifyFiles,
		...(await walkRelativeFiles(outputRoot, ".agents")),
		...(await walkRelativeFiles(outputRoot, ".claude")),
	])
		await assertIndependentCopy(outputRoot, relativePath);
	const files = [
		...(await walkRelativeFiles(outputRoot, "docs/testing")),
		...(await walkRelativeFiles(outputRoot, "specs")),
		...specifyFiles.filter((file) => file.endsWith("README.md")),
		"WORKFLOWS.md",
	].map((file) => path.join(outputRoot, file));
	for (const file of files) {
		const text = await fs.readFile(file, "utf8");
		for (const match of text.matchAll(
			/\[[^\]]+\]\((<[^>]+>|(?:[^()]|\([^()]*\))*)\)/gu,
		)) {
			const target = decodeURI(
				match[1].replace(/^<|>$/gu, "").split("#", 1)[0],
			);
			if (!target || /^[a-z][a-z0-9+.-]*:/iu.test(target)) continue;
			if (!(await pathExists(path.resolve(path.dirname(file), target))))
				throw new Error(
					`Generated policy has a missing link: ${path.relative(outputRoot, file)} -> ${target}`,
				);
		}
		if (file.endsWith("spec.md")) await assertSpecReferences(outputRoot, file);
	}
	const agentText = await fs.readFile(
		path.join(outputRoot, "AGENTS.md"),
		"utf8",
	);
	if (/repository-workflows|openspec|specs\/template/iu.test(agentText))
		throw new Error(
			"Generated instructions retain retired or generator-only guidance.",
		);
}

async function assertStorybook(outputRoot, profileCase) {
	for (const requiredPath of [
		".storybook/main.ts",
		".storybook/preview.tsx",
		"vitest.config.mts",
		"vitest.shims.d.ts",
		"scripts/storybook-preview.mjs",
		"scripts/storybook-build-provenance.ts",
		"scripts/verify/verify-storybook-preview.mjs",
	]) {
		if (!(await pathExists(path.join(outputRoot, requiredPath)))) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} is missing Storybook path: ${requiredPath}`,
			);
		}
	}
	for (const forbiddenPath of [
		".agents/plugins",
		"plugins",
		"openspec",
		"specs/template",
	]) {
		if (await pathExists(path.join(outputRoot, forbiddenPath))) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} contains template plugin source: ${forbiddenPath}`,
			);
		}
	}
	for (const requiredPath of [
		".specify/memory/constitution.md",
		"specs/platform/data/forms/spec.md",
		"specs/platform/data/loading/spec.md",
		"docs/testing/forms.md",
		"docs/testing/loading.md",
		"WORKFLOWS.md",
		"scripts/verify/verify-forms.mjs",
		"scripts/verify/verify-loading.mjs",
		"scripts/verify/forms/shared.mjs",
	]) {
		if (!(await pathExists(path.join(outputRoot, requiredPath))))
			throw new Error(
				`Generated project is missing form/spec ownership: ${requiredPath}`,
			);
	}
	const surfaces = new Set(
		templateProfiles[profileCase.profileId].assembly.surfaces,
	);
	await assertBehaviorContracts(outputRoot, surfaces);
	if (
		(await pathExists(path.join(outputRoot, "specs/form-behavior"))) ||
		(await pathExists(path.join(outputRoot, "scripts/verify/loading"))) !==
			surfaces.has("dashboard")
	)
		throw new Error(
			`Loading capability ownership mismatch: ${profileCase.profileId}`,
		);
	for (const [name, surface] of [
		["login", "dashboard"],
		["support", "dashboard"],
		["contact", "marketing"],
	]) {
		if (
			(await pathExists(
				path.join(outputRoot, `scripts/verify/forms/${name}.mjs`),
			)) !== surfaces.has(surface)
		)
			throw new Error(
				`Form test ownership mismatch: ${profileCase.profileId}/${name}`,
			);
	}
	const sourceFiles = await collectTypeScriptFiles(
		path.join(outputRoot, "src"),
	);
	const storyFile = sourceFiles.find((filePath) =>
		/\.stories\.[cm]?[jt]sx?$/.test(filePath),
	);
	if (profileCase.profileId !== "thin-start" && !storyFile) {
		throw new Error(
			`${profileCase.profileId}/${profileCase.content} retained Storybook without any owned stories.`,
		);
	}
	const obsoleteUiDemo = sourceFiles.find((filePath) =>
		/internal\/demo\/_content\/pages\/ui(?:-|\.[cm]?[jt]sx?$)/.test(
			filePath.replaceAll(path.sep, "/"),
		),
	);
	if (obsoleteUiDemo) {
		throw new Error(
			`Generated project unexpectedly contains a superseded UI demo module: ${path.relative(outputRoot, obsoleteUiDemo)}`,
		);
	}

	const pkg = await readJson(path.join(outputRoot, "package.json"));
	const requiredScripts = [
		"storybook",
		"storybook:preview",
		"storybook:status",
		"storybook:stop",
		"verify:storybook-preview",
		"build-storybook",
		"test-storybook",
	];
	if (profileCase.profileId !== "thin-start") {
		requiredScripts.push(
			"test-storybook:ui:light",
			"test-storybook:ui:dark",
			"test-storybook:ui",
			"verify:storybook-catalog",
		);
	}
	for (const script of requiredScripts) {
		if (typeof pkg.scripts?.[script] !== "string") {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} is missing Storybook script: ${script}`,
			);
		}
	}
	for (const dependency of [
		"@chromatic-com/storybook",
		"@storybook/addon-a11y",
		"@storybook/addon-docs",
		"@storybook/addon-mcp",
		"@storybook/addon-vitest",
		"@storybook/nextjs-vite",
		"@vitest/browser-playwright",
		"@vitest/coverage-v8",
		"storybook",
		"vite",
		"vitest",
	]) {
		if (pkg.devDependencies?.[dependency] === undefined) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} is missing Storybook dependency: ${dependency}`,
			);
		}
	}
}

async function assertComponentExport(outputRoot, profileCase) {
	const selectedSurfaces = new Set(
		templateProfiles[profileCase.profileId]?.assembly?.surfaces ?? [],
	);
	const hasDemo = selectedSurfaces.has("demo");
	const catalogRoot = path.join(outputRoot, "src/lib/component-catalog");
	const generatorPath = path.join(
		outputRoot,
		"scripts/generate-component-catalog.mjs",
	);
	const packageJson = await readJson(path.join(outputRoot, "package.json"));
	const sourceFiles = await collectTypeScriptFiles(
		path.join(outputRoot, "src"),
	);
	const catalogFiles = sourceFiles.filter((filePath) =>
		/\.catalog\.tsx$/.test(filePath),
	);

	if (!hasDemo) {
		for (const forbiddenPath of [catalogRoot, generatorPath]) {
			if (await pathExists(forbiddenPath)) {
				throw new Error(
					`${profileCase.profileId}/${profileCase.content} unexpectedly contains Component Export machinery: ${path.relative(outputRoot, forbiddenPath)}`,
				);
			}
		}
		if (catalogFiles.length > 0) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} unexpectedly contains ${catalogFiles.length} catalogue contracts.`,
			);
		}
		for (const [name, command] of Object.entries(packageJson.scripts ?? {})) {
			if (
				name.startsWith("catalog:") ||
				`${command}`.includes("catalog:generate")
			) {
				throw new Error(
					`${profileCase.profileId}/${profileCase.content} retains an unselected catalogue script: ${name}`,
				);
			}
		}
		return;
	}

	for (const requiredPath of [catalogRoot, generatorPath]) {
		if (!(await pathExists(requiredPath))) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} is missing Component Export machinery: ${path.relative(outputRoot, requiredPath)}`,
			);
		}
	}
	if (
		packageJson.scripts?.["catalog:generate"] === undefined ||
		packageJson.scripts?.["verify:component-sweep"] === undefined
	) {
		throw new Error(
			`${profileCase.profileId}/${profileCase.content} is missing Component Export scripts.`,
		);
	}
	const expectedOwnerCount = selectedSurfaces.has("dashboard") ? 96 : 83;
	if (catalogFiles.length !== expectedOwnerCount) {
		throw new Error(
			`${profileCase.profileId}/${profileCase.content} expected ${expectedOwnerCount} installed catalogue owners, found ${catalogFiles.length}.`,
		);
	}
	run(
		process.execPath,
		["scripts/generate-component-catalog.mjs", "--check"],
		outputRoot,
		{
			silent: true,
		},
	);
	for (const filePath of [
		...catalogFiles,
		path.join(
			outputRoot,
			"src/lib/component-catalog/ComponentExportSurface.tsx",
		),
		path.join(
			outputRoot,
			"src/app/(component-export)/internal/demo/[section]/page.tsx",
		),
	]) {
		const source = await fs.readFile(filePath, "utf8");
		if (/@storybook|\.stories\./.test(source)) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} Component Export imports Storybook: ${path.relative(outputRoot, filePath)}`,
			);
		}
	}
}

async function assertInternalRouteShell(outputRoot, profileCase) {
	const marketingInternalLayout = path.join(
		outputRoot,
		"src/app/(site)/(marketing)/internal/layout.tsx",
	);
	const standaloneInternalLayout = path.join(
		outputRoot,
		"src/app/(site)/(dev)/internal/layout.tsx",
	);
	const shouldUseMarketingShell =
		templateProfiles[profileCase.profileId]?.assembly?.surfaces.includes(
			"marketing",
		) ?? false;
	const expectedLayout = shouldUseMarketingShell
		? marketingInternalLayout
		: standaloneInternalLayout;
	const unexpectedLayout = shouldUseMarketingShell
		? standaloneInternalLayout
		: marketingInternalLayout;

	if (
		!(await fs
			.stat(expectedLayout)
			.then(() => true)
			.catch(() => false))
	) {
		throw new Error(
			`Missing expected internal layout for ${profileCase.profileId}/${profileCase.content}.`,
		);
	}
	if (
		await fs
			.stat(unexpectedLayout)
			.then(() => true)
			.catch(() => false)
	) {
		throw new Error(
			`Internal routes were assembled beneath the wrong shell for ${profileCase.profileId}/${profileCase.content}.`,
		);
	}

	const internalLayout = await fs.readFile(expectedLayout, "utf8");
	if (
		internalLayout.includes('process.env.NODE_ENV === "production"') ||
		internalLayout.includes("notFound()")
	) {
		throw new Error(
			`Installed internal routes remain production-gated for ${profileCase.profileId}/${profileCase.content}.`,
		);
	}
	if (shouldUseMarketingShell && internalLayout.includes("SiteShell")) {
		throw new Error(
			`Marketing internal layout duplicated the shell for ${profileCase.profileId}/${profileCase.content}.`,
		);
	}
	if (!shouldUseMarketingShell && !internalLayout.includes("SiteShell")) {
		throw new Error(
			`Standalone internal layout lost its fallback shell for ${profileCase.profileId}/${profileCase.content}.`,
		);
	}
}

function assertFailure(result, message) {
	if (result.status === 0) throw new Error(message);
}

function assertThrows(action, expectedMessage) {
	try {
		action();
	} catch (error) {
		if (error instanceof Error && error.message.includes(expectedMessage))
			return;
		throw error;
	}
	throw new Error(`Expected failure containing: ${expectedMessage}`);
}

async function verifyContractGuards(templateRoot, tempRoot) {
	const outputRoot = path.join(tempRoot, "full-payload-ready-assemble-1");
	const otherRoot = path.join(tempRoot, "thin-start-static-assemble-1");
	const surfaces = new Set(templateProfiles.full.assembly.surfaces);
	const relativeSpec = "specs/platform/data/forms/spec.md";
	const sourcePath = path.join(templateRoot, relativeSpec);
	const outputPath = path.join(outputRoot, relativeSpec);
	const otherPath = path.join(otherRoot, relativeSpec);
	const sourceBefore = await fs.readFile(sourcePath, "utf8");
	const outputBefore = await fs.readFile(outputPath, "utf8");
	const otherBefore = await fs.readFile(otherPath, "utf8");
	const backup = path.join(tempRoot, "contract-guard-backup.md");
	try {
		await fs.rename(outputPath, backup);
		await assert.rejects(
			assertBehaviorContracts(outputRoot, surfaces),
			/capability ownership mismatch/u,
		);
	} finally {
		await fs.rename(backup, outputPath);
	}
	for (const reference of [
		"specs/platform/services/identity/missing-contract",
		"specs/platform/content/missing-deep-contract",
		"specs/template/demos",
		"specs/product/orders/order-fulfillment",
		"specs/legacy/form-behavior",
		"specs/app/shared/data-lifecycle/form-behavior",
	]) {
		try {
			await fs.appendFile(outputPath, `\nDependency: ${reference}.\n`);
			await assert.rejects(
				assertSpecReferences(outputRoot, outputPath),
				/dependency missing|template, legacy or unsupported-scope dependency/u,
			);
			await fs.writeFile(
				outputPath,
				`${outputBefore}\nDependency: \`${reference}\`.\n`,
			);
			await assert.rejects(
				assertSpecReferences(outputRoot, outputPath),
				/dependency missing|template, legacy or unsupported-scope dependency/u,
			);
		} finally {
			await fs.writeFile(outputPath, outputBefore);
		}
	}
	for (const leaked of [
		"specs/template/demos/spec.md",
		"specs/product/orders/spec.md",
		"specs/legacy/leaked/spec.md",
		"specs/data-lifecycle/form-behavior/spec.md",
	]) {
		const leakedPath = path.join(outputRoot, leaked);
		const createdRoot = path.join(
			outputRoot,
			leaked.startsWith("specs/product/")
				? "specs/product/orders"
				: leaked.split("/").slice(0, 2).join("/"),
		);
		const preexisting = await pathExists(createdRoot);
		try {
			await fs.mkdir(path.dirname(leakedPath), { recursive: true });
			await fs.writeFile(leakedPath, "Forbidden generated namespace.\n");
			await assert.rejects(
				assertBehaviorContracts(outputRoot, surfaces),
				/template, product, legacy or unsupported namespaces/u,
			);
		} finally {
			if (preexisting) await fs.rm(leakedPath, { force: true });
			else await fs.rm(createdRoot, { recursive: true, force: true });
		}
	}
	const leakedWorkflow = path.join(outputRoot, ".specify/workflows/backport");
	try {
		await fs.mkdir(leakedWorkflow, { recursive: true });
		await fs.writeFile(
			path.join(leakedWorkflow, "workflow.yml"),
			'schema_version: "1.0"\n',
		);
		await assert.rejects(
			assertBehaviorContracts(outputRoot, surfaces),
			/template-only workflow/u,
		);
	} finally {
		await fs.rm(leakedWorkflow, { recursive: true, force: true });
	}
	const constitutionPath = ".specify/memory/constitution.md";
	const outputConstitution = path.join(outputRoot, constitutionPath);
	const constitutionBefore = await fs.readFile(outputConstitution, "utf8");
	const otherConstitutionBefore = await fs.readFile(
		path.join(otherRoot, constitutionPath),
		"utf8",
	);
	const sourceConstitutionBefore = await fs.readFile(
		path.join(templateRoot, constitutionPath),
		"utf8",
	);
	try {
		await fs.appendFile(outputConstitution, "\nIndependent project edit.\n");
		assert.equal(
			await fs.readFile(path.join(templateRoot, constitutionPath), "utf8"),
			sourceConstitutionBefore,
		);
		assert.equal(
			await fs.readFile(path.join(otherRoot, constitutionPath), "utf8"),
			otherConstitutionBefore,
		);
		await assert.rejects(
			assertBehaviorContracts(outputRoot, surfaces),
			/Generated independent contract differs/u,
		);
	} finally {
		await fs.writeFile(outputConstitution, constitutionBefore);
	}
	const procedurePath = path.join(outputRoot, "docs/testing/forms.md");
	const procedureBefore = await fs.readFile(procedurePath, "utf8");
	try {
		await fs.appendFile(
			procedurePath,
			"\n[Missing evidence](./does-not-exist.md)\n",
		);
		await assert.rejects(
			assertBehaviorContracts(outputRoot, surfaces),
			/Generated policy has a missing link/u,
		);
	} finally {
		await fs.writeFile(procedurePath, procedureBefore);
	}
	try {
		await fs.appendFile(outputPath, "\nIndependent generated-project edit.\n");
		assert.equal(
			await fs.readFile(sourcePath, "utf8"),
			sourceBefore,
			"Editing a generated contract mutated the template.",
		);
		assert.equal(
			await fs.readFile(otherPath, "utf8"),
			otherBefore,
			"Editing one project mutated another project's contract.",
		);
		await assert.rejects(
			assertBehaviorContracts(outputRoot, surfaces),
			/Generated independent contract differs/u,
		);
	} finally {
		await fs.writeFile(outputPath, outputBefore);
	}
	try {
		await fs.unlink(outputPath);
		await fs.link(sourcePath, outputPath);
		await assert.rejects(
			assertBehaviorContracts(outputRoot, surfaces),
			/shares its source inode/u,
		);
	} finally {
		// Unlink before restoring bytes so a failed hardlink check cannot alter source.
		await fs.rm(outputPath, { force: true });
		await fs.writeFile(outputPath, outputBefore);
	}
	await assertBehaviorContracts(outputRoot, surfaces);
	console.log(
		"Scoped platform omission, spec dependencies, template/product/workflow exclusion, broken-link and independent-copy guards passed.",
	);
}

async function verifyOwnershipGuards(templateRoot, tempRoot) {
	assertThrows(
		() => assertPackageOwnership({ scripts: { "unknown:script": "true" } }),
		"Unclassified package script",
	);
	assertThrows(
		() => assertPackageOwnership({ dependencies: { "unknown-package": "1" } }),
		"Unclassified package dependency",
	);
	assertThrows(
		() =>
			assertPackageOwnership({
				devDependencies: { "unknown-dev-package": "1" },
			}),
		"Unclassified package devDependency",
	);

	const sentinelPath = path.join(
		templateRoot,
		"docs/.assembly-unclassified-sentinel.md",
	);
	const outputRoot = path.join(tempRoot, "unclassified-documentation");
	try {
		await fs.writeFile(sentinelPath, "assembly ownership sentinel\n", "utf8");
		const result = run(
			process.execPath,
			[
				"scripts/create-template-profile.mjs",
				"--profile",
				"full",
				"--output",
				outputRoot,
			],
			templateRoot,
			{ allowFailure: true, silent: true },
		);
		assertFailure(result, "Unclassified documentation did not fail closed.");
		if (!result.stderr.includes("Unclassified assembly documentation")) {
			throw new Error(
				"Unclassified documentation failed for the wrong reason.",
			);
		}
	} finally {
		await fs.rm(sentinelPath, { force: true });
		await fs.rm(outputRoot, { recursive: true, force: true });
	}
	const previousMarketing = templateSurfaces.marketing.ownedPaths;
	const previousDashboard = templateSurfaces.dashboard.ownedPaths;
	const conflictingPath = "specs/platform/data/forms/spec.md";
	try {
		templateSurfaces.marketing.ownedPaths = [
			...previousMarketing,
			conflictingPath,
		];
		templateSurfaces.dashboard.ownedPaths = [
			...previousDashboard,
			conflictingPath,
		];
		await assert.rejects(
			assembleTemplateProfile({
				sourceRoot: templateRoot,
				destinationRoot: path.join(tempRoot, "conflicting-contract-owners"),
				profile: templateProfiles.full,
				content: "static",
			}),
			/Assembly ownership collision/u,
		);
	} finally {
		templateSurfaces.marketing.ownedPaths = previousMarketing;
		templateSurfaces.dashboard.ownedPaths = previousDashboard;
	}

	console.log("Assembly ownership guards passed.");
}

async function verifyCreationSafety(templateRoot, tempRoot) {
	const assemblyRoot = path.join(tempRoot, "full-payload-ready-assemble-1");
	const contentMismatch = run(
		process.execPath,
		[
			"scripts/create-template-profile.mjs",
			"--profile",
			"full",
			"--content",
			"static",
			"--output",
			assemblyRoot,
			"--force",
		],
		templateRoot,
		{ allowFailure: true, silent: true },
	);
	assertFailure(
		contentMismatch,
		"Cross-content replacement did not fail closed.",
	);

	const profileMismatch = run(
		process.execPath,
		[
			"scripts/create-template-profile.mjs",
			"--profile",
			"marketing-only",
			"--content",
			"payload-ready",
			"--output",
			assemblyRoot,
			"--force",
		],
		templateRoot,
		{ allowFailure: true, silent: true },
	);
	assertFailure(
		profileMismatch,
		"Cross-profile replacement did not fail closed.",
	);

	const dryRunRoot = path.join(tempRoot, "assembly-dry-run");
	const dryRun = run(
		process.execPath,
		[
			"scripts/create-template-profile.mjs",
			"--profile",
			"full",
			"--content",
			"static",
			"--output",
			dryRunRoot,
			"--dry-run",
		],
		templateRoot,
		{ silent: true },
	);
	if (
		await fs
			.stat(dryRunRoot)
			.then(() => true)
			.catch(() => false)
	) {
		throw new Error("Assembly dry-run created its output directory.");
	}
	if (!dryRun.stdout.includes("- content: static")) {
		throw new Error("Assembly dry-run did not report its content mode.");
	}

	const defaults = run(
		process.execPath,
		[
			"scripts/create-template-profile.mjs",
			"--profile",
			"full",
			"--output",
			path.join(tempRoot, "default-content-dry-run"),
			"--dry-run",
		],
		templateRoot,
		{ silent: true },
	);
	if (!defaults.stdout.includes("- content: payload-ready")) {
		throw new Error("The full profile default content is not payload-ready.");
	}

	for (const args of [
		["--profile", "app-only", "--content", "payload-ready", "--dry-run"],
		["--engine", "legacy", "--dry-run"],
		["--in-place", "--dry-run"],
		["--output", templateRoot],
	]) {
		const result = run(
			process.execPath,
			["scripts/create-template-profile.mjs", ...args],
			templateRoot,
			{ allowFailure: true, silent: true },
		);
		assertFailure(
			result,
			`Unsafe creation arguments were accepted: ${args.join(" ")}`,
		);
	}
	console.log("Assembly creation safety checks passed.");
}

function median(values) {
	const sorted = [...values].sort((left, right) => left - right);
	return sorted[Math.floor(sorted.length / 2)];
}

async function main() {
	const options = parseArgs(process.argv.slice(2));
	const templateRoot = process.cwd();
	const tempRoot = await fs.mkdtemp(
		path.join(os.tmpdir(), "averlo-template-profile-matrix-"),
	);
	const resolvedTempRoot = path.resolve(tempRoot);
	const resolvedSystemTemp = `${path.resolve(os.tmpdir())}${path.sep}`;
	if (!resolvedTempRoot.startsWith(resolvedSystemTemp)) {
		throw new Error(`Refusing unsafe profile-matrix root: ${tempRoot}`);
	}
	const timings = [];

	try {
		await assertCanonicalAgentContract(templateRoot);
		await assertRemovedPublicEnvironmentAbsent(
			templateRoot,
			"Canonical template",
		);
		for (const profileCase of PROFILE_CASES) {
			const { profileId, content } = profileCase;
			const profile = templateProfiles[profileId];
			let integrationRoot;
			for (
				let runIndex = 0;
				runIndex < options.performanceRuns;
				runIndex += 1
			) {
				const outputRoot = path.join(
					tempRoot,
					`${profileId}-${content}-assemble-${runIndex + 1}`,
				);
				if (runIndex === 0) integrationRoot = outputRoot;
				console.log(
					`\nMaterializing ${profileId}/${content} (${runIndex + 1}/${options.performanceRuns})`,
				);
				const startedAt = performance.now();
				run(
					process.execPath,
					[
						"scripts/create-template-profile.mjs",
						"--profile",
						profileId,
						"--content",
						content,
						"--output",
						outputRoot,
					],
					templateRoot,
					{ silent: runIndex > 0 },
				);
				timings.push(performance.now() - startedAt);
				await assertReceipt(outputRoot, profileCase);
				await assertGeneratedDocumentation(outputRoot, profileCase);
				await assertNoAssistantCapability(outputRoot);
				await assertStorybook(outputRoot, profileCase);
				await assertComponentExport(outputRoot, profileCase);
				await assertRemovedPublicEnvironmentAbsent(
					outputRoot,
					`${profileId}/${content}`,
				);
			}

			await assertInternalRouteShell(integrationRoot, profileCase);
			await assertGeneratedSurfaceContract(integrationRoot, profileCase);
			run(
				process.execPath,
				[
					path.join(templateRoot, "node_modules/tsx/dist/cli.mjs"),
					"scripts/verify/verify-route-surfaces.ts",
				],
				integrationRoot,
			);
			if (!options.integration) continue;
			runNpm(["ci", "--no-audit", "--no-fund"], integrationRoot);
			if (profileId === "thin-start") {
				runNpm(
					[
						"run",
						"review:thin-start-api",
						"--",
						"--root",
						integrationRoot,
						"--strict",
					],
					templateRoot,
				);
			}
			for (const command of getProfileVerificationCommands(profile)) {
				runNpm(npmRunArgs(command), integrationRoot);
			}
		}

		await verifyContractGuards(templateRoot, tempRoot);
		await verifyCreationSafety(templateRoot, tempRoot);
		await verifyOwnershipGuards(templateRoot, tempRoot);
		await verifyAssistantCapability(templateRoot, tempRoot);
		console.log(
			`assemble median materialization: ${Math.round(median(timings))}ms`,
		);
		console.log(
			options.integration
				? "\nTemplate profile integration matrix passed."
				: "\nTemplate profile materialization matrix passed.",
		);
	} finally {
		if (options.keep) {
			console.log(`Retained profile matrix at ${tempRoot}`);
		} else {
			await fs.rm(resolvedTempRoot, { recursive: true, force: true });
			console.log(`Removed disposable profile matrix ${tempRoot}`);
		}
	}
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
