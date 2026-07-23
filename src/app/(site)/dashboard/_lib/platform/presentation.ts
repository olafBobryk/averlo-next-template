import type { ChipTone } from "@/components/ui/misc";
import type {
	FeedbackCategory,
	FeedbackSeverity,
	FeedbackStatus,
	ProductReport,
	SupportRequest,
	SupportRequestStatus,
} from "./contracts";

export const supportStatusPresentation = {
	new: { label: "New", tone: "warning" },
	in_progress: { label: "In progress", tone: "primary" },
	resolved: { label: "Resolved", tone: "success" },
	closed: { label: "Closed", tone: "neutral" },
} satisfies Record<SupportRequestStatus, { label: string; tone: ChipTone }>;

export const feedbackStatusPresentation = {
	new: { label: "New", tone: "warning" },
	triaged: { label: "Triaged", tone: "primary" },
	planned: { label: "Planned", tone: "primary" },
	resolved: { label: "Resolved", tone: "success" },
	dismissed: { label: "Dismissed", tone: "neutral" },
} satisfies Record<FeedbackStatus, { label: string; tone: ChipTone }>;

export const feedbackCategoryPresentation = {
	bug: "Bug",
	ux_issue: "UX issue",
	data_problem: "Data problem",
	feature_request: "Feature request",
	workflow_complaint: "Workflow complaint",
} satisfies Record<FeedbackCategory, string>;

export const feedbackSeverityPresentation = {
	blocker: { label: "Blocker", tone: "danger" },
	high: { label: "High", tone: "warning" },
	normal: { label: "Normal", tone: "primary" },
	low: { label: "Low", tone: "neutral" },
} satisfies Record<FeedbackSeverity, { label: string; tone: ChipTone }>;

export function formatPlatformDate(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "Date unavailable";
	return new Intl.DateTimeFormat("en", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date);
}

export function supportRequestMatchesQuery(
	request: SupportRequest,
	query: string,
) {
	const normalized = query.trim().toLowerCase();
	if (!normalized) return true;
	return [
		request.id,
		request.name,
		request.email,
		request.organizationName,
		request.subject,
		request.message,
		request.internalNote ?? "",
	].some((value) => value.toLowerCase().includes(normalized));
}

export function productReportMatchesQuery(
	report: ProductReport,
	query: string,
) {
	const normalized = query.trim().toLowerCase();
	if (!normalized) return true;
	return [
		report.id,
		report.name,
		report.email,
		report.organizationName,
		report.currentRoute,
		report.description,
		report.triageNote ?? "",
		feedbackCategoryPresentation[report.category],
		feedbackSeverityPresentation[report.severity].label,
		feedbackStatusPresentation[report.status].label,
	].some((value) => value.toLowerCase().includes(normalized));
}
