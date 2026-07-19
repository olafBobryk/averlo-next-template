import { NextResponse } from "next/server";
import { toPublicAuthError } from "@/lib/auth/errors";
import { selectCurrentOrganization } from "@/lib/auth/server";

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as { organizationId?: unknown };
		const organizationId =
			typeof body.organizationId === "string" ? body.organizationId : "";
		const context = await selectCurrentOrganization(organizationId);
		return NextResponse.json(context);
	} catch (error) {
		const publicError = toPublicAuthError(error);
		return NextResponse.json(publicError, { status: publicError.status });
	}
}
