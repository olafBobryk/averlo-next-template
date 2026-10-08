"use client";
import { Button } from "@/components/ui/primitives/Button";
import { InlineError } from "@/components/ui/primitives/InlineError";
import { Card } from "@/components/ui/primitives/surfaces";
import type { AssistantApprovalDecision } from "@/lib/assistant/contracts";
export function ApprovalDecision({
	title,
	description,
	allowAlways = true,
	disabledReason,
	remaining = 0,
	pendingDecision,
	disabled = false,
	error,
	canAllow = true,
	onDecision,
}: {
	title: string;
	description: string;
	allowAlways?: boolean;
	disabledReason?: string;
	remaining?: number;
	pendingDecision?: AssistantApprovalDecision | null;
	disabled?: boolean;
	error?: string;
	canAllow?: boolean;
	onDecision: (decision: AssistantApprovalDecision) => void;
}) {
	const pending = disabled || !!pendingDecision;
	return (
		<Card
			display="flex"
			padding="sm"
			gap="sm"
			className="mb-2"
			role="region"
			aria-label="Action approval"
		>
			<div className="grid gap-1">
				<div className="flex items-center gap-2">
					<h2 className="text-sm font-medium">{title}</h2>
					{remaining > 0 && (
						<span className="ml-auto text-xs text-muted-foreground">
							+{remaining} pending
						</span>
					)}
				</div>
				<p className="text-xs text-muted-foreground">{description}</p>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<Button
					size="sm"
					variant="primary"
					disabled={pending || !canAllow}
					loading={pendingDecision === "allow_once"}
					onClick={() => onDecision("allow_once")}
				>
					Allow once
				</Button>
				{allowAlways && (
					<Button
						size="sm"
						disabled={pending || !canAllow}
						loading={pendingDecision === "always_allow"}
						onClick={() => onDecision("always_allow")}
					>
						Allow always
					</Button>
				)}
				<Button
					size="sm"
					variant="bare"
					disabled={pending}
					loading={pendingDecision === "deny"}
					onClick={() => onDecision("deny")}
				>
					Deny
				</Button>
			</div>
			{!canAllow && disabledReason && (
				<p className="text-xs text-muted-foreground">{disabledReason}</p>
			)}
			{error && <InlineError open>{error}</InlineError>}
		</Card>
	);
}
