import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Link from "next/link";
import {
	Component,
	type ErrorInfo,
	type ReactNode,
	useEffect,
	useState,
} from "react";
import { expect, userEvent, waitFor } from "storybook/test";
import { focusRing } from "@/components/ui/foundations/focus";
import { MotionProvider } from "@/components/ui/foundations/MotionProvider";
import { SettingsProvider } from "@/components/ui/foundations/settingsContext";
import { Button } from "@/components/ui/primitives/Button";
import { Card, Panel } from "@/components/ui/primitives/surfaces";
import { Text } from "@/components/ui/primitives/Text";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import type { MotionCompositionMetadata } from "../compositionMetadata";
import * as MotionSource from "../source";
import * as MotionEffect from "./index";
import { catalogContract } from "./MotionEffect.catalog";

const meta = {
	id: "ui-motion-motion-effect",
	title: "UI/Motion/MotionEffect",
	component: MotionEffect.Entrance,
	subcomponents: {
		"MotionEffect.TextStagger": MotionEffect.TextStagger,
		"MotionEffect.TextHighlight": MotionEffect.TextHighlight,
		"MotionEffect.Divider": MotionEffect.Divider,
		"MotionEffect.TextShift": MotionEffect.TextShift,
		"MotionEffect.TextReplay": MotionEffect.TextReplay,
		"MotionEffect.UnderlineText": MotionEffect.UnderlineText,
		"MotionEffect.Parallax": MotionEffect.Parallax,
		"MotionEffect.FrameWidth": MotionEffect.FrameWidth,
		"MotionEffect.Scramble": MotionEffect.Scramble,
		"MotionEffect.Number": MotionEffect.Number,
		"MotionEffect.Clip": MotionEffect.Clip,
		"MotionEffect.CounterpartReveal": MotionEffect.CounterpartReveal,
		"MotionEffect.GridReveal": MotionEffect.GridReveal,
		"MotionEffect.ScaleFade": MotionEffect.ScaleFade,
	},
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
} satisfies Meta<typeof MotionEffect.Entrance>;

export default meta;
type Story = StoryObj<typeof meta>;
type HoverTextReplayStory = StoryObj<{
	stagger: number;
	text: string;
	timing: MotionSource.Timing;
}>;

function EffectTeachingSurface() {
	const [active, setActive] = useState(true);
	return (
		<div className="grid max-w-6xl gap-6 p-8">
			<Button
				onClick={() => setActive((value) => !value)}
				size="sm"
				variant="secondary"
			>
				Toggle all effects
			</Button>
			<MotionSource.Root
				className="grid gap-8"
				strategy={{ type: "boolean", active, timing: "grand" }}
			>
				<div className="grid gap-5 md:grid-cols-3">
					<MotionEffect.Entrance>
						<Panel padding="md">Entrance</Panel>
					</MotionEffect.Entrance>
					<MotionEffect.Parallax magnitude={18}>
						<Panel padding="md">Parallax</Panel>
					</MotionEffect.Parallax>
					<MotionEffect.Clip
						finalRadius={16}
						origin={{ block: "start", inline: "start" }}
						variant="corner"
					>
						<Panel padding="md">Generic clip content</Panel>
					</MotionEffect.Clip>
				</div>
				<MotionEffect.TextShift className="text-4xl font-semibold">
					Measured text shift
				</MotionEffect.TextShift>
				<MotionEffect.Divider />
				<MotionEffect.FrameWidth
					className="h-48"
					contentClassName="grid place-items-center"
					coverClassName="bg-background"
					endInset={32}
					endRadius={{ tl: 24, tr: 24, br: 24, bl: 24 }}
					frameClassName="bg-primary/15"
					startInset={0}
				>
					<Text variant="bodyStrong">Framed width</Text>
				</MotionEffect.FrameWidth>
			</MotionSource.Root>
		</div>
	);
}

export const EffectGallery: Story = {
	args: { children: <span>Effect content</span> },
	render: () => <EffectTeachingSurface />,
	play: async ({ canvas, canvasElement }) => {
		await expect(canvas.getByText("Entrance")).toBeInTheDocument();
		await expect(canvas.getByText("Generic clip content")).toBeInTheDocument();
		await expect(canvas.getByText("Framed width")).toBeInTheDocument();
		await expect(
			canvasElement.querySelectorAll("[data-motion-effect]").length,
		).toBeGreaterThanOrEqual(6);
		await userEvent.click(
			canvas.getByRole("button", { name: "Toggle all effects" }),
		);
		await expect(canvas.getByText("Measured text shift")).toBeInTheDocument();
		await userEvent.click(
			canvas.getByRole("button", { name: "Toggle all effects" }),
		);
		await expect(canvas.getByText("Entrance")).toBeVisible();
	},
};

function TextEffectsTeachingSurface() {
	const [active] = useState(true);
	return (
		<MotionSource.Root
			className="grid max-w-4xl gap-7 p-8"
			strategy={{ type: "boolean", active, timing: "grand" }}
		>
			<MotionEffect.TextStagger as="h2" variant="headingLg">
				A stable character stagger
			</MotionEffect.TextStagger>
			<MotionEffect.TextHighlight
				as="p"
				highlight="shared progress"
				variant="headingXs"
			>
				Every text effect consumes shared progress.
			</MotionEffect.TextHighlight>
			<MotionEffect.TextReplay
				className="text-xl uppercase tracking-[0.18em]"
				repeats={2}
				text="Replay text"
			/>
			<div className="grid gap-4 md:grid-cols-2">
				<Panel padding="md">
					<MotionEffect.Scramble
						maintainSpace
						text="Seeded deterministic scramble"
					/>
				</Panel>
				<Panel padding="md">
					<MotionEffect.Scramble
						maintainSpace
						mode="numeric"
						text="Build 2048"
					/>
				</Panel>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				{(["countUp", "scroll"] as const).map((animation) => (
					<Panel key={animation} padding="md">
						<Text variant="caption" tone="muted">
							{animation}
						</Text>
						<MotionEffect.Number
							animation={animation}
							className="mt-3 text-4xl font-semibold"
							text="42 projects"
						/>
					</Panel>
				))}
			</div>
		</MotionSource.Root>
	);
}

