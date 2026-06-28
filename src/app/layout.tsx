import type { Metadata, Viewport } from "next";
import "./globals.css";
import { KEYWORDS } from "@/config/metadataConfig";
import { roboto } from "@/font";

export const metadata: Metadata = {
	title: "Averlo Next Template",
	description:
		"An agent-ready Next.js template for lightweight design-system scaffolds.",
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
			<body className={`${roboto.variable} antialiased`}>{children}</body>
		</html>
	);
}
