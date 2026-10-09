"use client";
// Native specimen adapted from @/components/ui/primitives/StatusMessage.catalog.
import { Button } from "@/components/ui/primitives/Button";
import { StatusMessage } from "@/components/ui/primitives/StatusMessage";

function CatalogPreview1() {
	const render = () => (
		<div className="grid gap-3">
			<StatusMessage tone="info" heading="Shared workspace">
				This workspace is visible to invited members.
			</StatusMessage>
			<StatusMessage
				tone="success"
				heading="Ready to continue"
				descriptionOnNewLine
			>
				Security settings are complete.
			</StatusMessage>
			<StatusMessage
				tone="warning"
				heading="Review required"
				onDismiss={() => undefined}
			>
				Billing details need review.
			</StatusMessage>
			<StatusMessage
				tone="danger"
				heading="Deletion scheduled"
				action={<Button size="sm">Review</Button>}
			>
				This environment is scheduled for deletion.
			</StatusMessage>
		</div>
	);
	return render();
}
export default CatalogPreview1;
