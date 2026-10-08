import clsx from "clsx";
import { focusRing } from "@/components/ui/foundations/focus";

export type ButtonVariant =
	| "primary"
	| "secondary"
	| "ghost"
	| "bare"
	| "link"
	| "inverse";
export type ButtonTone = "default" | "danger" | "warning";
export type ButtonSize =
	| "none"
	| "xxs"
	| "xs"
	| "compact"
	| "sm"
	| "md"
	| "lg"
	| "xl"
	| "chip"
	| "icon"
	| "icon-sm";
export type ButtonShape = "standard" | "round" | "square";
export type ButtonStyleProps = {
	variant?: ButtonVariant | null;
	tone?: ButtonTone | null;
	size?: ButtonSize | null;
	shape?: ButtonShape | null;
	radius?: "pill" | "sm" | null;
	align?: "left" | "center" | "between" | null;
	hitArea?: "none" | "touch" | null;
};

const typography: Record<ButtonSize, string> = {
	none: "",
	xxs: "text-xs font-medium",
	xs: "text-xs font-medium",
	compact: "text-xs font-medium",
	sm: "text-xs font-medium",
	md: "text-sm font-medium",
	lg: "text-sm font-semibold",
	xl: "text-base font-semibold",
	chip: "text-xs font-medium",
	icon: "text-sm font-medium",
	"icon-sm": "text-sm font-medium",
};
const geometry: Record<ButtonSize, string> = {
	none: "",
	xxs: "h-5 px-1.5",
	xs: "h-6 px-2",
	compact: "h-7 px-2.5",
	sm: "h-[30px] px-4",
	md: "h-[34px] px-4",
	lg: "h-[38px] px-5",
	xl: "h-11 px-6",
	chip: "h-auto px-2 py-1",
	icon: "size-[34px] p-0",
	"icon-sm": "size-8 p-0",
};
const iconGeometry: Record<ButtonSize, string> = {
	none: "p-0",
	xxs: "size-5 p-0",
	xs: "size-6 p-0",
	compact: "size-7 p-0",
	sm: "size-8 p-0",
	md: "size-[34px] p-0",
	lg: "size-[38px] p-0",
	xl: "size-10 p-0",
	chip: "size-6 p-0",
	icon: "size-[34px] p-0",
	"icon-sm": "size-8 p-0",
};

export function buttonGeometry({
	size = "md",
	shape = "standard",
	radius,
	align = "center",
}: ButtonStyleProps) {
	const resolvedSize = size ?? "md";
	return clsx(
		typography[resolvedSize],
		shape === "round" || shape === "square"
			? iconGeometry[resolvedSize]
			: geometry[resolvedSize],
		radius === "pill" || (!radius && shape === "round")
			? "rounded-full"
			: "rounded-[var(--button-radius)]",
		align === "left"
			? "justify-start"
			: align === "between"
				? "justify-between"
				: "justify-center",
	);
}

export function buttonStyles(props: ButtonStyleProps) {
	const { variant = "secondary", tone = "default", hitArea } = props;
	const semantic = tone === "danger" || tone === "warning";
	const filled =
		variant === "primary" || variant === "inverse" || variant === "secondary";
	return clsx(
		"group relative inline-flex shrink-0 items-center whitespace-nowrap border-0 bg-clip-padding cursor-pointer select-none transition-colors motion-interactive motion-reduce:transition-none",
		"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
		focusRing.visibleDefault,
		buttonGeometry(props),
		tone === "danger" &&
			"[--button-tone:var(--button-danger)] [--button-tone-text:var(--button-danger-text)]",
		tone === "warning" &&
			"[--button-tone:var(--button-warning)] [--button-tone-text:var(--button-warning-text)]",
		semantic &&
			"text-[var(--button-tone-text)] focus-visible:ring-[color-mix(in_srgb,var(--button-tone)_30%,transparent)]",
		semantic &&
			filled &&
			"bg-[color-mix(in_srgb,var(--button-tone)_var(--button-tone-fill),transparent)] hover:bg-[color-mix(in_srgb,var(--button-tone)_var(--button-tone-hover),transparent)] shadow-[var(--button-secondary-shadow)]",
		!semantic &&
			(variant === "primary" || variant === "inverse") &&
			"bg-[var(--button-primary)] text-[var(--button-primary-foreground)] hover:bg-[color-mix(in_srgb,var(--button-primary)_90%,transparent)] shadow-xs",
		!semantic &&
			variant === "secondary" &&
			"bg-[var(--button-secondary)] text-[var(--button-foreground)] hover:bg-[var(--button-secondary-hover)] shadow-[var(--button-secondary-shadow)]",
		!semantic &&
			(variant === "ghost" || variant === "bare" || variant === "link") &&
			"text-[var(--button-foreground)]",
		!filled && "bg-transparent",
		variant === "ghost" &&
			(semantic
				? "hover:bg-[color-mix(in_srgb,var(--button-tone)_var(--button-tone-fill),transparent)]"
				: "hover:bg-[var(--button-ghost-hover)]"),
		variant === "bare" &&
			"transition-opacity hover:opacity-70 active:opacity-50",
		variant === "link" && "underline-offset-4 hover:underline",
		hitArea === "touch" &&
			"before:absolute before:left-1/2 before:top-1/2 before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
	);
}

export function buttonContentGap(size: ButtonSize) {
	switch (size) {
		case "none":
		case "icon":
		case "icon-sm":
			return undefined;
		case "xxs":
			return "gap-0.5";
		case "xs":
		case "compact":
		case "chip":
			return "gap-1";
		case "sm":
			return "gap-1.5";
		case "md":
		case "lg":
		case "xl":
			return "gap-2";
	}
}
