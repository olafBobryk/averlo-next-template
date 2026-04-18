import { Section } from "@/components/ui/primitives/Section";

export function AuthShell({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="min-h-screen bg-background">
			<Section
				padding="default"
				height="hero"
				maxWidth="narrow"
				innerClassName="justify-center"
			>
				{children}
			</Section>
		</main>
	);
}
