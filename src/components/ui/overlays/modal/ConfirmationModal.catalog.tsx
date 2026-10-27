"use client";

import { useState } from "react";
import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Button } from "../../primitives/Button";
import { ModalHost } from "./ModalHost";
import { useConfirmationModal } from "./useConfirmationModal";

function ConfirmationHarness() {
	const [confirmations, setConfirmations] = useState(0);
	const { openConfirmation } = useConfirmationModal();
	return (
		<>
			<div id="modal-root" />
			<ModalHost />
			<Button
				onClick={() =>
					openConfirmation({
						title: "Delete report?",
						description: "Review the impact before continuing.",
						confirmLabel: "Delete report",
						details: [{ label: "Report", description: "Quarterly review" }],
						warning: "This cannot be undone.",
						onConfirm: () => {
							setConfirmations((count) => count + 1);
							return false;
						},
					})
				}
			>
				Open confirmation
			</Button>
			<output aria-live="polite">Confirmed {confirmations} times</output>
		</>
	);
}
function CatalogPreview1() {
	const render = () => (
		<div className="flex gap-4 p-8">
			<ConfirmationHarness />
		</div>
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}

export const catalogContract = defineCatalogOwnerContract({
	id: "ui-overlays-confirmation-modal",
	name: "ConfirmationModal",
	role: "Standard confirm-before-action modal with semantic impact details, warning, shared action hierarchy, and pending-state locking.",
	importStatement:
		'import { useConfirmationModal } from "@/components/ui/overlays/modal/useConfirmationModal";',
	chooseWhen: [
		"An action needs explicit confirmation before destructive or consequential work begins.",
		"Return false to keep the confirmation open without claiming completion. Return { ok: false, message } for a recoverable operational failure: the dialog shows one local InlineError, unlocks all close paths and allows retry. A thrown callback receives a safe generic local error. Successful results close once; pending confirmation preserves its label/geometry and disables conflicting cancellation.",
	],
	chooseInstead: [
		"Use the Modal owner for custom focused content, or inline validation for field errors.",
	],
	compounds: ["ConfirmationModal"],
	exclusions: ["Page-local confirmation dialogs and raw confirm() calls."],
	guarantees: [
		{
			label: "Confirmation details and keep-open result",
			storyId: "ui-overlays-confirmation-modal--confirmation-contract",
		},
		{
			label: "Delayed duplicate guard, all close locks and recoverable retry",
			storyId: "ui-overlays-confirmation-modal--recoverable-failure-and-retry",
		},
	],

	family: "UI",
	group: "Overlays",
	previewTargets: [
		{
			id: "confirmation-contract",
			name: "Confirmation details and keep-open result",
			baseline: {},
			axes: [],
			stage: "overlay",
			Render: CatalogPreview1,
		},
	],
});
