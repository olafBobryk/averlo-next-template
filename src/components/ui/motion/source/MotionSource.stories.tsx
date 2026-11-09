import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { cubicBezier } from "motion";
import Link from "next/link";
import { useState } from "react";
import { expect, userEvent, waitFor } from "storybook/test";
import { focusRing } from "@/components/ui/foundations/focus";
import { motionTiming } from "@/components/ui/foundations/motionTiming";
import * as MotionEffect from "@/components/ui/motion/effect";
import { Button } from "@/components/ui/primitives/Button";
import { Panel } from "@/components/ui/primitives/surfaces";
import { Text } from "@/components/ui/primitives/Text";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import type { MotionCompositionMetadata } from "../compositionMetadata";
import * as MotionSource from "./index";
import { catalogContract } from "./MotionSource.catalog";
import { getScrollSequenceRanges } from "./MotionSourceSequence";

function DriverParityComposition() {
	const [ready, setReady] = useState(false);
	const [cycle, setCycle] = useState(0);
	return (
		<div className="mx-auto grid max-w-3xl gap-6 p-8">
			<Button
				onClick={() => {
					setReady(true);
					setCycle((value) => value + 1);
				}}
			>
				{ready ? "Replay identical reveal" : "Start identical reveal"}
			</Button>
			<MotionSource.Sequence key={cycle} stagger={0.18}>
				{[
					"First shared reveal",
					"Second shared reveal",
					"Third shared reveal",
				].map((label) => (
					<MotionSource.Root
						key={label}
						strategy={{ type: "reveal", ready, duration: 1.2 }}
					>
						<MotionEffect.Entrance distance={24}>
							<Panel padding="md">{label}</Panel>
						</MotionEffect.Entrance>
					</MotionSource.Root>
				))}
			</MotionSource.Sequence>
			<MotionSource.Root strategy={{ type: "hover" }} asChild>
				<button
					type="button"
					className={`border border-subtle p-4 ${focusRing.visibleDefault}`}
				>
					<MotionEffect.UnderlineText>
						Hover or focus remains Motion
					</MotionEffect.UnderlineText>
				</button>
			</MotionSource.Root>
		</div>
	);
}

const verifyDriverComposition: NonNullable<Story["play"]> = async ({
	canvas,
	canvasElement,
	parameters,
}) => {
	const sources = [
		...canvasElement.querySelectorAll('[data-motion-source-strategy="reveal"]'),
	];
	await waitFor(() =>
		expect(sources[0]).toHaveAttribute("data-motion-source-mode", "animated"),
	);
	for (const source of sources)
		expect(source).toHaveAttribute(
			"data-motion-source-driver",
			parameters.motionDriver === "motion" ? "motion" : "gsap",
		);
	expect(
		canvasElement.querySelector('[data-motion-source-strategy="hover"]'),
	).toHaveAttribute("data-motion-source-driver", "motion");
	let effects = sources.map(
		(source) =>
			source.querySelector('[data-motion-effect="entrance"]') as HTMLElement,
	);
	await userEvent.click(
		canvas.getByRole("button", { name: "Start identical reveal" }),
	);
	effects = [
		...canvasElement.querySelectorAll(
			'[data-motion-source-strategy="reveal"] [data-motion-effect="entrance"]',
		),
	] as HTMLElement[];
	const samples: number[][] = [];
	await new Promise<void>((resolve) => {
		const start = performance.now();
		const sample = () => {
			samples.push(
				effects.map((effect) => Number(getComputedStyle(effect).opacity)),
			);
			if (performance.now() - start < 2100) requestAnimationFrame(sample);
			else resolve();
		};
		requestAnimationFrame(sample);
	});
	expect(samples.some((values) => values[0] > 0.05 && values[0] < 0.95)).toBe(
		true,
	);
	const starts = effects.map((_, index) =>
		samples.findIndex((values) => values[index] > 0.05),
	);
	expect(starts[0]).toBeGreaterThanOrEqual(0);
	expect(starts[1]).toBeGreaterThan(starts[0]);
	expect(starts[2]).toBeGreaterThan(starts[1]);
	await waitFor(() => {
		for (const effect of effects)
			expect(Number(getComputedStyle(effect).opacity)).toBeGreaterThan(0.99);
	});
};

export const HybridComposition: Story = {
	args: { children: null, strategy: { type: "reveal" } },
	parameters: { motionDriver: "hybrid" },
	render: () => <DriverParityComposition />,
	play: verifyDriverComposition,
};

export const MotionComposition: Story = {
	args: { children: null, strategy: { type: "reveal" } },
	parameters: { motionDriver: "motion" },
	render: () => <DriverParityComposition />,
	play: verifyDriverComposition,
};

