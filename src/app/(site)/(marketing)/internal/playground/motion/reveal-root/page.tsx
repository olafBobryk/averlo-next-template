"use client";

import { useEffect, useState } from "react";
import { MotionScene } from "@/components/ui/motion/MotionScene";
import {
	RevealGroup,
	RevealItem,
	RevealRoot,
} from "@/components/ui/motion/Reveal";
import { RevealImage } from "@/components/ui/motion/RevealImage";
import { RevealText } from "@/components/ui/motion/RevealText";
import { ScrambleReveal } from "@/components/ui/motion/ScrambleReveal";
import { Button } from "@/components/ui/primitives/Button";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";

const colorTiles = [
	"bg-red-500",
	"bg-orange-500",
	"bg-amber-400",
	"bg-yellow-300",
	"bg-lime-400",
	"bg-green-500",
	"bg-emerald-500",
	"bg-teal-500",
	"bg-cyan-400",
	"bg-sky-500",
	"bg-blue-600",
	"bg-indigo-600",
	"bg-violet-600",
	"bg-purple-600",
	"bg-fuchsia-500",
	"bg-pink-500",
	"bg-rose-500",
	"bg-stone-500",
	"bg-red-300",
	"bg-orange-300",
	"bg-amber-200",
	"bg-yellow-200",
	"bg-lime-200",
	"bg-green-300",
	"bg-emerald-300",
	"bg-teal-300",
	"bg-cyan-200",
	"bg-sky-300",
	"bg-blue-400",
	"bg-indigo-400",
	"bg-violet-400",
	"bg-purple-400",
	"bg-fuchsia-300",
	"bg-pink-300",
	"bg-rose-300",
	"bg-zinc-400",
	"bg-red-800",
	"bg-orange-800",
	"bg-yellow-700",
	"bg-green-800",
	"bg-cyan-800",
	"bg-blue-900",
];

function ExamplePanel({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<Panel display="flex" padding="md" gap="md" shadow="none">
			<Text as="h2" variant="headingSm">
				{title}
			</Text>
			{children}
		</Panel>
	);
}

function ActiveRevealExample() {
	const [active, setActive] = useState(false);

	return (
		<ExamplePanel title="Active Gate">
			<div className="flex flex-wrap gap-2">
				<Button size="sm" variant="outline" onClick={() => setActive(false)}>
					Hide gate
				</Button>
				<Button size="sm" variant="primary" onClick={() => setActive(true)}>
					Open gate
				</Button>
			</div>
			<RevealItem active={active}>
				<div className="rounded-lg border border-border/10 bg-surface p-4">
					<Text variant="bodyStrong">This waits for active=true.</Text>
					<Text variant="body" tone="muted">
						When root motion is disabled, this content is visible immediately.
					</Text>
				</div>
			</RevealItem>
		</ExamplePanel>
	);
}

