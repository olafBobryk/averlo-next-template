import FormValidationClientMount from "@/components/mount/FormValidationClientMount";
import LoadingScreenMount from "@/components/mount/LoadingScreenMount";
import ModalClientMount from "@/components/mount/ModalClientMount";
import ToastClientMount from "@/components/mount/ToastClientMount";
import { MotionProvider } from "@/components/ui/foundations/MotionProvider";
import { SettingsProvider } from "@/components/ui/foundations/settingsContext";
import { IconProvider } from "@/components/ui/icons/iconRegistry";
import { phosphorIconRegistry } from "@/components/ui/icons/phosphorRegistry";

const motionOverrideScript = `
(() => {
	try {
		const params = new URLSearchParams(window.location.search);
		const isOff = (value) => value === "off" || value === "false";
		const motion = params.get("motion")?.toLowerCase();
		const reveal = params.get("reveal")?.toLowerCase();

		if (isOff(motion) || isOff(reveal)) {
			document.documentElement.dataset.motionOverride = "off";
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
			delete document.documentElement.dataset.motionOverride;
		}
	} catch {}
})();
`;

export default function SiteLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SettingsProvider>
			<MotionProvider expressive={0}>
				<IconProvider registry={phosphorIconRegistry}>
					<script
						// Runs before the loading mount appears so automation URLs never see it.
						// biome-ignore lint/security/noDangerouslySetInnerHtml: Static bootstrap script reads URL params before hydration.
						dangerouslySetInnerHTML={{ __html: motionOverrideScript }}
					/>
					{children}
					<FormValidationClientMount />
					<LoadingScreenMount />
					<ModalClientMount />
					<ToastClientMount />
				</IconProvider>
			</MotionProvider>
		</SettingsProvider>
	);
}
