"use client";
// Native specimen adapted from @/components/domain/assistant/message/Message.catalog.
import * as Assistant from "@/components/domain/assistant";
import type {
	AssistantMessage as AssistantMessageContract,
	AssistantResponseMessage,
	AssistantStagedAttachment,
	AssistantUserMessage,
} from "@/lib/assistant/contracts";

const createdAt = "2026-08-01T09:00:00.000Z";
const userAttachment: AssistantStagedAttachment = {
	accessUrl: "data:application/pdf;base64,",
	contentType: "application/pdf",
	createdAt,
	filename: "launch-brief.pdf",
	id: "attachment-user",
	size: 84_000,
	status: "ready",
};
const assistantAttachment: AssistantStagedAttachment = {
	accessUrl: "data:text/plain;base64,",
	contentType: "text/plain",
	createdAt,
	filename: "record-summary.txt",
	id: "attachment-assistant",
	size: 2_400,
	status: "ready",
};
const userMessage: AssistantUserMessage = {
	createdAt,
	id: "message-user",
	parts: [
		{
			id: "part-user-text",
			text: "Review the attached brief and list the records needing attention.",
			type: "text",
		},
		{
			attachment: userAttachment,
			id: "part-user-file",
			type: "file",
		},
	],
	role: "user",
};
const assistantMessage: AssistantResponseMessage = {
	createdAt,
	id: "message-assistant",
	parts: [
		{
			id: "part-assistant-text",
			text: "I found one record that needs attention.",
			type: "text",
		},
		{
			attachment: assistantAttachment,
			id: "part-assistant-file",
			type: "file",
		},
		{
			approvalId: null,
			error: null,
			id: "part-assistant-tool",
			input: { query: "attention" },
			name: "records_list",
			output: null,
			state: "input-streaming",
			type: "tool",
		},
	],
	role: "assistant",
};
function MessageColumn({ messages }: { messages: AssistantMessageContract[] }) {
	return (
		<div className="grid w-full gap-7 py-6">
			{messages.map((message) => (
				<Assistant.Message key={message.id} message={message} />
			))}
		</div>
	);
}
function CatalogPreview() {
	const render = () => (
		<MessageColumn messages={[userMessage, assistantMessage]} />
	);
	return render();
}
export default CatalogPreview;
