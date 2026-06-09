import type {
	TemplateIntelligenceAgentMap,
	TemplateIntelligenceFile,
	TemplateIntelligenceGraphLink,
	TemplateIntelligenceGraphNode,
	TemplateIntelligenceGraphView,
	TemplateIntelligenceIndex,
} from "@/lib/template-intelligence";

type PruneSurface = {
	id: string;
	label: string;
	flag: string;
	description: string;
	ownedPaths: string[];
	routeIds: string[];
	centralRewrites: string[];
	packageScripts?: string[];
	packageDependencies?: string[];
	assertions: string[];
};

const PRUNE_SURFACES: PruneSurface[] = [
	{
		id: "dashboard",
		label: "Dashboard",
		flag: "--no-dashboard",
		description:
			"Dashboard shell, login/auth routes, and dashboard-only auth helpers.",
		ownedPaths: [
			"removed dashboard route tree",
			"removed auth route tree",
			"dashboard auth helper",
		],
		routeIds: ["login", "dashboard", "dashboardPages", "dashboardSettings"],
		centralRewrites: ["routes", "api-index", "fallback-content"],
		assertions: ["dashboard route ids", "dashboard auth import"],
	},
	{
		id: "demo",
		label: "Demo",
		flag: "--no-demo",
		description: "Internal component demo surface and demo search indexing.",
		ownedPaths: ["internal demo route tree"],
		routeIds: ["demo"],
		centralRewrites: ["routes", "marketing-nav", "content-search"],
		assertions: ["demo route ids", "demo content import"],
	},
	{
		id: "intelligence",
		label: "Intelligence",
		flag: "--no-intelligence",
		description:
			"Internal intelligence surface, generated-index scripts, benchmark logs, docs, and nav/search references.",
		ownedPaths: [
			"src/app/(site)/(marketing)/internal/intelligence",
			"src/lib/template-intelligence",
			"scripts/generate-template-intelligence.mjs",
			"scripts/record-template-intelligence-benchmark.mjs",
			"scripts/clear-template-intelligence-benchmark.mjs",
			"scripts/setup-template-intelligence-serena.mjs",
			"docs/template-intelligence.md",
			"docs/worklogs/template-intelligence-ledger.md",
			"docs/worklogs/template-intelligence-handoff.md",
			"docs/worklogs/template-intelligence-review-handoff.md",
			"docs/worklogs/template-intelligence-benchmark.md",
			"docs/worklogs/template-intelligence-benchmark-runs.jsonl",
			"docs/worklogs/template-intelligence-benchmark-runs.example.jsonl",
		],
		routeIds: ["intelligence"],
		centralRewrites: [
			"routes",
			"marketing-nav",
			"content-search",
			"fallback-content",
			"package-json",
		],
		packageScripts: [
			"intelligence:generate",
			"intelligence:query",
			"intelligence:record",
			"intelligence:record:clear",
			"intelligence:serena:setup",
			"predev",
			"predev:user",
			"predev:agent",
			"prebuild",
		],
		assertions: [
			"intelligence route ids and links",
			"template intelligence imports",
		],
	},
	{
		id: "playground",
		label: "Playground",
		flag: "--no-playground",
		description:
			"Internal playground surface and playground search/nav references.",
		ownedPaths: ["removed internal playground route tree"],
		routeIds: ["playground"],
		centralRewrites: ["routes", "marketing-nav", "content-search"],
		assertions: ["playground route ids and links"],
	},
	{
		id: "dictionary",
		label: "Dictionary",
		flag: "--no-dictionary",
		description:
			"Internal dictionary surface, route ids, and search/nav references.",
		ownedPaths: ["internal dictionary route tree"],
		routeIds: [
			"dictionary",
			"dictionaryRiveLogoReveal",
			"dictionarySpamProtectedForm",
		],
		centralRewrites: ["routes", "marketing-nav", "fallback-content"],
		assertions: ["dictionary route ids"],
	},
	{
		id: "reference",
		label: "Reference",
		flag: "--no-reference",
		description:
			"Internal reference/docs surface, including the shared live graph implementation reference.",
		ownedPaths: ["internal reference route tree"],
		routeIds: ["reference"],
		centralRewrites: ["routes", "marketing-nav", "fallback-content"],
		assertions: [],
	},
	{
		id: "payload",
		label: "Payload",
		flag: "--no-payload",
		description:
			"Guarded Payload CMS scaffold, config references, and Payload packages.",
		ownedPaths: ["payload.config.ts", "src/payload", "src/app/(payload)"],
		routeIds: [],
		centralRewrites: ["next-config", "tsconfig", "package-json"],
		packageDependencies: [
			"@payloadcms/db-postgres",
			"@payloadcms/next",
			"@payloadcms/richtext-lexical",
			"@payloadcms/storage-vercel-blob",
			"payload",
			"sharp",
		],
		assertions: ["Payload imports"],
	},
];

