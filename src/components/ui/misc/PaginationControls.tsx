import { Icon } from "@/components/ui/icons/Icon";
import { Button, type ButtonProps } from "@/components/ui/primitives/Button";
import { Text, type TextProps } from "@/components/ui/primitives/Text";

type PaginationControlsProps = {
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
		<div className={`flex items-center gap-[15px] ${className ?? ""}`}>
			<Button
				variant={variant}
				size={buttonSize}
				onClick={onPrev}
				aria-label={prevLabel}
				disabled={disablePrev}
			>
				<Icon name="caret-left" className={iconClassName} />
			</Button>
			<Text
				variant={textVariant}
				className={`font-mono ${textClassName ?? ""}`}
			>
				{current}/{total}
			</Text>
			<Button
				variant={variant}
				size={buttonSize}
				onClick={onNext}
				aria-label={nextLabel}
				disabled={disableNext}
			>
				<Icon name="caret-right" className={iconClassName} />
			</Button>
		</div>
	);
}

function PaginationControlsSkeleton({
	buttonSize = "icon-sm",
	className,
	current = 1,
	total = 10,
}: Pick<PaginationControlsProps, "buttonSize" | "className"> & {
	current?: number;
	total?: number;
}) {
	return (
		<div className={`flex items-center gap-[15px] ${className ?? ""}`}>
			<Button.Skeleton size={buttonSize} variant="secondary" />
			<Text.Skeleton className="font-mono">
				{current}/{total}
			</Text.Skeleton>
			<Button.Skeleton size={buttonSize} variant="secondary" />
		</div>
	);
}

export const PaginationControls = Object.assign(PaginationControlsRoot, {
	Skeleton: PaginationControlsSkeleton,
});
