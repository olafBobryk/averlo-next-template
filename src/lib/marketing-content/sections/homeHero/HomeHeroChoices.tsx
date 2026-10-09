import { Card } from "@/components/ui/primitives/surfaces";
import { Text } from "@/components/ui/primitives/Text";
import type { HomeHeroServiceItem } from "../../types";

export function HomeHeroChoices({
	services,
	skeleton = false,
	kind,
}: {
	services: HomeHeroServiceItem[];
	skeleton?: boolean;
	kind: "skills" | "installation";
}) {
	const skills = services.some((service) =>
		service.surfaceIds.includes("skillsPack"),
	);
	const installation = services.some((service) =>
		service.surfaceIds.some((id) =>
			["assembly", "thinStart", "fullStart"].includes(id),
		),
	);
	const Copy = skeleton ? Text.Skeleton : Text;
	return (
		<div className="w-full" data-hero-choices="">
			{skills && kind === "skills" && (
				<Card padding="sm" className="grid gap-4" data-service-id="skills-pack">
					<Copy as="h2" variant="headingSm">
						Skills pack
					</Copy>
					<ul className="grid gap-2">
						{[
							"Create project",
							"Compose",
							"Visual parity",
							"Systemize",
							"Animate",
						].map((skill) => (
							<li key={skill}>
								<Copy as="span" variant="support" tone="muted">
									{skill}
								</Copy>
							</li>
						))}
					</ul>
				</Card>
			)}
			{installation && kind === "installation" && (
				<Card
					padding="sm"
					className="grid gap-4"
					data-service-id="starting-point"
				>
					<Copy as="h2" variant="headingSm">
						Starting point
					</Copy>
					<Copy as="p" variant="support" tone="muted">
						Custom installation
					</Copy>
				</Card>
			)}
		</div>
	);
}
