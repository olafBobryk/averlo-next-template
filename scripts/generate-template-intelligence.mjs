#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, ".template-intelligence");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "index.json");
const AGENT_MAP_PATH = path.join(OUTPUT_DIR, "agent-map.json");

const EXCLUDED_DIRS = new Set([
	".git",
	".next",
	".next-user",
	".serena",
	".template-intelligence",
	".understand-anything",
	".vercel",
	".worktrees",
	"build",
	"coverage",
	"node_modules",
	"out",
]);

const EXCLUDED_FILE_PATTERNS = [
	/^\.env(?:\.|$)/,
	/^next-env\.d\.ts$/,
	/^tsconfig\.next-.*\.json$/,
	/\.pem$/,
	/\.log$/,
	/\.tsbuildinfo$/,
];

const INCLUDED_ROOTS = [
	"AGENTS.md",
	"README.md",
	"docs",
	"payload.config.ts",
	"scripts/dev-server.mjs",
	"scripts/generate-template-intelligence.mjs",
	"scripts/prune-template.mjs",
	"src/app/(payload)",
	"src/app/(site)/(marketing)",
	"src/components",
	"src/config/routes.ts",
	"src/lib",
	"src/payload",
];

const CONCEPTS = [
	{
		id: "agent-navigation",
		title: "Agent Navigation",
		summary:
			"Rules, routes, and docs that help agents find the right template surface before editing.",
		matches: [
			"AGENTS.md",
			"README.md",
			"src/config/routes.ts",
			"src/lib/routes.ts",
			"scripts/dev-server.mjs",
		],
		keywords: ["agent", "route", "workflow", "dev server", "preview"],
	},
	{
		id: "design-system-discovery",
		title: "Design System Discovery",
		summary:
			"Shared primitives, domain components, demos, and dictionary entries that should be reused before local UI is invented.",
		matches: [
			"src/components",
			"src/app/(site)/(marketing)/internal/demo",
			"src/app/(site)/(marketing)/internal/dictionary",
		],
		keywords: ["component", "primitive", "demo", "dictionary", "ui"],
	},
	{
		id: "internal-knowledge-base",
		title: "Internal Knowledge Base",
		summary:
			"Maintainer-facing docs, references, demos, and source notes that explain how the template is meant to be extended.",
		matches: [
			"docs",
			"src/app/(site)/(marketing)/internal/demo",
			"src/app/(site)/(marketing)/internal/dictionary",
			"src/app/(site)/(marketing)/internal/reference",
			"src/app/(site)/(marketing)/internal/playground",
		],
		keywords: ["docs", "reference", "demo", "dictionary", "playground"],
	},
	{
		id: "content-architecture",
		title: "Content Architecture",
		summary:
			"Lightweight render contracts and resolver boundaries for static, Payload-ready, and Payload-powered modes.",
		matches: [
			"docs/template-content-modes.md",
			"docs/payload-vercel-neon-blob.md",
			"src/lib/marketing-content",
		],
		keywords: ["content", "payload", "resolver", "section", "fallback"],
	},
	{
		id: "payload-scaffold",
		title: "Payload Scaffold",
		summary:
			"Guarded CMS scaffolding that stays inactive until a clone intentionally becomes Payload-powered.",
		matches: [
			"payload.config.ts",
			"src/payload",
			"src/app/(payload)",
			"docs/payload-vercel-neon-blob.md",
		],
		keywords: ["payload", "cms", "admin", "collection", "media"],
	},
	{
		id: "template-pruning",
		title: "Template Pruning",
		summary:
			"Optional surfaces and rewrite logic that keep cloned projects buildable after unused template areas are removed.",
		matches: [
			"scripts/prune-template.mjs",
			"scripts/verify-smoke.mjs",
			"README.md",
			"docs/template-content-modes.md",
			"src/config/routes.ts",
			"src/lib/marketing-content/fallback.ts",
		],
		keywords: ["prune", "optional", "surface", "template", "clone"],
	},
	{
		id: "dev-workflow",
		title: "Dev Workflow",
		summary:
			"Isolated user and agent development server behavior, build wrappers, and generated local artifacts.",
		matches: ["AGENTS.md", "scripts/dev-server.mjs", "package.json"],
		keywords: ["dev:agent", "dev:user", "automation url", "distDir", "port"],
	},
	{
		id: "route-surfaces",
		title: "Route Surfaces",
		summary:
			"Public, internal, dashboard, auth, and Payload route families exposed by the App Router tree.",
		matches: ["src/app", "src/config/routes.ts", "src/lib/routes.ts"],
		keywords: ["route", "layout", "page", "dashboard", "internal"],
	},
];

