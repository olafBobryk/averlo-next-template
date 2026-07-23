import { NextResponse } from "next/server";
import {
	FEEDBACK_STATUSES,
	type FeedbackStatus,
} from "@/app/(site)/dashboard/_lib/platform/contracts";
import { updateProductReport } from "@/app/(site)/dashboard/_lib/platform/fixtures.server";
import { resolveCurrentSession } from "@/lib/auth/server";

type RouteContext = { params: Promise<{ id: string }> };

function readStatus(value: unknown): FeedbackStatus | null {
	return typeof value === "string" &&
		(FEEDBACK_STATUSES as readonly string[]).includes(value)
		? (value as FeedbackStatus)
		: null;
}

export async function PATCH(request: Request, { params }: RouteContext) {
	const resolution = await resolveCurrentSession();
	if (resolution.status !== "resolved") {
		return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
	}
	if (resolution.user.platformRole !== "admin") {
		return NextResponse.json(
			{ message: "Platform administrator access is required." },
			{ status: 403 },
		);
	}
	const body = (await request.json().catch(() => null)) as {
		status?: unknown;
		triageNote?: unknown;
	} | null;
	const status = readStatus(body?.status);
	if (!status) {
		return NextResponse.json(
			{ message: "Select a valid status." },
			{ status: 400 },
		);
	}
	const { id } = await params;
	const report = updateProductReport(id, {
		status,
		triageNote: typeof body?.triageNote === "string" ? body.triageNote : null,
	});
	if (!report) {
		return NextResponse.json({ message: "Report not found." }, { status: 404 });
	}
	return NextResponse.json({ message: "Report updated.", report });
}
