"use client";

import clsx from "clsx";
import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import {
	InputFrame,
	inputFrameChromeClassName,
	inputVariants,
} from "./InputFrame";

function CatalogPreview1() {
	const render = () => (
		<div className="grid gap-4">
			<InputFrame
				start={<span aria-hidden>€</span>}
				end={<span>EUR</span>}
				fullWidth
				size="sm"
			>
				<input
					aria-label="Small amount"
					className={inputVariants({
						size: "sm",
						hasStart: true,
						hasEnd: true,
					})}
				/>
			</InputFrame>
			<InputFrame fullWidth size="md">
				<input
					aria-label="Medium input"
					className={inputVariants({ size: "md" })}
				/>
			</InputFrame>
			<InputFrame fullWidth size="lg">
				<input
					aria-label="Large input"
					className={inputVariants({ size: "lg" })}
				/>
			</InputFrame>
		</div>
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}
function CatalogPreview2() {
	const render = () => (
		<InputFrame data-testid="error-frame" fullWidth tone="error">
			<input
				aria-label="Invalid value"
				aria-invalid="true"
				className={inputVariants()}
			/>
		</InputFrame>
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}
function CatalogPreview3() {
	const render = () => (
		<div className="grid gap-4">
			<InputFrame disabled fullWidth>
				<input
					aria-label="Disabled value"
					className={inputVariants({ disabled: true })}
					disabled
					defaultValue="Unavailable"
				/>
			</InputFrame>
			<InputFrame.Skeleton fullWidth>Loading value</InputFrame.Skeleton>
		</div>
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}
function CatalogPreview4() {
	const render = () => (
		<div
			className={clsx(inputFrameChromeClassName, "min-h-9 px-3 py-2")}
			data-testid="static-framed-content"
		>
			Non-interactive content
		</div>
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}

export const catalogContract = defineCatalogOwnerContract({
	id: "ui-primitives-input-frame",
	name: "InputFrame",
	role: "Borderless input chrome with 9px corners, subtle fill and shadow, a 34px default height and a 28px xs toolbar size and a 24px xxs compact-row size. The muted variant uses a softer neutral fill without resting shadow; tone independently owns validation. Composer presentation uses 25px corners and the same fill and shadow. Owns focus treatment, static chrome reuse, and matching skeletons; callers own native control semantics.",
	importStatement:
		'import { InputFrame, inputFrameChromeClassName } from "@/components/ui/primitives/InputFrame";',
	chooseWhen: [
		"A real focusable input needs shared framing, size, adornment spacing, disabled/error treatment, or skeleton parity.",
		"A static domain surface deliberately needs InputFrame-equivalent neutral chrome without input or focus semantics.",
	],
	chooseInstead: [
		"Application code should prefer a finished text-like input that already composes InputFrame.",
	],
	compounds: ["InputFrame.Skeleton"],
	exclusions: [
		"Treating the frame itself as the semantic input.",
		"Overriding frame backgrounds in search or composers; presentation changes geometry, not fill ownership.",
		"Cataloguing inputVariants or direct skeleton implementations as owners.",
		"Applying InputFrame focus, tone, disabled, transition, or adornment behavior to static chrome reuse.",
	],
	guarantees: [
		{
			label: "Muted chrome retains focus and validation",
			storyId: "ui-primitives-input-frame--muted",
		},
		{
			label: "Compact toolbar and skeleton geometry",
			storyId: "ui-primitives-input-frame--compact-toolbar",
		},
		{
			label: "Composer shares input chrome in light and dark",
			storyId: "ui-primitives-input-frame--composer-chrome-parity",
		},
		{
			label: "Sizes and adornments",
			storyId: "ui-primitives-input-frame--sizes-and-adornments",
		},
		{
			label: "Focus and error state",
			storyId: "ui-primitives-input-frame--focus-and-error-state",
		},
		{
			label: "Disabled and skeleton parity",
			storyId: "ui-primitives-input-frame--disabled-and-skeleton-parity",
		},
		{
			label: "Static chrome reuse",
			storyId: "ui-primitives-input-frame--static-chrome-reuse",
		},
	],

	family: "UI",
	group: "Primitives",
	previewTargets: [
		{
			id: "sizes-and-adornments",
			name: "Sizes and adornments",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview1,
		},
		{
			id: "focus-and-error-state",
			name: "Focus and error state",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview2,
		},
		{
			id: "disabled-and-skeleton-parity",
			name: "Disabled and skeleton parity",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview3,
		},
		{
			id: "static-chrome-reuse",
			name: "Static chrome reuse",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview4,
		},
	],
});
