import type { MembershipRole } from "@/lib/auth/contracts";

export const SUPPORT_REQUEST_STATUSES = [
	"new",
	"in_progress",
	"resolved",
	"closed",
] as const;

export const FEEDBACK_CATEGORIES = [
	"bug",
	"ux_issue",
	"data_problem",
	"feature_request",
	"workflow_complaint",
] as const;

export const FEEDBACK_SEVERITIES = [
	"blocker",
	"high",
	"normal",
	"low",
] as const;

export const FEEDBACK_STATUSES = [
	"new",
	"triaged",
	"planned",
	"resolved",
	"dismissed",
] as const;

export type SupportRequestStatus = (typeof SUPPORT_REQUEST_STATUSES)[number];
export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];
export type FeedbackSeverity = (typeof FEEDBACK_SEVERITIES)[number];
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];
export type FeedbackBrowserMetadata = Record<string, unknown>;

export type PlatformActorSnapshot = {
	email: string;
	membershipId: string;
	name: string;
	organizationId: string;
	organizationName: string;
	organizationProfilePictureUrl: string | null;
	organizationSlug: string;
	profilePictureUrl: string | null;
	role: MembershipRole;
	userId: string;
};

export type SupportRequest = PlatformActorSnapshot & {
	createdAt: string;
	id: string;
	internalNote: string | null;
	message: string;
	status: SupportRequestStatus;
	subject: string;
	updatedAt: string;
};

export type ProductReport = PlatformActorSnapshot & {
	browserMetadata: FeedbackBrowserMetadata;
	category: FeedbackCategory;
	createdAt: string;
	currentRoute: string;
	description: string;
	id: string;
	severity: FeedbackSeverity;
	status: FeedbackStatus;
	triageNote: string | null;
	updatedAt: string;
	viewportHeight: number | null;
	viewportWidth: number | null;
};

export type CreateSupportRequestInput = {
	actor: PlatformActorSnapshot;
	message: string;
	subject: string;
};

export type CreateProductReportInput = {
	actor: PlatformActorSnapshot;
	browserMetadata?: FeedbackBrowserMetadata;
	category: FeedbackCategory;
	currentRoute: string;
	description: string;
	severity: FeedbackSeverity;
	viewportHeight?: number | null;
	viewportWidth?: number | null;
};

export type UpdateSupportRequestInput = {
	internalNote?: string | null;
	status?: SupportRequestStatus;
};

export type UpdateProductReportInput = {
	status?: FeedbackStatus;
	triageNote?: string | null;
};