function StrategyTeachingSurface() {
	const [active, setActive] = useState(false);
	return (
		<div className="grid max-w-5xl gap-6 p-8 md:grid-cols-3">
			<div className="grid gap-2">
				<Text variant="caption" tone="muted">
					Root hover
				</Text>
				<div
					className="rounded-lg border border-subtle p-5 text-xl"
					data-testid="direct-hover-boundary"
				>
					<MotionSource.Root
						asChild
						strategy={{ type: "hover", timing: "smooth" }}
					>
						<Link
							className={`inline-flex rounded-sm ${focusRing.visibleDefault}`}
							href="/direct-source"
						>
							<MotionEffect.UnderlineText>
								Hover or focus this text
							</MotionEffect.UnderlineText>
						</Link>
					</MotionSource.Root>
				</div>
			</div>
			<div className="grid gap-2">
				<Text variant="caption" tone="muted">
					Nearest owner
				</Text>
				<Link
					data-motion-owner
					className={`rounded-lg border border-subtle p-5 text-xl ${focusRing.visibleDefault}`}
					href="/owner-source"
				>
					<MotionSource.Root as="span" strategy={{ type: "owner-hover" }}>
						<MotionEffect.UnderlineText>
							Owner hover wraps this title across lines
						</MotionEffect.UnderlineText>
					</MotionSource.Root>
				</Link>
			</div>
			<Panel padding="md">
				<Button
					onClick={() => setActive((value) => !value)}
					size="sm"
					variant="secondary"
				>
					Toggle boolean
				</Button>
				<MotionSource.Root strategy={{ type: "boolean", active }}>
					<MotionEffect.TextHighlight className="mt-4 block text-lg">
						Boolean progress highlights this copy.
					</MotionEffect.TextHighlight>
				</MotionSource.Root>
			</Panel>
			<MotionSource.Root
				className="md:col-span-3"
				strategy={{ type: "in-view", once: false }}
			>
				<MotionEffect.Entrance>
					<Panel padding="md">
						In-view source uses the same Entrance effect.
					</Panel>
				</MotionEffect.Entrance>
			</MotionSource.Root>
		</div>
	);
}

