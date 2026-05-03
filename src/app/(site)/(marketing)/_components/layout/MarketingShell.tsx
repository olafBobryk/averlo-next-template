import ScrollController from "@/components/mount/ScrollController";
import { RevealRoot } from "@/components/ui/motion/Reveal";
import Footer from "./Footer";
import Header from "./Header";

export function MarketingShell({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />
			<RevealRoot>{children}</RevealRoot>
			<Footer />
			<ScrollController />
		</>
	);
}
