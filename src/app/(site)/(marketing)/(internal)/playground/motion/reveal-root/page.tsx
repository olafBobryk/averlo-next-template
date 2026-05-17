"use client";

import { useState } from "react";
import { MotionScene } from "@/components/ui/motion/MotionScene";
import {
	RevealGroup,
	RevealGroupItem,
	RevealItem,
	RevealRoot,
} from "@/components/ui/motion/Reveal";
import { RevealImage } from "@/components/ui/motion/RevealImage";
import { ScrambleReveal } from "@/components/ui/motion/ScrambleReveal";
import { Button } from "@/components/ui/primitives/Button";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";

const warmBlocks = ["bg-red-500", "bg-orange-500", "bg-amber-400"];
const coolBlocks = ["bg-sky-500", "bg-blue-600", "bg-violet-600"];
const greenBlocks = ["bg-lime-400", "bg-emerald-500", "bg-teal-500"];
const pinkBlocks = ["bg-fuchsia-500", "bg-pink-500", "bg-rose-500"];
const stressRows = [
	{
		id: "warm",
		label: "Row A",
		stagger: 0.16,
		blocks: [
			"bg-red-500",
			"bg-orange-500",
			"bg-amber-400",
			"bg-yellow-300",
			"bg-lime-400",
			"bg-green-500",
		],
	},
	{
		id: "cool",
		label: "Row B",
		stagger: 0.2,
		blocks: [
			"bg-emerald-500",
			"bg-teal-500",
			"bg-cyan-400",
			"bg-sky-500",
			"bg-blue-600",
			"bg-indigo-600",
		],
	},
	{
		id: "violet",
		label: "Row C",
		stagger: 0.24,
		blocks: [
			"bg-violet-600",
			"bg-purple-600",
			"bg-fuchsia-500",
			"bg-pink-500",
			"bg-rose-500",
			"bg-stone-500",
		],
	},
	{
		id: "soft",
		label: "Row D",
		stagger: 0.18,
		blocks: [
			"bg-red-300",
			"bg-orange-300",
			"bg-amber-200",
			"bg-lime-200",
			"bg-cyan-200",
			"bg-sky-300",
		],
	},
] as const;

function ColorBlock({
	className,
	label,
}: {
	className: string;
	label: string;
}) {
	return (
		<div
			className={[
				"flex min-h-32 items-end rounded-lg border border-foreground/10 p-3 shadow-sm",
				className,
			].join(" ")}
		>
			<span className="rounded bg-background/85 px-2 py-1 text-xs font-medium text-foreground">
				{label}
			</span>
		</div>
	);
}

function ApiLine({ children }: { children: React.ReactNode }) {
	return (
		<code className="block overflow-x-auto rounded-md bg-foreground/5 px-3 py-2 text-xs text-foreground">
			{children}
		</code>
	);
}

function Notes({
	api,
	expected,
	happens,
}: {
	api: React.ReactNode;
	expected: React.ReactNode;
	happens: React.ReactNode;
}) {
	return (
		<div className="grid gap-3 rounded-lg border border-border/10 bg-surface/50 p-4 md:grid-cols-3">
			<div className="flex flex-col gap-1">
				<Text variant="caption" tone="muted">
					API
				</Text>
				{api}
			</div>
			<div className="flex flex-col gap-1">
				<Text variant="caption" tone="muted">
					Expected
				</Text>
				<Text variant="body" tone="muted">
					{expected}
				</Text>
			</div>
			<div className="flex flex-col gap-1">
				<Text variant="caption" tone="muted">
					What happens
				</Text>
				<Text variant="body" tone="muted">
					{happens}
				</Text>
			</div>
		</div>
	);
}

function ExamplePanel({
	title,
	children,
	api,
	expected,
	happens,
}: {
	title: string;
	children: React.ReactNode;
	api: React.ReactNode;
	expected: React.ReactNode;
	happens: React.ReactNode;
}) {
	return (
		<Panel display="flex" padding="md" gap="md" shadow="none">
			<Text as="h2" variant="headingSm">
				{title}
			</Text>
			<Notes api={api} expected={expected} happens={happens} />
			{children}
		</Panel>
	);
}

