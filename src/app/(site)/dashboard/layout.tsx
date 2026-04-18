import { DashboardFrame } from "./_components/layout/DashboardFrame";
import { DashboardAuthGate } from "./_components/providers/DashboardAuthProvider";
import { DashboardProviders } from "./_components/providers/DashboardProviders";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<DashboardProviders>
			<DashboardFrame>
				<DashboardAuthGate>{children}</DashboardAuthGate>
			</DashboardFrame>
		</DashboardProviders>
	);
}
