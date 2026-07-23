import type {
	FeedbackSeverity,
	FeedbackStatus,
	SupportRequestStatus,
} from "@/app/(site)/dashboard/_lib/platform/contracts";
import {
	feedbackSeverityPresentation,
	feedbackStatusPresentation,
	supportStatusPresentation,
} from "@/app/(site)/dashboard/_lib/platform/presentation";
import { Chip } from "@/components/ui/misc";

export function SupportStatusChip({
	status,
}: {
	status: SupportRequestStatus;
}) {
	const presentation = supportStatusPresentation[status];
	return <Chip tone={presentation.tone}>{presentation.label}</Chip>;
}

export function FeedbackStatusChip({ status }: { status: FeedbackStatus }) {
	const presentation = feedbackStatusPresentation[status];
	return <Chip tone={presentation.tone}>{presentation.label}</Chip>;
}

export function FeedbackSeverityChip({
	severity,
}: {
	severity: FeedbackSeverity;
}) {
	const presentation = feedbackSeverityPresentation[severity];
	return <Chip tone={presentation.tone}>{presentation.label}</Chip>;
}
