import type { Metadata, Viewport } from "next";
import "./globals.css";
import { appearanceBootstrapScript } from "@/components/ui/foundations/appearance";
import { inter } from "@/font";
import { LOADING_SCREEN_SESSION_LANGUAGE_KEY } from "@/lib/loadingScreenLifecycle";
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
		const introSessionLanguageKey = ${JSON.stringify(LOADING_SCREEN_SESSION_LANGUAGE_KEY)};

		if (motionDisabled) {
			document.documentElement.dataset.motionOverride = "off";
		} else {
			delete document.documentElement.dataset.motionOverride;
		}

		if (loadingDisabled) {
			document.documentElement.dataset.loadingOverride = "off";
			delete document.documentElement.dataset.loadingBootstrap;
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
			const language = document.documentElement.lang || "und";
			const previousLanguage = window.sessionStorage.getItem(introSessionLanguageKey);
			const navigation = performance.getEntriesByType("navigation")[0];
			const navigationType = navigation && "type" in navigation ? navigation.type : undefined;
			window.sessionStorage.setItem(introSessionLanguageKey, language);
			if (
				previousLanguage === null ||
				previousLanguage !== language ||
				navigationType === "reload"
			) {
				document.documentElement.dataset.loadingBootstrap = "true";
			} else {
				delete document.documentElement.dataset.loadingBootstrap;
			}
		}
	} catch {}
})();
`;

const loadingBootstrapStyle = `
	html[data-loading-bootstrap="true"],
	html[data-loading-bootstrap="true"] body {
		background: var(--background, #fff);
	}

	#loading-bootstrap-cover {
		position: fixed;
		z-index: 2147483647;
		inset: 0;
		display: none;
		height: 100vh;
		height: 100dvh;
		background: var(--background, #fff);
		pointer-events: none;
	}

	html[data-loading-bootstrap="true"] #loading-bootstrap-cover {
		display: block;
	}
`;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className={inter.variable} lang="en" suppressHydrationWarning>
			<head>
				<style>{loadingBootstrapStyle}</style>
				<script
					id="appearance-bootstrap"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Static bootstrap applies the stored site appearance before visible content renders.
					dangerouslySetInnerHTML={{ __html: appearanceBootstrapScript }}
				/>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: This parser-executed static bootstrap must claim the cover before body content is parsed.
					dangerouslySetInnerHTML={{ __html: motionOverrideBootstrap }}
				/>
			</head>
			<body className="antialiased">
				<div aria-hidden="true" id="loading-bootstrap-cover" />
				{children}
			</body>
		</html>
	);
}