export const TextEffects: Story = {
	args: { children: <span>Text effect</span> },
	render: () => <TextEffectsTeachingSurface />,
	play: async ({ canvas, canvasElement }) => {
		await expect(canvas.getByText("A stable character stagger")).toBeVisible();
		await expect(
			canvas.getAllByText("Seeded deterministic scramble").length,
		).toBeGreaterThanOrEqual(1);
		await expect(
			canvasElement.querySelectorAll('[data-motion-effect="number"]'),
		).toHaveLength(2);
	},
};

function TextStaggerTeachingSurface() {
	const [active, setActive] = useState(false);
	return (
		<div className="grid max-w-5xl gap-8 p-8">
			<Button
				onClick={() => setActive((value) => !value)}
				size="sm"
				variant="secondary"
			>
				{active ? "Reverse text staggers" : "Complete text staggers"}
			</Button>
			<MotionSource.Root
				className="grid gap-8"
				strategy={{ type: "boolean", active, timing: "grand" }}
			>
				<MotionEffect.TextStagger
					as="h2"
					className="max-w-3xl"
					variant="headingLg"
				>
					Graphemes keep emoji 👩🏽‍💻 together.
				</MotionEffect.TextStagger>
				<MotionEffect.TextStagger
					className="block w-80 text-3xl leading-tight"
					treatment="blur"
					unit="words"
				>
					Words, punctuation, and wrapping stay intact across lines.
				</MotionEffect.TextStagger>
				<MotionEffect.TextStagger
					blurOffset="0.9em"
					blurRadius={8}
					className="text-4xl font-medium"
					segments={[
						{ text: "186", unit: "graphemes" },
						{
							className: "font-semibold italic",
							text: " creates liquidity structures",
							unit: "words",
						},
					]}
					treatment="blur"
				/>
				<MotionEffect.TextStagger
					className="max-w-md text-2xl leading-relaxed"
					dir="rtl"
					lang="ar"
					treatment="blur"
					unit="words"
				>
					النص العربي يحافظ على الاتجاه وعلامات الترقيم.
				</MotionEffect.TextStagger>
				<MotionEffect.TextStagger lang="ja" treatment="blur" unit="words">
					流動性構造をつくる
				</MotionEffect.TextStagger>
			</MotionSource.Root>
		</div>
	);
}

export const TextStaggerModes: Story = {
	args: { children: <span>Text stagger modes</span> },
	parameters: {
		motionComposition: {
			effects: ["text-stagger"],
			focusHints: ["section", "page"],
			role: "controlled-text-stagger",
			schemaVersion: 1,
			staticPattern: "standalone-text",
			sources: ["boolean"],
			status: "approved",
		} satisfies MotionCompositionMetadata,
	},
	render: () => <TextStaggerTeachingSurface />,
	play: async ({ canvas, canvasElement }) => {
		const roots = Array.from(
			canvasElement.querySelectorAll<HTMLElement>(
				'[data-motion-effect="text-stagger"]',
			),
		);
		await expect(roots).toHaveLength(5);
		await expect(roots[0]?.querySelector(".sr-only")).toHaveTextContent(
			"Graphemes keep emoji 👩🏽‍💻 together.",
		);
		await expect(roots[2]?.querySelector(".sr-only")).toHaveTextContent(
			"186 creates liquidity structures",
		);
		const graphemeUnits = Array.from(
			roots[0]?.querySelectorAll<HTMLElement>(
				"[data-motion-effect-text-stagger-token]",
			) ?? [],
		);
		await expect(
			graphemeUnits.filter((unit) => unit.textContent === "👩🏽‍💻"),
		).toHaveLength(1);
		await expect(
			roots[1]?.querySelector<HTMLElement>(
				"[data-motion-effect-text-stagger-token]",
			),
		).toHaveTextContent("Words,");
		await waitFor(() => {
			const wordLines = new Set(
				Array.from(
					roots[1]?.querySelectorAll<HTMLElement>(
						"[data-motion-effect-text-stagger-token]",
					) ?? [],
				).map((unit) => unit.offsetTop),
			);
			expect(wordLines.size).toBeGreaterThan(1);
		});
		await expect(
			roots[2]?.querySelectorAll(
				'[data-motion-effect-text-stagger-segment="0"]',
			),
		).toHaveLength(3);
		await expect(
			roots[2]?.querySelectorAll(
				'[data-motion-effect-text-stagger-segment="1"]',
			).length,
		).toBeGreaterThan(1);
		await expect(
			roots[4]?.querySelectorAll("[data-motion-effect-text-stagger-token]")
				.length,
		).toBeGreaterThan(1);
		await expect(roots[3]).toHaveAttribute("dir", "rtl");

		const firstVisual = roots[0]?.querySelector<HTMLElement>(
			"[data-motion-effect-text-stagger-token] > span",
		);
		if (!firstVisual)
			throw new Error("TextStagger visual token was not rendered.");
		await waitFor(() =>
			expect(Number(getComputedStyle(firstVisual).opacity)).toBe(0),
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Complete text staggers" }),
		);
		await waitFor(() =>
			expect(Number(getComputedStyle(firstVisual).opacity)).toBe(1),
		);
	},
};

function StatRevealCompositionSurface() {
	const [active, setActive] = useState(false);
	return (
		<div className="grid gap-8 p-8">
			<Button
				onClick={() => setActive((value) => !value)}
				size="sm"
				variant="secondary"
			>
				{active ? "Reverse statistic" : "Complete statistic"}
			</Button>
			<MotionSource.Root
				strategy={{ type: "boolean", active, timing: "grand" }}
			>
				<MotionEffect.TextStagger
					blurOffset="10px"
					className="font-medium"
					segments={[
						{ className: "text-2xl", text: "USD ", unit: "whole" },
						{
							className: "text-4xl",
							render: (text) => (
								<MotionEffect.Number range={[0.58, 1]} text={text} />
							),
							text: "250",
							unit: "whole",
						},
						{ className: "text-2xl", text: "k", unit: "whole" },
					]}
					treatment="blur"
				/>
			</MotionSource.Root>
		</div>
	);
}

