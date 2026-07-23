import fs from "node:fs/promises";
import path from "node:path";

export type TemplateIntelligenceFile = {
	path: string;
	title: string;
	sourceType: string;
	size: number;
	lines: number;
	conceptIds: string[];
	excerpt: string;
};

export type TemplateIntelligenceConcept = {
	id: string;
	title: string;
	summary: string;
	fileCount: number;
	sourceTypes: string[];
};

export type TemplateIntelligenceRelationship = {
	source: string;
	target: string;
	weight: number;
	sharedFiles: string[];
};

export type TemplateIntelligenceAgentMapTopic = {
	id: string;
	title: string;
	aliases: string[];
	paths: string[];
	notes: string;
};

export type TemplateIntelligenceAgentMap = {
	schemaVersion: 1;
	project: string;
	generator: string;
	artifact: string;
	topics: TemplateIntelligenceAgentMapTopic[];
};

export type TemplateIntelligenceIndex = {
	schemaVersion: 1;
	project: string;
	generator: string;
	artifact: string;
	fileCount: number;
	conceptCount: number;
	files: TemplateIntelligenceFile[];
	concepts: TemplateIntelligenceConcept[];
	relationships: TemplateIntelligenceRelationship[];
};

export type TemplateIntelligenceBenchmarkRun = {
	schemaVersion: 1 | 2 | 3;
	recordKind?: "executed-run";
	runId?: string;
	strategyDefinitionVersion?: number;
	date: string;
	project: string;
	taskId: string;
	taskName: string;
	strategy: string;
	benchmarkMode?: string;
	shellCommands: number;
	semanticCalls: number;
	lookupActions: number;
	correctness?: number;
	measurementSource?: string;
	sourceCommand?: string;
	scenarioId?: string;
	resolution?: string;
	runGroupId?: string;
	taskClass?: string;
	beforeCommit?: string;
	afterCommit?: string;
	setupSeconds?: number;
	buildSeconds?: number;
	querySeconds?: number;
	outputBytes?: number;
	graphNodes?: number;
	graphEdges?: number;
	graphQueries?: number;
	suggestedFiles?: string[];
	actualFiles?: string[];
	missedFiles?: string[];
	unnecessaryFiles?: string[];
	fallbacksUsed?: string[];
	elapsedSeconds?: number;
	wrongTurns?: number;
	generatedArtifactMistakes?: number;
	notes?: string;
};

export type TemplateIntelligenceReadResult =
	| {
			status: "ready";
			index: TemplateIntelligenceIndex;
	  }
	| {
			status: "missing";
			path: string;
	  };

export type TemplateIntelligenceAgentMapReadResult =
	| {
			status: "ready";
			agentMap: TemplateIntelligenceAgentMap;
	  }
	| {
			status: "missing";
			path: string;
	  };

export type TemplateIntelligenceBenchmarkReadResult =
	| {
			status: "ready";
			path: string;
			runs: TemplateIntelligenceBenchmarkRun[];
			invalidLineCount: number;
	  }
	| {
			status: "missing";
			path: string;
			runs: [];
			invalidLineCount: 0;
	  };

const INTELLIGENCE_INDEX_PATH = path.join(
	process.cwd(),
	".template-intelligence/index.json",
);
const INTELLIGENCE_AGENT_MAP_PATH = path.join(
	process.cwd(),
	".template-intelligence/agent-map.json",
);
const BENCHMARK_RUNS_PATH = path.join(
	process.cwd(),
	"docs/worklogs/template-intelligence-benchmark-runs.jsonl",
);
const BENCHMARK_EXAMPLE_RUNS_PATH = path.join(
	process.cwd(),
	"docs/worklogs/template-intelligence-benchmark-runs.example.jsonl",
);

function isTemplateIntelligenceIndex(
	value: unknown,
): value is TemplateIntelligenceIndex {
	if (!value || typeof value !== "object") return false;

	const candidate = value as Partial<TemplateIntelligenceIndex>;

	return (
		candidate.schemaVersion === 1 &&
		Array.isArray(candidate.files) &&
		Array.isArray(candidate.concepts) &&
		Array.isArray(candidate.relationships)
	);
}

function isTemplateIntelligenceAgentMap(
	value: unknown,
): value is TemplateIntelligenceAgentMap {
	if (!value || typeof value !== "object") return false;

	const candidate = value as Partial<TemplateIntelligenceAgentMap>;

	return candidate.schemaVersion === 1 && Array.isArray(candidate.topics);
}

function isNonNegativeNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function hasValidExecutedRunEvidence(
	candidate: Partial<TemplateIntelligenceBenchmarkRun>,
) {
	if (candidate.schemaVersion !== 3) return true;

	if (
		candidate.benchmarkMode === "triple-run" &&
		(!candidate.runGroupId || !candidate.scenarioId)
	) {
		return false;
	}
	if (candidate.runGroupId && !candidate.scenarioId) return false;

	switch (candidate.strategy) {
		case "Control":
		case "TemplateMap":
			return candidate.semanticCalls === 0 && !candidate.graphQueries;
		case "TemplateSerena":
			return (candidate.semanticCalls ?? 0) > 0 && !candidate.graphQueries;
		case "Graphify":
			return (
				(candidate.graphQueries ?? 0) > 0 &&
				(candidate.outputBytes ?? 0) > 0 &&
				isNonNegativeNumber(candidate.buildSeconds) &&
				isNonNegativeNumber(candidate.querySeconds)
			);
		default:
			return false;
	}
}

function isTemplateIntelligenceBenchmarkRun(
	value: unknown,
): value is TemplateIntelligenceBenchmarkRun {
	if (!value || typeof value !== "object") return false;

	const candidate = value as Partial<TemplateIntelligenceBenchmarkRun>;
	const correctness = candidate.correctness;
	const isLegacy =
		candidate.schemaVersion === 1 || candidate.schemaVersion === 2;
	const isExecutedRun =
		candidate.schemaVersion === 3 &&
		candidate.recordKind === "executed-run" &&
		typeof candidate.runId === "string" &&
		candidate.runId.length > 0 &&
		candidate.strategyDefinitionVersion === 1 &&
		typeof candidate.measurementSource === "string" &&
		typeof candidate.sourceCommand === "string";
	const hasValidCorrectness =
		correctness === undefined ||
		(isNonNegativeNumber(correctness) && correctness <= 3);

	return (
		(isLegacy || isExecutedRun) &&
		typeof candidate.date === "string" &&
		typeof candidate.project === "string" &&
		typeof candidate.taskId === "string" &&
		typeof candidate.taskName === "string" &&
		typeof candidate.strategy === "string" &&
		isNonNegativeNumber(candidate.shellCommands) &&
		isNonNegativeNumber(candidate.semanticCalls) &&
		isNonNegativeNumber(candidate.lookupActions) &&
		hasValidCorrectness &&
		(!isLegacy || correctness !== undefined) &&
		hasValidExecutedRunEvidence(candidate)
	);
}

export async function readTemplateIntelligenceIndex(): Promise<TemplateIntelligenceReadResult> {
	const raw = await fs
		.readFile(INTELLIGENCE_INDEX_PATH, "utf8")
		.catch(() => null);

	if (!raw) {
		return {
			status: "missing",
			path: ".template-intelligence/index.json",
		};
	}

	const parsed = JSON.parse(raw) as unknown;

	if (!isTemplateIntelligenceIndex(parsed)) {
		throw new Error("Template intelligence index has an invalid shape.");
	}

	return {
		status: "ready",
		index: parsed,
	};
}

export async function readTemplateIntelligenceAgentMap(): Promise<TemplateIntelligenceAgentMapReadResult> {
	const raw = await fs
		.readFile(INTELLIGENCE_AGENT_MAP_PATH, "utf8")
		.catch(() => null);

	if (!raw) {
		return {
			status: "missing",
			path: ".template-intelligence/agent-map.json",
		};
	}

	const parsed = JSON.parse(raw) as unknown;

	if (!isTemplateIntelligenceAgentMap(parsed)) {
		throw new Error("Template intelligence agent map has an invalid shape.");
	}

	return {
		status: "ready",
		agentMap: parsed,
	};
}

async function readTemplateIntelligenceBenchmarkJsonl(
	filePath: string,
	relativePath: string,
): Promise<TemplateIntelligenceBenchmarkReadResult> {
	const raw = await fs.readFile(filePath, "utf8").catch(() => null);

	if (raw === null) {
		return {
			status: "missing",
			path: relativePath,
			runs: [],
			invalidLineCount: 0,
		};
	}

	const runs: TemplateIntelligenceBenchmarkRun[] = [];
	let invalidLineCount = 0;

	for (const line of raw.split(/\r?\n/)) {
		const trimmedLine = line.trim();
		if (!trimmedLine) continue;

		try {
			const parsed = JSON.parse(trimmedLine) as unknown;
			if (isTemplateIntelligenceBenchmarkRun(parsed)) {
				runs.push(parsed);
			} else {
				invalidLineCount += 1;
			}
		} catch {
			invalidLineCount += 1;
		}
	}

	return {
		status: "ready",
		path: relativePath,
		runs,
		invalidLineCount,
	};
}

export async function readTemplateIntelligenceBenchmarkRuns(): Promise<TemplateIntelligenceBenchmarkReadResult> {
	return readTemplateIntelligenceBenchmarkJsonl(
		BENCHMARK_RUNS_PATH,
		"docs/worklogs/template-intelligence-benchmark-runs.jsonl",
	);
}

export async function readTemplateIntelligenceBenchmarkExampleRuns(): Promise<TemplateIntelligenceBenchmarkReadResult> {
	return readTemplateIntelligenceBenchmarkJsonl(
		BENCHMARK_EXAMPLE_RUNS_PATH,
		"docs/worklogs/template-intelligence-benchmark-runs.example.jsonl",
	);
}
