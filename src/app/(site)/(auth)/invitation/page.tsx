import type { Metadata } from "next";
import { Button } from "@/components/ui/primitives/Button";
import { StatusMessage } from "@/components/ui/primitives/StatusMessage";
import { Text } from "@/components/ui/primitives/Text";
import { getSafeContinuationPath } from "@/lib/auth/continuation";
import { toPublicAuthError } from "@/lib/auth/errors";
import { applicationAdapters } from "@/lib/auth/server";
import { AuthScreen } from "../_components/AuthScreen";
import { acceptInvitationAction } from "../actions";

export const metadata: Metadata = {
	referrer: "no-referrer",
	title: "Review invitation",
};

export default async function InvitationPage({
	searchParams,
}: {
	searchParams: Promise<{
		invitation?: string;
		message?: string;
		next?: string;
		token?: string;
	}>;
}) {
	const query = await searchParams;
	const invitationId = query.invitation?.trim() ?? "";
	const tokenHash = query.token?.trim() ?? "";
	const next = getSafeContinuationPath(query.next);
	let invitation = null;
	let organization = null;
	let previewError: string | null = null;
	try {
		invitation = await applicationAdapters.invitations.previewInvitation({
			invitationId,
			tokenHash,
		});
		organization = await applicationAdapters.organizations.getOrganization(
			invitation.organizationId,
		);
	} catch (error) {
		previewError = toPublicAuthError(error).message;
	}

	return (
		<AuthScreen
			description="Review the recipient and organization. Access changes only after the explicit POST action below."
			message={query.message}
			title="Review invitation"
		>
			{invitation ? (
				<>
					<div className="grid gap-3 rounded-lg border border-border bg-surface-subtle p-4">
						<div>
							<Text as="div" tone="muted" variant="caption">
								Organization
							</Text>
							<Text as="div" variant="bodyStrong">
								{organization?.name ?? invitation.organizationId}
							</Text>
						</div>
						<div>
							<Text as="div" tone="muted" variant="caption">
								Recipient
							</Text>
							<Text as="div" variant="bodyStrong">
								{invitation.email}
							</Text>
						</div>
						<div>
							<Text as="div" tone="muted" variant="caption">
								Access
							</Text>
							<Text as="div" className="capitalize" variant="bodyStrong">
								{invitation.role}
							</Text>
						</div>
					</div>
					<StatusMessage tone="info">
						This GET page is intentionally inert so mail scanners cannot accept
						one-time invitations.
					</StatusMessage>
					<form action={acceptInvitationAction} className="grid gap-3">
						<input name="invitation" type="hidden" value={invitationId} />
						<input name="token" type="hidden" value={tokenHash} />
						<input name="next" type="hidden" value={next} />
						<Button className="w-full" type="submit" variant="primary">
							Accept invitation
						</Button>
						<Button className="w-full" href="/login" variant="ghost">
							Return to sign in
						</Button>
					</form>
				</>
			) : (
				<>
					<StatusMessage tone="danger">
						{previewError ?? "This invitation link is incomplete."}
					</StatusMessage>
					<Button className="w-full" href="/login" variant="secondary">
						Return to sign in
					</Button>
				</>
			)}
		</AuthScreen>
	);
}
