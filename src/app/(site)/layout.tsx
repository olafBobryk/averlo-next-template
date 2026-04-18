import FormValidationClientMount from "@/components/mount/FormValidationClientMount";
import LoadingScreenMount from "@/components/mount/LoadingScreenMount";
import ModalClientMount from "@/components/mount/ModalClientMount";
import ToastClientMount from "@/components/mount/ToastClientMount";
import { SettingsProvider } from "@/components/ui/foundations/settingsContext";
import { IconProvider } from "@/components/ui/icons/iconRegistry";
import { phosphorIconRegistry } from "@/components/ui/icons/phosphorRegistry";

export default function SiteLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SettingsProvider>
			<IconProvider registry={phosphorIconRegistry}>
				{children}
				<FormValidationClientMount />
				<LoadingScreenMount />
				<ModalClientMount />
				<ToastClientMount />
			</IconProvider>
		</SettingsProvider>
	);
}
