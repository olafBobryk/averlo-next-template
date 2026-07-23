"use client";

import type {
	CreateProductReportInput,
	FeedbackBrowserMetadata,
	FeedbackCategory,
	FeedbackSeverity,
	FeedbackStatus,
	ProductReport,
	SupportRequest,
	SupportRequestStatus,
} from "./contracts";

type ApiErrorBody = { message?: string };

async function readJson<T>(response: Response) {
	const body = (await response.json().catch(() => null)) as
		| (T & ApiErrorBody)
		| null;
	if (!response.ok) {
		throw new Error(body?.message ?? "The request could not be completed.");
	}
	if (!body) throw new Error("The server returned an empty response.");
	return body;
}

export async function submitSupportRequest(formData: FormData) {
	const response = await fetch("/api/support", {
		body: formData,
		credentials: "same-origin",
		method: "POST",
	});
	return readJson<{ message: string; request?: SupportRequest }>(response);
}

export async function submitProductReport(input: {
	browserMetadata: FeedbackBrowserMetadata;
	category: FeedbackCategory;
	currentRoute: string;
	description: string;
	severity: FeedbackSeverity;
	viewportHeight: number | null;
	viewportWidth: number | null;
}) {
	const response = await fetch("/api/feedback", {
		body: JSON.stringify(input),
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		method: "POST",
	});
	return readJson<{ message: string; report: ProductReport }>(response);
}

export async function updateSupportRequest(input: {
	id: string;
	internalNote: string;
	status: SupportRequestStatus;
}) {
	const response = await fetch(
		`/api/platform/inbox/${encodeURIComponent(input.id)}`,
		{
			body: JSON.stringify({
				internalNote: input.internalNote,
				status: input.status,
			}),
			credentials: "same-origin",
			headers: { "content-type": "application/json" },
			method: "PATCH",
		},
	);
	return readJson<{ message: string; request: SupportRequest }>(response);
}

export async function updateProductReport(input: {
	id: string;
	status: FeedbackStatus;
	triageNote: string;
}) {
	const response = await fetch(
		`/api/platform/reports/${encodeURIComponent(input.id)}`,
		{
			body: JSON.stringify({
				status: input.status,
				triageNote: input.triageNote,
			}),
			credentials: "same-origin",
			headers: { "content-type": "application/json" },
			method: "PATCH",
		},
	);
	return readJson<{ message: string; report: ProductReport }>(response);
}

export type ProductReportSubmission = Omit<CreateProductReportInput, "actor">;
