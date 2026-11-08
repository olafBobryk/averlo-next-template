import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Button } from "./Button";
import { Field } from "./Field";
import { catalogContract, FieldMessageWidthsExample } from "./Field.catalog";
import { InputFrame, inputVariants } from "./InputFrame";

const meta = {
	id: "ui-primitives-field",
	excludeStories: ["catalogContract"],
	title: "UI/Primitives/Field",
	component: Field,
	subcomponents: { "Field.Skeleton": Field.Skeleton },
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		layout: "padded",
		a11y: { test: "error" },
		docs: {
			description: {
				component: formatCatalogOwnerContract(catalogContract),
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const LabelDescriptionAndErrorRelationships: Story = {
	parameters: {
		a11y: { test: "error" },
	},
	render: () => (
		<Field
			label="Project name"
			description="Use a name teammates will recognize."
			message="A project name is required."
			tone="error"
			required
			inputId="project-name"
			descriptionId="project-name-description"
			messageId="project-name-message"
		>
			<InputFrame fullWidth tone="error">
				<input
					id="project-name"
					aria-describedby="project-name-description"
					aria-errormessage="project-name-message"
					aria-invalid="true"
					className={inputVariants()}
				/>
			</InputFrame>
		</Field>
	),
	play: async ({ canvas }) => {
		const input = canvas.getByRole("textbox", { name: /project name/i });
		await expect(input).toHaveAccessibleDescription(
			"Use a name teammates will recognize.",
		);
		await expect(input).toHaveAttribute(
			"aria-errormessage",
			"project-name-message",
		);
		await expect(canvas.getByRole("alert")).toHaveTextContent(
			"A project name is required.",
		);
	},
};

export const SuccessAndLabelAction: Story = {
	parameters: {
		a11y: { test: "error" },
	},
	render: () => (
		<Field
			label="Slug"
			labelAction={
				<Button size="none" variant="ghost">
					Generate
				</Button>
			}
			message="Available"
			tone="success"
			inputId="project-slug"
			messageId="project-slug-message"
		>
			<InputFrame fullWidth tone="success">
				<input
					id="project-slug"
					className={inputVariants()}
					defaultValue="averlo"
				/>
			</InputFrame>
		</Field>
	),
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("textbox", { name: "Slug" })).toHaveValue(
			"averlo",
		);
		await expect(
			canvas.getByRole("button", { name: "Generate" }),
		).toBeVisible();
		await expect(canvas.getByText("Available")).toBeVisible();
	},
};

export const SkeletonParity: Story = {
	render: () => (
		<Field.Skeleton label="Project name" fullWidth>
			Project name
		</Field.Skeleton>
	),
};

function messageGeometry(frame: HTMLElement) {
	const region = frame.querySelector<HTMLElement>(
		'[data-slot="content-presence"]',
	);
	if (!region) throw new Error("Field message region is missing.");
	const content = region.firstElementChild as HTMLElement | null;
	const text = region.querySelector<HTMLElement>("p");
	const after = frame.querySelector<HTMLElement>("[data-testid^=field-after]");
	return { region, content, text, after };
}

type MessageFrame = {
	violations: string[];
	textHeight: number;
	regionHeight: number;
};

/**
 * Samples every frame until `done` resolves. A visible message (opacity above
 * 0.05) must never be cut by its box or an ancestor, nor overlap what follows.
 */
async function sampleMessages(
	frames: HTMLElement[],
	done: () => Promise<unknown>,
) {
	const samples: MessageFrame[] = [];
	let handle = 0;
	const sample = () => {
		for (const root of frames) {
			const { region, content, text, after } = messageGeometry(root);
			if (!content || !text) continue;
			const opacity = Number(getComputedStyle(content).opacity);
			const textBox = text.getBoundingClientRect();
			const violations: string[] = [];
			if (opacity > 0.05) {
				for (
					let element: HTMLElement | null = region;
					element && element !== root;
					element = element.parentElement
				) {
					const style = getComputedStyle(element);
					const bounds = element.getBoundingClientRect();
					const clips =
						style.overflowY !== "visible" ||
						style.maskImage !== "none" ||
						style.clipPath !== "none";
					if (clips && textBox.bottom > bounds.bottom + 0.5)
						violations.push(`clipped at opacity ${opacity}`);
				}
				if (after && textBox.bottom > after.getBoundingClientRect().top + 0.5)
					violations.push(`overlaps following content at opacity ${opacity}`);
			}
			samples.push({
				violations,
				textHeight: textBox.height,
				regionHeight: region.getBoundingClientRect().height,
			});
		}
		handle = requestAnimationFrame(sample);
	};
	handle = requestAnimationFrame(sample);
	try {
		await done();
	} finally {
		cancelAnimationFrame(handle);
	}
	return samples;
}

export const MultiLineMessage: Story = {
	render: () => <FieldMessageWidthsExample />,
	play: async ({ canvas, canvasElement }) => {
		const frames = [390, 1440].map(
			(width) =>
				canvasElement.querySelector<HTMLElement>(
					`[data-testid="field-width-${width}"]`,
				) as HTMLElement,
		);
		const opening = await sampleMessages(frames, async () => {
			await userEvent.click(
				canvas.getByRole("button", { name: "Show errors" }),
			);
			await waitFor(
				() => {
					for (const root of frames) {
						const { region, content } = messageGeometry(root);
						expect(content).not.toBeNull();
						expect(getComputedStyle(content as HTMLElement).opacity).toBe("1");
						expect(getComputedStyle(region).overflow).toBe("visible");
					}
				},
				{ timeout: 3000 },
			);
		});
		// The samples include frames where the box is still shorter than the text.
		expect(
			opening.some(
				({ textHeight, regionHeight }) => regionHeight < textHeight - 1,
			),
		).toBe(true);
		for (const { violations } of opening) expect(violations).toEqual([]);

		for (const root of frames) {
			const { region, text, after } = messageGeometry(root);
			const textBox = (text as HTMLElement).getBoundingClientRect();
			const style = getComputedStyle(text as HTMLElement);
			// At rest the box holds the whole message, which wraps to two lines.
			expect(region.getBoundingClientRect().height).toBeGreaterThanOrEqual(
				(text as HTMLElement).scrollHeight - 0.5,
			);
			expect(
				textBox.height - Number.parseFloat(style.paddingTop),
			).toBeGreaterThanOrEqual(Number.parseFloat(style.lineHeight) * 2 - 1);
			expect(
				(after as HTMLElement).getBoundingClientRect().top,
			).toBeGreaterThanOrEqual(textBox.bottom - 0.5);
			await expect(text).toHaveAttribute("role", "alert");
		}

		const closing = await sampleMessages(frames, async () => {
			await userEvent.click(
				canvas.getByRole("button", { name: "Clear errors" }),
			);
			await waitFor(
				() => {
					for (const root of frames) {
						const { region } = messageGeometry(root);
						expect(region.firstElementChild).toBeNull();
						expect(region.getBoundingClientRect().height).toBe(0);
					}
				},
				{ timeout: 3000 },
			);
		});
		for (const { violations } of closing) expect(violations).toEqual([]);
	},
};
