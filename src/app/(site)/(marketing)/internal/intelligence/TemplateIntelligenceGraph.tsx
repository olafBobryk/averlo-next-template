"use client";

import { useMemo, useState } from "react";
import Divider from "@/components/ui/primitives/Divider";
import { Panel } from "@/components/ui/primitives/Panel";
import { Text } from "@/components/ui/primitives/Text";
import type {
	TemplateIntelligenceConcept,
	TemplateIntelligenceFile,
	TemplateIntelligenceIndex,
	TemplateIntelligenceRelationship,
} from "@/lib/template-intelligence";

const GRAPH_WIDTH = 980;
const GRAPH_HEIGHT = 620;
const GRAPH_CENTER_X = GRAPH_WIDTH / 2;
const GRAPH_CENTER_Y = 300;
const CONCEPT_RADIUS_X = 350;
const CONCEPT_RADIUS_Y = 190;
const SOURCE_RADIUS_X = 210;
const SOURCE_RADIUS_Y = 92;

type PositionedConcept = TemplateIntelligenceConcept & {
	x: number;
	y: number;
};

type PositionedSourceType = {
	id: string;
	label: string;
	count: number;
	x: number;
	y: number;
};

function getConceptPositions(
	concepts: TemplateIntelligenceConcept[],
): PositionedConcept[] {
	return concepts.map((concept, index) => {
		const angle =
			(index / Math.max(concepts.length, 1)) * Math.PI * 2 - Math.PI / 2;

		return {
			...concept,
			x: Math.round(GRAPH_CENTER_X + Math.cos(angle) * CONCEPT_RADIUS_X),
			y: Math.round(GRAPH_CENTER_Y + Math.sin(angle) * CONCEPT_RADIUS_Y),
		};
	});
}

function getSourceTypePositions(
	files: TemplateIntelligenceFile[],
): PositionedSourceType[] {
	const counts = new Map<string, number>();

	for (const file of files) {
		counts.set(file.sourceType, (counts.get(file.sourceType) ?? 0) + 1);
	}

	return [...counts.entries()]
		.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
		.map(([sourceType, count], index, sourceTypes) => {
			const angle =
				(index / Math.max(sourceTypes.length, 1)) * Math.PI * 2 - Math.PI / 2;

			return {
				id: `source-${sourceType}`,
				label: sourceType,
				count,
				x: Math.round(GRAPH_CENTER_X + Math.cos(angle) * SOURCE_RADIUS_X),
				y: Math.round(GRAPH_CENTER_Y + Math.sin(angle) * SOURCE_RADIUS_Y),
			};
		});
}

function getConceptSourceWeight(
	files: TemplateIntelligenceFile[],
	conceptId: string,
	sourceType: string,
) {
	return files.filter(
		(file) =>
			file.sourceType === sourceType && file.conceptIds.includes(conceptId),
	).length;
}

function getConceptRelationships(
	relationships: TemplateIntelligenceRelationship[],
	conceptId: string,
) {
	return relationships
		.filter(
			(relationship) =>
				relationship.source === conceptId || relationship.target === conceptId,
		)
		.sort((a, b) => b.weight - a.weight);
}

function getRelatedConceptId(
	relationship: TemplateIntelligenceRelationship,
	conceptId: string,
) {
	return relationship.source === conceptId
		? relationship.target
		: relationship.source;
}

function getTopFiles(
	files: TemplateIntelligenceFile[],
	conceptId: string,
	query: string,
) {
	const normalizedQuery = query.trim().toLowerCase();

	return files
		.filter((file) => file.conceptIds.includes(conceptId))
		.filter((file) => {
			if (!normalizedQuery) return true;
			return (
				file.path.toLowerCase().includes(normalizedQuery) ||
				file.title.toLowerCase().includes(normalizedQuery) ||
				file.excerpt.toLowerCase().includes(normalizedQuery)
			);
		})
		.sort((a, b) => b.lines - a.lines || a.path.localeCompare(b.path))
		.slice(0, 10);
}

function getEdgePath(
	source: { x: number; y: number },
	target: { x: number; y: number },
	curve = 0.16,
) {
	const midX = (source.x + target.x) / 2;
	const midY = (source.y + target.y) / 2;
	const dx = target.x - source.x;
	const dy = target.y - source.y;
	const controlX = midX - dy * curve;
	const controlY = midY + dx * curve;

	return `M ${source.x} ${source.y} Q ${Math.round(controlX)} ${Math.round(controlY)} ${target.x} ${target.y}`;
}

