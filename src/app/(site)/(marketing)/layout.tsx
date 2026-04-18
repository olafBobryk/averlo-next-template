import { MarketingShell } from "./_components/layout/MarketingShell";

export default function MarketingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <MarketingShell>{children}</MarketingShell>;
}
