"use client";
import type {
	AssistantContextReference,
	AssistantMessage as AssistantMessageContract,
	AssistantToolPart,
} from "@/lib/assistant/contracts";
import { AssistantMessage } from "./assistant";
import { UserMessage } from "./user";

export function Message({
	decisionPending,
	message,
	onEdit,
	onToolDecision,
	streaming = false,
}: {
	decisionPending?: boolean;
	onEdit?: (
		text: string,
		references?: AssistantContextReference[],
	) => Promise<void>;
	message: AssistantMessageContract;
	onToolDecision?: (part: AssistantToolPart, approved: boolean) => void;
	streaming?: boolean;
}) {
	switch (message.role) {
		case "user":
			return <UserMessage message={message} onEdit={onEdit} />;
		case "assistant":
			return (
				<AssistantMessage
					decisionPending={decisionPending}
					message={message}
					onToolDecision={onToolDecision}
					streaming={streaming}
				/>
			);
		case "system":
			return null;
	}

	message satisfies never;
	return null;
}