function DelayedRevealImage({
	delayMs,
	placeholder,
}: {
	delayMs: number;
	placeholder?: "blur";
}) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(false);
		const timeout = window.setTimeout(() => setMounted(true), delayMs);
		return () => window.clearTimeout(timeout);
	}, [delayMs]);

	if (!mounted) {
		return (
			<div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-dashed border-border/20 bg-surface">
				<Text variant="body" tone="muted">
					Waiting {delayMs}ms before image mount...
				</Text>
			</div>
		);
	}

	return (
		<RevealImage
			src={placeholder === "blur" ? "/test/blob.png" : "/test/mercury.png"}
			alt="Delayed reveal image"
			fill
			placeholder={placeholder}
			blurDataURL={
				placeholder === "blur"
					? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNsaGj4DwAFkgJcJzg6zQAAAABJRU5ErkJggg=="
					: undefined
			}
			className="w-full"
			contentClassName="aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/10 bg-surface"
			imageClassName="object-cover"
			fallback={
				<div className="flex h-full w-full items-center justify-center bg-surface-secondary">
					<Text variant="body" tone="muted">
						Image loading...
					</Text>
				</div>
			}
			fallbackClassName="flex items-center justify-center"
		/>
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
							href="/internal/playground"
							size="sm"
							variant="ghost"
							className="w-fit"
						>
							Back to playground
						</Button>
						<div className="flex flex-col gap-2">
							<Text as="h1" variant="headingLg">
								Reveal Root Playground
							</Text>
							<Text variant="body" tone="muted">
								Canonical reveal components now use visible-item scheduling. Use{" "}
								<code>?motion=off</code> or <code>?reveal=off</code> to disable
								reveals for automation.
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
						<div className="grid gap-4 lg:grid-cols-2">
							<ExamplePanel title="Plain RevealItem">
								<RevealItem>
									<div className="rounded-lg border border-border/10 bg-surface p-4">
										<Text variant="bodyStrong">Plain scheduled item</Text>
										<Text variant="body" tone="muted">
											This card only joins the root queue when this card becomes
											visible.
										</Text>
									</div>
								</RevealItem>
							</ExamplePanel>

							<ExamplePanel title="RevealItem asChild">
								<RevealItem asChild>
									<div className="rounded-lg border border-border/10 bg-surface-secondary p-4">
										<Text variant="bodyStrong">Slotted reveal</Text>
										<Text variant="body" tone="muted">
											The child keeps ownership of the DOM element.
										</Text>
									</div>
								</RevealItem>
							</ExamplePanel>

							<ExamplePanel title="asChild Handoff">
								<div className="rounded-lg bg-[repeating-linear-gradient(90deg,var(--color-foreground)_0_16px,var(--color-background)_16px_32px)] p-4">
									<RevealItem asChild handoffAfterReveal>
										<div className="rounded-lg border border-white/25 bg-white/20 p-4 shadow-lg backdrop-blur-md transition-opacity duration-300">
											<Text variant="bodyStrong">Backdrop-blur handoff</Text>
											<Text variant="body">
												Child transitions are suppressed during reveal and
												restored after opacity reaches the final state.
											</Text>
										</div>
									</RevealItem>
								</div>
							</ExamplePanel>

							<ExamplePanel title="RevealGroup Compatibility">
								<RevealGroup className="grid gap-3" stagger={0.06}>
									<RevealItem>
										<div className="rounded-lg border border-border/10 bg-surface p-4">
											<Text variant="bodyStrong">Group item one</Text>
										</div>
									</RevealItem>
									<RevealItem>
										<div className="rounded-lg border border-border/10 bg-surface p-4">
											<Text variant="bodyStrong">Group item two</Text>
										</div>
									</RevealItem>
								</RevealGroup>
							</ExamplePanel>
						</div>

						<div className="grid gap-4 lg:grid-cols-2">
							<ExamplePanel title="RevealText">
								<RevealText as="h2" variant="headingSm">
									Characters inherit the scheduled parent reveal.
								</RevealText>
								<RevealItem>
									<Text variant="body" tone="muted">
										Character stagger starts when the text item enters the root
										queue.
									</Text>
								</RevealItem>
							</ExamplePanel>

							<ExamplePanel title="RevealImage">
								<RevealImage
									src="/test/blob.png"
									alt="Abstract blob"
									fill
									className="w-full"
									contentClassName="aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/10 bg-surface"
									imageClassName="object-cover"
								/>
							</ExamplePanel>
						</div>

						<ExamplePanel title="RevealImage Blur Placeholder">
							<RevealImage
								src="/test/blob.png"
								alt="Blur placeholder reveal"
								fill
								placeholder="blur"
								blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNsaGj4DwAFkgJcJzg6zQAAAABJRU5ErkJggg=="
								className="w-full"
								contentClassName="aspect-[16/7] w-full overflow-hidden rounded-lg border border-border/10 bg-surface"
								imageClassName="object-cover"
							/>
						</ExamplePanel>

						<div className="grid gap-4 lg:grid-cols-2">
							<ExamplePanel title="Delayed Image Loading">
								<DelayedRevealImage delayMs={1400} />
								<Text variant="body" tone="muted">
									The image component mounts after a deliberate delay so the
									fallback and scheduler handoff are easy to inspect.
								</Text>
							</ExamplePanel>

							<ExamplePanel title="Delayed Blur Placeholder">
								<DelayedRevealImage delayMs={1800} placeholder="blur" />
								<Text variant="body" tone="muted">
									This uses Next Image blur placeholder plus the reveal
									scheduler after delayed mount.
								</Text>
							</ExamplePanel>
						</div>

						<ActiveRevealExample />

						<ExamplePanel title="MotionScene waitFor / unlockStage">
							<MotionScene>
								<div className="grid gap-4 lg:grid-cols-2">
									<RevealImage
										src="/test/mercury.png"
										alt="Motion scene media"
										fill
										waitFor="app"
										unlockStage="media"
										className="w-full"
										contentClassName="aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/10 bg-surface"
										imageClassName="object-cover"
									/>
									<div className="flex flex-col gap-3">
										<RevealGroup waitFor="media" unlockStage="content">
											<RevealItem>
												<Text variant="headingSm">
													Content waits for the image reveal.
												</Text>
											</RevealItem>
											<RevealItem>
												<Text variant="body" tone="muted">
													The group unlocks after its scheduled children
													complete.
												</Text>
											</RevealItem>
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

						<ExamplePanel title="Disabled Root">
							<RevealRoot disabled>
								<div className="grid gap-3 md:grid-cols-3">
									<RevealItem>
										<div className="rounded-lg bg-emerald-500 p-4 text-white">
											Disabled roots show immediately.
										</div>
									</RevealItem>
									<RevealItem active={false}>
										<div className="rounded-lg bg-sky-500 p-4 text-white">
											Active gates are ignored in disabled mode.
										</div>
									</RevealItem>
									<RevealText as="p" variant="bodyStrong">
										Text appears without waiting.
									</RevealText>
								</div>
							</RevealRoot>
						</ExamplePanel>

						<div className="flex min-h-[50vh] items-end">
							<RevealItem className="w-full">
								<div className="flex flex-col gap-2">
									<Text as="h2" variant="headingSm">
										Color field
									</Text>
									<Text variant="body" tone="muted">
										A dense batch below the fold makes the scheduler timing
										easier to judge while scrolling.
									</Text>
								</div>
							</RevealItem>
						</div>

						<div className="grid grid-cols-3 gap-3">
							{colorTiles.map((className, index) => (
								<RevealItem key={className}>
									<div
										className={[
											"flex min-h-28 items-end rounded-lg border border-foreground/10 p-3 shadow-sm",
											className,
										].join(" ")}
									>
										<span className="rounded bg-background/85 px-2 py-1 text-xs font-medium text-foreground">
											{String(index + 1).padStart(2, "0")}
										</span>
									</div>
								</RevealItem>
							))}
						</div>
					</RevealRoot>
				</div>
			</Section>
		</main>
	);
}
