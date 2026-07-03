import { AuthShell } from "./_components/AuthShell";

export default function SiteAuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <AuthShell>{children}</AuthShell>;
}
