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
	initialOrganization,
	initialUser,
}: {
	children: React.ReactNode;
	initialMembership: OrganizationMembership;
	initialOrganization: Organization;
	initialUser: SessionUser;
}) {
	return (
		<DashboardSettingsProvider>
			<DashboardAuthProvider
				initialMembership={initialMembership}
				initialOrganization={initialOrganization}
				initialUser={initialUser}
			>
				{children}
			</DashboardAuthProvider>
		</DashboardSettingsProvider>
	);
}
