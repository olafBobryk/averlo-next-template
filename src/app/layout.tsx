import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import LoadingScreenMount from "@/components/mount/LoadingScreenMount";
import ModalClientMount from "@/components/mount/ModalClientMount";
import ScrollController from "@/components/mount/ScrollController";
import ToastClientMount from "@/components/mount/ToastClientMount";
import { SettingsProvider } from "@/components/ui/foundations/settingsContext";
import { IconProvider } from "@/components/ui/icons/iconRegistry";
import { phosphorIconRegistry } from "@/components/ui/icons/phosphorRegistry";
import { KEYWORDS } from "@/config/metadataConfig";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

//Generate related files: https://favicon.io/favicon-converter/

export const metadata: Metadata = {
	title: "WebVizion Template",
	description: "A template to make things easier to setup",
	keywords: KEYWORDS,
	icons: {
		icon: "/favicon-32x32.png",
		shortcut: "/favicon.ico",
		apple: "/apple-touch-icon.png",
	},
	manifest: "/site.webmanifest",
	robots: {
		index: true,
		follow: true,
	},
};

export const viewport: Viewport = {
	themeColor: "#0f172a",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} antialiased`}>
				<SettingsProvider>
					<IconProvider registry={phosphorIconRegistry}>
						<Header />

						{children}
						<Footer />
						<LoadingScreenMount />
						{/* TODO: Swap mount order or placement if a project needs overlays elsewhere. */}
						<ModalClientMount />
						<ToastClientMount />
						<ScrollController />
					</IconProvider>
				</SettingsProvider>
			</body>
		</html>
	);
}
