"use client";
import { useState } from "react";
import { Button } from "@/components/ui/primitives/Button";
import { InlineError } from "@/components/ui/primitives/InlineError";
import type {
	AssistantResponseMessage,
	AssistantToolPart,
} from "@/lib/assistant/contracts";
import { Attachment } from "../../attachment";
import { MessageFrame } from "../frame";
import { Response } from "./response";
import { ToolCallGroup } from "./tool-call/ToolCallGroup";

export function AssistantMessage({
	decisionPending,
	message,
	onToolDecision,
	streaming,
}: {
	decisionPending?: boolean;
	message: AssistantResponseMessage;
	onToolDecision?: (part: AssistantToolPart, approved: boolean) => void;
	streaming: boolean;
}) {
	const [copied, setCopied] = useState(false);
	const tools = message.parts.filter(
		(part): part is AssistantToolPart => part.type === "tool",
	);
	const hasVisibleParts = message.parts.some(
		(part) => part.type !== "text" || part.text.length > 0,
	);
	if (!hasVisibleParts && !message.failure) return null;

	return (
		<MessageFrame ariaLabel="Assistant">
			<div className="group/response w-full min-w-0">
				{tools.length > 0 && (
					<ToolCallGroup
						parts={tools}
						disabled={decisionPending}
						onDecision={onToolDecision}
					/>
				)}
				<div
					className={tools.length > 0 ? "mt-2" : undefined}
					data-slot="assistant-reply"
				>
					{message.parts.map((part) => {
						switch (part.type) {
							case "text":
								return (
									<Response
										key={part.id}
										streaming={streaming}
										text={part.text}
									/>
								);
							case "file":
								return (
									<Attachment attachment={part.attachment} key={part.id} />
								);
							case "tool":
								return null;
						}

						part satisfies never;
						return null;
					})}
				</div>
				<InlineError open={!!message.failure}>{message.failure}</InlineError>
				{!streaming && (
					<div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
						<Button
							variant="bare"
							size="none"
							iconSize={12}
							className="min-h-6 py-1"
							shape="square"
							aria-label={copied ? "Copied response" : "Copy response"}
							leadingIcon={copied ? "check" : "copy"}
							onClick={async () => {
								try {
									await navigator.clipboard.writeText(
										message.parts
											.flatMap((part) =>
												part.type === "text" ? [part.text] : [],
											)
											.join("\n"),
									);
									setCopied(true);
								} catch {
									setCopied(false);
								}
							}}
						/>
						<time
							className="opacity-0 motion-micro transition-opacity group-hover/response:opacity-100 group-focus-within/response:opacity-100"
							dateTime={message.createdAt}
						>
							{new Date(message.createdAt).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</time>
					</div>
				)}
			</div>
		</MessageFrame>
	);
}
