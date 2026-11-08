import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect } from "react";
import { expect, userEvent } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Button } from "../primitives/Button";
import { MotionProvider } from "./MotionProvider";
import { catalogContract } from "./MotionProvider.catalog";
import {
	useIntroDisableOverride,
	useMotionDisableOverride,
} from "./motionDisableOverride";

function OverrideEvidence() {
	const motionDisabled = useMotionDisableOverride();
	const introDisabled = useIntroDisableOverride();

	useEffect(
		() => () => {
			delete document.documentElement.dataset.motionOverride;
			delete document.documentElement.dataset.loadingOverride;
		},
		[],
	);

	return (
		<div className="grid gap-3">
			<output aria-live="polite">
				Motion {motionDisabled ? "disabled" : "enabled"}; intro{" "}
				{introDisabled ? "disabled" : "enabled"}
			</output>
			<Button
				onClick={() => {
					document.documentElement.dataset.motionOverride = "off";
					document.documentElement.dataset.loadingOverride = "off";
					window.dispatchEvent(new PopStateEvent("popstate"));
				}}
			>
				Apply automation overrides
			</Button>
		</div>
	);
}

const meta = {
	id: "ui-foundations-motion-provider",
	excludeStories: ["catalogContract"],
	title: "UI/Foundations/Motion Provider and Overrides",
	component: MotionProvider,
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta<typeof MotionProvider>;

export default meta;
type Story = StoryObj;

export const AutomationOverrides: Story = {
	render: () => <OverrideEvidence />,
	play: async ({ canvas }) => {
		await expect(
			canvas.getByText(/Motion enabled; intro enabled/),
		).toBeInTheDocument();
		await userEvent.click(
			canvas.getByRole("button", { name: "Apply automation overrides" }),
		);
		await expect(
			canvas.getByText(/Motion disabled; intro disabled/),
		).toBeInTheDocument();
	},
};