const AGENT_MAP = {
	schemaVersion: 1,
	project: "verilo-next-template",
	generator: "scripts/generate-template-intelligence.mjs",
	artifact: ".template-intelligence/agent-map.json",
	topics: [
		{
			id: "route-architecture",
			title: "Route and internal marketing architecture",
			aliases: ["routes", "internal-marketing", "marketing-routes"],
			paths: [
				"src/config/routes.ts",
				"src/lib/routes.ts",
				"src/app/(site)/(marketing)/internal/layout.tsx",
				"src/app/(site)/(marketing)/layout.tsx",
				"src/lib/marketing-content/fallback.ts",
				"src/lib/marketing-content/types.ts",
				"src/lib/marketing-content/resolvers.ts",
				"src/app/(site)/(marketing)/_components/layout/MarketingContentSearch.tsx",
				"scripts/prune-template.mjs",
			],
			notes:
				"Route IDs live in appRoutes, hrefFor resolves them, internal routes inherit the production guard for client clones with canonical-template host and env opt-ins, and marketing layout/search/fallback consume lightweight link data.",
		},
		{
			id: "ui-primitives",
			title: "Shared UI primitives and feedback rules",
			aliases: ["design-system", "toast", "confirmation", "modal"],
			paths: [
				"src/components/AGENTS.md",
				"src/components/ui/AGENTS.md",
				"src/components/ui/primitives/AGENTS.md",
				"src/components/ui/overlays/modal/AGENTS.md",
				"src/components/ui/overlays/toast/AGENTS.md",
				"src/lib/feedback/toast.ts",
				"src/components/ui/overlays/toast/ToastHost.tsx",
				"src/components/ui/overlays/modal/useConfirmationModal.tsx",
				"src/components/ui/overlays/modal/ConfirmationModal.tsx",
			],
			notes:
				"Start with AGENTS files for rules, then inspect concrete toast and confirmation primitives only if implementation details are needed.",
		},
		{
			id: "prune-behavior",
			title: "Prune behavior and optional surface ownership",
			aliases: ["prune", "optional-surfaces", "template-pruning"],
			paths: [
				"scripts/prune-template.mjs",
				"scripts/create-thin-start.mjs",
				"scripts/review-thin-start-api.mjs",
				"README.md",
				"docs/template-content-modes.md",
				"docs/thin-start-creation-boundary.md",
				"scripts/verify-smoke.mjs",
				"src/config/routes.ts",
				"src/lib/routes.ts",
				"src/app/(site)/(marketing)/_components/layout/marketingNav.ts",
				"src/app/(site)/(marketing)/_components/layout/MarketingContentSearch.tsx",
				"src/lib/marketing-content/fallback.ts",
			],
			notes:
				"SURFACES owns normal prune flags, paths, routes, nav/search references, smoke-route rewrites, package changes, and post-removal assertions. Lightweight instances should dry-run then apply: npm run prune:template -- --dry-run --no-dashboard --no-demo --no-dictionary --no-reference --no-playground, then npm run prune:template -- --yes --no-dashboard --no-demo --no-dictionary --no-reference --no-playground. Add --no-payload only for static instances. Thin-start is a separate explicit instance activation path; dry-run first, then activate with --in-place --confirm-instance and require strict API review.",
		},
		{
			id: "content-modes",
			title: "Static, Payload-ready, and Payload-powered boundaries",
			aliases: ["payload", "content-architecture", "cms"],
			paths: [
				"docs/template-content-modes.md",
				"docs/payload-vercel-neon-blob.md",
				"src/lib/marketing-content/resolvers.ts",
				"src/lib/marketing-content/types.ts",
				"src/lib/marketing-content/fallback.ts",
				"payload.config.ts",
				"src/payload/isPayloadConfigured.ts",
				"src/app/(payload)/api/[...slug]/route.ts",
				"src/app/(payload)/admin/[[...segments]]/page.tsx",
				"scripts/prune-template.mjs",
			],
			notes:
				"Frontend contracts stay lightweight; Payload-specific fields should be resolved server-side before section rendering.",
		},
		{
			id: "dev-server",
			title: "Agent dev-server isolation",
			aliases: ["dev-workflow", "dev-agent", "agent-server"],
			paths: [
				"AGENTS.md",
				"package.json",
				"scripts/dev-server.mjs",
				"next.config.ts",
				".gitignore",
				"scripts/prune-template.mjs",
			],
			notes:
				"Use npm run dev:agent, keep user ports reserved, use isolated dist dirs and generated tsconfig files, and use automation URL query flags for automated traversal.",
		},
		{
			id: "new-internal-surface",
			title: "New internal authoring surface placement",
			aliases: ["internal-surface", "authoring-surface", "new-surface"],
			paths: [
				"src/app/(site)/(marketing)/internal/layout.tsx",
				"src/config/routes.ts",
				"src/lib/routes.ts",
				"src/app/(site)/(marketing)/_components/layout/marketingNav.ts",
				"src/app/(site)/(marketing)/_components/layout/MarketingContentSearch.tsx",
				"src/lib/marketing-content/fallback.ts",
				"scripts/prune-template.mjs",
				"README.md",
			],
			notes:
				"Add template-maintainer tools under /internal so they inherit noindex and the client-clone production guard; add prune ownership if clones should remove them.",
		},
	],
};

