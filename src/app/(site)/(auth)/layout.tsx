import { AuthAppearance } from "./_components/AuthAppearance";
import { AuthShell } from "./_components/AuthShell";

export default function SiteAuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<AuthAppearance />
			<AuthShell>{children}</AuthShell>
		</>
	);
}
