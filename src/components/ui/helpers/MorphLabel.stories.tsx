import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { MorphLabel } from "./MorphLabel";
import {
	catalogContract,
	MorphLabelExample,
	morphLabelPairs,
} from "./MorphLabel.catalog";

const meta = {
	id: "ui-helpers-morph-label",
	excludeStories: ["catalogContract"],
	title: "UI/Helpers/MorphLabel",
	component: MorphLabel,
	tags: ["autodocs"],
	args: { children: "Copy details" },
	parameters: {
		catalogContract,
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta<typeof MorphLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

type Frame = {
	boxWidth: number;
	/** Visible layers whose glyphs extend past the box, by how many px. */
	overflow: { text: string; opacity: number; past: number }[];
	visibleTexts: string[];
};

function textExtent(layer: HTMLElement) {
	const range = document.createRange();
	range.selectNodeContents(layer);
	return range.getBoundingClientRect();
}

/** Reads every frame until `done` resolves. */
async function sampleFrames(box: HTMLElement, done: () => Promise<unknown>) {
	const frames: Frame[] = [];
	let handle = 0;
	const sample = () => {
		const bounds = box.getBoundingClientRect();
		const frame: Frame = {
			boxWidth: bounds.width,
			overflow: [],
			visibleTexts: [],
		};
		for (const layer of box.querySelectorAll<HTMLElement>(
			"[data-morph-layer]",
		)) {
			const opacity = Number(getComputedStyle(layer).opacity);
			if (opacity <= 0.05) continue;
			const text = layer.textContent ?? "";
			const extent = textExtent(layer);
			const past = Math.max(
				extent.right - bounds.right,
				bounds.left - extent.left,
			);
			frame.visibleTexts.push(text);
			if (past > 1) frame.overflow.push({ text, opacity, past });
		}
		frames.push(frame);
		handle = requestAnimationFrame(sample);
	};
	handle = requestAnimationFrame(sample);
	try {
		await done();
	} finally {
		cancelAnimationFrame(handle);
	}
	return frames;
}

function settled(box: HTMLElement, text: string) {
	return waitFor(
		() => {
			const layers = box.querySelectorAll<HTMLElement>("[data-morph-layer]");
			expect(layers).toHaveLength(1);
			expect(layers[0]).toHaveTextContent(text);
			expect(getComputedStyle(layers[0]).opacity).toBe("1");
			expect(box.style.width).toBe("auto");
		},
		{ timeout: 3000 },
	);
}

export const SequencedSwap: Story = {
	render: () => <MorphLabelExample />,
	play: async ({ canvas }) => {
		for (const [index, [short, long]] of morphLabelPairs.entries()) {
			const button = canvas.getByTestId(`morph-${index}`);
			const box = button.querySelector<HTMLElement>(
				'[data-slot="morph-label"]',
			) as HTMLElement;
			const initial = box.getBoundingClientRect().width;
			// One direction grows the label and the other shrinks it.
			const forward = await sampleFrames(box, async () => {
				await userEvent.click(button);
				await settled(box, long);
			});
			const back = await sampleFrames(box, async () => {
				await userEvent.click(button);
				await settled(box, short);
			});
			for (const frames of [forward, back]) {
				const widths = frames.map(({ boxWidth }) => boxWidth);
				// The width eased through intermediate values.
				expect(new Set(widths.map(Math.round)).size).toBeGreaterThan(2);
				for (const { overflow } of frames) expect(overflow).toEqual([]);
				expect(frames.some(({ visibleTexts }) => visibleTexts.length > 0)).toBe(
					true,
				);
			}
			await expect(box.getBoundingClientRect().width).toBeCloseTo(initial, 0);
			await expect(button).toHaveAccessibleName(short);
		}
	},
};

export const ReducedMotion: Story = {
	render: () => <MorphLabelExample />,
	beforeEach: () => {
		const native = window.matchMedia;
		window.matchMedia = (query) => {
			const media = native.call(window, query);
			if (query === "(prefers-reduced-motion: reduce)")
				Object.defineProperty(media, "matches", { value: true });
			return media;
		};
		return () => {
			window.matchMedia = native;
		};
	},
	play: async ({ canvas }) => {
		const button = canvas.getByTestId("morph-0");
		const box = button.querySelector<HTMLElement>(
			'[data-slot="morph-label"]',
		) as HTMLElement;
		await userEvent.click(button);
		const layers = box.querySelectorAll<HTMLElement>("[data-morph-layer]");
		await expect(layers).toHaveLength(1);
		await expect(layers[0]).toHaveTextContent(morphLabelPairs[0][1]);
		await expect(getComputedStyle(layers[0]).opacity).toBe("1");
		await expect(button).toHaveAccessibleName(morphLabelPairs[0][1]);
	},
};