function normalizeTopic(value) {
	return value.trim().toLowerCase();
}

function findAgentMapTopic(query) {
	const normalizedQuery = normalizeTopic(query);

	return AGENT_MAP.topics.find(
		(topic) =>
			topic.id === normalizedQuery ||
			normalizeTopic(topic.title) === normalizedQuery ||
			topic.aliases.some((alias) => alias === normalizedQuery),
	);
}

function printAgentMapTopic(query) {
	const topic = findAgentMapTopic(query);

	if (!topic) {
		console.error(`Unknown intelligence topic: ${query}`);
		console.error(
			`Available topics: ${AGENT_MAP.topics.map((item) => item.id).join(", ")}`,
		);
		process.exit(1);
	}

	console.log(`${topic.title} (${topic.id})`);
	console.log(topic.notes);
	console.log("");
	console.log("Start here:");
	for (const filePath of topic.paths) {
		console.log(`- ${filePath}`);
	}
}

function toPosixPath(filePath) {
	return filePath.split(path.sep).join("/");
}

function isExcludedFile(fileName) {
	return EXCLUDED_FILE_PATTERNS.some((pattern) => pattern.test(fileName));
}

function isUnderIncludedRoot(relativePath) {
	return INCLUDED_ROOTS.some(
		(root) => relativePath === root || relativePath.startsWith(`${root}/`),
	);
}

async function pathExists(targetPath) {
	try {
		await fs.access(targetPath);
		return true;
	} catch {
		return false;
	}
}

async function walk(targetDir) {
	const entries = await fs.readdir(targetDir, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const absolutePath = path.join(targetDir, entry.name);
		const relativePath = toPosixPath(path.relative(ROOT, absolutePath));

		if (entry.isDirectory()) {
			if (EXCLUDED_DIRS.has(entry.name) || entry.name.startsWith(".next")) {
				continue;
			}

			files.push(...(await walk(absolutePath)));
			continue;
		}

		if (!entry.isFile() || isExcludedFile(entry.name)) {
			continue;
		}

		if (isUnderIncludedRoot(relativePath)) {
			files.push(absolutePath);
		}
	}

	return files;
}

function getSourceType(relativePath) {
	if (relativePath.endsWith("AGENTS.md")) return "agent-rules";
	if (relativePath.startsWith("docs/")) return "docs";
	if (relativePath.startsWith("scripts/")) return "script";
	if (relativePath.startsWith("src/components/")) return "component";
	if (relativePath.startsWith("src/app/")) return "route";
	if (relativePath.startsWith("src/lib/")) return "library";
	if (
		relativePath.startsWith("src/payload/") ||
		relativePath === "payload.config.ts"
	) {
		return "payload";
	}
	if (relativePath === "README.md") return "overview";
	return "source";
}

