import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

function read(relativePath: string) {
	return readFileSync(resolve(root, relativePath), "utf8");
}

function assertIncludes(source: string, needle: string, label: string) {
	assert.ok(source.includes(needle), `Missing ${label}: ${needle}`);
}

// A generated receipt wins even if a project retains the template package name.
const generated = existsSync(resolve(root, ".template-profile.json"));
const isDirectory = (name: string) => {
	const location = resolve(root, name);
	return existsSync(location) && statSync(location).isDirectory();
};
const canonicalTemplate =
	!generated &&
	JSON.parse(read("package.json")).name === "averlo-next-template" &&
	isDirectory("template-assembly") &&
	isDirectory("template-profiles");
const shells: [string, string][] = [
	[
		"installed modal shell",
		read("src/components/ui/overlays/modal/ModalShell.tsx"),
	],
];
const confirmations: [string, string][] = [
	[
		"installed confirmation",
		read("src/components/ui/overlays/modal/ConfirmationModal.tsx"),
	],
];
if (canonicalTemplate) {
	shells.push([
		"thin override modal shell",
		read(
			"template-profiles/thin-start/overrides/src/components/ui/overlays/modal/ModalShell.tsx",
		),
	]);
	confirmations.push([
		"thin override confirmation",
		read(
			"template-profiles/thin-start/overrides/src/components/ui/overlays/modal/ConfirmationModal.tsx",
		),
	]);
}

for (const [label, source] of shells) {
	for (const contract of [
		"export function useModalSubmission()",
		"submissionRef",
		"beginSubmission",
		"endSubmission",
		"isSubmitting",
		"requestClose",
		"if (!submissionRef.current) onClose();",
	]) {
		assertIncludes(source, contract, `${label} submission contract`);
	}
}

for (const [label, source] of confirmations) {
	for (const contract of [
		"useModalSubmission",
		"if (!beginSubmission()) return",
		"shouldEndSubmission = false",
		"if (shouldEndSubmission)",
		"onCloseDisabledChange?.(true)",
		"onCloseDisabledChange?.(false)",
		"<InlineError>{error}</InlineError>",
	]) {
		assertIncludes(source, contract, `${label} pending handoff`);
	}
}

const modalForm = read("src/components/ui/overlays/modal/ModalForm.tsx");
assertIncludes(modalForm, "isSubmitting?: boolean", "step form pending API");
assert.ok(
	(modalForm.match(/disabled=\{isSubmitting\}/g) ?? []).length >= 3,
	"ModalStepForm must disable Back, Cancel, and Next while pending.",
);
assertIncludes(
	modalForm,
	"steps={indicatorSteps}",
	"step indicator pending lock",
);
assertIncludes(
	modalForm,
	"if (!isSubmitting) onStepChange(step)",
	"step callback pending guard",
);

assertIncludes(
	read("src/components/ui/overlays/modal/ModalHost.tsx"),
	"ariaLabel={options?.ariaLabel}",
	"modal aria label forwarding",
);
assertIncludes(
	read("src/components/ui/overlays/modal/useConfirmationModal.tsx"),
	"ariaLabel: title",
	"confirmation aria label",
);

const dashboardInstalled = isDirectory("src/app/(site)/dashboard");
if (generated) {
	const receipt = JSON.parse(read(".template-profile.json"));
	assert.equal(
		dashboardInstalled,
		receipt.assembly.surfaces.includes("dashboard"),
		"Mutation adoption checks must match installed dashboard surfaces",
	);
}

if (dashboardInstalled) {
	for (const relativePath of [
		"src/app/(site)/dashboard/_components/entities/record/RecordCollectionImplementation.tsx",
		"src/app/(site)/dashboard/_components/entities/record/RecordDetailActions.tsx",
		"src/app/(site)/dashboard/_components/detail/DashboardMarkdownEditorModalButton.tsx",
		"src/components/composites/markdown/MarkdownEditor.tsx",
	]) {
		const source = read(relativePath);
		assertIncludes(source, "useModalSubmission", `${relativePath} adoption`);
		assertIncludes(
			source,
			"if (!beginSubmission()) return",
			`${relativePath} guard`,
		);
	}

	const collection = read(
		"src/app/(site)/dashboard/_components/entities/record/RecordCollectionImplementation.tsx",
	);
	assertIncludes(
		collection,
		'completion: { type: "refresh" }',
		"collection deletion completion",
	);

	const detail = read(
		"src/app/(site)/dashboard/_components/entities/record/RecordDetailActions.tsx",
	);
	assertIncludes(detail, 'type: "navigate"', "detail deletion navigation");
	assertIncludes(detail, "replace: true", "detail replacement navigation");
	assert.ok(
		!detail.includes('router.push("/dashboard/records")'),
		"Detail deletion must not own a second navigation path.",
	);

	const referenceRecords = read(
		"src/app/(site)/dashboard/_lib/fixtures/reference-records.core.ts",
	);
	assertIncludes(referenceRecords, "fieldErrors?", "structured record errors");
} else {
	console.log(
		"Dashboard mutation adoption intentionally omitted: dashboard is not installed.",
	);
}

console.log(
	`Installed modal mutation policy passed; template overrides ${canonicalTemplate ? "verified" : "not applicable"}.`,
);
