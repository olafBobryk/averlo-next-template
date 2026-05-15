import ScrollController from "@/components/mount/ScrollController";
import { RevealRoot } from "@/components/ui/motion/Reveal";
import type { SiteLayoutDocument } from "@/lib/marketing-content/types";
import Footer from "./Footer";
import Header from "./Header";

export function MarketingShell({
	children,
	siteLayout,
}: Readonly<{
	children: React.ReactNode;
	siteLayout: SiteLayoutDocument;
}>) {
	return (
		<>
			<Header layout={siteLayout.header} />
			<RevealRoot>{children}</RevealRoot>
			<Footer layout={siteLayout.footer} />
			<ScrollController />
		</>
	);
}