const meta = {
	id: "ui-motion-motion-source",
	title: "UI/Motion/MotionSource",
	component: MotionSource.Root,
	subcomponents: { "MotionSource.Sequence": MotionSource.Sequence },
	excludeStories: ["catalogContract"],
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		layout: "fullscreen",
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta<typeof MotionSource.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StrategyMatrix: Story = {
	args: {
		children: <span>Source content</span>,
		strategy: { type: "boolean", active: true },
	},
	render: () => <StrategyTeachingSurface />,
	play: async ({ canvas }) => {
		const direct = canvas.getByRole("link", {
			name: "Hover or focus this text",
		});
		const directBoundary = canvas.getByTestId("direct-hover-boundary");
		const owner = canvas.getByRole("link", {
			name: "Owner hover wraps this title across lines",
		});
		await expect(direct).toHaveAttribute(
			"data-motion-source-strategy",
			"hover",
		);
		await expect(direct).toHaveAttribute("data-motion-source-timing", "smooth");
		await waitFor(() => expect(allLinesHidden(direct)).toBe(true));
		await userEvent.hover(directBoundary);
		await waitFor(() => expect(allLinesHidden(direct)).toBe(true));
		await userEvent.unhover(directBoundary);
		await userEvent.hover(direct);
		await waitFor(() => expect(allLinesDrawn(direct)).toBe(true));
		await userEvent.unhover(direct);
		await waitFor(() => expect(allLinesHidden(direct)).toBe(true));
		await expect(owner).toHaveAttribute("data-motion-owner");
		await userEvent.hover(owner);
		await waitFor(() => expect(allLinesDrawn(owner)).toBe(true));
		await userEvent.unhover(owner);
		await waitFor(() => expect(allLinesHidden(owner)).toBe(true));
		await userEvent.tab();
		await expect(direct).toHaveFocus();
		await waitFor(() => expect(allLinesDrawn(direct)).toBe(true));
		await userEvent.click(
			canvas.getByRole("button", { name: "Toggle boolean" }),
		);
		await expect(
			canvas.getByText("Boolean progress highlights this copy."),
		).toBeVisible();
	},
};

export const SharedScrollScene: Story = {
	args: { children: <span>Scroll content</span>, strategy: { type: "scroll" } },
	render: () => (
		<div className="min-h-[220vh] overflow-hidden bg-foreground px-8 py-[80vh] text-background">
			<MotionSource.Root
				className="mx-auto grid max-w-5xl gap-8"
				strategy={{
					type: "scroll",
					offset: ["start 85%", "start 25%"],
					staticProgress: 1,
				}}
			>
				<MotionEffect.TextShift className="whitespace-nowrap text-6xl font-semibold">
					Shared scene text
				</MotionEffect.TextShift>
				<MotionEffect.TextReplay
					className="text-2xl uppercase tracking-[0.2em]"
					repeats={2}
					text="Scroll down"
				/>
				<MotionEffect.Divider />
			</MotionSource.Root>
		</div>
	),
	play: async ({ canvasElement }) => {
		const source = canvasElement.querySelector(
			'[data-motion-source-strategy="scroll"]',
		);
		await expect(source).toBeInTheDocument();
		await expect(source?.querySelectorAll("[data-motion-effect]")).toHaveLength(
			3,
		);
	},
};

export const HybridDriverBoundary: Story = {
	args: { children: <span>Hybrid source</span>, strategy: { type: "scroll" } },
	render: () => (
		<div className="min-h-[260vh] bg-background px-6 py-12 text-foreground sm:px-10">
			<div className="mx-auto grid max-w-4xl gap-6">
				<div className="grid gap-2">
					<Text as="h2" variant="headingLg">
						One composition API, two focused drivers
					</Text>
					<Text tone="muted">
						GSAP owns reveal and scroll progress. Motion remains responsible for
						direct interaction.
					</Text>
				</div>

				<MotionSource.Root strategy={{ type: "reveal" }}>
					<MotionEffect.Entrance>
						<Panel padding="md">
							<Text variant="caption" tone="muted">
								GSAP reveal source
							</Text>
							<Text className="mt-2" variant="headingLg">
								The scheduler still composes this reusable effect.
							</Text>
						</Panel>
					</MotionEffect.Entrance>
				</MotionSource.Root>

				<MotionSource.Root
					asChild
					strategy={{ type: "hover", timing: "smooth" }}
				>
					<button
						className={`rounded-lg border border-subtle p-6 text-start ${focusRing.visibleDefault}`}
						type="button"
					>
						<Text variant="caption" tone="muted">
							Motion hover source
						</Text>
						<MotionEffect.UnderlineText className="mt-2 block text-xl font-medium">
							Hover or focus stays attached to your hand.
						</MotionEffect.UnderlineText>
					</button>
				</MotionSource.Root>

				<MotionSource.Root
					className="mt-[70vh]"
					strategy={{ type: "in-view", once: false }}
				>
					<MotionEffect.Entrance distance={32}>
						<Panel padding="md">
							<Text variant="caption" tone="muted">
								GSAP in-view source
							</Text>
							<Text className="mt-2" variant="headingLg">
								Scroll away and return to replay the same effect.
							</Text>
						</Panel>
					</MotionEffect.Entrance>
				</MotionSource.Root>

				<MotionSource.Root
					className="mt-[55vh] grid gap-4"
					strategy={{
						offset: ["start 88%", "end 28%"],
						type: "scroll",
					}}
				>
					<Text variant="caption" tone="muted">
						GSAP ScrollTrigger progress
					</Text>
					<MotionEffect.TextHighlight className="text-4xl font-medium sm:text-6xl">
						One progress source still coordinates every descendant effect.
					</MotionEffect.TextHighlight>
					<MotionEffect.Divider />
				</MotionSource.Root>
			</div>
		</div>
	),
	play: async ({ canvasElement }) => {
		const sources = Array.from(
			canvasElement.querySelectorAll<HTMLElement>("[data-motion-source]"),
		);
		const driverFor = (strategy: string) =>
			sources.find((source) => source.dataset.motionSourceStrategy === strategy)
				?.dataset.motionSourceDriver;

		await expect(driverFor("reveal")).toBe("gsap");
		await expect(driverFor("in-view")).toBe("gsap");
		await expect(driverFor("scroll")).toBe("gsap");
		await expect(driverFor("hover")).toBe("motion");
		await waitFor(
			() => {
				const entrance = canvasElement.querySelector<HTMLElement>(
					'[data-motion-effect="entrance"]',
				);
				expect(
					Number.parseFloat(entrance?.style.opacity ?? "0"),
				).toBeGreaterThan(0.99);
			},
			{ timeout: 3000 },
		);
	},
};

export const RevealSequence: Story = {
	args: { children: <span>Reveal content</span>, strategy: { type: "reveal" } },
	render: () => (
		<MotionSource.Sequence
			className="grid max-w-3xl gap-4 p-8 sm:grid-cols-3"
			stagger={0.1}
		>
			{["First", "Second", "Third"].map((label) => (
				<MotionSource.Root key={label} strategy={{ type: "reveal" }}>
					<MotionEffect.Entrance>
						<Panel padding="md">{label} participant</Panel>
					</MotionEffect.Entrance>
				</MotionSource.Root>
			))}
		</MotionSource.Sequence>
	),
	play: async ({ canvas, canvasElement }) => {
		const sequence = canvasElement.querySelector(
			"[data-motion-source-sequence]",
		);
		await expect(sequence).toHaveAttribute(
			"data-motion-source-sequence-once",
			"false",
		);
		await waitFor(() =>
			expect(canvas.getByText("First participant")).toBeVisible(),
		);
		await expect(
			canvasElement.querySelectorAll('[data-motion-source-strategy="reveal"]'),
		).toHaveLength(3);
		await waitFor(
			() => {
				const effects = Array.from(
					canvasElement.querySelectorAll<HTMLElement>(
						'[data-motion-effect="entrance"]',
					),
				);
				expect(effects).toHaveLength(3);
				expect(
					effects.every(
						(effect) => Number.parseFloat(effect.style.opacity) >= 0.99,
					),
				).toBe(true);
			},
			{ timeout: 3000 },
		);
	},
};

export const RevealViewportReentry: Story = {
	args: { children: <span>Replay content</span>, strategy: { type: "reveal" } },
	render: () => (
		<div className="min-h-[260vh] bg-background p-8">
			<MotionSource.Sequence
				className="grid max-w-3xl gap-4 sm:grid-cols-3"
				stagger={0.1}
			>
				{["First", "Second", "Third"].map((label) => (
					<MotionSource.Root key={label} strategy={{ type: "reveal" }}>
						<MotionEffect.Entrance>
							<Panel padding="md">{label} replay participant</Panel>
						</MotionEffect.Entrance>
					</MotionSource.Root>
				))}
			</MotionSource.Sequence>
			<Text className="mt-[190vh]" tone="muted" variant="caption">
				Scroll back to the top to replay the staggered batch.
			</Text>
		</div>
	),
	play: async ({ canvasElement }) => {
		const view = canvasElement.ownerDocument.defaultView;
		if (!view) throw new Error("Story viewport is unavailable.");
		const sequence = canvasElement.querySelector(
			"[data-motion-source-sequence]",
		);
		const effects = () =>
			Array.from(
				canvasElement.querySelectorAll<HTMLElement>(
					'[data-motion-effect="entrance"]',
				),
			);
		const allAtOpacity = (opacity: number) =>
			effects().length === 3 &&
			effects().every(
				(effect) =>
					Math.abs(Number.parseFloat(effect.style.opacity) - opacity) < 0.01,
			);

		view.scrollTo(0, 0);
		await expect(sequence).toHaveAttribute(
			"data-motion-source-sequence-once",
			"false",
		);
		await expect(sequence).toHaveAttribute(
			"data-motion-source-sequence-stagger",
			"0.1",
		);
		await waitFor(() => expect(allAtOpacity(1)).toBe(true), { timeout: 3000 });

		view.scrollTo(0, canvasElement.ownerDocument.documentElement.scrollHeight);
		await waitFor(() => expect(allAtOpacity(0)).toBe(true), { timeout: 3000 });

		view.scrollTo(0, 0);
		await waitFor(() => expect(allAtOpacity(1)).toBe(true), { timeout: 3000 });
	},
};

function FooterHeadingHandoffSurface() {
	const [active, setActive] = useState(false);
	return (
		<section
			aria-label="Footer heading handoff composition"
			className="grid min-h-[30rem] content-end gap-8 bg-background p-8 text-foreground"
		>
			<Button
				onClick={() => setActive((value) => !value)}
				size="sm"
				variant="primary"
			>
				{active ? "Reset footer heading" : "Complete footer heading"}
			</Button>
			<MotionSource.Root strategy={{ type: "boolean", active, timing: "slow" }}>
				<Text as="h2" theme="dark" variant="headingPage">
					<MotionEffect.TextStagger
						as="span"
						className="block"
						range={[0, 0.72]}
						theme="dark"
						treatment="blur"
						unit="words"
					>
						Finish the story
					</MotionEffect.TextStagger>
					<MotionEffect.TextShift className="mt-2 block" range={[0.18, 1]}>
						<MotionEffect.TextStagger
							as="span"
							theme="dark"
							treatment="blur"
							unit="words"
						>
							with a clear next step
						</MotionEffect.TextStagger>
					</MotionEffect.TextShift>
				</Text>
			</MotionSource.Root>
		</section>
	);
}

export const FooterHeadingHandoff: Story = {
	args: {
		children: <span>Footer heading handoff</span>,
		strategy: { type: "boolean", active: false },
	},
	parameters: {
		motionComposition: {
			effects: ["text-stagger", "text-shift"],
			focusHints: ["shell", "page"],
			role: "footer-heading-handoff",
			schemaVersion: 1,
			staticPattern: "split-heading",
			sources: ["boolean"],
			status: "approved",
		} satisfies MotionCompositionMetadata,
	},
	render: () => <FooterHeadingHandoffSurface />,
	play: async ({ canvas, canvasElement }) => {
		await expect(
			canvas.getByRole("heading", { name: /finish the story/i }),
		).toBeInTheDocument();
		await expect(
			canvasElement.querySelectorAll('[data-motion-effect="text-stagger"]'),
		).toHaveLength(2);
		await expect(
			canvasElement.querySelector('[data-motion-effect="text-shift"]'),
		).not.toBeNull();
		await userEvent.click(
			canvas.getByRole("button", { name: "Complete footer heading" }),
		);
		const firstToken = canvasElement.querySelector<HTMLElement>(
			"[data-motion-effect-text-stagger-token] > span",
		);
		if (!firstToken)
			throw new Error("Footer heading did not render text tokens.");
		await waitFor(() =>
			expect(Number(getComputedStyle(firstToken).opacity)).toBe(1),
		);
	},
};

export const QuoteScrollHighlight: Story = {
	args: {
		children: <span>Quote scroll highlight composition</span>,
		strategy: { type: "scroll" },
	},
	parameters: {
		motionComposition: {
			effects: ["entrance", "text-highlight", "grid-reveal"],
			focusHints: ["section", "page"],
			role: "quote-scroll-highlight",
			schemaVersion: 1,
			staticPattern: "quote-with-supporting-media",
			sources: ["scroll"],
			status: "approved",
		} satisfies MotionCompositionMetadata,
	},
	render: () => (
		<div className="min-h-[220vh] bg-background px-8 py-[80vh] text-foreground">
			<section
				aria-label="Quote scroll highlight composition"
				className="mx-auto max-w-5xl"
			>
				<MotionSource.Root
					className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)] md:items-end"
					strategy={{
						offset: ["start 84%", "start 38%"],
						smooth: true,
						staticProgress: 1,
						type: "scroll",
					}}
				>
					<div className="grid gap-6">
						<MotionEffect.Entrance>
							<MotionEffect.TextHighlight
								as="blockquote"
								theme="dark"
								variant="headingLg"
							>
								A clear conviction earns attention before it asks for action.
							</MotionEffect.TextHighlight>
						</MotionEffect.Entrance>
					</div>
					<div
						aria-label="Abstract supporting media"
						className="relative aspect-[4/5] overflow-hidden rounded-xl"
						role="img"
					>
						<MotionEffect.GridReveal
							tileStyle={{
								backgroundImage:
									"radial-gradient(circle at 30% 24%, var(--color-primary), transparent 28%), linear-gradient(145deg, var(--color-surface), var(--color-foreground))",
							}}
						/>
					</div>
				</MotionSource.Root>
			</section>
		</div>
	),
	play: async ({ canvas, canvasElement }) => {
		await expect(
			canvas.getByText(/clear conviction earns attention/i),
		).toBeInTheDocument();
		await expect(
			canvasElement.querySelector('[data-motion-source-strategy="scroll"]'),
		).not.toBeNull();
		await expect(
			canvasElement.querySelector('[data-motion-effect="text-highlight"]'),
		).not.toBeNull();
		await expect(
			canvasElement.querySelector('[data-motion-effect="grid-reveal"]'),
		).not.toBeNull();
	},
};

