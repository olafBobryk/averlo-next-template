import type { FeedbackStatus, SupportRequestStatus } from "./contracts";

export function resolveFeedbackStatus({
	currentStatus,
	requestedStatus,
	triageNote,
}: {
	currentStatus: FeedbackStatus;
	requestedStatus?: FeedbackStatus;
	triageNote?: string | null;
}): FeedbackStatus {
	const nextStatus = requestedStatus ?? currentStatus;
	return currentStatus === "new" && nextStatus === "new" && triageNote?.trim()
		? "triaged"
		: nextStatus;
}

export function resolveSupportRequestStatus({
	currentStatus,
	internalNote,
	requestedStatus,
}: {
	currentStatus: SupportRequestStatus;
	internalNote?: string | null;
	requestedStatus?: SupportRequestStatus;
}): SupportRequestStatus {
	const nextStatus = requestedStatus ?? currentStatus;
	return currentStatus === "new" && nextStatus === "new" && internalNote?.trim()
		? "in_progress"
		: nextStatus;
}
