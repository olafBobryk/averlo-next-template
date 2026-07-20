import { Button } from "@/components/ui/primitives/Button";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import {
	readTemplateIntelligenceAgentMap,
	readTemplateIntelligenceIndex,
} from "@/lib/template-intelligence";
import { buildTemplateIntelligenceGraphs } from "@/lib/template-intelligence/graphs";
import { TemplateIntelligenceGraph } from "../TemplateIntelligenceGraph";

function MissingGraphIndexState({ path }: { path: string }) {
	return (
		<main>
			<Section padding="hero">
				<div className="flex max-w-3xl flex-col gap-6">
					<header className="flex flex-col gap-2">
						<Text as="h1" variant="headingLg">
							Template Intelligence
						</Text>
						<Text variant="body" tone="muted">
							The generated repo intelligence index is not available yet.
						</Text>
					</header>

					<div className="grid gap-4">
						<Text variant="body">
							Run <code>npm run intelligence:generate</code> to create{" "}
							<code>{path}</code>.
						</Text>
						<Button
							href="/internal/intelligence"
							variant="secondary"
							size="sm"
							className="w-fit"
						>
							Back to overview
						</Button>
					</div>
				</div>
			</Section>
		</main>
	);
}

export default async function TemplateIntelligenceGraphPage() {
	const [indexResult, agentMapResult] = await Promise.all([
		readTemplateIntelligenceIndex(),
		readTemplateIntelligenceAgentMap(),
	]);

	if (indexResult.status === "missing") {
		return <MissingGraphIndexState path={indexResult.path} />;
	}

	const graphs = buildTemplateIntelligenceGraphs({
		index: indexResult.index,
		agentMap:
			agentMapResult.status === "ready" ? agentMapResult.agentMap : null,
	});

	return <TemplateIntelligenceGraph graphs={graphs} />;
}