export const StatRevealComposition: Story = {
	args: { children: <span>Statistic reveal composition</span> },
	tags: ["backport-canonical"],
	parameters: {
		backport: {
			schemaVersion: 1,
			target: "averlo-next-template",
			canonicalStoryId: "ui-motion-motion-effect--stat-reveal-composition",
			strategy: "adapt",
			rationale:
				"Adapt the reusable prefix, count-up value, and suffix reveal as a product-neutral composition using the template's existing motion effects.",
			source: {
				repository: "averloco/pearl",
				storyId: "ui-motion-motion-effect--pearl-stat-reveal",
				fingerprint:
					"sha256:c5d7f102b98b5804b8c49b77099e5b054ace8058ac569318a6317b1705e75b7c",
			},
		},
		motionComposition: {
			effects: ["text-stagger", "number"],
			focusHints: ["section", "page"],
			role: "stat-reveal-composition",
			schemaVersion: 1,
			staticPattern: "standalone-text",
			sources: ["boolean"],
			status: "approved",
		} satisfies MotionCompositionMetadata,
	},
	render: () => <StatRevealCompositionSurface />,
	play: async ({ canvas, canvasElement }) => {
		const reveals = canvasElement.querySelectorAll<HTMLElement>(
			'[data-motion-effect="text-stagger"]',
		);
		const tokens = canvasElement.querySelectorAll<HTMLElement>(
			"[data-motion-effect-text-stagger-token]",
		);
		const number = canvasElement.querySelector<HTMLElement>(
			'[data-motion-effect="number"]',
		);
		const numberVisual = number?.querySelector<HTMLElement>(
			'[aria-hidden="true"]',
		);
		const prefixTokenVisual =
			tokens[0]?.querySelector<HTMLElement>(":scope > span");
		const numberTokenVisual =
			tokens[1]?.querySelector<HTMLElement>(":scope > span");
		await expect(reveals).toHaveLength(1);
		await expect(tokens).toHaveLength(3);
		await expect(number).not.toBeNull();
		await expect(numberVisual).not.toBeNull();
		await expect(prefixTokenVisual).not.toBeNull();
		await expect(numberTokenVisual).not.toBeNull();
		await expect(
			reveals[0]?.querySelector(":scope > .sr-only"),
		).toHaveTextContent("USD 250k");
		await expect(numberVisual).toHaveTextContent("000");
		await waitFor(() =>
			expect(
				getComputedStyle(numberTokenVisual as HTMLElement).filter,
			).toContain("blur(5px)"),
		);
		await waitFor(() =>
			expect(
				Number(getComputedStyle(numberTokenVisual as HTMLElement).opacity),
			).toBe(0),
		);
		await expect(
			getComputedStyle(numberTokenVisual as HTMLElement).transform,
		).toBe(getComputedStyle(prefixTokenVisual as HTMLElement).transform);
		await expect(
			Number.parseFloat(
				getComputedStyle(numberTokenVisual as HTMLElement).fontSize,
			),
		).toBeGreaterThan(
			Number.parseFloat(
				getComputedStyle(prefixTokenVisual as HTMLElement).fontSize,
			),
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Complete statistic" }),
		);
		await waitFor(() => expect(numberVisual).toHaveTextContent("250"));
		await waitFor(() =>
			expect(
				getComputedStyle(numberTokenVisual as HTMLElement).filter,
			).toContain("blur(0px)"),
		);
		await waitFor(() =>
			expect(
				Number(getComputedStyle(numberTokenVisual as HTMLElement).opacity),
			).toBe(1),
		);
		await waitFor(() =>
			expect(
				Number(
					getComputedStyle(
						reveals[0]?.querySelector<HTMLElement>(
							"[data-motion-effect-text-stagger-token] > span",
						) as HTMLElement,
					).opacity,
				),
			).toBe(1),
		);
		await expect(
			canvas.getByRole("button", { name: "Reverse statistic" }),
		).toBeVisible();
	},
};

const gridTileStyle = {
	backgroundImage:
		"linear-gradient(132deg, #9fd8f8 0%, #46657f 42%, #1d242b 43%, #e4af68 100%)",
};

function GridRevealTeachingSurface() {
	const [active, setActive] = useState(false);
	const [narrow, setNarrow] = useState(false);
	return (
		<SettingsProvider defaultMotionDisabled={false} storageKey={null}>
			<MotionProvider expressive={0}>
				<div className="grid gap-6 p-8">
					<div className="flex flex-wrap gap-3">
						<Button
							onClick={() => setActive((value) => !value)}
							size="sm"
							variant="secondary"
						>
							{active ? "Reset grid reveal" : "Play grid reveal"}
						</Button>
						<Button
							onClick={() => setNarrow((value) => !value)}
							size="sm"
							variant="secondary"
						>
							{narrow ? "Use wide landscape" : "Use narrow landscape"}
						</Button>
					</div>
					<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
						<MotionSource.Root
							className="relative overflow-hidden rounded-xl"
							data-testid="grid-landscape"
							strategy={{ type: "boolean", active, timing: "grand" }}
							style={{ height: 360, width: narrow ? 460 : 900 }}
						>
							<MotionEffect.GridReveal tileStyle={gridTileStyle} />
						</MotionSource.Root>
						<MotionSource.Root
							className="relative h-[440px] overflow-hidden rounded-xl"
							data-testid="grid-portrait"
							strategy={{ type: "boolean", active, timing: "grand" }}
						>
							<MotionEffect.GridReveal tileStyle={gridTileStyle} />
						</MotionSource.Root>
					</div>
				</div>
			</MotionProvider>
		</SettingsProvider>
	);
}

