import { getSiteLayout } from "@/lib/marketing-content/resolvers";
import { MarketingShell } from "./_components/layout/MarketingShell";

export default async function MarketingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const siteLayout = await getSiteLayout();

	return <MarketingShell siteLayout={siteLayout}>{children}</MarketingShell>;
}
