#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process, { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import {
	THIN_START_REMOVE_PATHS,
	THIN_START_WRITE_FILES,
} from "./thin-start-live-templates.mjs";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const PARKED_ROOT = path.join(ROOT, ".thin-start");
const PARKED_REFERENCE_DIR = path.join(
	PARKED_ROOT,
	"reference/averlo-components",
);
const PARKED_COMPONENTS_DIR = path.join(PARKED_REFERENCE_DIR, "src/components");
const COMPONENT_SOURCE_DIR = path.join(ROOT, "src/components");
const LIVE_REWRITE_PLAN_PATH = path.join(
	PARKED_ROOT,
	"reference/live-rewrite-plan.json",
);
const PACKAGE_JSON_PATH = path.join(ROOT, "package.json");
const ACTIVATION_DEPENDENCIES = {
	sonner: "^2.0.7",
};
const LIVE_REWRITE_TARGETS = [
	{
		path: "src/components/ui/primitives/Button.tsx",
		purpose: "Reduce to thin-start Button API.",
	},
	{
		path: "src/components/ui/primitives/Text.tsx",
		purpose: "Reduce to visually complete heading/body/support typography.",
	},
	{
		path: "src/components/ui/primitives/Section.tsx",
		purpose: "Keep shared section scaffold behavior intact.",
	},
	{
		path: "src/components/ui/primitives/Field.tsx",
		purpose: "Keep minimal field label/message wrapper for text/select inputs.",
	},
	{
		path: "src/components/ui/primitives/InputFrame.tsx",
		purpose: "Keep minimal text-like input shell.",
	},
	{
		path: "src/components/ui/input/TextInput.tsx",
		purpose: "Keep TextInput built from Field and InputFrame.",
	},
	{
		path: "src/components/ui/input/SelectInput.tsx",
		purpose: "Keep simplified select field pattern.",
	},
	{
		path: "src/components/ui/primitives/Dropdown.tsx",
		purpose: "Keep existing dropdown interaction behavior.",
	},
	{
		path: "src/components/ui/overlays/toast",
		purpose:
			"Replace current Averlo toast with shadcn/Sonner-style thin-start default.",
	},
	{
		path: "src/app/(site)/(marketing)/internal/intelligence",
		purpose: "Move internal intelligence UI to route-owned minimal components.",
	},
	{
		path: "src/app/(site)/(marketing)/_components/layout",
		purpose:
			"Replace broad header/search/menu chrome with a thin-start marketing shell.",
	},
	{
		path: "src/config/routes.ts",
		purpose: "Reduce route registry to selected thin-start routes.",
	},
	{
		path: "src/lib/marketing-content",
		purpose:
			"Reduce fallback content and link types to thin-start route shape.",
	},
	{
		path: "src/components/ui/{misc,helpers,icons,time}",
		purpose: "Remove broad Averlo helper surfaces from live source.",
	},
];
const LIVE_IMPORT_PATTERN =
	/((from|import)\s*["'][^"']*(\.thin-start|thin-start\/reference|reference\/averlo-components)[^"']*["']|import\([^)]*["'][^"']*(\.thin-start|thin-start\/reference|reference\/averlo-components)[^"']*["'][^)]*\))/;

function parseArgs(argv) {
	const flags = new Set(argv);
	const recognized = new Set([
		"--dry-run",
		"--yes",
		"--force",
		"--in-place",
		"--confirm-instance",
		"--help",
	]);
	const unknown = argv.filter((arg) => !recognized.has(arg));

	if (unknown.length > 0) {
		throw new Error(`Unknown flag(s): ${unknown.join(", ")}`);
	}

	return {
		dryRun: flags.has("--dry-run"),
		force: flags.has("--force"),
		help: flags.has("--help"),
		inPlace: flags.has("--in-place"),
		confirmInstance: flags.has("--confirm-instance"),
		yes: flags.has("--yes"),
	};
}

function printUsage() {
	console.log(`Usage: npm run create:thin-start -- [flags]

Flags:
  --dry-run  Print the thin-start creation plan without changing files
  --yes      Skip the confirmation prompt
  --force    Replace an existing parked reference directory
  --in-place Record an in-place live rewrite plan after parking reference code
  --confirm-instance
            Required with mutating --in-place runs. Confirms this checkout is
            a new/disposable template instance, not the canonical default.
  --help     Show this help text
`);
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

async function readPackageJson() {
	const raw = await fs.readFile(PACKAGE_JSON_PATH, "utf8");
	return JSON.parse(raw);
}

async function writePackageJson(pkg) {
	await fs.writeFile(
		PACKAGE_JSON_PATH,
		`${JSON.stringify(pkg, null, "\t")}\n`,
		"utf8",
	);
}

async function assertTemplateShape() {
	const pkg = await readPackageJson();
	const requiredScripts = [
		"build",
		"dev:agent",
		"intelligence:generate",
		"prune:template",
	];
	const missingScripts = requiredScripts.filter((scriptName) => {
		return typeof pkg.scripts?.[scriptName] !== "string";
	});

	if (missingScripts.length > 0) {
		throw new Error(
			`Expected an Averlo template-shaped checkout. Missing package script(s): ${missingScripts.join(", ")}.`,
		);
	}
}

function assertInPlaceActivationAllowed(options) {
	if (!options.inPlace || options.dryRun) return;

	if (!options.confirmInstance) {
		throw new Error(
			"Mutating thin-start activation requires --confirm-instance. Use it only in a new/disposable template instance after accepting that the live source will be rewritten.",
		);
	}
}

async function confirmMutation(options) {
	const rl = createInterface({ input, output });

	try {
		const prompt = options.inPlace
			? "This parks the current reference and rewrites live source for selected thin-start in-place activation. Continue? [y/N] "
			: "This creates a local parked thin-start reference outside src/. Continue? [y/N] ";
		const answer = await rl.question(prompt);
		return /^(y|yes)$/i.test(answer.trim());
	} finally {
		rl.close();
	}
}

async function walkFiles(targetDir) {
	if (!(await pathExists(targetDir))) return [];

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

async function assertParkedReferenceOutsideLiveImportGraph() {
	const files = (await walkFiles(SRC_DIR)).filter((filePath) =>
		/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(filePath),
	);
	const failures = [];

	for (const filePath of files) {
		const content = await fs.readFile(filePath, "utf8");
		if (LIVE_IMPORT_PATTERN.test(content)) {
			failures.push(relativePath(filePath));
		}
	}

	if (failures.length === 0) return;

	console.error("\nParked thin-start reference imports found in live src/:");
	for (const failure of failures) {
		console.error(`- ${failure}`);
	}

	throw new Error("Thin-start parked reference is in the live import graph.");
}

function buildManifest(options) {
	return {
		schemaVersion: 1,
		generatedAt: new Date().toISOString(),
		mode: options.inPlace ? "thin-start-in-place" : "thin-start-reference",
		source: "src/components",
		target: relativePath(PARKED_COMPONENTS_DIR),
		liveImportGraph: "forbidden",
		notes: [
			"Reference-only parked copy of the current Averlo component system.",
			"Do not import from this directory into src/.",
			"Promote only the minimal API needed for the current website.",
		],
	};
}

function buildLiveRewritePlan() {
	return {
		schemaVersion: 1,
		mode: "thin-start-in-place",
		status: "planned",
		defaultSetupBehavior: "unchanged until this command is explicitly selected",
		parkedReferenceImportGraph: "forbidden",
		targets: LIVE_REWRITE_TARGETS,
		writes: THIN_START_WRITE_FILES.map((file) => file.path),
		removals: THIN_START_REMOVE_PATHS,
		nextGate:
			"Run exported API review in strict mode after selected in-place activation.",
	};
}

function renderReferenceReadme() {
	return [
		"# Thin-Start Parked Averlo Reference",
		"",
		"This directory is generated by `npm run create:thin-start`.",
		"",
		"It is reference-only and must stay outside the live import graph.",
		"Agents may inspect the parked Averlo component API here, but live",
		"promotion should bring forward only the minimal API needed for the",
		"current website.",
		"",
		"Do not import from `.thin-start/` into `src/`.",
		"",
	].join("\n");
}

function printPlan(options) {
	console.log("\nThin-start creation plan");
	console.log("========================");
	console.log(`- mode: ${options.inPlace ? "in-place" : "reference-only"}`);
	console.log(`- copy: ${relativePath(COMPONENT_SOURCE_DIR)}`);
	console.log(`- parked reference: ${relativePath(PARKED_COMPONENTS_DIR)}`);
	console.log("- write: .thin-start/reference/README.md");
	console.log("- write: .thin-start/reference/manifest.json");
	if (options.inPlace) {
		console.log("- write: .thin-start/reference/live-rewrite-plan.json");
		console.log(
			`- live source rewrite files: ${THIN_START_WRITE_FILES.length} planned`,
		);
		console.log(
			`- live source removals: ${THIN_START_REMOVE_PATHS.length} planned`,
		);
		console.log(
			"- live source rewrite: applied only on non-dry explicit --in-place run",
		);
		console.log(
			`- package dependency update: ${Object.keys(ACTIVATION_DEPENDENCIES).join(", ")}`,
		);
	}
	console.log("- assert: live src/ does not import parked reference paths");
	console.log("- default Averlo setup remains unchanged");
	if (options.force) {
		console.log("- force: existing parked reference will be replaced");
	}
}

async function applyInPlaceRewrite() {
	for (const targetPath of THIN_START_REMOVE_PATHS) {
		await fs.rm(path.join(ROOT, targetPath), { recursive: true, force: true });
	}

	for (const file of THIN_START_WRITE_FILES) {
		const absolutePath = path.join(ROOT, file.path);
		await fs.mkdir(path.dirname(absolutePath), { recursive: true });
		await fs.writeFile(absolutePath, file.content, "utf8");
	}
}

async function applyActivationDependencies() {
	const pkg = await readPackageJson();
	pkg.dependencies = pkg.dependencies ?? {};

	let changed = false;
	for (const [name, version] of Object.entries(ACTIVATION_DEPENDENCIES)) {
		if (pkg.dependencies[name] === version) continue;
		pkg.dependencies[name] = version;
		changed = true;
	}

	if (!changed) return;

	pkg.dependencies = Object.fromEntries(
		Object.entries(pkg.dependencies).sort(([left], [right]) =>
			left.localeCompare(right),
		),
	);
	await writePackageJson(pkg);
}

async function createThinStartReference(options) {
	if (await pathExists(PARKED_REFERENCE_DIR)) {
		if (!options.force) {
			throw new Error(
				`${relativePath(PARKED_REFERENCE_DIR)} already exists. Re-run with --force to replace it.`,
			);
		}
		await fs.rm(PARKED_REFERENCE_DIR, { recursive: true, force: true });
	}

	await fs.mkdir(path.dirname(PARKED_COMPONENTS_DIR), { recursive: true });
	await fs.cp(COMPONENT_SOURCE_DIR, PARKED_COMPONENTS_DIR, {
		recursive: true,
		errorOnExist: true,
	});
	await fs.writeFile(
		path.join(PARKED_ROOT, "reference/README.md"),
		renderReferenceReadme(),
		"utf8",
	);
	await fs.writeFile(
		path.join(PARKED_ROOT, "reference/manifest.json"),
		`${JSON.stringify(buildManifest(options), null, "\t")}\n`,
		"utf8",
	);

	if (options.inPlace) {
		await fs.writeFile(
			LIVE_REWRITE_PLAN_PATH,
			`${JSON.stringify(buildLiveRewritePlan(), null, "\t")}\n`,
			"utf8",
		);
	}
}

async function main() {
	const options = parseArgs(process.argv.slice(2));

	if (options.help) {
		printUsage();
		return;
	}

	await assertTemplateShape();
	assertInPlaceActivationAllowed(options);
	printPlan(options);

	if (options.dryRun) {
		await assertParkedReferenceOutsideLiveImportGraph();
		console.log("\nDry run complete. No files were changed.");
		return;
	}

	if (!options.yes) {
		const confirmed = await confirmMutation(options);
		if (!confirmed) {
			throw new Error("Aborted by user.");
		}
	}

	await createThinStartReference(options);
	if (options.inPlace) {
		await applyActivationDependencies();
		await applyInPlaceRewrite();
	}
	await assertParkedReferenceOutsideLiveImportGraph();

	console.log(
		options.inPlace
			? "\nThin-start parked reference created and in-place activation applied."
			: "\nThin-start parked reference created successfully.",
	);
}

main().catch((error) => {
	console.error(`\n${error.message}`);
	process.exit(1);
});
