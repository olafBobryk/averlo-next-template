"use client";
// Native specimen adapted from @/components/ui/overlays/modal/ConfirmationModal.catalog.
import { useState } from "react";
import { ModalHost } from "@/components/ui/overlays/modal/ModalHost";
import { useConfirmationModal } from "@/components/ui/overlays/modal/useConfirmationModal";
import { Button } from "@/components/ui/primitives/Button";

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
	return render();
}
export default CatalogPreview1;
