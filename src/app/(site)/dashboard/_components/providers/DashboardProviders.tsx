import { DashboardAuthProvider } from "./DashboardAuthProvider";
import { DashboardSettingsProvider } from "./DashboardSettingsProvider";

export function DashboardProviders({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<DashboardSettingsProvider>
			<DashboardAuthProvider>{children}</DashboardAuthProvider>
		</DashboardSettingsProvider>
	);
}
