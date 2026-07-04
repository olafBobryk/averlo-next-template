#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const ALLOWED_UI_IMPORTS = new Set([
	"@/components/ui/primitives/Button",
	"@/components/ui/primitives/Text",
	"@/components/ui/primitives/Section",
	"@/components/ui/primitives/Field",
	"@/components/ui/primitives/InputFrame",
	"@/components/ui/primitives/Dropdown",
	"@/components/ui/primitives/dropdownStyles",
	"@/components/ui/input/choice/ChoiceIndicators",
	"@/components/ui/input/TextInput",
	"@/components/ui/input/SelectInput",
]);
const ALLOWED_COMPOSITE_IMPORT_PREFIXES = ["@/components/composites/markdown"];
const ALLOWED_UI_PREFIXES = [
	"@/components/ui/foundations/",
	"@/components/ui/motion",
	"@/components/ui/overlays/",
];
const BROAD_UI_PREFIXES = [
	"@/components/ui/misc/",
	"@/components/ui/helpers/",
	"@/components/ui/icons/",
	"@/components/ui/time/",
];
const PARKED_IMPORT_PATTERN =
	/(\.thin-start|thin-start\/reference|reference\/averlo-components)/;
const COMPATIBILITY_PROP_PATTERN =
	/\b(compat|compatibility|legacy|deprecated)\b/i;
const COMPATIBILITY_MARKER_EXEMPTIONS = new Set([
	"src/components/ui/motion/reveal/legacyCore.tsx",
]);
const IMPORT_PATTERN =
	/(?:import\s+(?:type\s+)?[^"']*from\s*["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\))/g;

function parseArgs(argv) {
	const flags = new Set(argv);
	const recognized = new Set(["--strict", "--help"]);
	const unknown = argv.filter((arg) => !recognized.has(arg));

	if (unknown.length > 0) {
		throw new Error(`Unknown flag(s): ${unknown.join(", ")}`);
	}

	return {
		help: flags.has("--help"),
		strict: flags.has("--strict"),
	};
}

function printUsage() {
	console.log(`Usage: npm run review:thin-start-api -- [flags]

Flags:
  --strict  Exit non-zero when broad UI imports, parked imports, or compatibility props are found
  --help    Show this help text
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

function classifyUiImport(source) {
	if (!source.startsWith("@/components/ui/")) return null;
	if (ALLOWED_UI_IMPORTS.has(source)) return "allowed";
	if (ALLOWED_UI_PREFIXES.some((prefix) => source.startsWith(prefix))) {
		return "allowed-support";
	}
	if (BROAD_UI_PREFIXES.some((prefix) => source.startsWith(prefix))) {
		return "broad";
	}
	return "outside-allowlist";
}

function classifyCompositeImport(source) {
	if (!source.startsWith("@/components/composites/")) return null;
	if (
		ALLOWED_COMPOSITE_IMPORT_PREFIXES.some(
			(prefix) => source === prefix || source.startsWith(`${prefix}/`),
		)
	) {
		return "allowed-composite";
	}
	return "outside-composite-allowlist";
}

async function collectFindings() {
	const files = (await walkFiles(SRC_DIR)).filter((filePath) =>
		/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(filePath),
	);
	const findings = {
		allowed: [],
		allowedSupport: [],
		allowedComposite: [],
		broad: [],
		outsideAllowlist: [],
		outsideCompositeAllowlist: [],
		parkedImports: [],
		compatibilityProps: [],
	};

	for (const filePath of files) {
		const content = await fs.readFile(filePath, "utf8");
		const relative = relativePath(filePath);

		if (PARKED_IMPORT_PATTERN.test(content)) {
			findings.parkedImports.push(relative);
		}

		if (
			COMPATIBILITY_PROP_PATTERN.test(content) &&
			!COMPATIBILITY_MARKER_EXEMPTIONS.has(relative)
		) {
			findings.compatibilityProps.push(relative);
		}

		for (const match of content.matchAll(IMPORT_PATTERN)) {
			const source = match[1] ?? match[2];
			const classification =
				classifyUiImport(source) ?? classifyCompositeImport(source);
			if (!classification) continue;

			const record = `${relative} -> ${source}`;
			if (classification === "allowed") findings.allowed.push(record);
			if (classification === "allowed-support") {
				findings.allowedSupport.push(record);
			}
			if (classification === "allowed-composite") {
				findings.allowedComposite.push(record);
			}
			if (classification === "broad") findings.broad.push(record);
			if (classification === "outside-allowlist") {
				findings.outsideAllowlist.push(record);
			}
			if (classification === "outside-composite-allowlist") {
				findings.outsideCompositeAllowlist.push(record);
			}
		}
	}

	return findings;
}

function printList(title, items) {
	console.log(`\n${title}`);
	if (items.length === 0) {
		console.log("- none");
		return;
	}
	for (const item of items) {
		console.log(`- ${item}`);
	}
}

function hasFailures(findings) {
	return (
		findings.broad.length > 0 ||
		findings.outsideAllowlist.length > 0 ||
		findings.outsideCompositeAllowlist.length > 0 ||
		findings.parkedImports.length > 0 ||
		findings.compatibilityProps.length > 0
	);
}

async function main() {
	const options = parseArgs(process.argv.slice(2));
	if (options.help) {
		printUsage();
		return;
	}

	const findings = await collectFindings();

	console.log("\nThin-start exported API review");
	console.log("==============================");
	console.log(`Allowed imports: ${findings.allowed.length}`);
	console.log(`Allowed support imports: ${findings.allowedSupport.length}`);
	console.log(`Allowed composite imports: ${findings.allowedComposite.length}`);
	console.log(`Broad UI imports: ${findings.broad.length}`);
	console.log(`Outside allowlist imports: ${findings.outsideAllowlist.length}`);
	console.log(
		`Outside composite allowlist imports: ${findings.outsideCompositeAllowlist.length}`,
	);
	console.log(
		`Parked reference import files: ${findings.parkedImports.length}`,
	);
	console.log(
		`Compatibility marker files: ${findings.compatibilityProps.length}`,
	);

	printList("Broad UI imports", findings.broad);
	printList("Outside allowlist imports", findings.outsideAllowlist);
	printList(
		"Outside composite allowlist imports",
		findings.outsideCompositeAllowlist,
	);
	printList("Parked reference imports", findings.parkedImports);
	printList("Compatibility markers", findings.compatibilityProps);

	if (options.strict && hasFailures(findings)) {
		throw new Error("Thin-start exported API review failed.");
	}
}

main().catch((error) => {
	console.error(`\n${error.message}`);
	process.exit(1);
});
