import Logo from "@/components/branding/Logo";
import { Section } from "@/components/ui/primitives/Section";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";

export default function Page() {
	return (
		<main className="h-screen">
			<Section className="h-full" innerClassName="h-full" align={"center"}>
				<div className="max flex flex-col items-center h-full justify-center gap-2">
					<Logo size="md" />
					<Text as="h1" variant="headingXl">
						Page not found
					</Text>
					<Text variant="body" tone="muted">
						The page you’re looking for doesn’t exist.
					</Text>
					<Button variant="primary" href="/">
						Go Home
					</Button>
				</div>
			</Section>
		</main>
	);
}