function getNodeMatchesQuery(
	concept: TemplateIntelligenceConcept,
	files: TemplateIntelligenceFile[],
	query: string,
) {
	const normalizedQuery = query.trim().toLowerCase();
	if (!normalizedQuery) return true;

	return (
		concept.title.toLowerCase().includes(normalizedQuery) ||
		concept.summary.toLowerCase().includes(normalizedQuery) ||
		files.some(
			(file) =>
				file.conceptIds.includes(concept.id) &&
				(file.path.toLowerCase().includes(normalizedQuery) ||
					file.excerpt.toLowerCase().includes(normalizedQuery)),
		)
	);
}

function toPercent(value: number, total: number) {
	return `${(value / total) * 100}%`;
}

function getConceptButtonClasses({
	isSelected,
	isDimmed,
	matchesQuery,
}: {
	isSelected: boolean;
	isDimmed: boolean;
	matchesQuery: boolean;
}) {
	const classes = [
		"absolute z-10 flex min-h-[74px] w-[132px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-2xl border px-3 py-2 text-center shadow-sm outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary/70",
	];

	if (isSelected) {
		classes.push("border-primary bg-primary/12 text-foreground shadow-md");
	} else if (matchesQuery) {
		classes.push("border-primary/60 bg-background text-foreground");
	} else {
		classes.push("border-border/40 bg-background/92 text-foreground");
	}

	if (isDimmed) {
		classes.push("opacity-45");
	}

	return classes.join(" ");
}

function getSourceNodeClasses(isSelected: boolean) {
	return [
		"absolute z-10 flex min-h-10 w-[118px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl border px-2 py-1 text-center shadow-sm",
		isSelected
			? "border-primary bg-primary/10 text-foreground"
			: "border-border/40 bg-surface text-muted",
	].join(" ");
}

