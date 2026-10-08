import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { HELPER_COLOR_INDICES, HELPER_COLOR_NAMES } from "@/components/ui/foundations/helperPalette";
import { Chip } from "@/components/ui/misc/Chip";
import { ProfilePicture } from "@/components/ui/misc/ProfilePicture";
import Divider from "@/components/ui/primitives/Divider";
import { Card, Float, Panel } from "@/components/ui/primitives/surfaces";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { measureRenderedContrast } from "./contrastEvidence";
import { catalogContract } from "./SurfaceTint.catalog";
import { createSurfaceTint } from "./surfaceTint";

const meta = {
	id: "ui-foundations-surface-tint",
	excludeStories: ["catalogContract"],
	title: "UI/Foundations/Surface Tint",
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const StableRecipe: Story = {
	render: () => {
		const tint = createSurfaceTint({
			surface: "var(--surface)",
			space: "oklab",
			tint: "var(--primary)",
			tintPercentage: 12,
		});
		return (
			<div
				className="grid gap-3 rounded-md border p-4"
				style={{ background: tint }}
			>
				<strong>Tinted surface</strong>
				<code data-testid="tint-recipe">{tint}</code>
			</div>
		);
	},
	play: async ({ canvas }) => {
		await expect(canvas.getByTestId("tint-recipe")).toHaveTextContent(
			"color-mix(in oklab,var(--primary) 12%,var(--surface))",
		);
	},
};

const inkRoles = [
	["Body", "text-foreground"],
	["Muted", "text-muted-foreground"],
	["Primary", "text-primary-text"],
	["Success", "text-success-text"],
	["Warning", "text-warning"],
	["Danger", "text-danger-text"],
] as const;
const surfaceOwners = [Panel, Card, Float];
function ColorPass() {
	return (
		<div className="grid gap-5">
			<div>
				<h1 className="text-lg font-semibold">Color across three surfaces</h1>
				<p className="text-sm text-muted-foreground">
					One color set for semantic tones and identity: avatars use the default
					tint; held down is momentary interaction feedback.
				</p>
			</div>
			<div className="grid gap-4 md:grid-cols-3">
				{(["Surface", "Card", "Float"] as const).map((label, surfaceIndex) => {
					const Owner = surfaceOwners[surfaceIndex];
					return (
						<Owner
							padding="none"
							display="grid"
							key={label}
							className="p-4 grid gap-4"
							data-contrast-surface={label}
						>
							<h2 className="font-semibold">{label}</h2>
							<div className="grid grid-cols-2 gap-2 text-sm">
								{inkRoles.map(([name, className]) => (
									<span
										key={name}
										className={className}
										data-contrast-label={name}
									>
										{name} text
									</span>
								))}
							</div>
							<Divider decorative />
							<div className="grid gap-2">
								{HELPER_COLOR_INDICES.map((index) => (
									<div
										key={index}
										className="flex items-center gap-3"
										data-helper-evidence={index}
									>
										<ProfilePicture
											fallback="AB"
											helperIndex={index}
											size="sm"
										/>
										<Chip
											tone="helper"
											helperIndex={index}
											data-contrast-label={`Helper ${index}`}
										>
											{HELPER_COLOR_NAMES[index]}
										</Chip>
										<Chip
											tone="helper"
											helperIndex={index}
											onClick={() => {}}
											data-contrast-label={`Helper ${index} pressed`}
											style={{
												backgroundColor: "var(--chip-background-active)",
											}}
										>
											Held down
										</Chip>
									</div>
								))}
							</div>
						</Owner>
					);
				})}
			</div>
		</div>
	);
}
async function verifyColorPass({
	canvasElement,
}: {
	canvasElement: HTMLElement;
}) {
	for (const surface of canvasElement.querySelectorAll<HTMLElement>(
		"[data-contrast-surface]",
	)) {
		const readings = [];
		for (const sample of surface.querySelectorAll<HTMLElement>(
			"[data-contrast-label], [data-slot=profile-picture]",
		)) {
			const result = measureRenderedContrast(sample, surface);
			readings.push({
				role: sample.dataset.contrastLabel ?? "Avatar",
				...result,
			});
			await expect(
				result.text,
				`${surface.dataset.contrastSurface} ${sample.dataset.contrastLabel ?? "avatar"} text`,
			).toBeGreaterThanOrEqual(4.5);
		}
		console.info(
			"Contrast evidence",
			surface.dataset.contrastSurface,
			readings,
		);
	}
}
export const LightColorPass: Story = {
	globals: { appearance: "light" },
	render: () => <ColorPass />,
	play: verifyColorPass,
};
export const DarkColorPass: Story = {
	globals: { appearance: "dark" },
	render: () => <ColorPass />,
	play: verifyColorPass,
};
