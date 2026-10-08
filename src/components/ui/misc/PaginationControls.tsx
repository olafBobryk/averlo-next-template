import { Icon } from "@/components/ui/icons/Icon";
import { Button, type ButtonProps } from "@/components/ui/primitives/Button";
import { Text, type TextProps } from "@/components/ui/primitives/Text";

type PaginationControlsProps = {
	countFormat?: "fraction" | "pages";
	ariaLabel?: string;
	current: number;
	total: number;
	onPrev: () => void;
	onNext: () => void;
	prevLabel?: string;
	nextLabel?: string;
	disablePrev?: boolean;
	disableNext?: boolean;
	variant?: ButtonProps["variant"];
	buttonSize?: ButtonProps["size"];
	preserveIconDirection?: boolean;
	textVariant?: TextProps["variant"];
	textClassName?: string;
	className?: string;
};

function PaginationControlsRoot({
	countFormat = "fraction",
	ariaLabel = "Pages",
	current,
	total,
	onPrev,
	onNext,
	prevLabel = "Previous",
	nextLabel = "Next",
	disablePrev,
	disableNext,
	variant = "secondary",
	buttonSize = "icon-sm",
	preserveIconDirection = false,
	textVariant = "body",
	textClassName,
	className,
}: PaginationControlsProps) {
	const iconClassName = preserveIconDirection ? "rtl:-scale-x-100" : undefined;

	return (
		<nav
			aria-label={ariaLabel}
			className={`flex items-center ${countFormat === "pages" ? "gap-0" : "gap-[15px]"} ${className ?? ""}`}
		>
			<Button
				variant={variant}
				size={buttonSize}
				shape="square"
				onClick={onPrev}
				aria-label={prevLabel}
				disabled={disablePrev}
			>
				<Icon name="caret-left" className={iconClassName} />
			</Button>
			<Text
				variant={textVariant}
				className={`${countFormat === "pages" ? "whitespace-nowrap px-1 tabular-nums" : "font-mono"} ${textClassName ?? ""}`}
			>
				{countFormat === "pages"
					? `${current} of ${total}`
					: `${current}/${total}`}
			</Text>
			<Button
				variant={variant}
				size={buttonSize}
				shape="square"
				onClick={onNext}
				aria-label={nextLabel}
				disabled={disableNext}
			>
				<Icon name="caret-right" className={iconClassName} />
			</Button>
		</nav>
	);
}

function PaginationControlsSkeleton({
	countFormat = "fraction",
	buttonSize = "icon-sm",
	className,
	current = 1,
	total = 10,
	variant = "secondary",
	textVariant = "body",
	textClassName,
}: Pick<
	PaginationControlsProps,
	| "buttonSize"
	| "className"
	| "countFormat"
	| "variant"
	| "textVariant"
	| "textClassName"
> & {
	current?: number;
	total?: number;
}) {
	return (
		<div
			className={`flex items-center ${countFormat === "pages" ? "gap-0" : "gap-[15px]"} ${className ?? ""}`}
		>
			<Button.Skeleton size={buttonSize} shape="square" variant={variant} />
			<Text.Skeleton
				variant={textVariant}
				className={`${countFormat === "pages" ? "whitespace-nowrap px-1 tabular-nums" : "font-mono"} ${textClassName ?? ""}`}
			>
				{countFormat === "pages"
					? `${current} of ${total}`
					: `${current}/${total}`}
			</Text.Skeleton>
			<Button.Skeleton size={buttonSize} shape="square" variant={variant} />
		</div>
	);
}

export const PaginationControls = Object.assign(PaginationControlsRoot, {
	Skeleton: PaginationControlsSkeleton,
});
