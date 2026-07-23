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

type ComparableBenchmarkCohort = {
	id: string;
	scenarioId: string;
	runs: TemplateIntelligenceBenchmarkRun[];
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

function formatNumber(value: number) {
	return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function getComparableCohorts(
	runs: TemplateIntelligenceBenchmarkRun[],
	isExample: boolean,
): ComparableBenchmarkCohort[] {
	const byCohort = new Map<string, TemplateIntelligenceBenchmarkRun[]>();

	for (const run of runs) {
		const scenarioId = run.scenarioId ?? (isExample ? run.taskName : undefined);
		if (!run.runGroupId || !scenarioId) continue;
		if (!isExample && run.schemaVersion !== 3) continue;
		const cohortId = `${scenarioId}:${run.runGroupId}`;
		const cohortRuns = byCohort.get(cohortId) ?? [];
		cohortRuns.push(run);
		byCohort.set(cohortId, cohortRuns);
	}

	return [...byCohort.entries()]
		.filter(
			([, cohortRuns]) =>
				new Set(cohortRuns.map((run) => run.strategy)).size > 1,
		)
		.map(([id, cohortRuns]) => ({
			id,
			scenarioId:
				cohortRuns[0]?.scenarioId ?? cohortRuns[0]?.taskName ?? "unknown",
			runs: cohortRuns.sort((a, b) => a.strategy.localeCompare(b.strategy)),
		}));
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
		<InternalPage className="gap-8 text-center">
			<InternalPageHeader
				className="mx-auto items-center"
				title="Template Intelligence"
				description="Generated map of the template surfaces to inspect before changing shared code."
			/>

			<div className="grid w-full gap-4 sm:grid-cols-2 md:grid-cols-4">
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
	const comparableCohorts = getComparableCohorts(runs, isExample);
	const legacyRunCount = isExample
		? 0
		: runs.filter((run) => run.schemaVersion < 3).length;
	const executedRunCount = isExample
		? runs.length
		: runs.filter((run) => run.schemaVersion === 3).length;

	return (
		<InternalPage>
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
							Run a strategy through <code>npm run intelligence:benchmark</code>
							. Successful commands measure, validate, and persist their own
							execution record.
						</Card.Description>
					</Card.Content>
				</Card>
			) : (
				<>
					<div className="grid w-full gap-2 sm:grid-cols-3 sm:gap-4">
						<Card className="min-w-0 w-full" size="sm">
							<Card.Content className="grid gap-1">
								<Text variant="caption" tone="muted">
									Legacy observations
								</Text>
								<Text as="p" variant="headingMd">
									{legacyRunCount}
								</Text>
							</Card.Content>
						</Card>
						<Card className="min-w-0 w-full" size="sm">
							<Card.Content className="grid gap-1">
								<Text variant="caption" tone="muted">
									Executed runs
								</Text>
								<Text as="p" variant="headingMd">
									{executedRunCount}
								</Text>
							</Card.Content>
						</Card>
						<Card className="min-w-0 w-full" size="sm">
							<Card.Content className="grid gap-1">
								<Text variant="caption" tone="muted">
									Matched cohorts
								</Text>
								<Text as="p" variant="headingMd">
									{comparableCohorts.length}
								</Text>
							</Card.Content>
						</Card>
					</div>

					{legacyRunCount > 0 ? (
						<StatusMessage>
							Legacy observations are preserved as history and excluded from
							strategy rankings.
						</StatusMessage>
					) : null}

					{comparableCohorts.length === 0 ? (
						<Card>
							<Card.Content className="grid gap-1">
								<Card.Title>No matched comparison cohorts</Card.Title>
								<Card.Description>
									Preserved does not mean comparable. Cross-strategy charts
									appear only after two or more executed strategies share a
									scenario and run group.
								</Card.Description>
							</Card.Content>
						</Card>
					) : (
						<div className="grid gap-4">
							{comparableCohorts.map((cohort) => {
								const maxLookupActions = Math.max(
									1,
									...cohort.runs.map((run) => run.lookupActions),
								);

								return (
									<Card key={cohort.id}>
										<Card.Header className="border-b">
											<Card.Title>{cohort.scenarioId}</Card.Title>
											<Card.Description>
												Matched run group {cohort.runs[0]?.runGroupId}
											</Card.Description>
										</Card.Header>
										<Card.Content className="grid gap-4 lg:grid-cols-2">
											{cohort.runs.map((run) => (
												<div
													className="grid gap-2"
													key={run.runId ?? run.taskId}
												>
													<BenchmarkBar
														label={run.strategy}
														value={run.lookupActions}
														max={maxLookupActions}
													/>
													<Text variant="caption" tone="muted">
														{run.shellCommands} shell · {run.semanticCalls}{" "}
														semantic
														{run.correctness === undefined
															? " · unrated"
															: ` · correctness ${formatNumber(run.correctness)}/3`}
													</Text>
												</div>
											))}
										</Card.Content>
									</Card>
								);
							})}
						</div>
					)}
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
