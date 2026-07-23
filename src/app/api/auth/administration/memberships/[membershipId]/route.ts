import { NextResponse } from "next/server";
import type { MembershipRole } from "@/lib/auth/contracts";
import { AuthDomainError, toPublicAuthError } from "@/lib/auth/errors";
import { applicationAdapters } from "@/lib/auth/server";
import { requireAdministrationContext } from "../../_lib/access.server";

function isEditableRole(
	value: unknown,
): value is Exclude<MembershipRole, "owner"> {
	return value === "admin" || value === "member";
}

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ membershipId: string }> },
) {
	try {
		const context = await requireAdministrationContext();
		const { membershipId } = await params;
		const body = (await request.json()) as { action?: unknown; role?: unknown };
		if (body.action === "transfer-ownership") {
			const result = await applicationAdapters.organizations.transferOwnership({
				actorMembershipId: context.membership.id,
				membershipId,
			});
			return NextResponse.json(result);
		}
		if (body.action !== "change-role" || !isEditableRole(body.role)) {
			throw new AuthDomainError("membership-role-forbidden");
		}
		const membership =
			await applicationAdapters.organizations.updateMembershipRole({
				actorMembershipId: context.membership.id,
				membershipId,
				role: body.role,
			});
		return NextResponse.json({ membership });
	} catch (error) {
		const publicError = toPublicAuthError(error);
		return NextResponse.json(publicError, { status: publicError.status });
	}
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ membershipId: string }> },
) {
	try {
		const context = await requireAdministrationContext();
		const { membershipId } = await params;
		const membership = await applicationAdapters.organizations.removeMembership(
			{
				actorMembershipId: context.membership.id,
				membershipId,
			},
		);
		return NextResponse.json({ membership });
	} catch (error) {
		const publicError = toPublicAuthError(error);
		return NextResponse.json(publicError, { status: publicError.status });
	}
}
