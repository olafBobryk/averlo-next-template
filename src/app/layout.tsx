import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inter } from "@/font";
import { createRootMetadata } from "@/lib/metadata";

export const metadata: Metadata = createRootMetadata();

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#18181b" },
	],
};

const motionOverrideBootstrap =
	'try{var p=new URLSearchParams(window.location.search);var m=(p.get("motion")||"").toLowerCase();var r=(p.get("reveal")||"").toLowerCase();var i=(p.get("intro")||"").toLowerCase();var l=(p.get("loading")||"").toLowerCase();var motionOff=m==="off"||m==="false"||r==="off"||r==="false";var loadingOff=motionOff||i==="off"||i==="false"||l==="off"||l==="false";if(motionOff){document.documentElement.setAttribute("data-motion-override","off");}if(loadingOff){document.documentElement.setAttribute("data-loading-override","off");}}catch(e){}';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className={inter.variable} lang="en">
			<head>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Static bootstrap reads URL flags before hydration so automation screenshots do not capture hidden motion states.
					dangerouslySetInnerHTML={{ __html: motionOverrideBootstrap }}
				/>
			</head>
			<body className="antialiased">{children}</body>
		</html>
	);
}
