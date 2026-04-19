#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process, { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const INTERNAL_MARKETING_DIR = path.join(
	ROOT,
	"src/app/(site)/(marketing)/(internal)",
);

const SURFACES = {
	dashboard: {
		id: "dashboard",
		flag: "--no-dashboard",
		description:
			"Remove the dashboard shell, login/auth routes, and dashboard-only auth helpers.",
		dependentSurfaces: ["auth"],
		ownedPaths: [
			"src/app/(site)/dashboard",
			"src/app/(site)/(auth)",
			"src/lib/api/auth.ts",
		],
		routeIds: ["login", "dashboard", "dashboardSettings"],
		routeBuilders: ["dashboardSubpage"],
		navRouteIds: [],
		searchSources: [],
		postRemovalAssertions: [
			{
				label: "dashboard route ids",
				pattern:
					/(hrefFor\("dashboard"\)|hrefFor\("dashboardSettings"\)|hrefFor\("login"\)|routeId:\s*"dashboard"|routeId:\s*"dashboardSettings"|routeId:\s*"login")/,
			},
			{
				label: "dashboard auth import",
				pattern: /from\s+["']@\/lib\/api\/auth["']/,
			},
		],
	},
	demo: {
		id: "demo",
		flag: "--no-demo",
		description: "Remove the internal demo surface and demo search indexing.",
		dependentSurfaces: [],
		ownedPaths: ["src/app/(site)/(marketing)/(internal)/demo"],
		routeIds: ["demo"],
		routeBuilders: [],
		navRouteIds: ["demo"],
		searchSources: ["demoPages"],
		postRemovalAssertions: [
			{
				label: "demo route ids",
				pattern: /(hrefFor\("demo"\)|routeId:\s*"demo")/,
			},
			{
				label: "demo content import",
				pattern: /from\s+["']@\/app\/\(site\)\/\(marketing\)\/\(internal\)\/demo\/content["']/,
			},
		],
	},
	dictionary: {
		id: "dictionary",
		flag: "--no-dictionary",
		description:
			"Remove the internal dictionary surface, its route ids, and dictionary search/nav references.",
		dependentSurfaces: [],
		ownedPaths: ["src/app/(site)/(marketing)/(internal)/dictionary"],
		routeIds: [
			"dictionary",
			"dictionaryRiveLogoReveal",
			"dictionarySpamProtectedForm",
		],
		routeBuilders: ["dictionaryEntry"],
		navRouteIds: ["dictionary"],
		searchSources: [],
		postRemovalAssertions: [
			{
				label: "dictionary route ids",
				pattern:
					/(hrefFor\("dictionary"\)|hrefFor\("dictionaryRiveLogoReveal"\)|hrefFor\("dictionarySpamProtectedForm"\)|routeId:\s*"dictionary"|routeId:\s*"dictionaryRiveLogoReveal"|routeId:\s*"dictionarySpamProtectedForm")/,
			},
		],
	},
	reference: {
		id: "reference",
		flag: "--no-reference",
		description: "Remove the internal reference/docs surface.",
		dependentSurfaces: [],
		ownedPaths: ["src/app/(site)/(marketing)/(internal)/reference"],
		routeIds: [],
		routeBuilders: [],
		navRouteIds: [],
		searchSources: [],
		postRemovalAssertions: [],
	},
};

const CENTRAL_FILES = [
	"src/config/routes.ts",
	"src/lib/routes.ts",
	"src/lib/api/index.ts",
	"src/app/(site)/(marketing)/_components/layout/marketingNav.ts",
	"src/app/(site)/(marketing)/_components/layout/MarketingContentSearch.tsx",
	"src/app/(site)/(marketing)/_components/layout/HeaderFull.tsx",
];

function printUsage() {
	console.log(`Usage: npm run prune:template -- [flags]

Flags:
  --no-dashboard   Remove dashboard routes, auth/login shell, and dashboard auth helpers
  --no-demo        Remove the internal demo surface
  --no-dictionary  Remove the internal dictionary surface
  --no-reference   Remove the internal reference surface
  --dry-run        Print the prune plan without changing files
  --yes            Skip the confirmation prompt
`);
}

function parseArgs(argv) {
	const surfaceIds = [];
	const flags = new Set(argv);

	for (const [surfaceId, surface] of Object.entries(SURFACES)) {
		if (flags.has(surface.flag)) {
			surfaceIds.push(surfaceId);
		}
	}

	const recognized = new Set([
		"--dry-run",
		"--yes",
		"--help",
		...Object.values(SURFACES).map((surface) => surface.flag),
	]);

	const unknown = argv.filter((arg) => !recognized.has(arg));
	if (unknown.length > 0) {
		throw new Error(`Unknown flag(s): ${unknown.join(", ")}`);
	}

	return {
		surfaceIds,
		dryRun: flags.has("--dry-run"),
		yes: flags.has("--yes"),
		help: flags.has("--help"),
	};
}

function relativePath(targetPath) {
	return path.relative(ROOT, targetPath) || ".";
}

async function pathExists(targetPath) {
	try {
		await fs.access(targetPath);
		return true;
	} catch {
		return false;
	}
}

async function assertTemplateRoot() {
	const packageJsonPath = path.join(ROOT, "package.json");
	const raw = await fs.readFile(packageJsonPath, "utf8");
	const pkg = JSON.parse(raw);

	if (pkg.name !== "webvizion-template") {
		throw new Error(
			`Expected package.json name to be "webvizion-template", received "${pkg.name ?? "unknown"}".`,
		);
	}
}

function buildState(surfaceIds) {
	const removed = new Set(surfaceIds);

	return {
		hasDashboard: !removed.has("dashboard"),
		hasDemo: !removed.has("demo"),
		hasDictionary: !removed.has("dictionary"),
		hasReference: !removed.has("reference"),
	};
}

async function collectPlan(surfaceIds) {
	const deletedPaths = [];

	for (const surfaceId of surfaceIds) {
		for (const ownedPath of SURFACES[surfaceId].ownedPaths) {
			const absolutePath = path.join(ROOT, ownedPath);
			if (await pathExists(absolutePath)) {
				deletedPaths.push(absolutePath);
			}
		}
	}

	const uniqueDeletedPaths = [...new Set(deletedPaths)].sort();
	const removeInternalDir =
		surfaceIds.includes("demo") &&
		surfaceIds.includes("dictionary") &&
		surfaceIds.includes("reference");

	return {
		surfaces: surfaceIds.map((surfaceId) => SURFACES[surfaceId]),
		deletedPaths: uniqueDeletedPaths,
		rewriteFiles: [...CENTRAL_FILES],
		removeInternalDir,
	};
}

function renderRoutesFile(state) {
	const lines = [
		`export const appRoutes = {`,
		`\thome: "/",`,
		`\tcontact: "/contact",`,
	];

	if (state.hasDemo) {
		lines.push(`\tdemo: "/demo",`);
	}

	lines.push(`\tsettings: "/settings",`);

	if (state.hasDashboard) {
		lines.push(`\tlogin: "/login",`);
		lines.push(`\tdashboard: "/dashboard",`);
		lines.push(`\tdashboardSettings: "/dashboard/settings",`);
	}

	if (state.hasDictionary) {
		lines.push(`\tdictionary: "/dictionary",`);
		lines.push(
			`\tdictionaryRiveLogoReveal: "/dictionary/loading-screens/rive-logo-reveal",`,
		);
		lines.push(
			`\tdictionarySpamProtectedForm: "/dictionary/forms/spam-protected-form",`,
		);
	}

	lines.push(`} as const;`, "", `export type AppRouteId = keyof typeof appRoutes;`, "");

	return lines.join("\n");
}

function renderLibRoutesFile(state) {
	const builderLines = [];

	if (state.hasDashboard) {
		builderLines.push(
			"\tdashboardSubpage: (...segments: string[]) => `/dashboard/${segments.join(\"/\")}`,",
		);
	}

	if (state.hasDictionary) {
		builderLines.push(
			"\tdictionaryEntry: (...segments: string[]) => `/dictionary/${segments.join(\"/\")}`,",
		);
	}

	return [
		'import { appRoutes, type AppRouteId } from "@/config/routes";',
		"",
		'export type { AppRouteId } from "@/config/routes";',
		"",
		"export function hrefFor(routeId: AppRouteId) {",
		"\treturn appRoutes[routeId];",
		"}",
		"",
		builderLines.length > 0
			? ["export const routeBuilders = {", ...builderLines, "};", ""].join("\n")
			: ["export const routeBuilders = {};", ""].join("\n"),
	].join("\n");
}

function renderMarketingNavFile(state) {
	const navEntries = ['\t{ name: "Home", routeId: "home" },'];

	if (state.hasDemo) {
		navEntries.push('\t{ name: "Demo", routeId: "demo" },');
	}

	navEntries.push('\t{ name: "Settings", routeId: "settings" },');

	if (state.hasDictionary) {
		navEntries.push('\t{ name: "Dictionary", routeId: "dictionary" },');
	}

	return [
		'import type { IconName } from "@/components/ui/icons/Icon";',
		'import type { AppRouteId } from "@/config/routes";',
		"",
		"export type MarketingNavLink = {",
		"\tname: string;",
		"\trouteId: AppRouteId;",
		"};",
		"",
		"export type MarketingSocialLink = {",
		"\tname: string;",
		"\ticon: IconName;",
		"\thref: string;",
		"};",
		"",
		"export const MARKETING_NAV_LINKS: MarketingNavLink[] = [",
		...navEntries,
		"];",
		"",
		"export const MARKETING_SOCIAL_LINKS: MarketingSocialLink[] = [",
		"\t{",
		'\t\tname: "X",',
		'\t\ticon: "x",',
		'\t\thref: "",',
		"\t},",
		"\t{",
		'\t\tname: "Instagram",',
		'\t\ticon: "instagram",',
		'\t\thref: "",',
		"\t},",
		"\t{",
		'\t\tname: "LinkedIn",',
		'\t\ticon: "linked-in",',
		'\t\thref: "",',
		"\t},",
		"\t{",
		'\t\tname: "Meta",',
		'\t\ticon: "meta",',
		'\t\thref: "",',
		"\t},",
		"\t{",
		'\t\tname: "You Tube",',
		'\t\ticon: "youtube",',
		'\t\thref: "",',
		"\t},",
		"];",
		"",
	].join("\n");
}

function renderMarketingContentSearchFile(state) {
	const header = [
		'"use client";',
		"",
		state.hasDemo
			? 'import { getVisibleDemoPages } from "@/app/(site)/(marketing)/(internal)/demo/content";'
			: null,
		"import {",
		"\tContentSearch,",
		"\ttype ContentSearchEntry,",
		"\ttype ContentSearchFieldProps,",
		"\ttype ContentSearchInputProps,",
		'} from "@/components/domain/search/ContentSearch";',
		'import { hrefFor } from "@/lib/routes";',
		'import { MARKETING_NAV_LINKS } from "./marketingNav";',
		"",
		"type MarketingContentSearchProps = {",
		"\tonNavigate?: () => void;",
		"\tportalTargetId?: string;",
		"\tfield?: ContentSearchFieldProps;",
		"\tinput?: ContentSearchInputProps;",
		"};",
		"",
		"function getMarketingSearchEntries(): ContentSearchEntry[] {",
		"\tconst entries: ContentSearchEntry[] = [];",
		'\tconst seen = new Set<string>();',
		"",
		"\tfunction addEntry(entry: ContentSearchEntry) {",
		"\t\tif (seen.has(entry.href)) return;",
		"\t\tseen.add(entry.href);",
		"\t\tentries.push(entry);",
		"\t}",
		"",
		"\tfor (const link of MARKETING_NAV_LINKS) {",
		"\t\taddEntry({",
		"\t\t\tid: `nav-${link.routeId}`,",
		"\t\t\tlabel: link.name,",
		"\t\t\thref: hrefFor(link.routeId),",
		"\t\t});",
		"\t}",
	];

	if (state.hasDemo) {
		header.push(
			"",
			"\tfor (const page of getVisibleDemoPages()) {",
			"\t\taddEntry({",
			"\t\t\tid: `demo-${page.id}`,",
			'\t\t\tlabel: `Demo: ${page.title}`,',
			'\t\t\thref: `/demo/${page.slug.join("/")}`,',
			"\t\t});",
			"\t}",
		);
	}

	header.push(
		"",
		"\treturn entries;",
		"}",
		"",
		"export default function MarketingContentSearch({",
		"\tonNavigate,",
		"\tportalTargetId,",
		"\tfield,",
		"\tinput,",
		"}: MarketingContentSearchProps) {",
		"\treturn (",
		"\t\t<ContentSearch",
		"\t\t\tentries={getMarketingSearchEntries()}",
		"\t\t\tonNavigate={onNavigate}",
		"\t\t\tportalTargetId={portalTargetId}",
		"\t\t\tfield={field}",
		"\t\t\tinput={input}",
		"\t\t/>",
		"\t);",
		"}",
		"",
	);

	return header.filter(Boolean).join("\n");
}

function renderHeaderFullFile(state) {
	const ctaBlock = state.hasDashboard
		? [
				"",
				"\t\t\t\t\t\t<Button",
				'\t\t\t\t\t\t\tvariant="primary"',
				'\t\t\t\t\t\t\thref={hrefFor("login")}',
				'\t\t\t\t\t\t\tclassName="pointer-events-auto"',
				"\t\t\t\t\t\t>",
				"\t\t\t\t\t\t\tJoin Now",
				"\t\t\t\t\t\t</Button>",
			].join("\n")
		: "";

	return [
		'"use client";',
		"",
		'import clsx from "clsx";',
		'import { motion } from "motion/react";',
		'import { useEffect, useRef, useState } from "react";',
		'import Logo from "@/components/branding/Logo";',
		'import { Button } from "@/components/ui/primitives/Button";',
		'import { useMotionAllowed } from "@/hooks/useMotionAllowed";',
		'import { springs } from "@/lib/motionPresets";',
		'import { hrefFor } from "@/lib/routes";',
		'import MarketingContentSearch from "./MarketingContentSearch";',
		'import { MARKETING_NAV_LINKS } from "./marketingNav";',
		"",
		"// TODO wip: animte header in with motion scene and app ready.",
		'export default function HeaderFull({ className = "" }: { className?: string }) {',
		"\tconst [atTop, setAtTop] = useState(false);",
		"\tconst [hide, setHide] = useState(false);",
		"\tconst motionAllowed = useMotionAllowed(true);",
		"\tconst lastScrollRef = useRef(0);",
		"",
		"\tuseEffect(() => {",
		"\t\tif (!motionAllowed) {",
		"\t\t\tsetHide(false);",
		"\t\t\treturn;",
		"\t\t}",
		"",
		"\t\tconst handleScroll = () => {",
		"\t\t\tconst currentY = window.scrollY;",
		"\t\t\tsetAtTop(currentY <= 50);",
		"\t\t\tsetHide(currentY > lastScrollRef.current && currentY > 10);",
		"\t\t\tlastScrollRef.current = currentY;",
		"\t\t};",
		"",
		"\t\thandleScroll();",
		'\t\twindow.addEventListener("scroll", handleScroll, { passive: true });',
		'\t\treturn () => window.removeEventListener("scroll", handleScroll);',
		"\t}, [motionAllowed]);",
		"",
		"\tuseEffect(() => {",
		"\t\tif (!motionAllowed) return;",
		"\t\tsetAtTop(window.scrollY <= 50);",
		"\t}, [motionAllowed]);",
		"",
		"\treturn (",
		"\t\t<header",
		"\t\t\tclassName={clsx(",
		'\t\t\t\t"h-[100px] fixed z-50 px-section-x pointer-events-none left-1/2 flex justify-center items-center -translate-x-1/2 w-full group",',
		"\t\t\t\tclassName,",
		"\t\t\t)}",
		"\t\t\tdata-top={atTop}",
		"\t\t\tdata-hide={hide}",
		"\t\t>",
		'\t\t\t<div className="max-w-section-max w-full flex items-center h-full">',
		'\t\t\t\t<div className="flex justify-between items-center w-full h-fit">',
		'\t\t\t\t\t<div className=" min-w-[400px]">',
		'\t\t\t\t\t\t<Logo size="md" className="pointer-events-auto" />',
		"\t\t\t\t\t</div>",
		"\t\t\t\t\t<motion.nav",
		'\t\t\t\t\t\tclassName="relative pointer-events-auto flex h-full items-center justify-center gap-5"',
		'\t\t\t\t\t\tanimate={motionAllowed ? { y: hide ? -80 : 0 } : { y: 0 }}',
		"\t\t\t\t\t\ttransition={motionAllowed ? springs.soft : { duration: 0 }}",
		"\t\t\t\t\t>",
		"\t\t\t\t\t\t{MARKETING_NAV_LINKS.map((item) => (",
		"\t\t\t\t\t\t\t<Button",
		"\t\t\t\t\t\t\t\thref={hrefFor(item.routeId)}",
		"\t\t\t\t\t\t\t\tkey={item.name}",
		'\t\t\t\t\t\t\t\tvariant="ghost"',
		"\t\t\t\t\t\t\t>",
		"\t\t\t\t\t\t\t\t{item.name}",
		"\t\t\t\t\t\t\t</Button>",
		"\t\t\t\t\t\t))}",
		"\t\t\t\t\t</motion.nav>",
		'\t\t\t\t\t<div className="flex justify-end items-center gap-3 pointer-events-auto min-w-[400px]">',
		"\t\t\t\t\t\t<MarketingContentSearch",
		'\t\t\t\t\t\t\tfield={{ className: "min-w-0" }}',
		"\t\t\t\t\t\t\tinput={{",
		'\t\t\t\t\t\t\t\tsize: "sm",',
		'\t\t\t\t\t\t\t\tclassName: "w-[14rem] xl:w-[16rem]",',
		'\t\t\t\t\t\t\t\ttextClassName: "text-sm",',
		"\t\t\t\t\t\t\t}}",
		"\t\t\t\t\t\t/>" + ctaBlock,
		"\t\t\t\t\t</div>",
		"\t\t\t\t</div>",
		"\t\t\t</div>",
		"\t\t</header>",
		"\t);",
		"}",
		"",
	].join("\n");
}

function renderApiIndexFile(state) {
	const lines = [];

	if (state.hasDashboard) {
		lines.push(
			'export {',
			"  fetchSession,",
			"  login,",
			"  logout,",
			"  type SessionUser,",
			"  updateStoredSessionUser,",
			'} from "./auth";',
		);
	}

	lines.push(
		"export {",
		"  checkHealth,",
		"  type HealthResponse,",
		'} from "./checkHealth";',
		"export {",
		"  type ApiClient,",
		"  type ApiClientOptions,",
		"  type ApiError,",
		"  type ApiRequestBody,",
		"  type ApiRequester,",
		"  type ApiRequestOptions,",
		"  createApiClient,",
		"  type ErrorResponse,",
		"  request,",
		'} from "./createApiClient";',
		"export {",
		"  createMockFetch,",
		"  type MockApiResponse,",
		"  type MockRequestContext,",
		"  type MockRoute,",
		'} from "./createMockFetch";',
		"export {",
		"  type SpamProtectedExampleSubmission,",
		"  submitSpamProtectedExample,",
		'} from "./submitSpamProtectedExample";',
		"",
	);

	return lines.join("\n");
}

function getRewriteTargets(state) {
	return [
		{
			path: "src/config/routes.ts",
			content: renderRoutesFile(state),
		},
		{
			path: "src/lib/routes.ts",
			content: renderLibRoutesFile(state),
		},
		{
			path: "src/lib/api/index.ts",
			content: renderApiIndexFile(state),
		},
		{
			path: "src/app/(site)/(marketing)/_components/layout/marketingNav.ts",
			content: renderMarketingNavFile(state),
		},
		{
			path: "src/app/(site)/(marketing)/_components/layout/MarketingContentSearch.tsx",
			content: renderMarketingContentSearchFile(state),
		},
		{
			path: "src/app/(site)/(marketing)/_components/layout/HeaderFull.tsx",
			content: renderHeaderFullFile(state),
		},
	];
}

async function writeFileIfChanged(targetPath, content) {
	const absolutePath = path.join(ROOT, targetPath);
	const nextContent = content.endsWith("\n") ? content : `${content}\n`;
	const current = await fs.readFile(absolutePath, "utf8");

	if (current === nextContent) return false;

	await fs.writeFile(absolutePath, nextContent, "utf8");
	return true;
}

async function deleteOwnedPaths(targetPaths) {
	for (const targetPath of targetPaths) {
		await fs.rm(targetPath, { recursive: true, force: true });
	}
}

async function removeEmptyInternalDirIfNeeded(shouldRemove) {
	if (!shouldRemove) return;
	if (!(await pathExists(INTERNAL_MARKETING_DIR))) return;

	const children = await fs.readdir(INTERNAL_MARKETING_DIR);
	if (children.length === 0) {
		await fs.rm(INTERNAL_MARKETING_DIR, { recursive: true, force: true });
	}
}

async function walkFiles(targetDir) {
	const entries = await fs.readdir(targetDir, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const absolutePath = path.join(targetDir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await walkFiles(absolutePath)));
			continue;
		}
		files.push(absolutePath);
	}

	return files;
}