export const GridRevealMedia: Story = {
	args: { children: <span>Grid reveal media</span> },
	tags: ["backport-canonical"],
	parameters: {
		backport: {
			schemaVersion: 1,
			target: "averlo-next-template",
			canonicalStoryId: "ui-motion-motion-effect--grid-reveal-media",
			strategy: "copy",
			rationale:
				"Replace the legacy SVG grid mask with the reusable responsive tile-clipped image reveal, including seam protection and RTL ordering.",
			source: {
				repository: "averloco/pearl",
				storyId: "ui-motion-motion-effect--grid-reveal-media",
				fingerprint:
					"sha256:3fec2d8f71989585401935e6e1c9784a702490f34ac48eaf4b62b8e41cb8be05",
			},
		},
		motionComposition: {
			effects: ["grid-reveal"],
			focusHints: ["section", "page"],
			role: "grid-reveal-media",
			schemaVersion: 1,
			staticPattern: "media-frame",
			sources: ["boolean"],
			status: "approved",
		} satisfies MotionCompositionMetadata,
	},
	render: () => <GridRevealTeachingSurface />,
	play: async ({ canvas, canvasElement }) => {
		const landscape = canvas.getByTestId("grid-landscape");
		const portrait = canvas.getByTestId("grid-portrait");
		const landscapeGrid = landscape.querySelector<HTMLElement>(
			'[data-motion-effect="grid-reveal"]',
		);
		const portraitGrid = portrait.querySelector<HTMLElement>(
			'[data-motion-effect="grid-reveal"]',
		);
		await expect(landscapeGrid).toHaveAttribute(
			"data-motion-grid-renderer",
			"tile-clips",
		);
		await expect(portraitGrid).toHaveAttribute(
			"data-motion-grid-renderer",
			"tile-clips",
		);
		await waitFor(() =>
			expect(
				Number(landscapeGrid?.getAttribute("data-motion-grid-columns")),
			).toBeGreaterThan(
				Number(landscapeGrid?.getAttribute("data-motion-grid-rows")),
			),
		);
		await expect(
			Number(portraitGrid?.getAttribute("data-motion-grid-columns")),
		).toBeGreaterThanOrEqual(
			Number(portraitGrid?.getAttribute("data-motion-grid-rows")),
		);
		const firstRow = landscape.querySelectorAll<HTMLElement>(
			'[data-motion-grid-row="0"]',
		);
		const secondRow = landscape.querySelectorAll<HTMLElement>(
			'[data-motion-grid-row="1"]',
		);
		await expect(firstRow[0]).toHaveAttribute(
			"data-motion-grid-direction",
			"ltr",
		);
		await expect(secondRow[0]).toHaveAttribute(
			"data-motion-grid-direction",
			"rtl",
		);
		await expect(firstRow[0]).toHaveStyle({
			"--motion-grid-tile-overlap": "1px",
		});
		await expect(Number(firstRow[0]?.dataset.motionGridStart)).toBeLessThan(
			Number(firstRow[firstRow.length - 1]?.dataset.motionGridStart),
		);
		await expect(Number(secondRow[0]?.dataset.motionGridStart)).toBeGreaterThan(
			Number(secondRow[secondRow.length - 1]?.dataset.motionGridStart),
		);
		const wideColumns = Number(landscapeGrid?.dataset.motionGridColumns);
		await userEvent.click(
			canvas.getByRole("button", { name: "Use narrow landscape" }),
		);
		await waitFor(() =>
			expect(Number(landscapeGrid?.dataset.motionGridColumns)).toBeLessThan(
				wideColumns,
			),
		);
		await expect(
			landscape.querySelectorAll("[data-motion-grid-tile]").length,
		).toBeGreaterThan(0);
		await userEvent.click(
			canvas.getByRole("button", { name: "Play grid reveal" }),
		);
		await waitFor(() =>
			expect(
				canvasElement.querySelectorAll('[data-motion-effect="grid-reveal"]'),
			).toHaveLength(2),
		);
	},
};

function GridRevealStaticFinalSurface() {
	useEffect(() => {
		document.documentElement.dataset.motionOverride = "off";
		window.dispatchEvent(new PopStateEvent("popstate"));
		return () => {
			delete document.documentElement.dataset.motionOverride;
			window.dispatchEvent(new PopStateEvent("popstate"));
		};
	}, []);

	return (
		<MotionSource.Root
			className="relative m-8 h-[300px] max-w-3xl overflow-hidden rounded-xl"
			data-testid="grid-static-final"
			strategy={{ type: "boolean", active: false, timing: "grand" }}
		>
			<MotionEffect.GridReveal tileStyle={gridTileStyle} />
		</MotionSource.Root>
	);
}

export const GridRevealStaticFinal: Story = {
	args: { children: <span>Static-final grid reveal</span> },
	tags: ["backport-canonical"],
	parameters: {
		backport: {
			schemaVersion: 1,
			target: "averlo-next-template",
			canonicalStoryId: "ui-motion-motion-effect--grid-reveal-static-final",
			strategy: "copy",
			rationale:
				"Keep the reusable grid reveal visible as a single static image when motion is disabled.",
			source: {
				repository: "averloco/pearl",
				storyId: "ui-motion-motion-effect--grid-reveal-static-final",
				fingerprint:
					"sha256:be619dbe2c2eb3904888331d0ec16aed8e400b30484ba004ebf03c87ace0776c",
			},
		},
	},
	render: () => <GridRevealStaticFinalSurface />,
	play: async ({ canvas }) => {
		const root = canvas.getByTestId("grid-static-final");
		await waitFor(() =>
			expect(root).toHaveAttribute("data-motion-source-mode", "instant"),
		);
		await waitFor(() =>
			expect(
				root.querySelector("[data-motion-grid-complete-image]"),
			).toBeInTheDocument(),
		);
		await expect(root.querySelectorAll("[data-motion-grid-tile]")).toHaveLength(
			0,
		);
	},
};

function GeometricMediaTeachingSurface() {
	const [active, setActive] = useState(false);
	return (
		<div className="grid max-w-6xl gap-6 p-8">
			<Button
				onClick={() => setActive((value) => !value)}
				size="sm"
				variant="secondary"
			>
				{active ? "Reverse media effects" : "Complete media effects"}
			</Button>
			<MotionSource.Root
				className="grid gap-5 md:grid-cols-2"
				strategy={{ type: "boolean", active, timing: "grand" }}
			>
				<MotionEffect.Clip
					axis="inline"
					className="min-h-48 rounded-xl bg-primary/15 p-6"
					origin="start"
				>
					Inline-start inset in LTR
				</MotionEffect.Clip>
				<MotionEffect.Clip
					axis="inline"
					className="min-h-48 rounded-xl bg-primary/15 p-6 text-right"
					dir="rtl"
					origin="start"
				>
					بداية السطر في RTL
				</MotionEffect.Clip>
				<MotionEffect.Clip
					className="min-h-48 rounded-xl bg-foreground p-6 text-background"
					origin={{ block: "start", inline: "end" }}
					variant="corner"
				>
					Logical corner reveal
				</MotionEffect.Clip>
				<MotionEffect.Clip
					className="min-h-48 bg-primary/20 p-6"
					fromRadius={12}
					origin={{ x: "calc(100% - 2rem)", y: "2rem" }}
					toRadius={175}
					variant="radial"
				>
					Custom radial origin
				</MotionEffect.Clip>
				<MotionEffect.Clip className="min-h-64 md:col-span-2" finalRadius={24}>
					<MotionEffect.ScaleFade asChild>
						<div className="grid h-full min-h-64 place-items-center bg-[linear-gradient(135deg,var(--color-primary),var(--color-background))] p-8 text-3xl font-semibold">
							Clip geometry plus independent scale and fade
						</div>
					</MotionEffect.ScaleFade>
				</MotionEffect.Clip>
			</MotionSource.Root>
		</div>
	);
}

