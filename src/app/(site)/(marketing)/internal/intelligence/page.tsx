import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import { StatusMessage } from "@/components/ui/primitives/StatusMessage";
import { Text } from "@/components/ui/primitives/Text";
import {
	readTemplateIntelligenceAgentMap,
	readTemplateIntelligenceBenchmarkExampleRuns,
	readTemplateIntelligenceBenchmarkRuns,
	readTemplateIntelligenceIndex,
	type TemplateIntelligenceBenchmarkRun,
	type TemplateIntelligenceIndex,
} from "@/lib/template-intelligence";
import { InternalPage, InternalPageHeader } from "../_components/InternalPage";
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
		<InternalPage>
			<InternalPageHeader
				title="Template Intelligence"
				description="The generated repository index is not available yet."
			/>

			<Card>
				<Card.Content>
					<Text variant="body">
						Run <code>npm run intelligence:generate</code> to create{" "}
						<code>{path}</code>.
					</Text>
				</Card.Content>
			</Card>
		</InternalPage>
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
		<InternalPage
			maxWidth="wide"
			className="mx-auto max-w-5xl gap-8 text-center"
		>
			<InternalPageHeader
				className="mx-auto items-center"
				title="Template Intelligence"
				description="Generated map of the template surfaces to inspect before changing shared code."
			/>

			<div className="grid w-full gap-4 md:grid-cols-4">
				<Card size="sm">
					<Card.Content className="grid gap-1">
						<Text variant="caption" tone="muted">
							Files indexed
						</Text>
						<Text as="p" variant="headingMd">
							{index.fileCount}
						</Text>
					</Card.Content>
				</Card>
				<Card size="sm">
					<Card.Content className="grid gap-1">
						<Text variant="caption" tone="muted">
							Concept groups
						</Text>
						<Text as="p" variant="headingMd">
							{index.conceptCount}
						</Text>
					</Card.Content>
				</Card>
				<Card size="sm">
					<Card.Content className="grid gap-1">
						<Text variant="caption" tone="muted">
							Relationships
						</Text>
						<Text as="p" variant="headingMd">
							{index.relationships.length}
						</Text>
					</Card.Content>
				</Card>
				<Card size="sm">
					<Card.Content className="grid gap-1">
						<Text variant="caption" tone="muted">
							Task topics
						</Text>
						<Text as="p" variant="headingMd">
							{agentMapResult.status === "ready"
								? agentMapResult.agentMap.topics.length
								: 0}
						</Text>
					</Card.Content>
				</Card>
			</div>

			<Card className="mx-auto max-w-3xl text-center">
				<Card.Header className="border-b">
					<Card.Title>Benchmark lookup cost</Card.Title>
					<Card.Description>
						Compare Control, TemplateSerena, and Graphify workflows when
						benchmark runs are intentionally recorded.
					</Card.Description>
				</Card.Header>
				<Card.Content className="flex justify-center">
					<Button
						href="/internal/intelligence?view=benchmarks"
						variant="secondary"
						size="md"
						className="mx-auto w-fit"
					>
						View benchmarks
					</Button>
				</Card.Content>
			</Card>
		</InternalPage>
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
		<InternalPage maxWidth="wide" className="mx-auto max-w-5xl">
			<InternalPageHeader
				title="Intelligence Benchmarks"
				description="Recorded lookup-cost comparisons across repository navigation strategies."
				action={
					<Button
						href="/internal/intelligence"
						variant="ghost"
						size="sm"
						className="w-fit"
					>
						Back to overview
					</Button>
				}
			/>

			<BenchmarkRunToggle isExample={isExample} />

			{isExample ? (
				<StatusMessage>
					Placeholder data is shown for visual QA, not benchmark history.
				</StatusMessage>
			) : null}

			{invalidLineCount > 0 ? (
				<StatusMessage tone="warning">
					{invalidLineCount} malformed benchmark{" "}
					{invalidLineCount === 1 ? "line was" : "lines were"} ignored.
				</StatusMessage>
			) : null}

			{runs.length === 0 ? (
				<Card>
					<Card.Content className="grid gap-1">
						<Card.Title>No real benchmark runs recorded</Card.Title>
						<Card.Description>
							The active run log intentionally starts empty. Use{" "}
							<code>npm run intelligence:record</code> after an intentional
							benchmark pass, or switch to placeholder data for chart QA.
						</Card.Description>
					</Card.Content>
				</Card>
			) : (
				<>
					<div className="grid w-full grid-cols-3 gap-2 sm:gap-4">
						<Card className="min-w-0 w-full" size="sm">
							<Card.Content className="grid gap-1">
								<Text variant="caption" tone="muted">
									Runs
								</Text>
								<Text as="p" variant="headingMd">
									{runs.length}
								</Text>
							</Card.Content>
						</Card>
						<Card className="min-w-0 w-full" size="sm">
							<Card.Content className="grid gap-1">
								<Text variant="caption" tone="muted">
									Strategies
								</Text>
								<Text as="p" variant="headingMd">
									{summaries.length}
								</Text>
							</Card.Content>
						</Card>
						<Card className="min-w-0 w-full" size="sm">
							<Card.Content className="grid gap-1">
								<Text variant="caption" tone="muted">
									Latest
								</Text>
								<Text as="p" variant="headingMd">
									{latestDate ?? "n/a"}
								</Text>
							</Card.Content>
						</Card>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<Card>
							<Card.Header className="border-b">
								<Card.Title>Strategy totals</Card.Title>
								<Card.Description>
									Lookup actions combine shell commands and semantic tool calls
									so strategies share one comparison scale.
								</Card.Description>
							</Card.Header>
							<Card.Content>
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
							</Card.Content>
						</Card>

						<Card>
							<Card.Header className="border-b">
								<Card.Title>Strategy details</Card.Title>
							</Card.Header>
							<Card.Content>
								<div className="grid gap-2">
									{summaries.map((summary) => (
										<Card
											key={summary.strategy}
											size="sm"
											background="surface"
											border="none"
										>
											<Card.Content className="grid gap-1">
												<Text variant="bodyStrong">{summary.strategy}</Text>
												<Text variant="caption" tone="muted">
													{summary.totalShellCommands} shell ·{" "}
													{summary.totalSemanticCalls} semantic · median{" "}
													{formatNumber(summary.medianLookupActions)} lookups ·{" "}
													correctness {formatNumber(summary.averageCorrectness)}
													/3
												</Text>
											</Card.Content>
										</Card>
									))}
								</div>
							</Card.Content>
						</Card>
					</div>
				</>
			)}
		</InternalPage>
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
