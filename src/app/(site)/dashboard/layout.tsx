import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
	getSafeContinuationPath,
	withSafeContinuation,
} from "@/lib/auth/continuation";
import { resolveCurrentSession } from "@/lib/auth/server";
import { DashboardFrame } from "./_components/layout/DashboardFrame";
import { DashboardProviders } from "./_components/providers/DashboardProviders";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const requestPath = getSafeContinuationPath(
		(await headers()).get("x-template-request-path"),
		"/dashboard",
	);
	const resolution = await resolveCurrentSession();
	if (resolution.status === "anonymous") {
		redirect(withSafeContinuation("/login", requestPath));
	}
	if (resolution.status === "organization-selection-required") {
		redirect(withSafeContinuation("/select-organization", requestPath));
	}
	if (resolution.status === "membership-required") {
		redirect(
			`/login?next=${encodeURIComponent(requestPath)}&message=membership-required`,
		);
	}

	const initialUser = {
		id: resolution.user.id,
		name: resolution.user.name,
		email: resolution.user.email,
		role: resolution.membership.role,
		isBanned: resolution.user.isBanned,
		profilePictureUrl: resolution.user.profilePictureUrl,
	};

	return (
		<DashboardProviders
			initialMembership={resolution.membership}
			initialMemberships={resolution.memberships}
			initialOrganization={resolution.organization}
			initialUser={initialUser}
		>
			<DashboardFrame>{children}</DashboardFrame>
		</DashboardProviders>
	);
}
