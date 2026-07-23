import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const owners = [
	["src/components/ui/input/text/TextInput.tsx", "TextInput"],
	["src/components/ui/input/numeric/NumberInput.tsx", "NumberInput"],
	["src/components/ui/input/numeric/UnitNumberInput.tsx", "UnitNumberInput"],
	["src/components/ui/input/text/TextAreaInput.tsx", "TextAreaInput"],
	["src/components/ui/input/selection/SelectInput.tsx", "SelectInput"],
	[
		"src/components/ui/input/selection/ComboboxTextInput.tsx",
		"ComboboxTextInput",
	],
	[
		"src/components/ui/input/selection/ComboboxMultiSelectInput.tsx",
		"ComboboxMultiSelectInput",
	],
	[
		"src/components/ui/input/selection/ButtonMultiSelectInput.tsx",
		"ButtonMultiSelectInput",
	],
	["src/components/ui/input/choice/MultiselectInput.tsx", "MultiselectInput"],
	["src/components/ui/input/date/DateInput.tsx", "DateInput"],
	["src/components/ui/input/date/DateRangeInput.tsx", "DateRangeInput"],
	["src/components/ui/input/color/ColorInput.tsx", "ColorInput"],
	["src/components/ui/input/color/ColorSwatchInput.tsx", "ColorSwatchInput"],
	["src/components/ui/input/text/PhoneInput.tsx", "PhoneInput"],
	[
		"src/components/ui/input/files/ProfilePictureInput.tsx",
		"ProfilePictureInput",
	],
	["src/components/ui/input/numeric/SliderInput.tsx", "SliderInput"],
	["src/components/ui/input/SignatureInput.tsx", "SignatureInput"],
	[
		"src/components/ui/input/editable/EditableTextField.tsx",
		"EditableTextField",
	],
	["src/components/ui/input/files/FileInput.tsx", "FileInput"],
	["src/components/ui/input/files/FilePreview.tsx", "FilePreview"],
	["src/components/ui/misc/PaginationControls.tsx", "PaginationControls"],
	["src/components/ui/misc/SocialLinks.tsx", "SocialLinks"],
	["src/components/ui/time/DateAgo.tsx", "DateAgo"],
	["src/components/ui/time/DateIndicator.tsx", "DateIndicator"],
	["src/components/composites/markdown/MarkdownEditor.tsx", "MarkdownEditor"],
	[
		"src/lib/marketing-content/sections/homeHero/HomeHeroSection.tsx",
		"HomeHeroSection",
	],
] as const;

const thinOwners = [
	[
		"template-profiles/thin-start/overrides/src/components/ui/input/choice/ChoiceField.tsx",
		"ChoiceField",
	],
	[
		"template-profiles/thin-start/overrides/src/components/ui/input/choice/RadioInput.tsx",
		"RadioInput",
	],
	[
		"template-profiles/thin-start/overrides/src/components/ui/input/choice/ToggleInput.tsx",
		"ToggleInput",
	],
	[
		"template-profiles/thin-start/overrides/src/components/ui/input/choice/MultiselectInput.tsx",
		"MultiselectInput",
	],
	[
		"template-profiles/thin-start/overrides/src/components/ui/input/text/TextInput.tsx",
		"TextInput",
	],
	[
		"template-profiles/thin-start/overrides/src/components/ui/input/selection/SelectInput.tsx",
		"SelectInput",
	],
	[
		"template-profiles/thin-start/overrides/src/lib/marketing-content/sections/homeHero/HomeHeroSection.tsx",
		"HomeHeroSection",
	],
] as const;

const failures: string[] = [];
for (const [relativePath, owner] of [...owners, ...thinOwners]) {
	const source = fs.readFileSync(path.join(root, relativePath), "utf8");
	if (
		!source.includes(`export const ${owner}`) ||
		!source.includes("Skeleton")
	) {
		failures.push(
			`${owner} does not expose Component.Skeleton in ${relativePath}`,
		);
	}
}

const forbiddenGraphTokens = [
	"GraphMap",
	"react-force-graph-2d",
	"react-force-graph-3d",
	"three-spritetext",
	"/internal/intelligence/graph",
];
const searchableFiles = ["src", "scripts", "template-profiles", "package.json"];
for (const token of forbiddenGraphTokens) {
	for (const relativePath of searchableFiles) {
		const absolutePath = path.join(root, relativePath);
		const files = fs.statSync(absolutePath).isDirectory()
			? walk(absolutePath)
			: [absolutePath];
		for (const file of files) {
			if (file.endsWith("verify-component-skeletons.ts")) continue;
			if (!/\.(?:tsx?|mjs|json)$/.test(file)) continue;
			if (fs.readFileSync(file, "utf8").includes(token)) {
				failures.push(
					`Removed graph token ${token} remains in ${path.relative(root, file)}`,
				);
			}
		}
	}
}

if (failures.length > 0) {
	throw new Error(failures.join("\n"));
}

console.log(
	`Verified ${owners.length + thinOwners.length} component skeleton contracts and GraphMap removal.`,
);

function walk(directory: string): string[] {
	return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const entryPath = path.join(directory, entry.name);
		return entry.isDirectory() ? walk(entryPath) : [entryPath];
	});
}
