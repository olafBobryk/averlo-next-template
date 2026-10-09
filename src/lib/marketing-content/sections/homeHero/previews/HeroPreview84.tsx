"use client";
import { ModalHost } from "@/components/ui/overlays/modal/ModalHost";
import {
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	useModalSubmission,
} from "@/components/ui/overlays/modal/ModalShell";
import { useModal } from "@/components/ui/overlays/modal/useModal";
// Native specimen adapted from @/components/ui/overlays/modal/Modal.catalog.
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";

function StandardModalContent({ close }: { close: () => void }) {
	return (
		<>
			<ModalHeader>
				<ModalTitle>Account details</ModalTitle>
			</ModalHeader>
			<ModalContent>
				<Text>Hosted modal content.</Text>
			</ModalContent>
			<ModalFooter>
				<Button onClick={close}>Done</Button>
			</ModalFooter>
		</>
	);
}
function SubmissionContent() {
	const { beginSubmission, endSubmission, isSubmitting } = useModalSubmission();
	return (
		<>
			<ModalHeader>
				<ModalTitle>Submitting modal</ModalTitle>
			</ModalHeader>
			<ModalContent>
				<output aria-live="polite">
					{isSubmitting ? "Submission locked" : "Ready"}
				</output>
			</ModalContent>
			<ModalFooter>
				<Button onClick={beginSubmission}>Begin submission</Button>
				<Button onClick={endSubmission} variant="secondary">
					End submission
				</Button>
			</ModalFooter>
		</>
	);
}
function ModalHarness({ submission = false }: { submission?: boolean }) {
	const { openModal } = useModal();
	return (
		<>
			<div id="modal-root" />
			<ModalHost />
			<Button
				onClick={() =>
					openModal(
						({ close }) =>
							submission ? (
								<SubmissionContent />
							) : (
								<StandardModalContent close={close} />
							),
						{ ariaLabel: submission ? "Submitting modal" : "Account details" },
					)
				}
			>
				Open modal
			</Button>
		</>
	);
}
function CatalogPreview1() {
	const render = () => (
		<div className="p-8">
			<ModalHarness />
		</div>
	);
	return render();
}
export default CatalogPreview1;