async function validateRemovedSurfaceReferences(surfaceIds) {
	if (surfaceIds.length === 0) return;

	const files = (await walkFiles(SRC_DIR)).filter((filePath) =>
		/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(filePath),
	);

	const failures = [];

	for (const surfaceId of surfaceIds) {
		for (const assertion of SURFACES[surfaceId].postRemovalAssertions) {
			for (const filePath of files) {
				const content = await fs.readFile(filePath, "utf8");
				const pattern = new RegExp(
					assertion.pattern.source,
					assertion.pattern.flags,
				);

				if (!pattern.test(content)) continue;
				failures.push({
					surfaceId,
					label: assertion.label,
					filePath,
				});
			}
		}
	}

	if (failures.length === 0) return;

	console.error("\nUnresolved references remain after pruning:");
	for (const failure of failures) {
		console.error(
			`- [${failure.surfaceId}] ${failure.label}: ${relativePath(failure.filePath)}`,
		);
	}

	throw new Error("Prune validation failed.");
}

function printPlan(plan) {
	console.log("\nTemplate prune plan");
	console.log("===================");

	for (const surface of plan.surfaces) {
		console.log(`- ${surface.flag}: ${surface.description}`);
		if (surface.dependentSurfaces.length > 0) {
			console.log(
				`  dependencies: ${surface.dependentSurfaces.join(", ")}`,
			);
		}
	}

	console.log("\nFiles/directories to delete");
	if (plan.deletedPaths.length === 0) {
		console.log("- none");
	} else {
		for (const targetPath of plan.deletedPaths) {
			console.log(`- ${relativePath(targetPath)}`);
		}
	}

	if (plan.removeInternalDir) {
		console.log(`- ${relativePath(INTERNAL_MARKETING_DIR)} (if empty after prune)`);
	}

	console.log("\nCentral files to rewrite");
	for (const filePath of plan.rewriteFiles) {
		console.log(`- ${filePath}`);
	}

	console.log("\nWarnings");
	console.log("- unresolved reference validation runs after mutation");
	console.log("- build validation runs after mutation");
}

