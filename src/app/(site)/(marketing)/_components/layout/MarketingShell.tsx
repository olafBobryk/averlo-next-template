import ScrollController from "@/components/mount/ScrollController";
import { Reveal } from "@/components/ui/motion";
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
			<Reveal.Root>{children}</Reveal.Root>
			<Footer layout={siteLayout.footer} />
			<ScrollController />
		</>
	);
}
