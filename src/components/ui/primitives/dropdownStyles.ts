import { focusRing } from "@/components/ui/foundations/focus";
import {
	type SurfaceElevation,
	surfaceChromeStyles,
} from "@/components/ui/primitives/surfaces/surfaceStyles";

export type DropdownOptionTone = "default" | "warning" | "danger";
export type DropdownDivider = boolean | "full" | "inset";

type DropdownOptionClassOptions = {
	active?: boolean;
	selected?: boolean;
	disabled?: boolean;
	layout?: "default" | "presentation";
	tone?: DropdownOptionTone;
	className?: string;
	activeClassName?: string;
	selectedClassName?: string;
	disabledClassName?: string;
};

export const dropdownChromeClassName = "!rounded-[12px]";
export const dropdownElevationClassName = "!shadow-[var(--dropdown-shadow)]";

export const dropdownListWrapperClassName =
	"flex max-h-[252px] min-h-0 flex-col overflow-y-auto p-0";
export const dropdownListClassName = "flex shrink-0 flex-col gap-0.5 p-1";
export const dropdownEmptyStateClassName = "px-4 py-3";
export function getDropdownSurfaceClassName(
	elevation: SurfaceElevation = "float",
) {
	return `${surfaceChromeStyles({ background: "float", border: "subtle", elevation, radius: "float" })} ${dropdownChromeClassName} ${elevation === "float" ? dropdownElevationClassName : ""} overflow-hidden`;
}

export const dropdownSurfaceClassName = getDropdownSurfaceClassName();
const dropdownOptionBaseClassName =
	"flex w-full min-w-0 items-center gap-2.5 !border-0 !bg-clip-border !px-2.5 !py-1.5 text-left text-sm text-foreground !transition-none";
const dropdownPresentationOptionClassName =
	"!h-auto !min-h-16 !gap-0 !px-3 !py-3";
const dropdownOptionRadiusClassName = "!rounded-[7px]";

export function getDropdownOptionClassName({
	active,
	selected,
	disabled,
	layout = "default",
	tone = "default",
	className,
	activeClassName,
	selectedClassName,
	disabledClassName,
}: DropdownOptionClassOptions = {}) {
	return [
		dropdownOptionBaseClassName,
		layout === "presentation" ? dropdownPresentationOptionClassName : undefined,
		dropdownOptionRadiusClassName,
		focusRing.visibleInner,
		selected && tone === "default" ? "!text-foreground" : undefined,
		active && !disabled && tone === "default"
			? "[&&]:!bg-foreground/5 !text-foreground"
			: undefined,
		tone === "danger"
			? [
					"!text-[var(--button-danger-text)]",
					disabled
						? undefined
						: "[&&]:hover:!bg-danger/10 hover:!text-[var(--button-danger-text)]",
				]
					.filter(Boolean)
					.join(" ")
			: undefined,
		tone === "warning"
			? [
					"!text-[var(--button-warning-text)]",
					disabled
						? undefined
						: "[&&]:hover:!bg-warning-accent/10 hover:!text-[var(--button-warning-text)]",
				]
					.filter(Boolean)
					.join(" ")
			: undefined,
		active && !disabled && tone === "danger"
			? "[&&]:!bg-danger/10 !text-[var(--button-danger-text)]"
			: undefined,
		active && !disabled && tone === "warning"
			? "[&&]:!bg-warning-accent/10 !text-[var(--button-warning-text)]"
			: undefined,
		disabled
			? "cursor-not-allowed opacity-50 [&&]:hover:!bg-transparent [&&]:hover:!opacity-50 [&&]:active:!opacity-50"
			: [
					"cursor-pointer",
					tone === "default" ? "[&&]:hover:!bg-foreground/5" : undefined,
					"[&&]:hover:!opacity-100 [&&]:active:!opacity-100",
				]
					.filter(Boolean)
					.join(" "),
		className,
		active ? activeClassName : undefined,
		selected ? selectedClassName : undefined,
		disabled ? disabledClassName : undefined,
	]
		.filter(Boolean)
		.join(" ");
}

/** Shared by action collections and custom control panels. */
export const dropdownCompactOptionClassName = "!h-7 !min-h-7 !py-0 !text-xs";
export function getDropdownDividerClassName(boundary: DropdownDivider) {
	return boundary === "full"
		? "-mx-1 my-0.5 !w-[calc(100%+8px)] !bg-foreground/10"
		: "mx-2.5 my-0.5 !w-[calc(100%-20px)] !bg-foreground/10";
}
