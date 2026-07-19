import type { TemplateIntelligenceGraphView } from "@/lib/template-intelligence";
import { InternalCard } from "./_components/InternalCard";

export function TemplateIntelligenceGraph({
	graphs,
}: {
	graphs: TemplateIntelligenceGraphView[];
}) {
	return (
		<div className="grid gap-4">
			{graphs.map((graph) => (
				<InternalCard key={graph.id}>
					<h2 className="text-lg font-semibold">{graph.title}</h2>
					<p className="mt-2 text-sm text-muted">
						{graph.nodes.length} nodes, {graph.links.length} links
					</p>
				</InternalCard>
			))}
		</div>
	);
}
