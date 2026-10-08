import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Composer } from "./Composer";

function Preview() {
	return (
		<Composer
			attachments={[]}
			busy={false}
			canWrite
			onAddFiles={() => {}}
			onRemoveAttachment={() => {}}
			onStop={() => {}}
			onSubmit={() => {}}
			onToolModeChange={() => {}}
			toolMode="read_write"
		/>
	);
}
export const catalogContract = defineCatalogOwnerContract({
	id: "domain-assistant-controls",
	name: "Assistant controls",
	role: "Conversation composer, session queue and ordered action decisions. Temporary composer-adjacent queues and approvals share Card background and elevation.",
	importStatement: 'import { Composer } from "@/components/domain/assistant";',
	chooseWhen: [
		"Compose browser-capable chat with functional queue and approval adapters.",
	],
	chooseInstead: [
		"Use field validation for invalid input and InlineError for recoverable local failures.",
	],
	compounds: ["Composer", "MessageQueue", "ApprovalDecision"],
	exclusions: ["Nonfunctional provider, voice or desktop filesystem controls."],
	guarantees: [
		{
			label: "Pending dependencies retain an editable draft",
			storyId: "domain-assistant-controls--composer-dependencies-loading",
		},
		{
			label: "Send loading does not replace the input frame",
			storyId: "domain-assistant-controls--pending-send",
		},
		{
			label: "A pending run remains cancellable and accepts queued drafts",
			storyId: "domain-assistant-controls--cancellable-pending-send",
		},
		{
			label: "Composer commands select before execution",
			storyId: "domain-assistant-controls--slash-commands",
		},
		{
			label: "Context identity survives selection and clears on editing",
			storyId: "domain-assistant-controls--context-picker",
		},
		{
			label: "Recoverable search errors and safe new-conversation commands",
			storyId: "domain-assistant-controls--picker-recovery",
		},
		{
			label: "Resume paused queue from the empty composer",
			storyId: "domain-assistant-controls--resume-from-composer",
		},
		{
			label: "Only the clicked approval action shows loading",
			storyId: "domain-assistant-controls--clicked-action-loading",
		},
		{
			label: "Uniform queue rows with composer editing",
			storyId: "domain-assistant-controls--uniform-queue-rows",
		},
		{
			label: "Move queued content into composer and reorder remaining items",
			storyId: "domain-assistant-controls--queue-editing",
		},
		{
			label: "Explicit approval decisions",
			storyId: "domain-assistant-controls--approval-order",
		},
	],
	family: "Domain",
	group: "Assistant",
	previewTargets: [
		{
			id: "composer-idle",
			name: "Composer idle",
			baseline: {},
			axes: [],
			stage: "wide",
			Render: Preview,
		},
	],
});