function getTitle(relativePath, content) {
	const heading = content.match(/^#\s+(.+)$/m);
	if (heading?.[1]) return heading[1].trim();

	const fileName = path.basename(relativePath).replace(/\.[^.]+$/, "");
	return fileName
		.split(/[-_]/)
		.filter(Boolean)
		.map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
		.join(" ");
}

function getExcerpt(content) {
	return (
		content
			.split(/\r?\n/)
			.map((line) => line.trim())
			.find((line) => line.length > 30 && !line.startsWith("import "))
			?.slice(0, 180) ?? ""
	);
}

function getMatchedConceptIds(relativePath, content) {
	const lowerPath = relativePath.toLowerCase();
	const lowerContent = content.toLowerCase();

	return CONCEPTS.filter((concept) => {
		const pathMatched = concept.matches.some(
			(match) =>
				lowerPath === match.toLowerCase() ||
				lowerPath.startsWith(`${match.toLowerCase()}/`),
		);
		if (pathMatched) return true;

		return concept.keywords.some((keyword) =>
			lowerContent.includes(keyword.toLowerCase()),
		);
	}).map((concept) => concept.id);
}

function buildRelationships(concepts, files) {
	const fileByConcept = new Map();

	for (const concept of concepts) {
		fileByConcept.set(
			concept.id,
			new Set(
				files
					.filter((file) => file.conceptIds.includes(concept.id))
					.map((file) => file.path),
			),
		);
	}

	const relationships = [];

	for (let index = 0; index < concepts.length; index += 1) {
		for (
			let nextIndex = index + 1;
			nextIndex < concepts.length;
			nextIndex += 1
		) {
			const source = concepts[index];
			const target = concepts[nextIndex];
			const sourceFiles = fileByConcept.get(source.id) ?? new Set();
			const targetFiles = fileByConcept.get(target.id) ?? new Set();
			const sharedFiles = [...sourceFiles].filter((filePath) =>
				targetFiles.has(filePath),
			);

			if (sharedFiles.length === 0) continue;

			relationships.push({
				source: source.id,
				target: target.id,
				weight: sharedFiles.length,
				sharedFiles: sharedFiles.slice(0, 6),
			});
		}
	}

	return relationships.sort(
		(a, b) =>
			a.source.localeCompare(b.source) || a.target.localeCompare(b.target),
	);
}

async function buildIndex() {
	const files = [];

	for (const includedRoot of INCLUDED_ROOTS) {
		const absoluteRoot = path.join(ROOT, includedRoot);
		if (!(await pathExists(absoluteRoot))) continue;

		const stat = await fs.stat(absoluteRoot);
		const absoluteFiles = stat.isDirectory()
			? await walk(absoluteRoot)
			: [absoluteRoot];

		for (const absoluteFile of absoluteFiles) {
			const relativePath = toPosixPath(path.relative(ROOT, absoluteFile));
			if (isExcludedFile(path.basename(relativePath))) continue;

			const content = await fs.readFile(absoluteFile, "utf8").catch(() => "");
			const conceptIds = getMatchedConceptIds(relativePath, content);

			files.push({
				path: relativePath,
				title: getTitle(relativePath, content),
				sourceType: getSourceType(relativePath),
				size: Buffer.byteLength(content, "utf8"),
				lines: content.length === 0 ? 0 : content.split(/\r?\n/).length,
				conceptIds,
				excerpt: getExcerpt(content),
			});
		}
	}

	const uniqueFiles = [
		...new Map(files.map((file) => [file.path, file])).values(),
	].sort((a, b) => a.path.localeCompare(b.path));

	const concepts = CONCEPTS.map((concept) => ({
		id: concept.id,
		title: concept.title,
		summary: concept.summary,
		fileCount: uniqueFiles.filter((file) =>
			file.conceptIds.includes(concept.id),
		).length,
		sourceTypes: [
			...new Set(
				uniqueFiles
					.filter((file) => file.conceptIds.includes(concept.id))
					.map((file) => file.sourceType),
			),
		].sort(),
	}));

	return {
		schemaVersion: 1,
		project: "verilo-next-template",
		generator: "scripts/generate-template-intelligence.mjs",
		artifact: ".template-intelligence/index.json",
		fileCount: uniqueFiles.length,
		conceptCount: concepts.length,
		files: uniqueFiles,
		concepts,
		relationships: buildRelationships(concepts, uniqueFiles),
	};
}

const index = await buildIndex();
const args = process.argv.slice(2);

if (args[0] === "--query") {
	const topicQuery = args[1];

	if (!topicQuery) {
		console.error("Usage: npm run intelligence:query -- <topic>");
		console.error(
			`Available topics: ${AGENT_MAP.topics.map((item) => item.id).join(", ")}`,
		);
		process.exit(1);
	}

	printAgentMapTopic(topicQuery);
	process.exit(0);
}

await fs.mkdir(OUTPUT_DIR, { recursive: true });
await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(index, null, "\t")}\n`);
await fs.writeFile(
	AGENT_MAP_PATH,
	`${JSON.stringify(AGENT_MAP, null, "\t")}\n`,
);

console.log(
	`Generated ${path.relative(ROOT, OUTPUT_PATH)} with ${index.fileCount} files and ${index.conceptCount} concepts.`,
);
console.log(`Generated ${path.relative(ROOT, AGENT_MAP_PATH)}.`);