export const GeometricMediaEffects: Story = {
	args: { children: <span>Geometric media effects</span> },
	render: () => <GeometricMediaTeachingSurface />,
	play: async ({ canvas, canvasElement }) => {
		const clips = Array.from(
			canvasElement.querySelectorAll<HTMLElement>(
				'[data-motion-effect="clip"]',
			),
		);
		const scaleFade = canvasElement.querySelector<HTMLElement>(
			'[data-motion-effect="scale-fade"]',
		);
		if (!scaleFade) throw new Error("ScaleFade composition was not rendered.");
		await expect(clips).toHaveLength(5);
		await waitFor(() =>
			expect(clips[1]).toHaveAttribute(
				"data-motion-effect-clip-direction",
				"rtl",
			),
		);
		await expect(clips[3]).toHaveAttribute(
			"data-motion-effect-clip-variant",
			"radial",
		);
		await waitFor(() =>
			expect(getComputedStyle(clips[3] as HTMLElement).clipPath).toContain(
				"12%",
			),
		);
		await waitFor(() =>
			expect(Number(getComputedStyle(scaleFade).opacity)).toBeCloseTo(0.56, 2),
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Complete media effects" }),
		);
		await waitFor(() =>
			expect(getComputedStyle(clips[3] as HTMLElement).clipPath).toContain(
				"175%",
			),
		);
		await waitFor(() =>
			expect(Number(getComputedStyle(scaleFade).opacity)).toBe(1),
		);
	},
};

function CounterpartCardFace({
	anchorProps,
	dir,
	items,
	layer,
	title,
}: MotionEffect.CounterpartRevealRenderProps & {
	dir?: "ltr" | "rtl";
	items: readonly string[];
	title: string;
}) {
	const counterpart = layer === "counterpart";
	return (
		<Card
			className={`h-full min-h-72 text-left ${
				counterpart ? "border-primary/40 bg-primary/10" : ""
			}`}
			dir={dir}
		>
			<Card.Header>
				<Card.Title as="h3">{title}</Card.Title>
				<Card.Description>
					The same structure is rendered in both visual treatments.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<ul className="grid gap-4">
					{items.map((item, index) => (
						<li className="flex items-start gap-3" key={item}>
							<span
								{...(index === 0 ? anchorProps : { "aria-hidden": true })}
								className={`mt-1.5 block size-2.5 shrink-0 rounded-full ${
									counterpart ? "bg-primary" : "bg-muted-foreground"
								}`}
							/>
							<Text as="span">{item}</Text>
						</li>
					))}
				</ul>
			</Card.Content>
		</Card>
	);
}

const counterpartItems = [
	"The reveal origin follows this bullet when the card changes width.",
	"Base and counterpart layers retain identical layout geometry.",
	"One source reverses the entire treatment without timing drift.",
] as const;

function CounterpartRevealTeachingSurface() {
	const [active, setActive] = useState(false);
	const [narrow, setNarrow] = useState(false);
	return (
		<SettingsProvider defaultMotionDisabled={false} storageKey={null}>
			<MotionProvider expressive={0}>
				<div className="grid min-h-screen gap-8 bg-background p-8">
					<div className="grid gap-2">
						<Text as="h2" variant="headingLg">
							Anchored counterpart reveal
						</Text>
						<Text className="max-w-3xl" tone="muted">
							One measured anchor and one shared progress value keep two
							coincident visual layers synchronized in both directions.
						</Text>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button
							onClick={() => setActive((value) => !value)}
							size="sm"
							variant="secondary"
						>
							{active ? "Return to base" : "Reveal counterpart"}
						</Button>
						<Button
							onClick={() => setNarrow((value) => !value)}
							size="sm"
							variant="secondary"
						>
							{narrow ? "Use wide card" : "Use narrow card"}
						</Button>
					</div>
					<div className="grid items-start gap-8 lg:grid-cols-2">
						<div className="grid gap-3">
							<Text variant="bodyStrong">Controlled before / after</Text>
							<MotionSource.Root
								strategy={{ type: "boolean", active, timing: "component" }}
							>
								<MotionEffect.CounterpartReveal
									className={narrow ? "w-72" : "w-full"}
									data-testid="controlled-counterpart"
									renderLayer={(props) => (
										<CounterpartCardFace
											{...props}
											items={counterpartItems}
											title="Reusable motion composition"
										/>
									)}
								/>
							</MotionSource.Root>
						</div>
						<div className="grid gap-3">
							<Text variant="bodyStrong">Hover, focus, and RTL</Text>
							<Link
								className={`block ${focusRing.visibleDefault}`}
								data-motion-owner
								href="#counterpart-details"
							>
								<MotionSource.Root
									as="span"
									strategy={{ type: "owner-hover", timing: "component" }}
								>
									<MotionEffect.CounterpartReveal
										as="span"
										className="block"
										data-testid="interactive-counterpart"
										renderLayer={(props) => (
											<CounterpartCardFace
												{...props}
												dir="rtl"
												items={[
													"تتبع نقطة الكشف اتجاه القراءة المنطقي.",
													"تظل طبقتا البطاقة متطابقتين في البنية.",
													"تنعكس الحركة من مصدر واحد مشترك.",
												]}
												title="تركيب بطاقة عام"
											/>
										)}
									/>
								</MotionSource.Root>
							</Link>
						</div>
					</div>
					<div id="counterpart-details" />
				</div>
			</MotionProvider>
		</SettingsProvider>
	);
}

