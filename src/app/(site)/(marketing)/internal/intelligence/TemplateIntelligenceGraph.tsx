"use client";

import { GraphMap } from "@/components/ui/misc/GraphMap";
import type {
	TemplateIntelligenceGraphView,
	TemplateIntelligenceGraphViewId,
} from "@/lib/template-intelligence";

export function TemplateIntelligenceGraph({
	graphs,
}: {
	graphs: TemplateIntelligenceGraphView[];
}) {
	return (
		<GraphMap<TemplateIntelligenceGraphViewId>
			graphs={graphs}
			ariaLabel="Template intelligence graph"
			backHref="/internal/intelligence"
		/>
	);
}
