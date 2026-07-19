import { Button } from "@/components/ui/primitives/Button";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import {
	readTemplateIntelligenceAgentMap,
	readTemplateIntelligenceIndex,
} from "@/lib/template-intelligence";
import { buildTemplateIntelligenceGraphs } from "@/lib/template-intelligence/graphs";
import { TemplateIntelligenceGraph } from "../TemplateIntelligenceGraph";

export default async function TemplateIntelligenceGraphPage() {
	const [indexResult, agentMapResult] = await Promise.all([
		readTemplateIntelligenceIndex(),
		readTemplateIntelligenceAgentMap(),
	]);

	if (indexResult.status !== "ready") {
		return (
			<main>
				<Section padding="hero">
					<div className="mx-auto grid max-w-section-max gap-4">
						<Text as="h1" variant="heading">
							Template Intelligence
						</Text>
						<Text tone="muted">Run npm run intelligence:generate first.</Text>
						<Button href="/internal/intelligence" variant="ghost">
							Back
						</Button>
					</div>
				</Section>
			</main>
		);
	}

	const graphs = buildTemplateIntelligenceGraphs({
		index: indexResult.index,
		agentMap:
			agentMapResult.status === "ready" ? agentMapResult.agentMap : null,
	});

	return (
		<main>
			<Section padding="hero">
				<div className="mx-auto grid max-w-section-max gap-6">
					<header className="grid gap-3">
						<Text as="h1" variant="heading">
							Graph Summary
						</Text>
						<Text tone="muted">
							Route-owned summary of generated intelligence graphs.
						</Text>
					</header>
					<TemplateIntelligenceGraph graphs={graphs} />
				</div>
			</Section>
		</main>
	);
}
