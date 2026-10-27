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
} from "../../template-assembly/assembler.mjs";
import {
	assemblyCoreSpecPaths,
	assemblyOpenSpecSkillPaths,
} from "../../template-assembly/manifest.mjs";
import {
	getProfileVerificationCommands,
	templateProfiles,
} from "../../template-profiles/index.mjs";
import { templateSurfaces } from "../../template-surfaces/index.mjs";

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
	for (const heading of [
		"## Project",
		"## Averlo Plugin Pack",
		"## Development and Review Isolation",
		"## Application Areas",
		"## Design System",
	]) {
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
		"stock OpenSpec discovery",
		"project-owned maintained behavior in `openspec/specs/app/`",
		"This project owns its `app/` contracts and OpenSpec configuration",
		"Nearest `AGENTS.md` owns structure and dependency direction",
		"Storybook owns supported component APIs/defaults",
		"names-only `WORKFLOWS.md` menu",
		"independent copies",
		"A source-backed composition must not call Figma or edit product code",
		"$averlo:compose",
		"$averlo:systemize-composition",
		"$averlo:animate",
		"$averlo:visual-parity",
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
	for (const heading of [
		"## Project",
		"## Averlo Plugin Pack",
		"## Development and Review Isolation",
		"## Application Areas",
		"## Design System",
	]) {
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
	]) {
		if (agentInstructions.includes(forbiddenText)) {
			throw new Error(
				`Canonical AGENTS.md contains retired recipe text: ${forbiddenText}.`,
			);
		}
	}
	for (const requiredPolicy of [
		"`openspec list --specs`",
		"`openspec show <capability-id> --type spec`",
		"normal stock change lifecycle",
		"Generated projects receive explicitly selected independent app copies",
		"Nearest `AGENTS.md` owns source topology, dependency direction",
		"Storybook owner contracts own supported component APIs and defaults",
		"`WORKFLOWS.md` is their names-only menu",
		"A source-backed composition must not call Figma or edit product code",
		"$averlo:compose",
		"$averlo:systemize-composition",
		"$averlo:animate",
		"$averlo:visual-parity",
	]) {
		if (!agentInstructions.replace(/\s+/gu, " ").includes(requiredPolicy)) {
			throw new Error(
				`Canonical AGENTS.md is missing workflow-delivery policy: ${requiredPolicy}.`,
			);
		}
	}
	if (!(await pathExists(path.join(templateRoot, "PRODUCT.md")))) {
		throw new Error("Canonical template is missing PRODUCT.md.");
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

async function assertProjectOpenSpecConfig(outputRoot) {
	const relativePath = "openspec/config.yaml";
	const configPath = path.join(outputRoot, relativePath);
	const config = await fs.readFile(configPath, "utf8");
	if (
		!/^schema: spec-driven$/mu.test(config) ||
		!/^context: \|$/mu.test(config) ||
		!config.includes("independent product project") ||
		!config.includes("openspec/specs/app/") ||
		!config.includes("project-owned copies") ||
		!config.includes("existing product contracts") ||
		!config.includes("cross-client/server data-lifecycle") ||
		!config.includes("Reserve openspec/specs/product/") ||
		!config.includes("never installs a feature") ||
		!/^operations:$/mu.test(config) ||
		[...config.matchAll(/^([^\s#][^:]*):/gmu)].some(
			(match) => !["schema", "context", "operations"].includes(match[1]),
		) ||
		/in the template repository|propagate applicable|Contact and support fixtures never send email|template\/(?:demo-behavior|project-assembly)/iu.test(
			config,
		)
	)
		throw new Error(
			"Generated OpenSpec config retains template policy or lacks project ownership.",
		);
	const sourcePath = path.resolve(relativePath);
	const [sourceConfig, sourceStat, outputStat] = await Promise.all([
		fs.readFile(sourcePath, "utf8"),
		fs.stat(sourcePath),
		fs.stat(configPath),
	]);
	if (
		config === sourceConfig ||
		(sourceStat.dev === outputStat.dev && sourceStat.ino === outputStat.ino)
	)
		throw new Error(
			"Generated OpenSpec config must be an independent project-owned configuration.",
		);
}

function isScopedAppCapability(capability) {
	return /^app\/(?:shared\/(?:data-lifecycle|frontend\/(?:components|interaction|navigation|content)|services\/(?:identity|files|delivery|transport))|marketing\/(?:composition|content-sources|metadata)|dashboard\/navigation)\/[a-z][a-z0-9-]*$/u.test(
		capability,
	);
}

async function assertAppCapabilityReferences(outputRoot, file) {
	const text = await fs.readFile(file, "utf8");
	for (const match of text.matchAll(
		/(?<![a-z0-9-/])((?:app|template|product|content|data-lifecycle|delivery|domain|experience|identity|integration|interaction|navigation|ui-system)(?:\/[a-z][a-z0-9-]*)+)(?![a-z0-9-/])/gu,
	)) {
		if (!isScopedAppCapability(match[1]))
			throw new Error(
				`Generated capability has a legacy, non-app or unsupported-scope dependency: ${match[1]}`,
			);
		if (
			!(await pathExists(
				path.join(outputRoot, "openspec/specs", match[1], "spec.md"),
			))
		)
			throw new Error(`Generated capability dependency missing: ${match[1]}`);
	}
}

async function assertBehaviorContracts(outputRoot, surfaces) {
	await assertProjectOpenSpecConfig(outputRoot);
	const expected = new Set(assemblyCoreSpecPaths);
	for (const surface of surfaces) {
		for (const owned of templateSurfaces[surface]?.ownedPaths ?? []) {
			if (owned.startsWith("openspec/specs/")) expected.add(owned);
		}
	}
	const files = [];
	async function visit(directory) {
		if (!(await pathExists(directory))) return;
		for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
			const target = path.join(directory, entry.name);
			if (entry.isDirectory()) await visit(target);
			else files.push(target);
		}
	}
	if (await pathExists(path.join(outputRoot, "openspec/changes")))
		throw new Error("Generated OpenSpec history must remain excluded.");
	for (const namespace of ["template", "product"]) {
		if (await pathExists(path.join(outputRoot, "openspec/specs", namespace)))
			throw new Error(
				"Generated specs retain template, product, legacy or unsupported namespaces.",
			);
	}
	await visit(path.join(outputRoot, "openspec/specs"));
	const actual = new Set(files.map((file) => path.relative(outputRoot, file)));
	if (
		[...actual].some(
			(file) =>
				!file.endsWith("/spec.md") ||
				!isScopedAppCapability(
					file.slice("openspec/specs/".length, -"/spec.md".length),
				),
		)
	)
		throw new Error(
			"Generated specs retain template, product, legacy or unsupported namespaces.",
		);
	const expectedCount =
		13 +
		(surfaces.has("dashboard") ? 3 : 0) +
		(surfaces.has("marketing") ? 4 : 0);
	if (expected.size !== expectedCount)
		throw new Error(
			`Explicit selected capability count differs: expected ${expectedCount}, got ${expected.size}`,
		);
	for (const [capability, shouldExist] of [
		["app/shared/frontend/content/media-delivery", true],
		[
			"app/marketing/content-sources/source-resolution",
			surfaces.has("marketing"),
		],
		[
			"app/marketing/metadata/public-document-metadata",
			surfaces.has("marketing"),
		],
		["app/dashboard/navigation/route-enrichment", surfaces.has("dashboard")],
		[
			"app/shared/frontend/content/entity-presentation",
			surfaces.has("dashboard"),
		],
		[
			"app/shared/services/files/private-file-access",
			surfaces.has("dashboard"),
		],
		[
			"app/shared/services/delivery/contact-delivery",
			surfaces.has("marketing"),
		],
	]) {
		if (expected.has(`openspec/specs/${capability}/spec.md`) !== shouldExist)
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
	for (const relativePath of [...expected, ...assemblyOpenSpecSkillPaths]) {
		const sourcePath = path.resolve(relativePath);
		const outputPath = path.join(outputRoot, relativePath);
		if (
			(await fs.readFile(sourcePath, "utf8")) !==
			(await fs.readFile(outputPath, "utf8"))
		)
			throw new Error(
				`Generated independent contract differs: ${relativePath}`,
			);
		const [sourceStat, outputStat] = await Promise.all([
			fs.stat(sourcePath),
			fs.stat(outputPath),
		]);
		if (sourceStat.dev === outputStat.dev && sourceStat.ino === outputStat.ino)
			throw new Error(
				`Generated contract shares its source inode: ${relativePath}`,
			);
	}
	await visit(path.join(outputRoot, "docs/testing"));
	files.push(path.join(outputRoot, "WORKFLOWS.md"));
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
		if (file.endsWith("spec.md"))
			await assertAppCapabilityReferences(outputRoot, file);
	}
	const agentText = await fs.readFile(
		path.join(outputRoot, "AGENTS.md"),
		"utf8",
	);
	if (
		/repository-workflows|template\/(?:(?:assembly|demonstrations)\/)?(?:project-assembly|demo-behavior)|openspec\/specs\/(?!app\/|product\/)/u.test(
			agentText,
		)
	)
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
		"openspec/changes",
		"openspec/specs/template",
	]) {
		if (await pathExists(path.join(outputRoot, forbiddenPath))) {
			throw new Error(
				`${profileCase.profileId}/${profileCase.content} contains template plugin source: ${forbiddenPath}`,
			);
		}
	}
	for (const requiredPath of [
		...assemblyOpenSpecSkillPaths,
		"openspec/config.yaml",
		"openspec/specs/app/shared/data-lifecycle/form-behavior/spec.md",
		"openspec/specs/app/shared/data-lifecycle/loading-state-behavior/spec.md",
		"docs/testing/forms.md",
		"docs/testing/loading.md",
		"WORKFLOWS.md",
		"scripts/verify/verify-forms.mjs",
		"scripts/verify/verify-loading.mjs",
		"scripts/verify/forms/shared.mjs",
	]) {
		if (!(await pathExists(path.join(outputRoot, requiredPath))))
			throw new Error(
				`Generated project is missing form/OpenSpec ownership: ${requiredPath}`,
			);
	}
	const stockSkills = await fs.readdir(path.join(outputRoot, ".agents/skills"));
	if (
		stockSkills.length !== 6 ||
		stockSkills.some(
			(name) =>
				!assemblyOpenSpecSkillPaths.has(`.agents/skills/${name}/SKILL.md`),
		)
	)
		throw new Error(
			"Generated project must retain only the six stock OpenSpec skills.",
		);
	const surfaces = new Set(
		templateProfiles[profileCase.profileId].assembly.surfaces,
	);
	await assertBehaviorContracts(outputRoot, surfaces);
	if (
		(await pathExists(path.join(outputRoot, "openspec/specs/form-behavior"))) ||
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
	const expectedOwnerCount = selectedSurfaces.has("dashboard") ? 95 : 82;
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
	const relativeSpec =
		"openspec/specs/app/shared/data-lifecycle/form-behavior/spec.md";
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
		"app/shared/services/identity/missing-contract",
		"app/shared/frontend/content/missing-deep-contract",
		"template/demonstrations/demo-behavior",
		"product/orders/order-fulfillment",
		"app/data-lifecycle/form-behavior",
		"app/shared/unknown/missing-contract",
		"data-lifecycle/form-behavior",
	]) {
		try {
			await fs.appendFile(outputPath, `\nDependency: ${reference}.\n`);
			await assert.rejects(
				assertAppCapabilityReferences(outputRoot, outputPath),
				/dependency missing|legacy, non-app or unsupported-scope dependency/u,
			);
			await fs.writeFile(
				outputPath,
				`${outputBefore}\nDependency: \`${reference}\`.\n`,
			);
			await assert.rejects(
				assertAppCapabilityReferences(outputRoot, outputPath),
				/dependency missing|legacy, non-app or unsupported-scope dependency/u,
			);
		} finally {
			await fs.writeFile(outputPath, outputBefore);
		}
	}
	for (const namespace of [
		"template/demonstrations",
		"product",
		"data-lifecycle",
		"app/data-lifecycle",
	]) {
		const leakedPath = path.join(
			outputRoot,
			"openspec/specs",
			namespace,
			"leaked/spec.md",
		);
		try {
			await fs.mkdir(path.dirname(leakedPath), { recursive: true });
			await fs.writeFile(leakedPath, "Forbidden generated namespace.\n");
			await assert.rejects(
				assertBehaviorContracts(outputRoot, surfaces),
				/template, product, legacy or unsupported namespaces/u,
			);
		} finally {
			const cleanupNamespace = namespace.startsWith("app/")
				? namespace
				: namespace.split("/", 1)[0];
			await fs.rm(path.join(outputRoot, "openspec/specs", cleanupNamespace), {
				recursive: true,
				force: true,
			});
		}
	}
	const historyPath = path.join(
		outputRoot,
		"openspec/changes/invented-history",
	);
	try {
		await fs.mkdir(historyPath, { recursive: true });
		await fs.writeFile(
			path.join(historyPath, "proposal.md"),
			"History leakage.\n",
		);
		await assert.rejects(
			assertBehaviorContracts(outputRoot, surfaces),
			/history must remain excluded/u,
		);
	} finally {
		await fs.rm(path.join(outputRoot, "openspec/changes"), {
			recursive: true,
			force: true,
		});
	}
	const configPath = path.join(outputRoot, "openspec/config.yaml");
	const configBefore = await fs.readFile(configPath, "utf8");
	const otherConfigPath = path.join(otherRoot, "openspec/config.yaml");
	const otherConfigBefore = await fs.readFile(otherConfigPath, "utf8");
	const sourceConfigPath = path.join(templateRoot, "openspec/config.yaml");
	const sourceConfigBefore = await fs.readFile(sourceConfigPath, "utf8");
	try {
		await fs.appendFile(configPath, "# Independent project edit.\n");
		assert.equal(
			await fs.readFile(sourceConfigPath, "utf8"),
			sourceConfigBefore,
		);
		assert.equal(await fs.readFile(otherConfigPath, "utf8"), otherConfigBefore);
		await assertProjectOpenSpecConfig(outputRoot);
		await fs.writeFile(configPath, sourceConfigBefore);
		await assert.rejects(
			assertProjectOpenSpecConfig(outputRoot),
			/config.*(?:template policy|independent project-owned)/u,
		);
	} finally {
		await fs.writeFile(configPath, configBefore);
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
		"Scoped app omission, deep dependencies, legacy/template/history/product exclusion, broken-link, project-config and independent-copy guards passed.",
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
	const conflictingPath =
		"openspec/specs/app/shared/data-lifecycle/form-behavior/spec.md";
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