const CONTENT_BOUNDARIES = [
	{
		id: "static",
		label: "Static",
		summary:
			"No Payload runtime. Pages render from plain TypeScript fallback content.",
		links: [
			"src/lib/marketing-content/fallback.ts",
			"src/lib/marketing-content/types.ts",
			"docs/template-content-modes.md",
		],
		tags: ["no Payload", "fallback content", "lightweight props"],
	},
	{
		id: "payload-ready",
		label: "Payload-ready",
		summary:
			"Guarded scaffold remains, but live admin/API routes stay disabled until activation.",
		links: [
			"src/payload/isPayloadConfigured.ts",
			"src/app/(payload)/admin/[[...segments]]/page.tsx",
			"src/app/(payload)/api/[...slug]/route.ts",
			"payload.config.ts",
		],
		tags: ["guarded scaffold", "fallback first", "activation path"],
	},
	{
		id: "payload-powered",
		label: "Payload-powered Vercel",
		summary:
			"Real CMS mode with server-side resolvers, Neon Postgres, Vercel Blob, and Payload admin/API routes.",
		links: [
			"docs/payload-vercel-neon-blob.md",
			"payload.config.ts",
			"src/payload",
			"src/lib/marketing-content/resolvers.ts",
		],
		tags: ["Neon", "Vercel Blob", "server adapters"],
	},
];

function pathToNodeId(prefix: string, filePath: string) {
	return `${prefix}:${filePath}`;
}

function getPathFamily(filePath: string) {
	if (filePath.startsWith("src/app/")) return "app routes";
	if (filePath.startsWith("src/components/")) return "components";
	if (filePath.startsWith("src/config/")) return "config";
	if (filePath.startsWith("src/lib/")) return "library";
	if (filePath.startsWith("scripts/")) return "scripts";
	if (filePath.startsWith("docs/")) return "docs";
	if (filePath === "AGENTS.md" || filePath.endsWith("/AGENTS.md")) {
		return "agent rules";
	}
	return "project";
}

function getReadablePathLabel(filePath: string) {
	const segments = filePath.split("/");
	const baseName = segments.at(-1) ?? filePath;
	const family = getPathFamily(filePath);

	if (family === "app routes") {
		const routeSegment = segments.includes("(payload)")
			? "payload"
			: (segments.at(-2) ?? "app");
		return `${routeSegment}/${baseName}`;
	}

	if (family === "components") {
		return `${segments.at(-2) ?? "components"}/${baseName}`;
	}

	if (family === "library") {
		return `${segments.at(-2) ?? "lib"}/${baseName}`;
	}

	if (family === "config" || family === "scripts" || family === "docs") {
		return `${segments.at(-2) ?? family}/${baseName}`;
	}

	return baseName;
}

