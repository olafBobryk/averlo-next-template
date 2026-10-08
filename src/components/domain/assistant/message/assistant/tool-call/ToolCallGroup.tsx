"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icons/Icon";
import { Accordion } from "@/components/ui/misc";
import { Button } from "@/components/ui/primitives/Button";
import Divider from "@/components/ui/primitives/Divider";
import type { AssistantToolPart } from "@/lib/assistant/contracts";
import { ToolCall } from "./ToolCall";

export function ToolCallGroup({
	parts,
	disabled,
	onDecision,
}: {
	parts: AssistantToolPart[];
	disabled?: boolean;
	onDecision?: (part: AssistantToolPart, approved: boolean) => void;
}) {
	const [open, setOpen] = useState(false);
	const count = `${parts.length} tool ${parts.length === 1 ? "call" : "calls"}`;
	const state = parts.some((part) => part.state === "approval-requested")
		? "Needs approval"
		: parts.some((part) =>
					["input-streaming", "input-available", "approved"].includes(
						part.state,
					),
				)
			? "Working"
			: parts.some((part) => part.state === "error")
				? "Finished with errors"
				: parts.every((part) => part.state === "denied")
					? "Not run"
					: "Finished";
	return (
		<div className="min-w-0" data-slot="tool-call-summary">
			<Accordion
				title={`${state} · ${count}`}
				open={open}
				onOpenChange={setOpen}
				contentClassName="!px-0 !py-0"
				renderTrigger={(props) => (
					<>
						<Button
							{...props}
							variant="bare"
							size="none"
							align="left"
							className="py-2 text-sm text-muted-foreground"
							contentClassName="gap-1.5"
						>
							{state} · {count}
							<Icon
								name="caret-right"
								size="sm"
								className={`motion-micro transition-transform ${open ? "rotate-90" : ""}`}
							/>
						</Button>
						<Divider decorative />
					</>
				)}
			>
				{parts.map((part) => (
					<ToolCall
						key={part.id}
						part={part}
						disabled={disabled}
						onDecision={
							onDecision ? (approved) => onDecision(part, approved) : undefined
						}
					/>
				))}
			</Accordion>
		</div>
	);
}
