import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import FormValidationClientMount from "@/components/mount/FormValidationClientMount";
import LoadingScreenMount from "@/components/mount/LoadingScreenMount";
import ModalClientMount from "@/components/mount/ModalClientMount";
import ScrollController from "@/components/mount/ScrollController";
import ToastClientMount from "@/components/mount/ToastClientMount";
import { SettingsProvider } from "@/components/ui/foundations/settingsContext";
import { IconProvider } from "@/components/ui/icons/iconRegistry";
import { phosphorIconRegistry } from "@/components/ui/icons/phosphorRegistry";

export default function MarketingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SettingsProvider>
			<IconProvider registry={phosphorIconRegistry}>
				<Header />

				{children}
				<Footer />
				<FormValidationClientMount />
				<LoadingScreenMount />
				<ModalClientMount />
				<ToastClientMount />
				<ScrollController />
			</IconProvider>
		</SettingsProvider>
	);
}