function getSourceTypeCounts(files: TemplateIntelligenceFile[]) {
	const counts = new Map<string, number>();

	for (const file of files) {
		counts.set(file.sourceType, (counts.get(file.sourceType) ?? 0) + 1);
	}

	return [...counts.entries()].sort(
		(a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
	);
}

function getGridGuide({
	index,
	columns,
	startX,
	startY,
	columnGap,
	rowGap,
}: {
	index: number;
	columns: number;
	startX: number;
	startY: number;
	columnGap: number;
	rowGap: number;
}) {
	return {
		x: startX + (index % columns) * columnGap,
		y: startY + Math.floor(index / columns) * rowGap,
	};
}

function getConceptGraph(
	index: TemplateIntelligenceIndex,
): TemplateIntelligenceGraphView {
	const sourceTypeCounts = getSourceTypeCounts(index.files);
	const nodes: TemplateIntelligenceGraphNode[] = [
		{
			id: "entry:concepts",
			label: "Concepts",
			kind: "entry",
			weight: index.conceptCount,
			group: "Graph Entry",
			guideX: -640,
			guideY: -360,
			detail: {
				title: "Concepts",
				summary:
					"Entry node for concept and source-type relationships in the generated intelligence index.",
				metrics: {
					concepts: index.conceptCount,
					files: index.fileCount,
				},
			},
		},
		...index.concepts.map((concept, conceptIndex) => {
			const guide = getGridGuide({
				index: conceptIndex,
				columns: 4,
				startX: -360,
				startY: -190,
				columnGap: 240,
				rowGap: 145,
			});

			return {
				id: `concept:${concept.id}`,
				label: concept.title,
				kind: "concept" as const,
				weight: concept.fileCount,
				group: "Concept",
				guideX: guide.x,
				guideY: guide.y,
				detail: {
					title: concept.title,
					summary: concept.summary,
					metrics: {
						files: concept.fileCount,
						sourceTypes: concept.sourceTypes.length,
					},
					paths: index.files
						.filter((file) => file.conceptIds.includes(concept.id))
						.sort((a, b) => b.lines - a.lines || a.path.localeCompare(b.path))
						.slice(0, 10)
						.map((file) => file.path),
					tags: concept.sourceTypes,
				},
			};
		}),
		...sourceTypeCounts.map(([sourceType, count], sourceIndex) => {
			const guide = getGridGuide({
				index: sourceIndex,
				columns: 4,
				startX: -360,
				startY: 120,
				columnGap: 240,
				rowGap: 145,
			});

			return {
				id: `source:${sourceType}`,
				label: sourceType,
				kind: "source-type" as const,
				weight: count,
				group: "Source Type",
				guideX: guide.x,
				guideY: guide.y,
				detail: {
					title: sourceType,
					summary: "Indexed files grouped by template role.",
					metrics: { files: count },
					paths: index.files
						.filter((file) => file.sourceType === sourceType)
						.slice(0, 10)
						.map((file) => file.path),
				},
			};
		}),
	];
	const links: TemplateIntelligenceGraphLink[] = [
		...index.concepts.map((concept) => ({
			source: "entry:concepts",
			target: `concept:${concept.id}`,
			weight: 4,
			label: "organizes",
		})),
		...index.relationships.map((relationship) => ({
			source: `concept:${relationship.source}`,
			target: `concept:${relationship.target}`,
			weight: relationship.weight,
			label: "shared files",
		})),
	];

	for (const concept of index.concepts) {
		for (const [sourceType] of sourceTypeCounts) {
			const weight = index.files.filter(
				(file) =>
					file.sourceType === sourceType &&
					file.conceptIds.includes(concept.id),
			).length;
			if (weight === 0) continue;

			links.push({
				source: `concept:${concept.id}`,
				target: `source:${sourceType}`,
				weight,
				label: "source overlap",
			});
		}
	}

	return {
		id: "concepts",
		title: "Concepts",
		description:
			"Concept and source-type relationships weighted by shared files and overlap.",
		canvas: {
			width: 1160,
			height: 760,
			background: "#eef6ff",
			accent: "#2563eb",
			defaultZoom: 0.82,
			minZoom: 0.35,
			cardScaleFloor: 0.55,
			linkOpacity: 0.14,
			selectedLinkOpacity: 0.5,
			labelPriority: ["entry", "concept", "source-type"],
			selectedNeighborhoodDefault: false,
			stageHeightVh: 220,
			fixedBackdrop: true,
			promptLabel: "Scroll for indexed concepts",
		},
		nodes,
		links,
	};
}

function getTaskMapGraph(
	agentMap: TemplateIntelligenceAgentMap | null,
): TemplateIntelligenceGraphView {
	const topics = agentMap?.topics ?? [];
	const pathSet = new Set(topics.flatMap((topic) => topic.paths));
	const paths = [...pathSet].sort();
	const pathFamilies = [
		"config",
		"docs",
		"app routes",
		"components",
		"library",
		"scripts",
		"agent rules",
		"project",
	];
	const familyCounters = new Map<string, number>();
	const familyColumns = new Map(
		pathFamilies.map((family, familyIndex) => [
			family,
			{
				x: -40 + (familyIndex % 4) * 270,
				y: -330 + Math.floor(familyIndex / 4) * 420,
			},
		]),
	);
	const nodes: TemplateIntelligenceGraphNode[] = [
		{
			id: "entry:task-map",
			label: "Task Map",
			kind: "entry",
			weight: Math.max(1, topics.length),
			group: "Graph Entry",
			guideX: -860,
			guideY: -330,
			detail: {
				title: "Task Map",
				summary:
					"Entry node for generated task topics and their recommended starting files.",
				metrics: {
					topics: topics.length,
					startingFiles: paths.length,
				},
			},
		},
		...topics.map((topic, topicIndex) => ({
			id: `task:${topic.id}`,
			label: topic.title,
			kind: "task" as const,
			weight: topic.paths.length,
			group: "Task",
			guideX: -560,
			guideY: -330 + topicIndex * 130,
			detail: {
				title: topic.title,
				summary: topic.notes,
				metrics: { startingFiles: topic.paths.length },
				paths: topic.paths,
				tags: topic.aliases,
			},
		})),
		...paths.map((filePath) => {
			const family = getPathFamily(filePath);
			const familyGuide =
				familyColumns.get(family) ?? familyColumns.get("project");
			const familyIndex = familyCounters.get(family) ?? 0;
			familyCounters.set(family, familyIndex + 1);

			return {
				id: pathToNodeId("task-file", filePath),
				label: getReadablePathLabel(filePath),
				kind: "file" as const,
				weight: topics.filter((topic) => topic.paths.includes(filePath)).length,
				path: filePath,
				group: `Starting File: ${family}`,
				guideX: familyGuide?.x ?? 0,
				guideY: (familyGuide?.y ?? 0) + familyIndex * 112,
				detail: {
					title: filePath,
					summary: "Recommended starting file from the generated task map.",
					metrics: {
						tasks: topics.filter((topic) => topic.paths.includes(filePath))
							.length,
					},
					paths: [filePath],
					tags: [family],
				},
			};
		}),
	];

	return {
		id: "task-map",
		title: "Task Map",
		description:
			"Agent-map topics connected to concrete starting files for faster task routing.",
		canvas: {
			width: 1580,
			height: 980,
			background: "#eef8f3",
			accent: "#16a34a",
			defaultZoom: 0.74,
			minZoom: 0.3,
			cardScaleFloor: 0.62,
			linkOpacity: 0.08,
			selectedLinkOpacity: 0.58,
			labelPriority: ["entry", "task", "file"],
			selectedNeighborhoodDefault: true,
			stageHeightVh: 240,
			fixedBackdrop: true,
			promptLabel: "Scroll for task starting files",
		},
		nodes,
		links: [
			...topics.map((topic) => ({
				source: "entry:task-map",
				target: `task:${topic.id}`,
				weight: 5,
				label: "organizes",
			})),
			...topics.flatMap((topic) =>
				topic.paths.map((filePath) => ({
					source: `task:${topic.id}`,
					target: pathToNodeId("task-file", filePath),
					weight: 3,
					label: "start here",
				})),
			),
		],
	};
}

function getPruneGraph(): TemplateIntelligenceGraphView {
	const centralRewrites = [
		...new Set(PRUNE_SURFACES.flatMap((surface) => surface.centralRewrites)),
	].sort();
	const packageItems = [
		...new Set(
			PRUNE_SURFACES.flatMap((surface) => [
				...(surface.packageScripts ?? []),
				...(surface.packageDependencies ?? []),
			]),
		),
	].sort();
	const assertionItems = [
		...new Set(PRUNE_SURFACES.flatMap((surface) => surface.assertions)),
	].sort();

	const nodes: TemplateIntelligenceGraphNode[] = [
		{
			id: "entry:prune",
			label: "Prune Ownership",
			kind: "entry",
			weight: PRUNE_SURFACES.length,
			group: "Graph Entry",
			guideX: -1030,
			guideY: -410,
			detail: {
				title: "Prune Ownership",
				summary:
					"Entry node for optional template surfaces, prune flags, rewrites, package entries, and assertions.",
				metrics: {
					surfaces: PRUNE_SURFACES.length,
					rewrites: centralRewrites.length,
					packageEntries: packageItems.length,
				},
			},
		},
		...PRUNE_SURFACES.map((surface, surfaceIndex) => ({
			id: `surface:${surface.id}`,
			label: surface.label,
			kind: "surface" as const,
			weight: surface.ownedPaths.length + surface.centralRewrites.length,
			group: "Surface",
			guideX: -500,
			guideY: -410 + surfaceIndex * 134,
			detail: {
				title: surface.label,
				summary: surface.description,
				metrics: {
					ownedPaths: surface.ownedPaths.length,
					routeIds: surface.routeIds.length,
					flag: surface.flag,
				},
				paths: surface.ownedPaths,
				tags: surface.routeIds,
			},
		})),
		...PRUNE_SURFACES.map((surface, surfaceIndex) => ({
			id: `flag:${surface.flag}`,
			label: surface.flag,
			kind: "flag" as const,
			weight: 2,
			group: "Flag",
			guideX: -760,
			guideY: -410 + surfaceIndex * 134,
			detail: {
				title: surface.flag,
				summary: `Removes the ${surface.label} optional template surface.`,
				paths: surface.ownedPaths,
			},
		})),
		...centralRewrites.map((rewrite, rewriteIndex) => {
			const guide = getGridGuide({
				index: rewriteIndex,
				columns: 2,
				startX: -220,
				startY: -410,
				columnGap: 240,
				rowGap: 134,
			});

			return {
				id: `rewrite:${rewrite}`,
				label: rewrite,
				kind: "rewrite" as const,
				weight: PRUNE_SURFACES.filter((surface) =>
					surface.centralRewrites.includes(rewrite),
				).length,
				group: "Rewrite",
				guideX: guide.x,
				guideY: guide.y,
				detail: {
					title: rewrite,
					summary: "Central file or generated fallback rewritten by prune.",
					metrics: {
						surfaces: PRUNE_SURFACES.filter((surface) =>
							surface.centralRewrites.includes(rewrite),
						).length,
					},
				},
			};
		}),
		...packageItems.map((item, itemIndex) => {
			const guide = getGridGuide({
				index: itemIndex,
				columns: 3,
				startX: 340,
				startY: -410,
				columnGap: 210,
				rowGap: 118,
			});

			return {
				id: `package:${item}`,
				label: item,
				kind: item.includes(":")
					? ("script" as const)
					: ("dependency" as const),
				weight: 2,
				group: item.includes(":") ? "Package Script" : "Package Dependency",
				guideX: guide.x,
				guideY: guide.y,
				detail: {
					title: item,
					summary: "Package entry removed when its owning surface is pruned.",
				},
			};
		}),
		...assertionItems.map((assertion, assertionIndex) => {
			const guide = getGridGuide({
				index: assertionIndex,
				columns: 1,
				startX: 1040,
				startY: -410,
				columnGap: 0,
				rowGap: 118,
			});

			return {
				id: `assertion:${assertion}`,
				label: assertion,
				kind: "assertion" as const,
				weight: 1,
				group: "Validation",
				guideX: guide.x,
				guideY: guide.y,
				detail: {
					title: assertion,
					summary: "Post-removal validation that catches leftover references.",
				},
			};
		}),
	];
	const links: TemplateIntelligenceGraphLink[] = [];

	for (const surface of PRUNE_SURFACES) {
		links.push({
			source: "entry:prune",
			target: `flag:${surface.flag}`,
			weight: 5,
			label: "organizes",
		});

		links.push({
			source: `flag:${surface.flag}`,
			target: `surface:${surface.id}`,
			weight: 5,
			label: "removes",
		});

		for (const rewrite of surface.centralRewrites) {
			links.push({
				source: `surface:${surface.id}`,
				target: `rewrite:${rewrite}`,
				weight: 2,
				label: "rewrites",
			});
		}

		for (const item of [
			...(surface.packageScripts ?? []),
			...(surface.packageDependencies ?? []),
		]) {
			links.push({
				source: `surface:${surface.id}`,
				target: `package:${item}`,
				weight: 2,
				label: "removes package entry",
			});
		}

		for (const assertion of surface.assertions) {
			links.push({
				source: `surface:${surface.id}`,
				target: `assertion:${assertion}`,
				weight: 1,
				label: "validates",
			});
		}
	}

	return {
		id: "prune",
		title: "Prune Ownership",
		description:
			"Optional surfaces connected to flags, rewrites, package entries, and validation checks.",
		canvas: {
			width: 2240,
			height: 1160,
			background: "#fff7ed",
			accent: "#d97706",
			defaultZoom: 0.62,
			minZoom: 0.26,
			cardScaleFloor: 0.66,
			linkOpacity: 0.055,
			selectedLinkOpacity: 0.62,
			labelPriority: [
				"entry",
				"flag",
				"surface",
				"rewrite",
				"dependency",
				"script",
			],
			selectedNeighborhoodDefault: true,
			stageHeightVh: 260,
			fixedBackdrop: true,
			promptLabel: "Scroll for prune ownership details",
		},
		nodes,
		links,
	};
}

function getContentModesGraph(): TemplateIntelligenceGraphView {
	const sharedBoundaries = [
		{
			id: "render-contract",
			label: "Render Contract",
			kind: "boundary" as const,
			summary:
				"Marketing components render lightweight page, section, and site layout data.",
		},
		{
			id: "server-resolvers",
			label: "Server Resolvers",
			kind: "resolver" as const,
			summary:
				"Source-specific details are resolved before data reaches section renderers.",
		},
		{
			id: "payload-metadata",
			label: "Payload Metadata",
			kind: "boundary" as const,
			summary:
				"Relationships, media records, drafts, SEO, localization, redirects, and taxonomy fields stay behind adapters.",
		},
		{
			id: "mode-docs",
			label: "Mode Docs",
			kind: "docs" as const,
			summary:
				"Docs that define static, Payload-ready, and Payload-powered modes.",
		},
	];
	const modeNodes: TemplateIntelligenceGraphNode[] = CONTENT_BOUNDARIES.map(
		(mode, modeIndex) => ({
			id: `mode:${mode.id}`,
			label: mode.label,
			kind: "mode",
			weight: mode.links.length,
			group: "Mode",
			guideX: -430,
			guideY: -160 + modeIndex * 160,
			detail: {
				title: mode.label,
				summary: mode.summary,
				paths: mode.links,
				tags: mode.tags,
			},
		}),
	);
	const boundaryNodes: TemplateIntelligenceGraphNode[] = sharedBoundaries.map(
		(boundary, boundaryIndex) => ({
			id: `boundary:${boundary.id}`,
			label: boundary.label,
			kind: boundary.kind,
			weight: 3,
			group: "Boundary",
			guideX: -40,
			guideY: -240 + boundaryIndex * 150,
			detail: {
				title: boundary.label,
				summary: boundary.summary,
			},
		}),
	);
	const modePaths = [
		...new Set(CONTENT_BOUNDARIES.flatMap((mode) => mode.links)),
	];
	const fileNodes: TemplateIntelligenceGraphNode[] = modePaths.map(
		(filePath, fileIndex) => {
			const guide = getGridGuide({
				index: fileIndex,
				columns: 3,
				startX: 210,
				startY: -240,
				columnGap: 220,
				rowGap: 120,
			});

			return {
				id: pathToNodeId("content-file", filePath),
				label: filePath.split("/").at(-1) ?? filePath,
				kind: filePath.startsWith("docs/") ? "docs" : "file",
				weight: CONTENT_BOUNDARIES.filter((mode) =>
					mode.links.includes(filePath),
				).length,
				path: filePath,
				group: filePath.startsWith("docs/") ? "Docs" : "Source",
				guideX: guide.x,
				guideY: guide.y,
				detail: {
					title: filePath,
					summary: "File that participates in the content mode boundary.",
					paths: [filePath],
				},
			};
		},
	);

	return {
		id: "content-modes",
		title: "Content Boundaries",
		description:
			"Static, Payload-ready, and Payload-powered modes connected to render contracts and source adapters.",
		canvas: {
			width: 1500,
			height: 760,
			background: "#f4f0ff",
			accent: "#7c3aed",
			defaultZoom: 0.74,
			minZoom: 0.35,
			cardScaleFloor: 0.58,
			linkOpacity: 0.12,
			selectedLinkOpacity: 0.52,
			labelPriority: ["entry", "mode", "boundary", "resolver", "file", "docs"],
			selectedNeighborhoodDefault: false,
			stageHeightVh: 220,
			fixedBackdrop: true,
			promptLabel: "Scroll for content boundaries",
		},
		nodes: [
			{
				id: "entry:content-modes",
				label: "Content Boundaries",
				kind: "entry",
				weight: CONTENT_BOUNDARIES.length,
				group: "Graph Entry",
				guideX: -690,
				guideY: -160,
				detail: {
					title: "Content Boundaries",
					summary:
						"Entry node for static, Payload-ready, and Payload-powered rendering boundaries.",
					metrics: {
						modes: CONTENT_BOUNDARIES.length,
						boundaries: sharedBoundaries.length,
					},
				},
			},
			...modeNodes,
			...boundaryNodes,
			...fileNodes,
		],
		links: [
			...CONTENT_BOUNDARIES.map((mode) => ({
				source: "entry:content-modes",
				target: `mode:${mode.id}`,
				weight: 5,
				label: "organizes",
			})),
			...CONTENT_BOUNDARIES.flatMap((mode) =>
				mode.links.map((filePath) => ({
					source: `mode:${mode.id}`,
					target: pathToNodeId("content-file", filePath),
					weight: 2,
					label: "uses",
				})),
			),
			{ source: "mode:static", target: "boundary:render-contract", weight: 4 },
			{
				source: "mode:payload-ready",
				target: "boundary:render-contract",
				weight: 4,
			},
			{
				source: "mode:payload-ready",
				target: "boundary:server-resolvers",
				weight: 3,
			},
			{
				source: "mode:payload-powered",
				target: "boundary:server-resolvers",
				weight: 5,
			},
			{
				source: "mode:payload-powered",
				target: "boundary:payload-metadata",
				weight: 4,
			},
			{ source: "mode:static", target: "boundary:mode-docs", weight: 2 },
			{ source: "mode:payload-ready", target: "boundary:mode-docs", weight: 2 },
			{
				source: "mode:payload-powered",
				target: "boundary:mode-docs",
				weight: 2,
			},
		],
	};
}

export function buildTemplateIntelligenceGraphs({
	index,
	agentMap,
}: {
	index: TemplateIntelligenceIndex;
	agentMap: TemplateIntelligenceAgentMap | null;
}): TemplateIntelligenceGraphView[] {
	return [
		getConceptGraph(index),
		getTaskMapGraph(agentMap),
		getPruneGraph(),
		getContentModesGraph(),
	];
}
