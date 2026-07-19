import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import {
	readTemplateIntelligenceAgentMap,
	readTemplateIntelligenceBenchmarkExampleRuns,
	readTemplateIntelligenceBenchmarkRuns,
	readTemplateIntelligenceIndex,
	type TemplateIntelligenceBenchmarkRun,
	type TemplateIntelligenceIndex,
} from "@/lib/template-intelligence";
import { BenchmarkRunToggle } from "./BenchmarkRunToggle";

type SearchParams = Promise<
	Record<string, string | string[] | undefined> | undefined
>;

type BenchmarkStrategySummary = {
	strategy: string;
	runCount: number;
	totalShellCommands: number;
	totalSemanticCalls: number;
	totalLookupActions: number;
	medianLookupActions: number;
	averageCorrectness: number;
};

function getViewParam(
	searchParams: Record<string, string | string[] | undefined> | undefined,
) {
	const value = searchParams?.view;
	const view = Array.isArray(value) ? value[0] : value;

	return view === "benchmarks" ? "benchmarks" : "index";
}

function getExampleParam(
	searchParams: Record<string, string | string[] | undefined> | undefined,
) {
	const value = searchParams?.example;
	const example = Array.isArray(value) ? value[0] : value;

	return example === "on" || example === "true" || example === "1";
}

