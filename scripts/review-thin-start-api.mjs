#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import thinStartProfile from "../template-profiles/thin-start/manifest.mjs";

const PARKED_IMPORT_PATTERN =
	/(\.thin-start|thin-start\/reference|reference\/averlo-components)/;
const COMPATIBILITY_PROP_PATTERN =
	/\b(compat|compatibility|legacy|deprecated)\b/i;
const IMPORT_PATTERN =
	/(?:import\s+(?:type\s+)?[^"']*from\s*["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\))/g;

function parseArgs(argv) {
	const options = {
		help: false,
		root: process.cwd(),
		strict: false,
	};

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (arg === "--root") {
			const value = argv[index + 1];
			if (!value || value.startsWith("--")) {
				throw new Error("--root requires a workspace path.");
			}
			options.root = path.resolve(process.cwd(), value);
			index += 1;
			continue;
		}
		if (arg === "--strict") options.strict = true;
		else if (arg === "--help") options.help = true;
		else throw new Error(`Unknown flag: ${arg}`);
	}

	return options;
}

function printUsage() {
	console.log(`Usage: npm run review:thin-start-api -- [flags]

Flags:
  --root <workspace>  Review a materialized workspace instead of the current root
  --strict            Exit non-zero for imports or markers outside the profile contract
  --help              Show this help text
`);
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
		if (entry.isDirectory()) files.push(...(await walkFiles(absolutePath)));
		else files.push(absolutePath);
	}
	return files;
}

function createClassifiers() {
	const review = thinStartProfile.apiReview;
	const allowedUiImports = new Set(review.allowedUiImports);
	const compatibilityExemptions = new Set(review.compatibilityMarkerExemptions);

	return {
		classifyImport(source) {
			if (source.startsWith("@/components/ui/")) {
				if (allowedUiImports.has(source)) return "allowed";
				if (
					review.allowedUiPrefixes.some((prefix) => source.startsWith(prefix))
				) {
					return "allowedSupport";
				}
				if (
					review.broadUiPrefixes.some((prefix) => source.startsWith(prefix))
				) {
					return "broad";
				}
				return "outsideAllowlist";
			}
			if (source.startsWith("@/components/composites/")) {
				if (
					review.allowedCompositePrefixes.some(
						(prefix) => source === prefix || source.startsWith(`${prefix}/`),
					)
				) {
					return "allowedComposite";
				}
				return "outsideCompositeAllowlist";
			}
			return null;
		},
		compatibilityExemptions,
	};
}

async function collectFindings(root) {
	const sourceRoot = path.join(root, "src");
	if (!(await pathExists(sourceRoot))) {
		throw new Error(`Thin-start review root has no src directory: ${root}`);
	}
	const files = (await walkFiles(sourceRoot)).filter((filePath) =>
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
	const { classifyImport, compatibilityExemptions } = createClassifiers();

	for (const filePath of files) {
		const content = await fs.readFile(filePath, "utf8");
		const relative = path.relative(root, filePath);

		if (PARKED_IMPORT_PATTERN.test(content))
			findings.parkedImports.push(relative);
		if (
			COMPATIBILITY_PROP_PATTERN.test(content) &&
			!compatibilityExemptions.has(relative)
		) {
			findings.compatibilityProps.push(relative);
		}

		for (const match of content.matchAll(IMPORT_PATTERN)) {
			const source = match[1] ?? match[2];
			const classification = classifyImport(source);
			if (!classification) continue;
			findings[classification].push(`${relative} -> ${source}`);
		}
	}

	return findings;
}

function printList(title, items) {
	console.log(`\n${title}`);
	if (items.length === 0) console.log("- none");
	else for (const item of items) console.log(`- ${item}`);
}

function hasFailures(findings) {
	return [
		"broad",
		"outsideAllowlist",
		"outsideCompositeAllowlist",
		"parkedImports",
		"compatibilityProps",
	].some((key) => findings[key].length > 0);
}

async function main() {
	const options = parseArgs(process.argv.slice(2));
	if (options.help) {
		printUsage();
		return;
	}

	const findings = await collectFindings(options.root);
	console.log("\nThin-start exported API review");
	console.log("==============================");
	console.log(`Profile: ${thinStartProfile.id}`);
	console.log(`Root: ${options.root}`);
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
