import ScrollController from "@/components/mount/ScrollController";
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
			{children}
			<Footer />
			<ScrollController />
		</>
	);
}
