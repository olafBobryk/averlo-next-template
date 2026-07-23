import type { Metadata, Viewport } from "next";
import "./globals.css";
import { appearanceBootstrapScript } from "@/components/ui/foundations/appearance";
import { inter } from "@/font";
import { createRootMetadata } from "@/lib/metadata";

export const metadata: Metadata = createRootMetadata();

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#18181b" },
	],
};

const motionOverrideBootstrap = `
(() => {
	try {
		const params = new URLSearchParams(window.location.search);
		const isOff = (value) => value === "off" || value === "false";
		const motion = params.get("motion")?.toLowerCase();
		const reveal = params.get("reveal")?.toLowerCase();
		const intro = params.get("intro")?.toLowerCase();
		const loading = params.get("loading")?.toLowerCase();
		const motionDisabled = isOff(motion) || isOff(reveal);
		const loadingDisabled = motionDisabled || isOff(intro) || isOff(loading);

		if (motionDisabled) {
			document.documentElement.dataset.motionOverride = "off";
		} else {
			delete document.documentElement.dataset.motionOverride;
		}

		if (loadingDisabled) {
			document.documentElement.dataset.loadingOverride = "off";
			if (!document.getElementById("loading-screen-override-style")) {
				const style = document.createElement("style");
				style.id = "loading-screen-override-style";
				style.textContent = '[data-loading-screen-mount="true"]{display:none!important;visibility:hidden!important;pointer-events:none!important;}';
				document.head.appendChild(style);
			}
			const removeLoadingMount = () => {
				document
					.querySelectorAll('[data-loading-screen-mount="true"]')
					.forEach((node) => node.remove());
			};
			const observer = new MutationObserver(removeLoadingMount);
			observer.observe(document.documentElement, {
				childList: true,
				subtree: true,
			});
			removeLoadingMount();
			window.addEventListener(
				"DOMContentLoaded",
				() => {
					removeLoadingMount();
					observer.disconnect();
				},
				{ once: true },
			);
		} else {
			delete document.documentElement.dataset.loadingOverride;
		}
	} catch {}
})();
`;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className={inter.variable} lang="en" suppressHydrationWarning>
			<head>
				<script
					id="appearance-bootstrap"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Static bootstrap applies the stored site appearance before visible content renders.
					dangerouslySetInnerHTML={{ __html: appearanceBootstrapScript }}
				/>
				<script
					id="motion-override-bootstrap"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Static bootstrap reads URL flags before hydration so automation screenshots do not capture hidden motion states.
					dangerouslySetInnerHTML={{ __html: motionOverrideBootstrap }}
				/>
			</head>
			<body className="antialiased">{children}</body>
		</html>
	);
}
