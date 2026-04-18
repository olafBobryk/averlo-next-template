import { DashboardAuthProvider } from "./DashboardAuthProvider";

export function DashboardProviders({
	children,
}: {
	children: React.ReactNode;
}) {
	return <DashboardAuthProvider>{children}</DashboardAuthProvider>;
}