function counterpartLayer(root: HTMLElement) {
	const layer = root.querySelector<HTMLElement>(
		'[data-motion-counterpart-layer="counterpart"]',
	);
	if (!layer) throw new Error("Counterpart layer was not rendered.");
	return layer;
}

function counterpartRadius(layer: HTMLElement) {
	const match = getComputedStyle(layer).clipPath.match(/circle\(([\d.]+)px/);
	return Number(match?.[1] ?? Number.NaN);
}

export const CounterpartReveal: Story = {
	args: { children: <span>Counterpart reveal</span> },
	tags: ["backport-canonical"],
	parameters: {
		backport: {
			schemaVersion: 1,
			target: "averlo-next-template",
			canonicalStoryId: "ui-motion-motion-effect--counterpart-reveal",
			strategy: "adapt",
			rationale:
				"Adapt Pearl's product-bound metric-card overlay into a product-neutral paired-layer effect with measured anchor geometry and shared reversible progress.",
			source: {
				repository: "averloco/pearl",
				storyId: "domain-marketing-metric-band--canonical-presentation",
				fingerprint:
					"sha256:fa351796045abdbc28caa0f61a04f1c4e07e31c3b66844ba785185771ec971ba",
			},
		},
		motionComposition: {
			effects: ["counterpart-reveal"],
			focusHints: ["section", "page"],
			role: "counterpart-reveal",
			schemaVersion: 1,
			staticPattern: "coincident-layer-card",
			sources: ["boolean", "owner-hover"],
			status: "approved",
		} satisfies MotionCompositionMetadata,
	},
	render: () => <CounterpartRevealTeachingSurface />,
	play: async ({ canvas }) => {
		const controlled = canvas.getByTestId("controlled-counterpart");
		const controlledLayer = counterpartLayer(controlled);
		const interactive = canvas.getByTestId("interactive-counterpart");
		const interactiveLayer = counterpartLayer(interactive);
		const interactiveLink = canvas.getByRole("link", {
			name: /تركيب بطاقة عام/i,
		});

		await expect(controlledLayer).toHaveAttribute("aria-hidden", "true");
		await expect(
			controlled.querySelectorAll("[data-motion-counterpart-anchor]"),
		).toHaveLength(2);
		await waitFor(() => expect(counterpartRadius(controlledLayer)).toBe(0));
		const initialRadius = counterpartRadius(controlledLayer);
		await userEvent.click(
			canvas.getByRole("button", { name: "Reveal counterpart" }),
		);
		await waitFor(() =>
			expect(counterpartRadius(controlledLayer)).toBeGreaterThan(
				initialRadius + 150,
			),
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Return to base" }),
		);
		await waitFor(() =>
			expect(counterpartRadius(controlledLayer)).toBeCloseTo(initialRadius, 0),
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Use narrow card" }),
		);
		await waitFor(() =>
			expect(controlled.getBoundingClientRect().width).toBe(288),
		);
		await userEvent.hover(interactiveLink);
		await waitFor(() =>
			expect(counterpartRadius(interactiveLayer)).toBeGreaterThan(200),
		);
		await userEvent.unhover(interactiveLink);
		await waitFor(() =>
			expect(counterpartRadius(interactiveLayer)).toBeLessThan(30),
		);
		await userEvent.tab();
		await expect(interactiveLink).toHaveFocus();
		await waitFor(() =>
			expect(counterpartRadius(interactiveLayer)).toBeGreaterThan(200),
		);
	},
};

const counterpartRevealVariants = [
	{
		description: "Expands from the marked bullet to the farthest card edge.",
		id: "circle",
		reveal: { type: "circle" },
		title: "Circle expand",
	},
	{
		description: "Uses logical inline direction and follows RTL automatically.",
		id: "swipe",
		reveal: { axis: "inline", origin: "start", type: "swipe" },
		title: "Logical swipe",
	},
	{
		description:
			"Reuses the alternating sequence owned by the media grid reveal.",
		id: "grid",
		reveal: { columns: 6, rows: 4, type: "grid" },
		title: "Alternating grid",
	},
] as const satisfies readonly {
	description: string;
	id: string;
	reveal: MotionEffect.CounterpartRevealStrategy;
	title: string;
}[];

function CounterpartRevealStrategiesSurface() {
	const [active, setActive] = useState(false);
	return (
		<SettingsProvider defaultMotionDisabled={false} storageKey={null}>
			<MotionProvider expressive={0}>
				<div className="grid min-h-screen gap-8 bg-background p-8">
					<div className="grid gap-2">
						<Text as="h2" variant="headingLg">
							Counterpart reveal strategies
						</Text>
						<Text className="max-w-3xl" tone="muted">
							The card composition stays unchanged while only the decorative
							reveal mask varies.
						</Text>
					</div>
					<Button
						className="justify-self-start"
						onClick={() => setActive((value) => !value)}
						size="sm"
						variant="secondary"
					>
						{active ? "Return all to base" : "Reveal all counterparts"}
					</Button>
					<MotionSource.Root
						className="grid items-start gap-6 lg:grid-cols-3"
						strategy={{ type: "boolean", active, timing: "grand" }}
					>
						{counterpartRevealVariants.map((variant) => (
							<div className="grid gap-3" key={variant.id}>
								<div className="grid gap-1">
									<Text variant="bodyStrong">{variant.title}</Text>
									<Text tone="muted" variant="support">
										{variant.description}
									</Text>
								</div>
								<MotionEffect.CounterpartReveal
									data-testid={`counterpart-${variant.id}`}
									renderLayer={(props) => (
										<CounterpartCardFace
											{...props}
											items={counterpartItems}
											title="Reusable motion composition"
										/>
									)}
									reveal={variant.reveal}
								/>
							</div>
						))}
					</MotionSource.Root>
				</div>
			</MotionProvider>
		</SettingsProvider>
	);
}

export const CounterpartRevealStrategies: Story = {
	args: { children: <span>Counterpart reveal strategies</span> },
	parameters: {
		motionComposition: {
			effects: ["counterpart-reveal"],
			focusHints: ["section"],
			role: "counterpart-reveal-strategies",
			schemaVersion: 1,
			staticPattern: "coincident-layer-card",
			sources: ["boolean"],
			status: "approved",
		} satisfies MotionCompositionMetadata,
	},
	render: () => <CounterpartRevealStrategiesSurface />,
	play: async ({ canvas }) => {
		const circle = canvas.getByTestId("counterpart-circle");
		const swipe = canvas.getByTestId("counterpart-swipe");
		const grid = canvas.getByTestId("counterpart-grid");
		const circleLayer = counterpartLayer(circle);
		const swipeLayer = counterpartLayer(swipe);
		const gridLayer = counterpartLayer(grid);

		await expect(circleLayer).toHaveAttribute(
			"data-motion-counterpart-reveal",
			"circle",
		);
		await expect(swipeLayer).toHaveAttribute(
			"data-motion-counterpart-reveal",
			"swipe",
		);
		await expect(gridLayer).toHaveAttribute(
			"data-motion-counterpart-reveal",
			"grid",
		);
		await expect(gridLayer).toHaveAttribute(
			"data-motion-counterpart-grid-columns",
			"6",
		);
		await expect(getComputedStyle(circle).overflow).toBe("visible");
		await userEvent.click(
			canvas.getByRole("button", { name: "Reveal all counterparts" }),
		);
		await waitFor(() =>
			expect(
				Number(
					getComputedStyle(grid).getPropertyValue(
						"--motion-counterpart-progress",
					),
				),
			).toBeCloseTo(1, 2),
		);
		await expect(getComputedStyle(circleLayer).clipPath).toContain("circle(");
		await expect(getComputedStyle(swipeLayer).clipPath).toContain("inset(");
		await expect(getComputedStyle(gridLayer).maskImage).not.toBe("none");
		await userEvent.click(
			canvas.getByRole("button", { name: "Return all to base" }),
		);
		await waitFor(() =>
			expect(
				Number(
					getComputedStyle(grid).getPropertyValue(
						"--motion-counterpart-progress",
					),
				),
			).toBeCloseTo(0, 2),
		);
	},
};

export const CounterpartRevealReducedMotion: Story = {
	args: { children: <span>Counterpart reveal reduced motion</span> },
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
		<MotionSource.Root strategy={{ type: "boolean", active: true }}>
			<MotionEffect.CounterpartReveal
				className="m-8 max-w-xl"
				data-testid="reduced-counterpart"
				renderLayer={(props) => (
					<CounterpartCardFace
						{...props}
						items={counterpartItems}
						title="Reusable motion composition"
					/>
				)}
			/>
		</MotionSource.Root>
	),
	play: async ({ canvas }) => {
		const root = canvas.getByTestId("reduced-counterpart");
		const source = root.closest<HTMLElement>("[data-motion-source]");
		await waitFor(() =>
			expect(source).toHaveAttribute("data-motion-source-mode", "instant"),
		);
		await waitFor(() =>
			expect(counterpartRadius(counterpartLayer(root))).toBeGreaterThan(200),
		);
	},
};