export function TemplateIntelligenceGraph({
	index,
}: {
	index: TemplateIntelligenceIndex;
}) {
	const [selectedConceptId, setSelectedConceptId] = useState(
		index.concepts[0]?.id ?? "",
	);
	const [query, setQuery] = useState("");
	const positionedConcepts = useMemo(
		() => getConceptPositions(index.concepts),
		[index.concepts],
	);
	const positionedSourceTypes = useMemo(
		() => getSourceTypePositions(index.files),
		[index.files],
	);
	const conceptById = useMemo(
		() => new Map(positionedConcepts.map((concept) => [concept.id, concept])),
		[positionedConcepts],
	);
	const selectedConcept =
		conceptById.get(selectedConceptId) ?? positionedConcepts[0];
	const selectedRelationships = selectedConcept
		? getConceptRelationships(index.relationships, selectedConcept.id)
		: [];
	const selectedFiles = selectedConcept
		? getTopFiles(index.files, selectedConcept.id, query)
		: [];
	const normalizedQuery = query.trim().toLowerCase();
	const matchingConceptIds = new Set(
		positionedConcepts
			.filter((concept) => getNodeMatchesQuery(concept, index.files, query))
			.map((concept) => concept.id),
	);
	const strongestRelationships = [...index.relationships]
		.sort((a, b) => b.weight - a.weight)
		.slice(0, 18);

	return (
		<Panel display="grid" padding="none" gap="none" shadow="none">
			<div className="grid min-h-[660px] lg:grid-cols-[minmax(0,1fr)_340px]">
				<div className="flex min-w-0 flex-col gap-4 p-4 md:p-6">
					<div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
						<div className="flex flex-col gap-1">
							<Text as="h2" variant="headingSm">
								Concept Graph
							</Text>
							<Text variant="body" tone="muted">
								Weighted links combine shared files and source-type overlap.
							</Text>
						</div>

						<label className="flex min-w-0 flex-col gap-1 md:w-[320px]">
							<span className="text-xs text-muted">Filter graph</span>
							<input
								type="search"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Search files or concepts"
								className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
							/>
						</label>
					</div>

					<div className="overflow-x-auto overflow-y-hidden rounded-lg border border-border/10 bg-surface-secondary/40">
						<div className="relative min-w-[760px]">
							<svg
								viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
								aria-hidden="true"
								aria-label="Template concept relationship map"
								className="h-auto min-h-[520px] w-full"
							>
								<defs>
									<radialGradient id="concept-node-fill">
										<stop
											offset="0%"
											stopColor="currentColor"
											stopOpacity="0.14"
										/>
										<stop
											offset="100%"
											stopColor="currentColor"
											stopOpacity="0.03"
										/>
									</radialGradient>
								</defs>

								<circle
									cx={GRAPH_CENTER_X}
									cy={GRAPH_CENTER_Y}
									r="118"
									className="fill-primary/5 stroke-primary/20"
									strokeDasharray="6 8"
								/>

								{positionedConcepts.flatMap((concept) =>
									positionedSourceTypes.map((sourceType) => {
										const weight = getConceptSourceWeight(
											index.files,
											concept.id,
											sourceType.label,
										);
										if (weight === 0) return null;

										const isSelected =
											selectedConcept?.id === concept.id ||
											selectedConcept?.sourceTypes.includes(sourceType.label);
										const matchesQuery = matchingConceptIds.has(concept.id);
										const isDimmed =
											(selectedConcept
												? selectedConcept.id !== concept.id &&
													!selectedConcept.sourceTypes.includes(
														sourceType.label,
													)
												: false) ||
											(Boolean(normalizedQuery) && !matchesQuery);

										return (
											<path
												key={`${concept.id}-${sourceType.id}`}
												d={getEdgePath(concept, sourceType, 0.08)}
												fill="none"
												stroke="currentColor"
												strokeOpacity={
													isDimmed ? 0.04 : isSelected ? 0.3 : 0.11
												}
												strokeWidth={Math.min(1 + weight / 10, 7)}
												className="text-muted"
											/>
										);
									}),
								)}

								{strongestRelationships.map((relationship) => {
									const source = conceptById.get(relationship.source);
									const target = conceptById.get(relationship.target);
									if (!source || !target) return null;

									const isSelected =
										selectedConcept?.id === relationship.source ||
										selectedConcept?.id === relationship.target;
									const matchesQuery =
										matchingConceptIds.has(relationship.source) ||
										matchingConceptIds.has(relationship.target);
									const isDimmed =
										(selectedConcept ? !isSelected : false) ||
										(Boolean(normalizedQuery) && !matchesQuery);

									return (
										<path
											key={`${relationship.source}-${relationship.target}`}
											d={getEdgePath(source, target)}
											fill="none"
											stroke="currentColor"
											strokeOpacity={
												isDimmed
													? 0.06
													: Math.min(0.2 + relationship.weight / 55, 0.72)
											}
											strokeWidth={Math.min(1 + relationship.weight / 7, 10)}
											className={
												isSelected ? "text-primary" : "text-foreground"
											}
										/>
									);
								})}

								{positionedConcepts.map((concept) => {
									const isSelected = selectedConcept?.id === concept.id;
									const matchesQuery = matchingConceptIds.has(concept.id);
									const isDimmed =
										(Boolean(selectedConcept) && !isSelected) ||
										(Boolean(normalizedQuery) && !matchesQuery);
									const radius = Math.max(
										42,
										Math.min(68, 34 + concept.fileCount / 7),
									);

									return (
										<circle
											key={concept.id}
											cx={concept.x}
											cy={concept.y}
											r={radius + (isSelected ? 8 : 0)}
											className={
												isSelected
													? "fill-primary/10 stroke-primary"
													: matchesQuery && normalizedQuery
														? "fill-primary/5 stroke-primary/60"
														: "fill-background/80 stroke-border"
											}
											strokeWidth={isSelected ? 3 : 2}
											opacity={isDimmed ? 0.38 : 1}
										/>
									);
								})}
							</svg>

							<div>
								{positionedSourceTypes.map((sourceType) => {
									const isSelected = Boolean(
										selectedConcept?.sourceTypes.includes(sourceType.label),
									);

									return (
										<div
											key={sourceType.id}
											className={getSourceNodeClasses(isSelected)}
											style={{
												left: toPercent(sourceType.x, GRAPH_WIDTH),
												top: toPercent(sourceType.y, GRAPH_HEIGHT),
											}}
										>
											<span className="max-w-full truncate text-[11px] font-medium">
												{sourceType.label}
											</span>
											<span className="text-[10px] text-muted">
												{sourceType.count} files
											</span>
										</div>
									);
								})}

								{positionedConcepts.map((concept) => {
									const isSelected = selectedConcept?.id === concept.id;
									const matchesQuery = matchingConceptIds.has(concept.id);
									const isDimmed =
										(Boolean(selectedConcept) && !isSelected) ||
										(Boolean(normalizedQuery) && !matchesQuery);

									return (
										<button
											key={concept.id}
											type="button"
											aria-pressed={isSelected}
											onClick={() => setSelectedConceptId(concept.id)}
											className={getConceptButtonClasses({
												isSelected,
												isDimmed,
												matchesQuery,
											})}
											style={{
												left: toPercent(concept.x, GRAPH_WIDTH),
												top: toPercent(concept.y, GRAPH_HEIGHT),
											}}
										>
											<span className="line-clamp-2 text-[12px] font-semibold leading-tight">
												{concept.title}
											</span>
											<span className="text-[10px] text-muted">
												{concept.fileCount} files
											</span>
										</button>
									);
								})}
							</div>
						</div>
					</div>

					<div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
						{positionedConcepts.map((concept) => (
							<button
								key={concept.id}
								type="button"
								aria-pressed={selectedConcept?.id === concept.id}
								onClick={() => setSelectedConceptId(concept.id)}
								className={[
									"min-h-11 rounded-lg border px-3 py-2 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
									selectedConcept?.id === concept.id
										? "border-primary bg-primary/10 text-foreground"
										: "border-border/10 bg-foreground/[0.03] text-muted hover:text-foreground",
								].join(" ")}
							>
								{concept.title}
							</button>
						))}
					</div>
				</div>

				<aside className="flex min-w-0 flex-col gap-4 border-border/10 border-t p-4 md:p-6 lg:border-t-0 lg:border-l">
					{selectedConcept ? (
						<>
							<div className="flex flex-col gap-2">
								<Text as="h3" variant="headingSm">
									{selectedConcept.title}
								</Text>
								<Text variant="body" tone="muted">
									{selectedConcept.summary}
								</Text>
								<div className="flex flex-wrap gap-2">
									{selectedConcept.sourceTypes.map((sourceType) => (
										<span
											key={sourceType}
											className="rounded-md border border-border/10 px-2 py-1 text-xs text-muted"
										>
											{sourceType}
										</span>
									))}
								</div>
							</div>

							<Divider />

							<div className="flex flex-col gap-3">
								<Text as="h4" variant="headingXs">
									Strongest Links
								</Text>
								<div className="grid gap-2">
									{selectedRelationships.slice(0, 5).map((relationship) => {
										const relatedConceptId = getRelatedConceptId(
											relationship,
											selectedConcept.id,
										);
										const relatedConcept = conceptById.get(relatedConceptId);

										return (
											<button
												key={`${relationship.source}-${relationship.target}`}
												type="button"
												onClick={() => setSelectedConceptId(relatedConceptId)}
												className="rounded-lg border border-border/10 bg-foreground/[0.03] p-3 text-left transition-colors hover:border-primary/50"
											>
												<div className="flex items-center justify-between gap-3">
													<Text variant="bodyStrong">
														{relatedConcept?.title ?? relatedConceptId}
													</Text>
													<Text variant="caption" tone="muted">
														{relationship.weight}
													</Text>
												</div>
												<Text variant="caption" tone="muted">
													{relationship.sharedFiles.slice(0, 2).join(", ")}
												</Text>
											</button>
										);
									})}
								</div>
							</div>

							<Divider />

							<div className="flex flex-col gap-3">
								<Text as="h4" variant="headingXs">
									Files
								</Text>
								<div className="grid max-h-[360px] gap-2 overflow-auto pr-1">
									{selectedFiles.length > 0 ? (
										selectedFiles.map((file) => (
											<div
												key={file.path}
												className="grid gap-1 rounded-lg bg-foreground/[0.03] p-3"
											>
												<Text variant="caption" className="break-words">
													{file.path}
												</Text>
												<Text variant="caption" tone="muted">
													{file.lines} lines · {file.sourceType}
												</Text>
											</div>
										))
									) : (
										<Text variant="caption" tone="muted">
											No files match the current filter for this concept.
										</Text>
									)}
								</div>
							</div>
						</>
					) : null}
				</aside>
			</div>
		</Panel>
	);
}
