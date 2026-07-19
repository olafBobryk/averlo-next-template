import { focusRing } from "@/components/ui/foundations/focus";

type DropdownOptionClassOptions = {
	active?: boolean;
	selected?: boolean;
	disabled?: boolean;
	tone?: "default" | "danger";
	className?: string;
	activeClassName?: string;
	selectedClassName?: string;
	disabledClassName?: string;
};

export const dropdownListWrapperClassName = "flex flex-col gap-0 p-0";
export const dropdownListClassName =
	"flex max-h-[260px] flex-col gap-0 overflow-y-auto p-0";
export const dropdownEmptyStateClassName = "px-4 py-3";
export const dropdownOptionBaseClassName =
	"flex w-full min-w-0 items-center gap-2.5 !border-0 !bg-clip-border !px-[15px] !py-2.5 text-left text-sm transition-colors motion-micro text-foreground/80 hover:!bg-foreground/5";
export const dropdownOptionRadiusClassName = "rounded-none";

export function getDropdownOptionClassName({
	active,
	selected,
	disabled,
	tone = "default",
	className,
	activeClassName,
	selectedClassName,
	disabledClassName,
}: DropdownOptionClassOptions = {}) {
	return [
		dropdownOptionBaseClassName,
		dropdownOptionRadiusClassName,
		focusRing.visibleDefault,
		selected ? "!bg-foreground/10 !text-foreground" : undefined,
		active && !selected && tone === "default"
			? "!bg-foreground/5 !text-foreground"
			: undefined,
		tone === "danger"
			? "!text-danger hover:!bg-danger/10 hover:!text-danger"
			: undefined,
		active && tone === "danger" ? "!bg-danger/10 !text-danger" : undefined,
		disabled
			? "cursor-not-allowed opacity-50 hover:bg-transparent"
			: "cursor-pointer",
		className,
		active ? activeClassName : undefined,
		selected ? selectedClassName : undefined,
		disabled ? disabledClassName : undefined,
	]
		.filter(Boolean)
		.join(" ");
}
