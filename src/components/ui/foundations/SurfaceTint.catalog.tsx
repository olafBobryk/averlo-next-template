"use client";

import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { createSurfaceTint } from "./surfaceTint";

function CatalogPreview1() {
	const render = () => {
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
	};
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}

export const catalogContract = defineCatalogOwnerContract({
	id: "ui-foundations-surface-tint",
	name: "Surface Tint",
	role: "Canonical color-mix recipe builder for opaque tinted surfaces that preserve their actual container ownership.",
	importStatement:
		'import { createSurfaceTint } from "@/components/ui/foundations/surfaceTint";',
	chooseWhen: [
		"A library owner needs a reusable tint mixed against its surface token.",
		"Semantic foreground tokens are ink and accent tokens are fills. Review the actual composited foreground/background pair after tinting on Surface, Card and Float, in light/dark and interactive states: normal text needs 4.5:1; large text, meaningful graphics and control boundaries need 3:1 where applicable. Soft decorative fills are not text or meaningful-graphic contrast targets.",
		"Name-based avatars use stable full-name-derived primary/success/warning/danger/violet tints with readable initials; the default static tint does not communicate status or a held-down interaction.",
	],
	chooseInstead: [
		"Use Panel or Card semantic backgrounds when an existing surface variant already fits.",
	],
	compounds: ["SurfaceTintOptions", "SurfaceTintSpace"],
	exclusions: [
		"Component-local color-mix strings that duplicate a shared tint recipe.",
	],
	guarantees: [
		{
			label: "Light surface contrast matrix",
			storyId: "ui-foundations-surface-tint--light-color-pass",
		},
		{
			label: "Dark surface contrast matrix",
			storyId: "ui-foundations-surface-tint--dark-color-pass",
		},
		{
			label: "Stable color-mix recipe",
			storyId: "ui-foundations-surface-tint--stable-recipe",
		},
	],

	family: "UI",
	group: "Foundations",
	previewTargets: [
		{
			id: "stable-recipe",
			name: "Stable color-mix recipe",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview1,
		},
	],
});
