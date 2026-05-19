import { Button } from "@/components/ui/primitives/Button";
import Divider from "@/components/ui/primitives/Divider";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import type { AppRouteId } from "@/config/routes";
import { hrefFor } from "@/lib/routes";
import { manifest as spamProtectedFormManifest } from "./forms/spam-protected-form/manifest";
import { manifest as riveLogoRevealManifest } from "./loading-screens/rive-logo-reveal/manifest";

type DictionaryFamily = {
	id: string;
	title: string;
	summary: string;
	entries: {
		manifest: {
			id: string;
			title: string;
			summary: string;
			copyTargets: string[];
		};
		routeId: AppRouteId;
	}[];
};

const families: DictionaryFamily[] = [
	{
		id: "loading-screens",
		title: "Loading Screens",
		summary:
			"Reference patterns for intro overlays that own the app-ready signal and exit cleanly.",
		entries: [
			{
				manifest: riveLogoRevealManifest,
				routeId: "dictionaryRiveLogoReveal",
			},
		],
	},
	{
		id: "forms",
		title: "Forms",
		summary:
			"Reference patterns for public forms that need reusable server-side guardrails.",
		entries: [
			{
				manifest: spamProtectedFormManifest,
				routeId: "dictionarySpamProtectedForm",
			},
		],
	},
];

export default function DictionaryIndexPage() {
	return (
		<Section className="flex flex-col gap-6">
			<header className="flex flex-col gap-2">
				<Text as="h1" variant="headingLg">
					Dictionary
				</Text>
				<Text variant="body" tone="muted">
					Structured source material for reusable patterns. The live template
					remains the source of truth.
				</Text>
			</header>

			<div className="grid gap-4">
				{families.map((family) => (
					<Panel key={family.id} display="flex" padding="md" gap="md">
						<div className="flex flex-col gap-2">
							<Text as="h2" variant="headingSm">
								{family.title}
							</Text>
							<Text variant="body" tone="muted">
								{family.summary}
							</Text>
						</div>
						<Divider />
						<div className="grid gap-4">
							{family.entries.map((entry) => (
								<div key={entry.manifest.id} className="flex flex-col gap-3">
									<div className="flex flex-col gap-1">
										<Text as="h3" variant="headingXs">
											{entry.manifest.title}
										</Text>
										<Text variant="body" tone="muted">
											{entry.manifest.summary}
										</Text>
									</div>
									<div className="flex flex-col gap-1">
										<Text variant="caption" tone="muted">
											Copy targets
										</Text>
										{entry.manifest.copyTargets.map((target) => (
											<Text key={target} variant="caption">
												{target}
											</Text>
										))}
									</div>
									<div className="flex flex-wrap gap-2">
										<Button
											href={hrefFor(entry.routeId)}
											size="sm"
											variant="outline"
										>
											Open entry
										</Button>
									</div>
								</div>
							))}
						</div>
					</Panel>
				))}
			</div>
		</Section>
	);
}