function ActiveGroupExample() {
	const [active, setActive] = useState(false);

	return (
		<ExamplePanel
			title="Active Gate"
			api={<ApiLine>{"<RevealGroup active={active}>"}</ApiLine>}
			expected="The group should not enter the root queue until the gate opens."
			happens="Clicking Open gate makes the group join the root queue, then its children stagger locally."
		>
			<div className="flex flex-wrap gap-2">
				<Button size="sm" variant="outline" onClick={() => setActive(false)}>
					Close gate
				</Button>
				<Button size="sm" variant="primary" onClick={() => setActive(true)}>
					Open gate
				</Button>
			</div>
			<RevealGroup
				active={active}
				className="grid gap-3 md:grid-cols-3"
				stagger={0.22}
			>
				{greenBlocks.map((className, index) => (
					<RevealGroupItem key={className}>
						<ColorBlock
							className={className}
							label={`active group ${index + 1}`}
						/>
					</RevealGroupItem>
				))}
			</RevealGroup>
		</ExamplePanel>
	);
}

function MotionSceneExample() {
	return (
		<ExamplePanel
			title="MotionScene waitFor / unlockStage"
			api={
				<ApiLine>
					{
						'<RevealImage unlockStage="media" /> -> <RevealGroup waitFor="media" unlockStage="content" />'
					}
				</ApiLine>
			}
			expected="The media reveal unlocks the content group. The content group unlocks the accent only after group children finish."
			happens="Image, content, then accent are staged through MotionScene instead of page-local timers."
		>
			<MotionScene>
				<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
					<RevealImage
						src="/test/mercury.png"
						alt="Motion scene media"
						fill
						sizes="(min-width: 1024px) 50vw, 100vw"
						waitFor="app"
						unlockStage="media"
						className="w-full"
						contentClassName="aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/10 bg-surface"
						imageClassName="object-cover"
					/>
					<div className="flex flex-col gap-4">
						<RevealGroup
							waitFor="media"
							unlockStage="content"
							className="grid gap-3"
							stagger={0.22}
						>
							<RevealGroupItem>
								<ColorBlock className="bg-cyan-400" label="content 1" />
							</RevealGroupItem>
							<RevealGroupItem>
								<ColorBlock className="bg-blue-600" label="content 2" />
							</RevealGroupItem>
							<RevealGroupItem>
								<ColorBlock className="bg-indigo-600" label="content 3" />
							</RevealGroupItem>
						</RevealGroup>
						<Text variant="bodyStrong" as="span">
							<ScrambleReveal
								text="Accent waits for the content stage."
								waitFor="content"
								maintainSpace
							/>
						</Text>
					</div>
				</div>
			</MotionScene>
		</ExamplePanel>
	);
}

