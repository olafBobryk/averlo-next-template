import Logo from "@/components/branding/Logo";
import { Button } from "@/components/ui/primitives/Button";
import { Heading } from "@/components/ui/primitives/Heading";
import { Text } from "@/components/ui/primitives/Text";

export default function Page() {
	return (
		<main className="h-screen">
			<section className="h-full">
				<div className="max flex flex-col items-center h-full justify-center gap-2">
					<Logo size="md" />
					<Heading as="h1" size="xl">
						Page not found
					</Heading>
					<Text variant="muted">
						The page you’re looking for doesn’t exist.
					</Text>
					<Button variant="primary" href="/">
						Go Home
					</Button>
				</div>
			</section>
		</main>
	);
}
