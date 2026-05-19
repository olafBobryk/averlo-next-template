import { Button } from "@/components/ui/primitives/Button";
import Divider from "@/components/ui/primitives/Divider";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import { hrefFor } from "@/lib/routes";
import { LoadingScreenPreview } from "./LoadingScreenPreview";
import { manifest } from "./manifest";

export default function RiveLogoRevealDictionaryPage() {
	return (
		<Section innerClassName="flex flex-col gap-6">
			<header className="flex flex-col gap-2">
				<Text as="h1" variant="headingLg">
					{manifest.title}
				</Text>
				<Text variant="body" tone="muted">
					{manifest.summary}
				</Text>
			</header>

			<Panel display="flex" padding="md" gap="md">
				<Text as="h2" variant="headingSm">
					Preview
				</Text>
				<Text variant="body" tone="muted">
					This entry keeps the root-mount contract intact while leaving the
					actual `.riv` runtime swap as a later integration step.
				</Text>
				<LoadingScreenPreview />
			</Panel>

			<Panel display="flex" padding="md" gap="md">
				<Text as="h2" variant="headingSm">
					Adaptation points
				</Text>
				<div className="flex flex-wrap gap-2">
					{manifest.adaptationPoints.map((point) => (
						<Text
							key={point}
							variant="caption"
							className="rounded-full border border-border/15 px-3 py-1"
						>
							{point}
						</Text>
					))}
				</div>
				<Divider />
				<Text as="h3" variant="headingXs">
					Notes
				</Text>
				<div className="flex flex-col gap-2">
					{manifest.notes.map((note) => (
						<Text key={note} variant="body" tone="muted">
							{note}
						</Text>
					))}
				</div>
				<Divider />
				<div className="flex flex-wrap gap-2">
					<Button href={hrefFor("dictionary")} size="sm" variant="outline">
						Back to dictionary
					</Button>
				</div>
			</Panel>
		</Section>
	);
}
