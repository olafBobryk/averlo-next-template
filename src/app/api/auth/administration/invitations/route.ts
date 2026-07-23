import { NextResponse } from "next/server";
import type { MembershipRole } from "@/lib/auth/contracts";
import { AuthDomainError, toPublicAuthError } from "@/lib/auth/errors";
import { applicationAdapters } from "@/lib/auth/server";
import { requireAdministrationContext } from "../_lib/access.server";

function isInvitationRole(
	value: unknown,
): value is Exclude<MembershipRole, "owner"> {
	return value === "admin" || value === "member";
}

export async function POST(request: Request) {
	try {
		const context = await requireAdministrationContext();
		const body = (await request.json()) as { email?: unknown; role?: unknown };
		const email =
			typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
		if (
			!email ||
			!/^\S+@\S+\.\S+$/.test(email) ||
			!isInvitationRole(body.role)
		) {
			throw new AuthDomainError("invitation-invalid");
		}
		const invitation = await applicationAdapters.invitations.createInvitation({
			actorMembershipId: context.membership.id,
			email,
			organizationId: context.organization.id,
			role: body.role,
		});
		return NextResponse.json({ invitation });
	} catch (error) {
		const publicError = toPublicAuthError(error);
		return NextResponse.json(publicError, { status: publicError.status });
	}
}