export const HoverTextReplay: HoverTextReplayStory = {
	args: {
		stagger: 0.4,
		text: "Featured work",
		timing: "grand",
	},
	argTypes: {
		stagger: {
			control: { max: 0.42, min: 0, step: 0.01, type: "range" },
			description:
				"Normalized progress distributed between the first and last character.",
		},
		text: { control: "text" },
		timing: {
			control: "select",
			description:
				"Shared MotionSource timing preset for the complete hover transition.",
			options: ["micro", "interactive", "component", "macro", "grand"],
		},
	},
	parameters: {
		controls: { include: ["text", "stagger", "timing"] },
	},
	render: ({ stagger, text, timing }) => (
		<div className="grid min-h-[28rem] place-items-center bg-foreground p-8 text-4xl font-medium uppercase tracking-[0.12em] text-background sm:text-6xl">
			<MotionSource.Root asChild strategy={{ type: "hover", timing }}>
				<Link className={focusRing.visibleDefault} href="/featured-work">
					<MotionEffect.TextReplay stagger={stagger} text={text} />
				</Link>
			</MotionSource.Root>
		</div>
	),
	play: async ({ args, canvas, canvasElement }) => {
		const link = canvas.getByRole("link", { name: args.text });
		const replay = canvasElement.querySelector<HTMLElement>(
			'[data-motion-effect="text-replay"]',
		);
		const outgoing = canvasElement.querySelector<HTMLElement>(
			'[data-motion-effect-text-replay-layer="outgoing"]',
		);
		const characterOffsets = Array.from(
			canvasElement.querySelectorAll<HTMLElement>(
				"[data-motion-effect-text-replay-offset]",
			),
		).map((character) =>
			Number(character.dataset.motionEffectTextReplayOffset),
		);
		if (!outgoing)
			throw new Error("TextReplay outgoing layer was not rendered.");

		await expect(link).toHaveAttribute("href", "/featured-work");
		await expect(link).toHaveAccessibleName(args.text);
		await expect(link).toHaveAttribute("data-motion-source-strategy", "hover");
		await expect(link).toHaveAttribute(
			"data-motion-source-timing",
			args.timing,
		);
		await expect(link).toHaveClass("focus-visible:ring-3");
		await expect(replay).toHaveAttribute(
			"data-motion-effect-text-stagger",
			String(args.stagger),
		);
		await expect(characterOffsets.at(-1)).toBeGreaterThan(
			characterOffsets[0] ?? 0,
		);
		await waitFor(() =>
			expect(replayLayerOpacity(outgoing)).toBeGreaterThan(0.99),
		);

		await userEvent.hover(link);
		await waitFor(() =>
			expect(replayLayerOpacity(outgoing)).toBeLessThan(0.98),
		);
		await userEvent.unhover(link);
		await waitFor(() =>
			expect(replayLayerOpacity(outgoing)).toBeGreaterThan(0.99),
		);

		await userEvent.tab();
		await expect(link).toHaveFocus();
		await waitFor(() =>
			expect(replayLayerOpacity(outgoing)).toBeLessThan(0.98),
		);
		link.blur();
		await waitFor(() =>
			expect(replayLayerOpacity(outgoing)).toBeGreaterThan(0.99),
		);
	},
};

