import { getSiteLayout } from "@/lib/marketing-content/resolvers";
import { MarketingShell } from "./_components/layout/MarketingShell";
import { MarketingSettingsProvider } from "./_components/providers/MarketingSettingsProvider";

export default async function MarketingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const siteLayout = await getSiteLayout();

	return (
		<MarketingSettingsProvider>
			<MarketingShell siteLayout={siteLayout}>{children}</MarketingShell>
		</MarketingSettingsProvider>
	);
}
