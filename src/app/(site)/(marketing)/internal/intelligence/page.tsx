import { Button } from "@/components/ui/primitives/Button";
import Divider from "@/components/ui/primitives/Divider";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import {
	readTemplateIntelligenceIndex,
	type TemplateIntelligenceFile,
	type TemplateIntelligenceIndex,
} from "@/lib/template-intelligence";
import { TemplateIntelligenceGraph } from "./TemplateIntelligenceGraph";

function getTopFiles(
	index: TemplateIntelligenceIndex,
	conceptId: string,
): TemplateIntelligenceFile[] {
	return index.files
		.filter((file) => file.conceptIds.includes(conceptId))
		.sort((a, b) => b.lines - a.lines || a.path.localeCompare(b.path))
		.slice(0, 5);
}

function getSourceTypeCounts(index: TemplateIntelligenceIndex) {
	const counts = new Map<string, number>();

	for (const file of index.files) {
		counts.set(file.sourceType, (counts.get(file.sourceType) ?? 0) + 1);
	}

	return [...counts.entries()].sort(
		(a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
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

					<Panel display="flex" padding="md" gap="md" shadow="none">
						<Text variant="body">
							Run <code>npm run intelligence:generate</code> to create{" "}
							<code>{path}</code>.
						</Text>
					</Panel>
				</div>
			</Section>
		</main>
	);
}

function ReadyState({ index }: { index: TemplateIntelligenceIndex }) {
	const sourceTypeCounts = getSourceTypeCounts(index);

	return (
		<main>
			<Section padding="hero">
				<div className="flex flex-col gap-6">
					<header className="flex max-w-4xl flex-col gap-2">
						<Text as="h1" variant="headingLg">
							Template Intelligence
						</Text>
						<Text variant="body" tone="muted">
							Generated map of the template surfaces agents and maintainers need
							before changing shared code.
						</Text>
					</header>

					<div className="grid gap-4 md:grid-cols-3">
						<Panel display="flex" padding="md" gap="sm" shadow="none">
							<Text variant="caption" tone="muted">
								Files indexed
							</Text>
							<Text as="p" variant="headingMd">
								{index.fileCount}
							</Text>
						</Panel>
						<Panel display="flex" padding="md" gap="sm" shadow="none">
							<Text variant="caption" tone="muted">
								Concept groups
							</Text>
							<Text as="p" variant="headingMd">
								{index.conceptCount}
							</Text>
						</Panel>
						<Panel display="flex" padding="md" gap="sm" shadow="none">
							<Text variant="caption" tone="muted">
								Relationships
							</Text>
							<Text as="p" variant="headingMd">
								{index.relationships.length}
							</Text>
						</Panel>
					</div>

					<TemplateIntelligenceGraph index={index} />

					<div className="grid gap-4 lg:grid-cols-[1fr_320px]">
						<div className="grid gap-4">
							{index.concepts.map((concept) => {
								const topFiles = getTopFiles(index, concept.id);

								return (
									<Panel
										key={concept.id}
										display="flex"
										padding="md"
										gap="md"
										shadow="none"
									>
										<div className="flex flex-col gap-2">
											<div className="flex flex-wrap items-start justify-between gap-3">
												<div className="flex flex-col gap-1">
													<Text as="h2" variant="headingSm">
														{concept.title}
													</Text>
													<Text variant="body" tone="muted">
														{concept.summary}
													</Text>
												</div>
												<Text variant="caption" tone="muted">
													{concept.fileCount} files
												</Text>
											</div>

											<div className="flex flex-wrap gap-2">
												{concept.sourceTypes.map((sourceType) => (
													<span
														key={sourceType}
														className="rounded-md border border-border/10 px-2 py-1 text-xs text-muted-foreground"
													>
														{sourceType}
													</span>
												))}
											</div>
										</div>

										<Divider />

										<div className="grid gap-2">
											{topFiles.map((file) => (
												<div
													key={file.path}
													className="grid gap-1 rounded-lg bg-foreground/[0.03] p-3"
												>
													<Text variant="bodyStrong">{file.path}</Text>
													{file.excerpt ? (
														<Text variant="caption" tone="muted">
															{file.excerpt}
														</Text>
													) : null}
												</div>
											))}
										</div>
									</Panel>
								);
							})}
						</div>

						<Panel display="flex" padding="md" gap="md" shadow="none">
							<div className="flex flex-col gap-2">
								<Text as="h2" variant="headingSm">
									Source Types
								</Text>
								<Text variant="body" tone="muted">
									Distribution of indexed files by template role.
								</Text>
							</div>

							<div className="grid gap-3">
								{sourceTypeCounts.map(([sourceType, count]) => (
									<div key={sourceType} className="grid gap-1">
										<div className="flex items-center justify-between gap-3">
											<Text variant="caption">{sourceType}</Text>
											<Text variant="caption" tone="muted">
												{count}
											</Text>
										</div>
										<div className="h-2 overflow-hidden rounded-full bg-foreground/10">
											<div
												className="h-full rounded-full bg-primary"
												style={{
													width: `${Math.max(6, Math.round((count / index.fileCount) * 100))}%`,
												}}
											/>
										</div>
									</div>
								))}
							</div>

							<Divider />

							<div className="flex flex-col gap-2">
								<Text variant="caption" tone="muted">
									Artifact
								</Text>
								<code className="break-all rounded-md bg-foreground/[0.05] px-3 py-2 text-xs">
									{index.artifact}
								</code>
								<Button
									href="/internal/reference"
									variant="outline"
									size="sm"
									className="w-fit"
								>
									Open reference
								</Button>
							</div>
						</Panel>
					</div>
				</div>
			</Section>
		</main>
	);
}

export default async function TemplateIntelligencePage() {
	const result = await readTemplateIntelligenceIndex();

	if (result.status === "missing") {
		return <MissingIndexState path={result.path} />;
	}

	return <ReadyState index={result.index} />;
}
