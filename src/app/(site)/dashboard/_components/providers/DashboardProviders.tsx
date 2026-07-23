import type { SessionUser } from "@/lib/api/auth";
import type {
	Organization,
	OrganizationMembership,
} from "@/lib/auth/contracts";
import type { DashboardSettingsSnapshot } from "../../settings/_components/settingsSnapshot";
import {
	DashboardAuthProvider,
	type DashboardOrganizationChoice,
} from "./DashboardAuthProvider";
import { DashboardSettingsProvider } from "./DashboardSettingsProvider";

export function DashboardProviders({
	children,
	initialMembership,
	initialMemberships,
	initialOrganization,
	initialOrganizationChoices,
	initialUser,
	settingsSnapshot,
}: {
	children: React.ReactNode;
	initialMembership: OrganizationMembership;
	initialMemberships: readonly OrganizationMembership[];
	initialOrganization: Organization;
	initialOrganizationChoices: readonly DashboardOrganizationChoice[];
	initialUser: SessionUser;
	settingsSnapshot: DashboardSettingsSnapshot;
}) {
	return (
		<DashboardSettingsProvider settingsSnapshot={settingsSnapshot}>
			<DashboardAuthProvider
				initialMembership={initialMembership}
				initialMemberships={initialMemberships}
				initialOrganization={initialOrganization}
				initialOrganizationChoices={initialOrganizationChoices}
				initialUser={initialUser}
			>
				{children}
			</DashboardAuthProvider>
		</DashboardSettingsProvider>
	);
}
