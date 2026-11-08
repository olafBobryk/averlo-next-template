"use client";

import clsx from "clsx";
import { focusRing } from "@/components/ui/foundations/focus";

type ChoiceIndicatorBaseProps = {
	checked: boolean;
	disabled?: boolean;
	className?: string;
};

export type ChoiceIndicatorSize = "compact" | "default";

type ChoiceIndicatorMultiProps = ChoiceIndicatorBaseProps & {
	size?: ChoiceIndicatorSize;
};

const uncheckedIndicatorSurface =
	"bg-input group-hover:bg-input/80 dark:group-hover:bg-foreground/25 group-data-[tone=error]/field:bg-danger/15";

export function ChoiceIndicatorMulti({
	checked,
	disabled,
	className,
	size = "default",
}: ChoiceIndicatorMultiProps) {
	return (
		<div
			className={clsx(
				"choice-field-indicator relative shrink-0 overflow-hidden transition-colors motion-snap",
				size === "compact"
					? "size-[18px] rounded-[6px]"
					: "size-[22px] rounded-[8px]",
				focusRing.peerDefault,
				focusRing.peerError,
				disabled ? "opacity-60" : "opacity-100",
				checked
					? "bg-primary group-hover:bg-primary-hover group-active:bg-primary-active"
					: uncheckedIndicatorSurface,
				className,
			)}
		>
			<span
				aria-hidden="true"
				className={clsx(
					"absolute flex size-3 items-center justify-center text-[13px] font-semibold leading-none text-primary-foreground transition-[scale] motion-snap",
					size === "compact" ? "inset-[3px]" : "inset-[5px]",
					checked ? "scale-100" : "scale-0",
				)}
			>
				{"\u2713"}
			</span>
		</div>
	);
}

export function ChoiceIndicatorRadio({
	checked,
	disabled,
	className,
}: ChoiceIndicatorBaseProps) {
	return (
		<div
			className={clsx(
				"choice-field-indicator relative size-[22px] shrink-0 overflow-hidden rounded-full transition-colors motion-snap",
				focusRing.peerDefault,
				focusRing.peerError,
				disabled ? "opacity-60" : "opacity-100",
				checked
					? "bg-primary group-hover:bg-primary-hover group-active:bg-primary-active"
					: uncheckedIndicatorSurface,
				className,
			)}
		>
			<div
				className={clsx(
					"absolute inset-[5px] size-3 rounded-full bg-primary-foreground transition-[scale] motion-snap",
					checked ? "scale-100" : "scale-0",
				)}
			/>
		</div>
	);
}

export function ChoiceIndicatorToggle({
	checked,
	disabled,
	className,
}: ChoiceIndicatorBaseProps) {
	return (
		<div
			className={clsx(
				"choice-field-indicator relative h-[26px] min-w-[42px] shrink-0 overflow-hidden rounded-full transition-colors motion-snap",
				focusRing.peerDefault,
				focusRing.peerError,
				disabled ? "opacity-60" : "opacity-100",
				checked
					? "bg-primary group-hover:bg-primary-hover group-active:bg-primary-active"
					: uncheckedIndicatorSurface,
				className,
			)}
		>
			<div
				className={clsx(
					"absolute left-1 top-1 h-[18px] w-[22px] rounded-full transition-[background-color,translate,box-shadow] motion-snap",
					checked
						? "translate-x-3 bg-primary-foreground shadow-sm"
						: "translate-x-0 bg-muted-foreground/55 dark:bg-muted-foreground",
				)}
			/>
		</div>
	);
}
