import { MarketingShell } from "./_components/layout/MarketingShell";
import { MarketingSettingsProvider } from "./_components/providers/MarketingSettingsProvider";

export default function MarketingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<MarketingSettingsProvider>
			<MarketingShell>{children}</MarketingShell>
		</MarketingSettingsProvider>
	);
}
