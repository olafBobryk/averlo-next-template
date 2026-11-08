export const assemblyGeneratedPaths = new Set([
	"AGENTS.md",
	"PRODUCT.md",
	"README.md",
	"WORKFLOWS.md",
	".specify/workflows/workflow-registry.json",
	"docs/README.md",
	"next.config.ts",
	"package-lock.json",
	"package.json",
	"src/config/surfaces.ts",
	"src/config/surfaces/marketing.ts",
	"src/lib/api/index.ts",
	"src/lib/marketing-content/source.ts",
	"tsconfig.json",
]);

export const assemblyTemplateOnlyPaths = new Set([
	"docs/operations/project-assembly.md",
	"docs/development/workflow.md",
	"docs/development/skeleton-generation-shimmer-20261010.md",
	"docs/operations/chip-capitalization-backport.md",
	"docs/operations/disclosure-alignment-backport.md",
	"docs/operations/dependency-audit-2026-10-08.md",
	"docs/reviews/hybrid-driver-integration.md",
	"docs/benchmarks/history/template-intelligence-runs.jsonl",
	"docs/benchmarks/README.md",
	"docs/benchmarks/design-system-agent-benchmark.md",
	"docs/benchmarks/design-system-agent-benchmark-runs.jsonl",
	"docs/benchmarks/design-system-agent-benchmark-runs.md",
	"scripts/create-template-profile.mjs",
	"scripts/dev-thin.mjs",
	"scripts/generate-repository-footprint.mjs",
	"scripts/generate-template-assembly-inventory.mjs",
	"scripts/measure-storybook-performance.mjs",
	"scripts/review-thin-start-api.mjs",
	"scripts/verify/verify-design-system-agent-benchmark.mjs",
	"scripts/verify/verify-template-profiles.mjs",
	"scripts/verify/verify-create-averlo.mjs",
	".github/workflows/publish-create-averlo.yml",
	".github/workflows/update-repository-footprint.yml",
]);

// Only the stock Spec Kit agent skills may escape the template-only .agents and .claude roots.
export function isAssemblySpecKitSkillPath(relativePath) {
	return /^\.(?:agents|claude)\/skills\/speckit-[a-z0-9-]+\/SKILL\.md$/u.test(
		relativePath,
	);
}

// Workflows that run against the template itself, never inside a generated project.
export const assemblyTemplateOnlyWorkflows = [
	"create-project",
	"publish",
	"backport",
];

export const assemblyTemplateOnlyRoots = [
	".agents",
	".claude",
	...assemblyTemplateOnlyWorkflows.map(
		(workflowId) => `.specify/workflows/${workflowId}`,
	),
	"specs/template",
	"plugins",
	"packages",
	"template-assembly",
	"template-profiles",
	"template-surfaces",
	"src/app/(site)/(marketing)/repository-footprint",
];

// Platform specs are core unless a surface owns them (template-surfaces/*).
// Shared behavioral dependencies apply to installed uses; they do not install features.
export const assemblyCoreSpecRoots = [
	"specs/README.md",
	"specs/platform",
	"specs/product",
];

export const assemblyCoreRoots = [
	...assemblyCoreSpecRoots,
	".specify",
	".env.example",
	".gitignore",
	".storybook",
	".vercelignore",
	".vscode",
	"biome.json",
	"docs",
	"next-sitemap.config.js",
	"postcss.config.mjs",
	"public",
	"scripts",
	"src",
	"vitest.config.mts",
	"vitest.shims.d.ts",
];

export const assemblyTemplateOnlyScripts = new Set([
	"create:project",
	"dev:thin",
	"footprint:generate",
	"review:thin-start-api",
	"measure:storybook-performance",
	"generate:design-system-agent-benchmark-report",
	"verify:design-system-agent-benchmark",
	"verify:storybook-backport",
	"verify:profiles",
	"verify:create-averlo",
	"verify:composition-workflows",
	"verify:visual-parity",
]);

export const assemblyTemplateOnlyDevDependencies = new Set(["js-tiktoken"]);

export const assemblyCoreScripts = new Set([
	"verify:forms",
	"verify:loading",
	"dev",
	"dev:local",
	"preview:tunnel",
	"preview:capture",
	"predev",
	"predev:local",
	"prebuild",
	"build-storybook",
	"build",
	"design-system:evidence",
	"start",
	"lint",
	"typecheck",
	"verify:static",
	"verify:build",
	"verify:smoke",
	"verify:modals",
	"verify:surface-contracts",
	"verify:retired-semantic-service",
	"verify:retired-template-intelligence",
	"verify:skill-references",
	"verify:route-surfaces",
	"verify:route-metadata",
	"verify:component-skeletons",
	"verify:route-skeletons",
	"storybook",
	"storybook:preview",
	"storybook:status",
	"storybook:stop",
	"test-storybook",
	"test-storybook:ui:light",
	"test-storybook:ui:dark",
	"test-storybook:ui",
	"verify",
	"verify:design-system-evidence",
	"verify:storybook-catalog",
	"verify:storybook-preview",
	"verify:preview-capture",
	"verify:dev-server-shutdown",
	"format",
	"postinstall",
	"postbuild",
]);

export const assemblyCoreDependencies = new Set([
	"pdfjs-dist",
	"@mdxeditor/editor",
	"@openai/apps-sdk-ui",
	"@radix-ui/react-slot",
	"class-variance-authority",
	"clsx",
	"libphonenumber-js",
	"micromark",
	"micromark-extension-directive",
	"micromark-extension-mdx-jsx",
	"micromark-extension-mdx-md",
	"motion",
	"gsap",
	"lenis",
	"next",
	"next-sitemap",
	"react",
	"react-dom",
	"react-markdown",
	"remark-gfm",
	"sonner",
	"streamdown",
]);

export const assemblyCoreDevDependencies = new Set([
	"@biomejs/biome",
	"@chromatic-com/storybook",
	"@storybook/addon-a11y",
	"@storybook/addon-docs",
	"@storybook/addon-mcp",
	"@storybook/addon-vitest",
	"@storybook/nextjs-vite",
	"@tailwindcss/postcss",
	"@types/node",
	"@types/react",
	"@types/react-dom",
	"@vitest/browser-playwright",
	"@vitest/coverage-v8",
	"playwright",
	"storybook",
	"tailwindcss",
	"tsx",
	"typescript",
	"vite",
	"vitest",
]);

export const assemblyProjectDocs = new Set([
	"docs/testing/forms.md",
	"docs/testing/loading.md",
	"docs/testing/actions.md",
	"docs/testing/interactions.md",
	"docs/testing/api-transport.md",
	"docs/testing/component-contracts.md",
	"docs/testing/routes-and-metadata.md",
	"docs/motion-drivers.md",
	"docs/operations/payload-vercel-neon-blob.md",
]);

export function isWithinPath(relativePath, ownedPath) {
	return relativePath === ownedPath || relativePath.startsWith(`${ownedPath}/`);
}