export const ReducedMotion: Story = {
	args: { children: <span>Reduced motion</span>, strategy: { type: "scroll" } },
	beforeEach: () => {
		const previous = document.documentElement.dataset.motionOverride;
		document.documentElement.dataset.motionOverride = "off";
		return () => {
			if (previous === undefined)
				delete document.documentElement.dataset.motionOverride;
			else document.documentElement.dataset.motionOverride = previous;
		};
	},
	render: () => (
		<div className="grid max-w-xl gap-5 p-8">
			<MotionSource.Root strategy={{ type: "scroll" }}>
				<MotionEffect.Entrance>Completed scroll fallback</MotionEffect.Entrance>
			</MotionSource.Root>
			<MotionSource.Root asChild strategy={{ type: "hover" }}>
				<button className="rounded border border-subtle p-4" type="button">
					<MotionEffect.UnderlineText>
						Immediate interaction feedback
					</MotionEffect.UnderlineText>
				</button>
			</MotionSource.Root>
		</div>
	),
	play: async ({ canvas }) => {
		await waitFor(() =>
			expect(canvas.getByText("Completed scroll fallback")).toBeVisible(),
		);
		const button = canvas.getByRole("button", {
			name: "Immediate interaction feedback",
		});
		await userEvent.hover(button);
		await waitFor(() => expect(allLinesDrawn(button)).toBe(true));
	},
};

