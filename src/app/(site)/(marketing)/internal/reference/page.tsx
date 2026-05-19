import { Button } from "@/components/ui/primitives/Button";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";

const REFERENCE_LINKS = [
	{
		title: "Real Favicon Generator",
		summary:
			"Generate a favicon set, pinned assets, and manifest files before copying the final outputs into `public/`.",
		href: "https://realfavicongenerator.net/",
	},
];

export default function ReferencePage() {
	return (
		<main>
			<Section padding={"hero"}>
				<div className="flex flex-col gap-6">
					<header className="flex flex-col gap-2">
						<Text as="h1" variant="headingLg">
							Reference
						</Text>
						<Text variant="body" tone="muted">
							Repo-level utility links and operational notes belong here, not in
							the dictionary.
						</Text>
					</header>

					<div className="grid gap-4">
						{REFERENCE_LINKS.map((link) => (
							<Panel key={link.href} display="flex" padding="md" gap="sm">
								<Text as="h2" variant="headingSm">
									{link.title}
								</Text>
								<Text variant="body" tone="muted">
									{link.summary}
								</Text>
								<div className="flex flex-wrap gap-2">
									<Button
										href={link.href}
										size="sm"
										variant="outline"
										target="_blank"
										rel="noreferrer"
									>
										Open link
									</Button>
								</div>
							</Panel>
						))}
					</div>
				</div>
			</Section>
		</main>
	);
}