function getAverage(values: number[]) {
	if (values.length === 0) return 0;
	return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getMedian(values: number[]) {
	if (values.length === 0) return 0;

	const sorted = [...values].sort((a, b) => a - b);
	const middle = Math.floor(sorted.length / 2);

	if (sorted.length % 2 === 1) return sorted[middle] ?? 0;

	return ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2;
}

function formatNumber(value: number) {
	return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function getStrategySummaries(
	runs: TemplateIntelligenceBenchmarkRun[],
): BenchmarkStrategySummary[] {
	const byStrategy = new Map<string, TemplateIntelligenceBenchmarkRun[]>();

	for (const run of runs) {
		const strategyRuns = byStrategy.get(run.strategy) ?? [];
		strategyRuns.push(run);
		byStrategy.set(run.strategy, strategyRuns);
	}

	return [...byStrategy.entries()]
		.map(([strategy, strategyRuns]) => ({
			strategy,
			runCount: strategyRuns.length,
			totalShellCommands: strategyRuns.reduce(
				(sum, run) => sum + run.shellCommands,
				0,
			),
			totalSemanticCalls: strategyRuns.reduce(
				(sum, run) => sum + run.semanticCalls,
				0,
			),
			totalLookupActions: strategyRuns.reduce(
				(sum, run) => sum + run.lookupActions,
				0,
			),
			medianLookupActions: getMedian(
				strategyRuns.map((run) => run.lookupActions),
			),
			averageCorrectness: getAverage(
				strategyRuns.map((run) => run.correctness),
			),
		}))
		.sort((a, b) => a.totalLookupActions - b.totalLookupActions);
}

function BenchmarkBar({
	value,
	max,
	label,
}: {
	value: number;
	max: number;
	label: string;
}) {
	const width = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0;

	return (
		<div className="grid gap-1">
			<div className="flex items-center justify-between gap-3">
				<Text variant="caption">{label}</Text>
				<Text variant="caption" tone="muted">
					{formatNumber(value)}
				</Text>
			</div>
			<div className="h-2 overflow-hidden rounded-full bg-foreground/10">
				<div
					className="h-full rounded-full bg-primary"
					style={{ width: `${width}%` }}
				/>
			</div>
		</div>
	);
}

function MissingIndexState({ path }: { path: string }) {
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

					<Card display="flex" padding="md" gap="md" shadow="none">
						<Text variant="body">
							Run <code>npm run intelligence:generate</code> to create{" "}
							<code>{path}</code>.
						</Text>
					</Card>
				</div>
			</Section>
		</main>
	);
}

function ReadyState({
	index,
	agentMapResult,
}: {
	index: TemplateIntelligenceIndex;
	agentMapResult: Awaited<ReturnType<typeof readTemplateIntelligenceAgentMap>>;
}) {
	return (
		<main>
			<Section padding="hero" maxWidth="wide">
				<div className="mx-auto flex w-full max-w-5xl flex-col gap-10 text-center">
					<header className="mx-auto flex max-w-3xl flex-col gap-3">
						<Text as="h1" variant="headingLg">
							Template Intelligence
						</Text>
						<Text variant="body" tone="muted">
							Generated map of the template surfaces agents and maintainers need
							before changing shared code.
						</Text>
					</header>

					<div className="grid gap-4 md:grid-cols-4">
						<Card display="flex" padding="md" gap="sm" shadow="none">
							<Text variant="caption" tone="muted">
								Files indexed
							</Text>
							<Text as="p" variant="headingMd">
								{index.fileCount}
							</Text>
						</Card>
						<Card display="flex" padding="md" gap="sm" shadow="none">
							<Text variant="caption" tone="muted">
								Concept groups
							</Text>
							<Text as="p" variant="headingMd">
								{index.conceptCount}
							</Text>
						</Card>
						<Card display="flex" padding="md" gap="sm" shadow="none">
							<Text variant="caption" tone="muted">
								Relationships
							</Text>
							<Text as="p" variant="headingMd">
								{index.relationships.length}
							</Text>
						</Card>
						<Card display="flex" padding="md" gap="sm" shadow="none">
							<Text variant="caption" tone="muted">
								Task topics
							</Text>
							<Text as="p" variant="headingMd">
								{agentMapResult.status === "ready"
									? agentMapResult.agentMap.topics.length
									: 0}
							</Text>
						</Card>
					</div>

					<div className="flex justify-center">
						<Button
							href="/internal/intelligence/graph"
							variant="primary"
							size="lg"
						>
							Open intelligence graph
						</Button>
					</div>

					<Card
						display="flex"
						padding="lg"
						gap="md"
						shadow="none"
						className="mx-auto max-w-3xl items-center text-center"
					>
						<Text as="h2" variant="headingSm">
							Benchmark lookup cost
						</Text>
						<Text variant="body" tone="muted">
							Compare Control, TemplateSerena, and Graphify workflows when
							benchmark runs are intentionally recorded.
						</Text>
						<Button
							href="/internal/intelligence?view=benchmarks"
							variant="outline"
							size="md"
							className="mx-auto w-fit"
						>
							View benchmarks
						</Button>
					</Card>
				</div>
			</Section>
		</main>
	);
}

function BenchmarkState({
	runs,
	invalidLineCount,
	isExample,
}: {
	runs: TemplateIntelligenceBenchmarkRun[];
	invalidLineCount: number;
	isExample: boolean;
}) {
	const summaries = getStrategySummaries(runs);
	const maxLookupActions = Math.max(
		1,
		...summaries.map((summary) => summary.totalLookupActions),
	);
	const latestDate = runs
		.map((run) => run.date)
		.sort()
		.at(-1);

	return (
		<main>
			<Section padding="hero" maxWidth="wide">
				<div className="flex flex-col gap-6">
					<header className="flex max-w-4xl flex-col gap-3">
						<div className="flex flex-col gap-2">
							<Text as="h1" variant="headingLg">
								Intelligence Benchmarks
							</Text>
							<Text variant="body" tone="muted">
								Recorded lookup-cost comparisons for Control, TemplateSerena,
								and Graphify agent workflows.
							</Text>
						</div>
						<Button
							href="/internal/intelligence"
							variant="outline"
							size="sm"
							className="w-fit"
						>
							Back to overview
						</Button>
					</header>

					<BenchmarkRunToggle isExample={isExample} />

					{isExample ? (
						<Card display="flex" padding="md" gap="sm" shadow="none">
							<Text variant="bodyStrong">Placeholder data</Text>
							<Text variant="body" tone="muted">
								This view is populated from the example JSONL file for visual
								QA. It is not benchmark history.
							</Text>
						</Card>
					) : null}

					{invalidLineCount > 0 ? (
						<Card display="flex" padding="md" gap="sm" shadow="none">
							<Text variant="bodyStrong">Skipped invalid JSONL lines</Text>
							<Text variant="body" tone="muted">
								{invalidLineCount} malformed benchmark{" "}
								{invalidLineCount === 1 ? "line was" : "lines were"} ignored.
							</Text>
						</Card>
					) : null}

					{runs.length === 0 ? (
						<Card display="flex" padding="md" gap="md" shadow="none">
							<Text as="h2" variant="headingSm">
								No real benchmark runs recorded
							</Text>
							<Text variant="body" tone="muted">
								The active run log intentionally starts empty. Use{" "}
								<code>npm run intelligence:record</code> after an intentional
								benchmark pass, or switch to placeholder data for chart QA.
							</Text>
						</Card>
					) : (
						<>
							<div className="grid gap-4 md:grid-cols-3">
								<Card display="flex" padding="md" gap="sm" shadow="none">
									<Text variant="caption" tone="muted">
										Runs
									</Text>
									<Text as="p" variant="headingMd">
										{runs.length}
									</Text>
								</Card>
								<Card display="flex" padding="md" gap="sm" shadow="none">
									<Text variant="caption" tone="muted">
										Strategies
									</Text>
									<Text as="p" variant="headingMd">
										{summaries.length}
									</Text>
								</Card>
								<Card display="flex" padding="md" gap="sm" shadow="none">
									<Text variant="caption" tone="muted">
										Latest
									</Text>
									<Text as="p" variant="headingMd">
										{latestDate ?? "n/a"}
									</Text>
								</Card>
							</div>

							<div className="grid gap-4 lg:grid-cols-2">
								<Card display="flex" padding="md" gap="md" shadow="none">
									<div className="flex flex-col gap-2">
										<Text as="h2" variant="headingSm">
											Strategy Totals
										</Text>
										<Text variant="body" tone="muted">
											Lookup actions combine shell commands and semantic tool
											calls so strategies share one comparison scale.
										</Text>
									</div>
									<div className="grid gap-3">
										{summaries.map((summary) => (
											<BenchmarkBar
												key={summary.strategy}
												label={`${summary.strategy} (${summary.runCount})`}
												value={summary.totalLookupActions}
												max={maxLookupActions}
											/>
										))}
									</div>
								</Card>

								<Card display="flex" padding="md" gap="md" shadow="none">
									<Text as="h2" variant="headingSm">
										Strategy Details
									</Text>
									<div className="grid gap-2">
										{summaries.map((summary) => (
											<div
												key={summary.strategy}
												className="grid gap-1 rounded-lg bg-foreground/[0.03] p-3"
											>
												<Text variant="bodyStrong">{summary.strategy}</Text>
												<Text variant="caption" tone="muted">
													{summary.totalShellCommands} shell ·{" "}
													{summary.totalSemanticCalls} semantic · median{" "}
													{formatNumber(summary.medianLookupActions)} lookups ·{" "}
													correctness {formatNumber(summary.averageCorrectness)}
													/3
												</Text>
											</div>
										))}
									</div>
								</Card>
							</div>
						</>
					)}
				</div>
			</Section>
		</main>
	);
}

export default async function TemplateIntelligencePage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const resolvedSearchParams = await searchParams;
	const view = getViewParam(resolvedSearchParams);

	if (view === "benchmarks") {
		const isExample = getExampleParam(resolvedSearchParams);
		const result = isExample
			? await readTemplateIntelligenceBenchmarkExampleRuns()
			: await readTemplateIntelligenceBenchmarkRuns();

		return (
			<BenchmarkState
				runs={result.runs}
				invalidLineCount={result.invalidLineCount}
				isExample={isExample}
			/>
		);
	}

	const [indexResult, agentMapResult] = await Promise.all([
		readTemplateIntelligenceIndex(),
		readTemplateIntelligenceAgentMap(),
	]);

	if (indexResult.status === "missing") {
		return <MissingIndexState path={indexResult.path} />;
	}

	return (
		<ReadyState index={indexResult.index} agentMapResult={agentMapResult} />
	);
}
