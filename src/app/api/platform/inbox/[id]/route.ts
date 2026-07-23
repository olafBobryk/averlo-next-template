import { NextResponse } from "next/server";
import {
	SUPPORT_REQUEST_STATUSES,
	type SupportRequestStatus,
} from "@/app/(site)/dashboard/_lib/platform/contracts";
import { updateSupportRequest } from "@/app/(site)/dashboard/_lib/platform/fixtures.server";
import { resolveCurrentSession } from "@/lib/auth/server";

type RouteContext = { params: Promise<{ id: string }> };

function readStatus(value: unknown): SupportRequestStatus | null {
	return typeof value === "string" &&
		(SUPPORT_REQUEST_STATUSES as readonly string[]).includes(value)
		? (value as SupportRequestStatus)
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
		internalNote?: unknown;
		status?: unknown;
	} | null;
	const status = readStatus(body?.status);
	if (!status) {
		return NextResponse.json(
			{ message: "Select a valid status." },
			{ status: 400 },
		);
	}
	const { id } = await params;
	const supportRequest = updateSupportRequest(id, {
		internalNote:
			typeof body?.internalNote === "string" ? body.internalNote : null,
		status,
	});
	if (!supportRequest) {
		return NextResponse.json(
			{ message: "Support request not found." },
			{ status: 404 },
		);
	}
	return NextResponse.json({
		message: "Support request updated.",
		request: supportRequest,
	});
}
