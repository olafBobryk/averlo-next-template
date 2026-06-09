import FormValidationClientMount from "@/components/mount/FormValidationClientMount";
import LoadingScreenMount from "@/components/mount/LoadingScreenMount";
import ModalClientMount from "@/components/mount/ModalClientMount";
import ToastClientMount from "@/components/mount/ToastClientMount";
import { MotionProvider } from "@/components/ui/foundations/MotionProvider";
import { SettingsProvider } from "@/components/ui/foundations/settingsContext";

export default function SiteLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SettingsProvider>
			<MotionProvider expressive={0}>
				{children}
				<FormValidationClientMount />
				<LoadingScreenMount />
				<ModalClientMount />
				<ToastClientMount />
			</MotionProvider>
		</SettingsProvider>
	);
}
