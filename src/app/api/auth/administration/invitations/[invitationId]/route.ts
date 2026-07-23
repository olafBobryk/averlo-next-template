import { NextResponse } from "next/server";
import { toPublicAuthError } from "@/lib/auth/errors";
import { applicationAdapters } from "@/lib/auth/server";
import { requireAdministrationContext } from "../../_lib/access.server";

export async function PATCH(
	_request: Request,
	{ params }: { params: Promise<{ invitationId: string }> },
) {
	try {
		const context = await requireAdministrationContext();
		const { invitationId } = await params;
		const invitation = await applicationAdapters.invitations.refreshInvitation({
			actorMembershipId: context.membership.id,
			invitationId,
		});
		return NextResponse.json({ invitation });
	} catch (error) {
		const publicError = toPublicAuthError(error);
		return NextResponse.json(publicError, { status: publicError.status });
	}
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ invitationId: string }> },
) {
	try {
		const context = await requireAdministrationContext();
		const { invitationId } = await params;
		const invitation = await applicationAdapters.invitations.revokeInvitation({
			actorMembershipId: context.membership.id,
			invitationId,
		});
		return NextResponse.json({ invitation });
	} catch (error) {
		const publicError = toPublicAuthError(error);
		return NextResponse.json(publicError, { status: publicError.status });
	}
}
