import type { SessionUser } from "@/lib/api/auth";
import type {
	Organization,
	OrganizationMembership,
} from "@/lib/auth/contracts";
import { DashboardAuthProvider } from "./DashboardAuthProvider";
import { DashboardSettingsProvider } from "./DashboardSettingsProvider";

export function DashboardProviders({
	children,
	initialMembership,
	initialMemberships,
	initialOrganization,
	initialUser,
}: {
	children: React.ReactNode;
	initialMembership: OrganizationMembership;
	initialMemberships: readonly OrganizationMembership[];
	initialOrganization: Organization;
	initialUser: SessionUser;
}) {
	return (
		<DashboardSettingsProvider>
			<DashboardAuthProvider
				initialMembership={initialMembership}
				initialMemberships={initialMemberships}
				initialOrganization={initialOrganization}
				initialUser={initialUser}
			>
				{children}
			</DashboardAuthProvider>
		</DashboardSettingsProvider>
	);
}