function allLinesDrawn(root: Element | null) {
	const lines = Array.from(root?.querySelectorAll("line") ?? []);
	return (
		lines.length > 0 &&
		lines.every((line) => line.getAttribute("x1") !== line.getAttribute("x2"))
	);
}

function allLinesHidden(root: Element | null) {
	const lines = Array.from(root?.querySelectorAll("line") ?? []);
	return (
		lines.length > 0 &&
		lines.every((line) => line.getAttribute("x1") === line.getAttribute("x2"))
	);
}

export const MotionViewportReentry: Story = {
	...RevealViewportReentry,
	parameters: { ...RevealViewportReentry.parameters, motionDriver: "motion" },
};

const catchUpOffset: MotionSource.SequenceScrollOffset = [
	"start 100%",
	"start 50%",
];
const progressTolerance = 0.03;

function resetStoryScroll() {
	window.scrollTo(0, 0);
	return () => window.scrollTo(0, 0);
}

function scrollSequence(root: HTMLElement) {
	const sequence = root.querySelector<HTMLElement>(
		'[data-motion-source-sequence-mode="scroll"]',
	);
	if (!sequence) throw new Error("Scroll sequence did not render.");
	return sequence;
}

function itemEffects(root: HTMLElement) {
	return Array.from(
		root.querySelectorAll<HTMLElement>(
			'[data-motion-source-item] [data-motion-effect="entrance"]',
		),
	);
}