async function confirmMutation() {
	const rl = createInterface({ input, output });

	try {
		const answer = await rl.question(
			"This mutates the current cloned repo by deleting optional surfaces. Continue? [y/N] ",
		);
		return /^(y|yes)$/i.test(answer.trim());
	} finally {
		rl.close();
	}
}

function runBuild() {
	const result = spawnSync("npm", ["run", "build"], {
		cwd: ROOT,
		stdio: "inherit",
		shell: process.platform === "win32",
	});

	if (result.status !== 0) {
		throw new Error("Build failed after pruning.");
	}
}

async function main() {
	const parsed = parseArgs(process.argv.slice(2));

	if (parsed.help) {
		printUsage();
		return;
	}

	if (parsed.surfaceIds.length === 0) {
		printUsage();
		console.log("No prune flags provided. Nothing to do.");
		return;
	}

	await assertTemplateRoot();

	const state = buildState(parsed.surfaceIds);
	const plan = await collectPlan(parsed.surfaceIds);

	printPlan(plan);

	if (parsed.dryRun) {
		console.log("\nDry run complete. No files were changed.");
		return;
	}

	if (!parsed.yes) {
		const confirmed = await confirmMutation();
		if (!confirmed) {
			throw new Error("Aborted by user.");
		}
	}

	await deleteOwnedPaths(plan.deletedPaths);

	for (const target of getRewriteTargets(state)) {
		await writeFileIfChanged(target.path, target.content);
	}

	await removeEmptyInternalDirIfNeeded(plan.removeInternalDir);
	await validateRemovedSurfaceReferences(parsed.surfaceIds);
	runBuild();

	console.log("\nTemplate prune completed successfully.");
}

main().catch((error) => {
	console.error(`\n${error.message}`);
	process.exit(1);
});
