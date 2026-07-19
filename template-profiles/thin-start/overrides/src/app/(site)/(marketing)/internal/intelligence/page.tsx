import { Button } from "@/components/ui/primitives/Button";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import {
	readTemplateIntelligenceAgentMap,
	readTemplateIntelligenceBenchmarkRuns,
	readTemplateIntelligenceIndex,
} from "@/lib/template-intelligence";
import { InternalCard } from "./_components/InternalCard";
import { BenchmarkRunToggle } from "./BenchmarkRunToggle";

type SearchParams = Promise<
	Record<string, string | string[] | undefined> | undefined
>;

function getViewParam(
	searchParams: Record<string, string | string[] | undefined> | undefined,
) {
	const value = searchParams?.view;
	const view = Array.isArray(value) ? value[0] : value;

	return view === "benchmarks" ? "benchmarks" : "index";
}

export default async function TemplateIntelligencePage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const resolvedSearchParams = await searchParams;
	const view = getViewParam(resolvedSearchParams);

	if (view === "benchmarks") {
		const result = await readTemplateIntelligenceBenchmarkRuns();

		return (
			<main>
				<Section padding="hero">
					<div className="mx-auto grid max-w-section-max gap-6">
						<header className="grid gap-3">
							<Text as="h1" variant="heading">
								Template Intelligence Benchmarks
							</Text>
							<Text tone="muted">
								Minimal route-owned benchmark summary for thin-start.
							</Text>
						</header>
						<div className="flex gap-3">
							<Button href="/internal/intelligence" variant="ghost">
								Overview
							</Button>
							<BenchmarkRunToggle isExample={false} />
						</div>
						<InternalCard>
							<Text as="h2" variant="heading" className="text-xl">
								{result.runs.length} recorded runs
							</Text>
							<Text tone="muted">
								{result.invalidLineCount} invalid benchmark lines skipped.
							</Text>
						</InternalCard>
					</div>
				</Section>
			</main>
		);
	}

	const [indexResult, agentMapResult] = await Promise.all([
		readTemplateIntelligenceIndex(),
		readTemplateIntelligenceAgentMap(),
	]);

	return (
		<main>
			<Section padding="hero">
				<div className="mx-auto grid max-w-section-max gap-6">
					<header className="grid gap-3">
						<Text as="h1" variant="heading">
							Template Intelligence
						</Text>
						<Text tone="muted">
							Minimal route-owned intelligence summary for thin-start.
						</Text>
					</header>
					<div className="flex gap-3">
						<Button href="/internal/intelligence/graph" variant="ghost">
							Graph summary
						</Button>
						<Button
							href="/internal/intelligence?view=benchmarks"
							variant="ghost"
						>
							Benchmarks
						</Button>
					</div>
					<div className="grid gap-4 md:grid-cols-3">
						<InternalCard>
							<Text variant="support" tone="muted">
								Index
							</Text>
							<Text as="p" variant="heading" className="text-2xl">
								{indexResult.status}
							</Text>
						</InternalCard>
						<InternalCard>
							<Text variant="support" tone="muted">
								Files
							</Text>
							<Text as="p" variant="heading" className="text-2xl">
								{indexResult.status === "ready"
									? indexResult.index.files.length
									: 0}
							</Text>
						</InternalCard>
						<InternalCard>
							<Text variant="support" tone="muted">
								Agent map
							</Text>
							<Text as="p" variant="heading" className="text-2xl">
								{agentMapResult.status}
							</Text>
						</InternalCard>
					</div>
				</div>
			</Section>
		</main>
	);
}