function itemRanges(root: HTMLElement) {
	return Array.from(
		root.querySelectorAll<HTMLElement>("[data-motion-source-item]"),
		(item) =>
			(item.dataset.motionSourceItemRange ?? "0 1").split(" ").map(Number) as [
				number,
				number,
			],
	);
}

function opacityOf(element: HTMLElement) {
	return Number(getComputedStyle(element).opacity);
}

function sliceOf(value: number, [start, end]: readonly [number, number]) {
	return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

/** The `slow` token curve, built here from the token, not the runtime. */
const slowCurve = cubicBezier(
	...(motionTiming.slow.ease as [number, number, number, number]),
);

/** Where pure scrolling puts an item: its slice position eased on `slow`. */
function easedSliceOf(value: number, range: readonly [number, number]) {
	return slowCurve(sliceOf(value, range));
}

/** Live progress of a `["start A%", "start B%"]` offset from the element rect. */
function liveProgress(element: HTMLElement, from: number, to: number) {
	const height = window.innerHeight;
	const top = element.getBoundingClientRect().top;
	return Math.min(
		1,
		Math.max(0, (height * from - top) / (height * (from - to))),
	);
}

/** Finish on the fully revealed state so the a11y scan sees settled content. */
async function scrollUntilRevealed(root: HTMLElement) {
	window.scrollTo(0, root.ownerDocument.documentElement.scrollHeight);
	await waitFor(
		() => {
			for (const effect of itemEffects(root))
				expect(opacityOf(effect)).toBeGreaterThan(0.99);
		},
		{ timeout: 3000 },
	);
}

function sampleFrames(effects: HTMLElement[], durationMs: number) {
	return new Promise<number[][]>((resolve) => {
		const samples: number[][] = [];
		const start = performance.now();
		const sample = () => {
			samples.push(effects.map(opacityOf));
			if (performance.now() - start < durationMs) requestAnimationFrame(sample);
			else resolve(samples);
		};
		sample();
	});
}

function ScrollRevealFixture({
	count,
	lead,
	offset,
	stagger,
}: {
	count: number;
	lead: "catch-up" | "below-fold";
	offset?: MotionSource.SequenceScrollOffset;
	stagger?: number;
}) {
	return (
		<div className="min-h-[320vh] bg-background text-foreground">
			<div className={lead === "catch-up" ? "h-[75vh]" : "h-[150vh]"} />
			<MotionSource.Sequence
				className="grid max-w-3xl gap-4 px-8"
				mode="scroll"
				offset={offset}
				stagger={stagger}
			>
				{["First", "Second", "Third"].slice(0, count).map((label) => (
					<MotionSource.Item key={label}>
						<MotionEffect.Entrance>
							<Panel padding="md">{label} scroll item</Panel>
						</MotionEffect.Entrance>
					</MotionSource.Item>
				))}
			</MotionSource.Sequence>
		</div>
	);
}

const verifyScrubFollowsScroll: NonNullable<Story["play"]> = async ({
	canvasElement,
}) => {
	const sequence = scrollSequence(canvasElement);
	const [effect] = itemEffects(canvasElement);
	await waitFor(() =>
		expect(sequence).toHaveAttribute("data-motion-source-mode", "animated"),
	);
	const documentTop = sequence.getBoundingClientRect().top + window.scrollY;
	const scrollToProgress = (value: number) =>
		window.scrollTo(0, documentTop - window.innerHeight * (0.95 - 0.4 * value));
	await waitFor(() => expect(opacityOf(effect)).toBe(0));
	for (const target of [0.25, 0.75, 1, 0.5, 0]) {
		scrollToProgress(target);
		await waitFor(
			() => {
				const live = liveProgress(sequence, 0.95, 0.55);
				expect(Math.abs(live - target)).toBeLessThan(progressTolerance);
				const opacity = opacityOf(effect);
				// The item follows its slice eased on `slow`, not linearly.
				expect(Math.abs(opacity - easedSliceOf(live, [0, 1]))).toBeLessThan(
					progressTolerance,
				);
				if (target > 0 && target < 1)
					expect(opacity - live).toBeGreaterThan(0.1);
			},
			{ timeout: 3000 },
		);
	}
	await scrollUntilRevealed(canvasElement);
};

const verifyCatchUpStopsAtScrollProgress: NonNullable<Story["play"]> = async ({
	canvasElement,
}) => {
	const sequence = scrollSequence(canvasElement);
	const effects = itemEffects(canvasElement);
	expect(effects).toHaveLength(2);
	const samples = await sampleFrames(effects, 1600);
	const live = liveProgress(sequence, 1, 0.5);
	expect(Math.abs(live - 0.5)).toBeLessThan(progressTolerance);
	const ranges = itemRanges(canvasElement);
	ranges.forEach((range, index) => {
		// The scroll-scrub value for this position: the intro lands on it.
		const expected = easedSliceOf(live, range);
		const values = samples.map((frame) => frame[index]);
		// Animated up from hidden, never beyond, and settled exactly there.
		expect(Math.min(...values)).toBeLessThan(expected * 0.6);
		expect(Math.max(...values)).toBeLessThanOrEqual(
			expected + progressTolerance,
		);
		expect(Math.abs((values.at(-1) ?? 0) - expected)).toBeLessThan(
			progressTolerance,
		);
	});
	// After the intro the slice follows scroll again, and scrolling back to
	// the load position reproduces exactly the value the intro landed on.
	const landed = samples.at(-1) ?? [];
	const loadScroll = window.scrollY;
	window.scrollTo(0, window.innerHeight * 0.1);
	await waitFor(
		() => {
			const next = liveProgress(sequence, 1, 0.5);
			effects.forEach((effect, index) => {
				expect(
					Math.abs(opacityOf(effect) - easedSliceOf(next, ranges[index])),
				).toBeLessThan(progressTolerance);
			});
		},
		{ timeout: 3000 },
	);
	window.scrollTo(0, loadScroll);
	await waitFor(
		() => {
			effects.forEach((effect, index) => {
				expect(Math.abs(opacityOf(effect) - landed[index])).toBeLessThan(
					progressTolerance,
				);
			});
		},
		{ timeout: 3000 },
	);
	await scrollUntilRevealed(canvasElement);
};

export const ScrollRevealScrub: Story = {
	args: { children: null, strategy: { type: "scroll" } },
	beforeEach: resetStoryScroll,
	render: () => <ScrollRevealFixture count={1} lead="below-fold" />,
	play: verifyScrubFollowsScroll,
};

export const ScrollRevealScrubMotionDriver: Story = {
	...ScrollRevealScrub,
	parameters: { motionDriver: "motion" },
};

export const ScrollRevealCatchUp: Story = {
	args: { children: null, strategy: { type: "scroll" } },
	beforeEach: resetStoryScroll,
	render: () => (
		<ScrollRevealFixture count={2} lead="catch-up" offset={catchUpOffset} />
	),
	play: verifyCatchUpStopsAtScrollProgress,
};

export const ScrollRevealCatchUpMotionDriver: Story = {
	...ScrollRevealCatchUp,
	parameters: { motionDriver: "motion" },
};

export const ScrollRevealCatchUpRetarget: Story = {
	args: { children: null, strategy: { type: "scroll" } },
	beforeEach: resetStoryScroll,
	render: () => (
		<ScrollRevealFixture count={2} lead="catch-up" offset={catchUpOffset} />
	),
	play: async ({ canvasElement }) => {
		const sequence = scrollSequence(canvasElement);
		const effects = itemEffects(canvasElement);
		// Scroll while the intro is still running: it must land on the new,
		// live progress, not on the progress it started towards.
		await new Promise((resolve) => requestAnimationFrame(resolve));
		window.scrollTo(0, window.innerHeight * 0.2);
		const samples = await sampleFrames(effects, 1600);
		const live = liveProgress(sequence, 1, 0.5);
		expect(Math.abs(live - 0.9)).toBeLessThan(progressTolerance);
		itemRanges(canvasElement).forEach((range, index) => {
			const expected = easedSliceOf(live, range);
			const values = samples.map((frame) => frame[index]);
			expect(Math.max(...values)).toBeLessThanOrEqual(
				expected + progressTolerance,
			);
			expect(Math.abs((values.at(-1) ?? 0) - expected)).toBeLessThan(
				progressTolerance,
			);
		});
		await scrollUntilRevealed(canvasElement);
	},
};

function verifySequenceStagger(
	stagger: number,
	expectedRanges: readonly (readonly [number, number])[],
): NonNullable<Story["play"]> {
	return async ({ canvasElement }) => {
		const sequence = scrollSequence(canvasElement);
		const effects = itemEffects(canvasElement);
		await waitFor(() =>
			expect(sequence).toHaveAttribute("data-motion-source-mode", "animated"),
		);
		expect(sequence).toHaveAttribute(
			"data-motion-source-sequence-stagger",
			String(stagger),
		);
		const ranges = itemRanges(canvasElement);
		const computedRanges = getScrollSequenceRanges(3, stagger);
		ranges.forEach(([start, end], index) => {
			expect(start).toBeCloseTo(expectedRanges[index][0], 3);
			expect(end).toBeCloseTo(expectedRanges[index][1], 3);
			expect(start).toBeCloseTo(computedRanges[index][0], 3);
			expect(end).toBeCloseTo(computedRanges[index][1], 3);
		});
		expect(ranges[0][0]).toBe(0);
		expect(ranges[2][1]).toBe(1);
		expect(ranges[1][0]).toBeGreaterThan(ranges[0][0]);
		expect(ranges[2][0]).toBeGreaterThan(ranges[1][0]);
		const documentTop = sequence.getBoundingClientRect().top + window.scrollY;
		window.scrollTo(0, documentTop - window.innerHeight * (0.95 - 0.4 * 0.5));
		await waitFor(
			() => {
				const live = liveProgress(sequence, 0.95, 0.55);
				const values = effects.map(opacityOf);
				values.forEach((value, index) => {
					expect(
						Math.abs(value - easedSliceOf(live, ranges[index])),
					).toBeLessThan(progressTolerance);
				});
				expect(values[0]).toBeGreaterThan(values[1]);
				expect(values[1]).toBeGreaterThan(values[2]);
			},
			{ timeout: 3000 },
		);
		await scrollUntilRevealed(canvasElement);
	};
}

export const ScrollSequenceStagger: Story = {
	args: { children: null, strategy: { type: "scroll" } },
	beforeEach: resetStoryScroll,
	render: () => <ScrollRevealFixture count={3} lead="below-fold" />,
	// 0.18s apart over 0.92s: [0, 0.6087], [0.1957, 0.8043], [0.3913, 1].
	play: verifySequenceStagger(0.18, [
		[0, 0.6087],
		[0.1957, 0.8043],
		[0.3913, 1],
	]),
};

export const ScrollSequenceTightStagger: Story = {
	args: { children: null, strategy: { type: "scroll" } },
	beforeEach: resetStoryScroll,
	render: () => (
		<ScrollRevealFixture count={3} lead="below-fold" stagger={0.06} />
	),
	// 0.06s apart over 0.68s: [0, 0.8235], [0.0882, 0.9118], [0.1765, 1].
	play: verifySequenceStagger(0.06, [
		[0, 0.8235],
		[0.0882, 0.9118],
		[0.1765, 1],
	]),
};

export const ScrollRevealMotionOff: Story = {
	args: { children: null, strategy: { type: "scroll" } },
	beforeEach: () => {
		const restoreScroll = resetStoryScroll();
		const previous = document.documentElement.dataset.motionOverride;
		document.documentElement.dataset.motionOverride = "off";
		return () => {
			restoreScroll();
			if (previous === undefined)
				delete document.documentElement.dataset.motionOverride;
			else document.documentElement.dataset.motionOverride = previous;
		};
	},
	render: () => <ScrollRevealFixture count={3} lead="below-fold" />,
	play: async ({ canvasElement }) => {
		const sequence = scrollSequence(canvasElement);
		await waitFor(() =>
			expect(sequence).toHaveAttribute(
				"data-motion-source-mode",
				"static-final",
			),
		);
		// Below the fold and never scrolled to, every item is fully shown.
		const effects = itemEffects(canvasElement);
		expect(effects).toHaveLength(3);
		await waitFor(() => {
			for (const effect of effects) expect(opacityOf(effect)).toBe(1);
		});
		window.scrollTo(0, window.innerHeight * 0.5);
		await new Promise((resolve) => window.setTimeout(resolve, 200));
		for (const effect of effects) expect(opacityOf(effect)).toBe(1);
	},
};