function DeterministicProgressHarness() {
	const [active, setActive] = useState(false);
	return (
		<div className="grid max-w-xl gap-5 p-8">
			<Button
				onClick={() => setActive((value) => !value)}
				size="sm"
				variant="secondary"
			>
				{active ? "Reverse progress" : "Complete progress"}
			</Button>
			<MotionSource.Root strategy={{ type: "boolean", active }}>
				<div className="grid gap-4">
					<MotionEffect.Scramble maintainSpace text="Signal ✦ 2048" />
					<MotionEffect.Number
						animation="countUp"
						className="text-4xl font-semibold"
						text="2048 builds"
					/>
				</div>
			</MotionSource.Root>
		</div>
	);
}

export const DeterministicProgress: Story = {
	args: { children: <span>Deterministic effect</span> },
	beforeEach: () => {
		const previous = document.documentElement.dataset.motionOverride;
		document.documentElement.dataset.motionOverride = "off";
		return () => {
			if (previous === undefined)
				delete document.documentElement.dataset.motionOverride;
			else document.documentElement.dataset.motionOverride = previous;
		};
	},
	render: () => <DeterministicProgressHarness />,
	play: async ({ canvas, canvasElement }) => {
		await waitFor(() =>
			expect(
				canvasElement.querySelector('[data-motion-source-mode="instant"]'),
			).toBeInTheDocument(),
		);
		const visual = canvasElement.querySelector<HTMLElement>(
			'[data-motion-effect-scramble-visual=""]',
		);
		if (!visual) throw new Error("Scramble visual output was not rendered.");
		const initialFrame = visual.textContent;
		await userEvent.click(
			canvas.getByRole("button", { name: "Complete progress" }),
		);
		await waitFor(() => expect(visual).toHaveTextContent("Signal ✦ 2048"));
		await expect(
			canvasElement.querySelector('[data-motion-effect="number"]'),
		).toHaveTextContent("2048 builds");
		await userEvent.click(
			canvas.getByRole("button", { name: "Reverse progress" }),
		);
		await waitFor(() => expect(visual.textContent).toBe(initialFrame));
	},
};

function UnderlineTeachingSurface() {
	const [narrow, setNarrow] = useState(false);
	return (
		<div className="grid max-w-3xl gap-8 p-8">
			<Link
				data-motion-owner
				className={`block rounded-xl border border-subtle p-6 ${narrow ? "w-56" : "w-80"} ${focusRing.visibleDefault}`}
				href="/card-title"
			>
				<Text variant="caption" tone="muted">
					Whole-card owner
				</Text>
				<MotionSource.Root as="span" strategy={{ type: "owner-hover" }}>
					<MotionEffect.UnderlineText className="mt-12 text-3xl leading-tight">
						A wrapped card title draws continuously
					</MotionEffect.UnderlineText>
				</MotionSource.Root>
			</Link>
			<Link
				data-motion-owner
				className={`w-72 rounded-sm text-2xl ${focusRing.visibleDefault}`}
				dir="rtl"
				href="/rtl"
			>
				<MotionSource.Root as="span" strategy={{ type: "owner-hover" }}>
					<MotionEffect.UnderlineText>
						عنوان متعدد الأسطر يبدأ من اليمين
					</MotionEffect.UnderlineText>
				</MotionSource.Root>
			</Link>
			<Button
				onClick={() => setNarrow((value) => !value)}
				size="sm"
				variant="secondary"
			>
				{narrow ? "Widen card" : "Narrow card"}
			</Button>
		</div>
	);
}

export const UnderlineOwners: Story = {
	args: { children: <span>Underline content</span> },
	render: () => <UnderlineTeachingSurface />,
	play: async ({ canvas }) => {
		const card = canvas.getByRole("link", { name: /A wrapped card title/i });
		const rtl = canvas.getByRole("link", {
			name: "عنوان متعدد الأسطر يبدأ من اليمين",
		});
		await waitFor(() =>
			expect(card.querySelectorAll("line").length).toBeGreaterThan(1),
		);
		await userEvent.hover(card);
		await waitFor(() => expect(allLinesDrawn(card)).toBe(true));
		await userEvent.unhover(card);
		await waitFor(() => expect(allLinesHidden(card)).toBe(true));
		await userEvent.hover(rtl);
		await waitFor(() => expect(allLinesDrawn(rtl)).toBe(true));
		const firstLine = rtl.querySelector("line");
		await expect(Number(firstLine?.getAttribute("x2"))).toBeLessThan(
			Number(firstLine?.getAttribute("x1")),
		);
		const before = card.querySelectorAll("line").length;
		await userEvent.click(canvas.getByRole("button", { name: "Narrow card" }));
		await waitFor(() =>
			expect(card.querySelectorAll("line").length).not.toBe(before),
		);
	},
};

class EffectUsageBoundary extends Component<
	{ children: ReactNode },
	{ error: Error | null }
> {
	state = { error: null as Error | null };
	static getDerivedStateFromError(error: Error) {
		return { error };
	}
	componentDidCatch(_error: Error, _info: ErrorInfo) {}
	render() {
		return this.state.error ? (
			<p role="alert">{this.state.error.message}</p>
		) : (
			this.props.children
		);
	}
}

export const RequiresSource: Story = {
	args: { children: <span>Missing source</span> },
	render: () => (
		<div className="grid gap-3 p-8">
			<EffectUsageBoundary>
				<MotionEffect.TextStagger>
					Unsupported text stagger
				</MotionEffect.TextStagger>
			</EffectUsageBoundary>
			<EffectUsageBoundary>
				<MotionEffect.Clip>Unsupported clip</MotionEffect.Clip>
			</EffectUsageBoundary>
			<EffectUsageBoundary>
				<MotionEffect.ScaleFade>Unsupported scale fade</MotionEffect.ScaleFade>
			</EffectUsageBoundary>
		</div>
	),
	play: async ({ canvas }) => {
		const alerts = canvas.getAllByRole("alert");
		await expect(alerts).toHaveLength(3);
		await expect(alerts[0]).toHaveTextContent(
			"MotionEffect.TextStagger must be rendered inside MotionSource.Root.",
		);
		await expect(alerts[1]).toHaveTextContent(
			"MotionEffect.Clip must be rendered inside MotionSource.Root.",
		);
		await expect(alerts[2]).toHaveTextContent(
			"MotionEffect.ScaleFade must be rendered inside MotionSource.Root.",
		);
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

function replayLayerOpacity(layer: HTMLElement) {
	return Number.parseFloat(getComputedStyle(layer).opacity);
}
