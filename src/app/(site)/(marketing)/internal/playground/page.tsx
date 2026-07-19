import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";

const playgroundGroups = [
	{
		id: "motion",
		title: "Motion",
		description: "Loose prototypes for reveal, scroll, and choreography ideas.",
		links: [
			{
				href: "/internal/playground/toasts",
				title: "Toast Hierarchy",
				description:
					"Typography and indicator comparisons for transient feedback.",
			},
			{
				href: "/internal/playground/motion",
				title: "Motion System QA",
				description:
					"Scoped motion character, timing moments, reveal primitives, and automation checks.",
			},
		],
	},
];

export default function PlaygroundIndexPage() {
	return (
		<main>
			<Section padding="hero">
				<div className="flex flex-col gap-6">
					<header className="flex max-w-3xl flex-col gap-2">
						<Text as="h1" variant="headingLg">
							Playground
						</Text>
						<Text variant="body" tone="muted">
							High-churn route experiments live here before they are structured
							enough for the component demo catalog.
						</Text>
					</header>

					<div className="grid gap-4">
						{playgroundGroups.map((group) => (
							<Card key={group.id} display="flex" padding="md" gap="md">
								<div className="flex flex-col gap-2">
									<Text as="h2" variant="headingSm">
										{group.title}
									</Text>
									<Text variant="body" tone="muted">
										{group.description}
									</Text>
								</div>

								<div className="grid gap-3 md:grid-cols-2">
									{group.links.map((link) => (
										<div
											key={link.href}
											className="flex flex-col gap-3 rounded-lg border border-border/10 bg-surface/50 p-4"
										>
											<div className="flex flex-col gap-1">
												<Text as="h3" variant="headingXs">
													{link.title}
												</Text>
												<Text variant="body" tone="muted">
													{link.description}
												</Text>
											</div>
											<div>
												<Button href={link.href} size="sm" variant="outline">
													Open playground
												</Button>
											</div>
										</div>
									))}
								</div>
							</Card>
						))}
					</div>
				</div>
			</Section>
		</main>
	);
}