export default function RevealRootPlaygroundPage() {
	const [runId, setRunId] = useState(0);

	return (
		<main>
			<Section padding="hero">
				<div className="flex flex-col gap-8">
					<header className="flex max-w-3xl flex-col gap-3">
						<Button
							href="/playground"
							size="sm"
							variant="ghost"
							className="w-fit"
						>
							Back to playground
						</Button>
						<div className="flex flex-col gap-2">
							<Text as="h1" variant="headingLg">
								Reveal Group Scheduler Playground
							</Text>
							<Text variant="body" tone="muted">
								This page verifies root-level items, root-scheduled groups,
								group-local staggering, stage gates, active gates, and disabled
								reveal mode. Use <code>?motion=off</code> or{" "}
								<code>?reveal=off</code> to confirm immediate rendering.
							</Text>
						</div>
						<div>
							<Button
								size="sm"
								variant="outline"
								onClick={() => setRunId((current) => current + 1)}
							>
								Reset local root
							</Button>
						</div>
					</header>

					<RevealRoot key={runId}>
						<ExamplePanel
							title="Standalone Root Items"
							api={<ApiLine>{"<RevealItem>...</RevealItem>"}</ApiLine>}
							expected="Each block registers directly with RevealRoot and uses root stagger."
							happens="The root sees three independent items ordered by their DOM position."
						>
							<div className="grid gap-3 md:grid-cols-3">
								{warmBlocks.map((className, index) => (
									<RevealItem key={className}>
										<ColorBlock
											className={className}
											label={`root item ${index + 1}`}
										/>
									</RevealItem>
								))}
							</div>
						</ExamplePanel>

						<ExamplePanel
							title="Single RevealGroup"
							api={
								<ApiLine>
									{"<RevealGroup><RevealGroupItem /></RevealGroup>"}
								</ApiLine>
							}
							expected="The root schedules the group once. Children stagger inside the group."
							happens="The wrapper itself does not animate; only RevealGroupItem children do."
						>
							<RevealGroup className="grid gap-3 md:grid-cols-3" stagger={0.22}>
								{coolBlocks.map((className, index) => (
									<RevealGroupItem key={className}>
										<ColorBlock
											className={className}
											label={`group child ${index + 1}`}
										/>
									</RevealGroupItem>
								))}
							</RevealGroup>
						</ExamplePanel>

						<ExamplePanel
							title="Multiple Groups In Root Order"
							api={<ApiLine>{"<RevealGroup /> <RevealGroup />"}</ApiLine>}
							expected="The root queue sees two groups, not six child items."
							happens="Group A starts its local stagger, then Group B starts from its own wrapper position."
						>
							<div className="grid gap-4 lg:grid-cols-2">
								<RevealGroup
									className="grid gap-3 md:grid-cols-3 lg:grid-cols-1"
									stagger={0.2}
								>
									{warmBlocks.map((className, index) => (
										<RevealGroupItem key={className}>
											<ColorBlock
												className={className}
												label={`group A.${index + 1}`}
											/>
										</RevealGroupItem>
									))}
								</RevealGroup>
								<RevealGroup
									className="grid gap-3 md:grid-cols-3 lg:grid-cols-1"
									stagger={0.2}
								>
									{pinkBlocks.map((className, index) => (
										<RevealGroupItem key={className}>
											<ColorBlock
												className={className}
												label={`group B.${index + 1}`}
											/>
										</RevealGroupItem>
									))}
								</RevealGroup>
							</div>
						</ExamplePanel>

						<ExamplePanel
							title="RevealItem Inside A Group"
							api={
								<ApiLine>
									{
										"<RevealGroup><RevealGroupItem /><RevealItem /></RevealGroup>"
									}
								</ApiLine>
							}
							expected="Only RevealGroupItem joins the local group queue."
							happens="The nested RevealItem still registers with RevealRoot, so it is useful as a contrast case."
						>
							<RevealGroup className="grid gap-3 md:grid-cols-3" stagger={0.24}>
								<RevealGroupItem>
									<ColorBlock className="bg-lime-400" label="local child 1" />
								</RevealGroupItem>
								<RevealItem>
									<ColorBlock
										className="bg-stone-500"
										label="root item child"
									/>
								</RevealItem>
								<RevealGroupItem>
									<ColorBlock
										className="bg-emerald-500"
										label="local child 2"
									/>
								</RevealGroupItem>
							</RevealGroup>
						</ExamplePanel>

						<ActiveGroupExample />

						<MotionSceneExample />

						<ExamplePanel
							title="Disabled Root"
							api={<ApiLine>{"<RevealRoot disabled>"}</ApiLine>}
							expected="Disabled reveal mode should show content immediately and should not stall group completion."
							happens="This nested root disables all reveal transforms while preserving visible content."
						>
							<RevealRoot disabled>
								<RevealGroup
									active={false}
									className="grid gap-3 md:grid-cols-3"
									stagger={0.22}
								>
									{greenBlocks.map((className, index) => (
										<RevealGroupItem key={className}>
											<ColorBlock
												className={className}
												label={`disabled ${index + 1}`}
											/>
										</RevealGroupItem>
									))}
								</RevealGroup>
							</RevealRoot>
						</ExamplePanel>

						<div
							id="group-row-stress-test"
							className="flex min-h-[45vh] items-end scroll-mt-24"
						>
							<RevealItem className="w-full">
								<div className="flex flex-col gap-2">
									<Text as="h2" variant="headingSm">
										Below-the-fold Group Rows
									</Text>
									<Text variant="body" tone="muted">
										Each row below is a separate RevealGroup. The root queue
										should see rows A, B, C, and D, while each row staggers its
										own RevealGroupItem blocks left to right.
									</Text>
								</div>
							</RevealItem>
						</div>

						<div className="flex flex-col gap-6">
							{stressRows.map((row) => (
								<RevealGroup
									key={row.id}
									className="grid gap-3 rounded-lg border border-border/10 bg-surface/40 p-3 md:grid-cols-[8rem_minmax(0,1fr)]"
									stagger={row.stagger}
								>
									<RevealGroupItem
										disableTransform
										className="flex min-h-32 items-center rounded-lg border border-border/10 bg-surface px-4"
									>
										<div className="flex flex-col gap-1">
											<Text variant="bodyStrong">{row.label}</Text>
											<Text variant="caption" tone="muted">
												Root group
											</Text>
										</div>
									</RevealGroupItem>
									<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
										{row.blocks.map((className, index) => (
											<RevealGroupItem key={`${row.id}-${className}`}>
												<ColorBlock
													className={className}
													label={`${row.label}.${index + 1}`}
												/>
											</RevealGroupItem>
										))}
									</div>
								</RevealGroup>
							))}
						</div>
					</RevealRoot>
				</div>
			</Section>
		</main>
	);
}
