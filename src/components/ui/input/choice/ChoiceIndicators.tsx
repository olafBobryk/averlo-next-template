"use client";

import clsx from "clsx";
import { focusRing } from "@/components/ui/foundations/focus";
import { Icon } from "@/components/ui/icons/Icon";

type ChoiceIndicatorBaseProps = {
	checked: boolean;
	disabled?: boolean;
	className?: string;
};

export function ChoiceIndicatorRadio({
	checked,
	disabled,
	className,
}: ChoiceIndicatorBaseProps) {
	return (
		<div
			className={clsx(
				"choice-field-indicator flex h-[22px] w-[22px] items-center justify-center rounded-full bg-background group-hover:bg-surface motion-micro",
				focusRing.peerDefault,
				focusRing.peerError,
				disabled ? "opacity-60" : "opacity-100",
				!checked ? "group-hover:scale-[1.05] group-active:scale-[0.95]" : "",
				className,
			)}
		>
			<div
				className={clsx(
					"flex h-[22px] w-[22px] items-center justify-center rounded-full border transition-colors motion-interactive",
					checked
						? "border-white/15 bg-primary"
						: "border-foreground/20 group-data-[tone=error]/field:border-danger",
				)}
			>
				<div
					className={clsx(
						"h-[12px] w-[12px] rounded-full transition-[transform,opacity] motion-interactive",
						checked
							? "scale-100 bg-primary-foreground"
							: "scale-0 bg-transparent",
					)}
				/>
			</div>
		</div>
	);
}

export function ChoiceIndicatorMulti({
	checked,
	disabled,
	className,
}: ChoiceIndicatorBaseProps) {
	return (
		<div
			className={clsx(
				"choice-field-indicator flex h-[22px] w-[22px] items-center justify-center rounded-[8px] group-hover:bg-surface group-hover:scale-[1.05] group-active:scale-[0.95] motion-micro",
				focusRing.peerDefault,
				focusRing.peerError,
				disabled ? "opacity-60" : "opacity-100",
				className,
			)}
		>
			<div
				className={clsx(
					"flex h-[22px] w-[22px] rounded-[8px] border transition-all motion-interactive overflow-hidden",
					checked
						? "border-white/15 bg-primary"
						: "border-foreground/20 group-data-[tone=error]/field:border-danger",
					disabled ? "opacity-60" : "opacity-100",
				)}
			>
				<div
					className={clsx(
						"w-full h-full flex items-center justify-center motion-micro transition-colors",
						checked
							? "group-hover:bg-primary-hover group-active:bg-primary-active"
							: "",
					)}
				>
					<Icon
						name="check"
						size="sm"
						className={clsx(
							"text-primary-foreground transition-transform motion-interactive",
							checked ? "scale-100" : "scale-0",
						)}
					/>
				</div>
			</div>
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
				"choice-field-indicator flex h-[26px] w-[42px] items-center justify-center rounded-full overflow-hidden bg-background group-hover:bg-surface group-hover:scale-[1.05] group-active:scale-[0.95] motion-micro",
				focusRing.peerDefault,
				focusRing.peerError,
				disabled ? "opacity-60" : "opacity-100",
				className,
			)}
		>
			<div
				className={clsx(
					"relative flex h-[26px] w-[42px] items-center rounded-full overflow-hidden border transition-colors motion-interactive",
					checked
						? "border-white/15 bg-primary"
						: "border-foreground/20 group-data-[tone=error]/field:border-danger",
					disabled ? "opacity-60" : "opacity-100",
				)}
			>
				<div
					className={clsx(
						"w-full h-full flex items-center justify-center motion-micro transition-colors",
						checked
							? "group-hover:bg-primary-hover group-active:bg-primary-active"
							: "",
					)}
				>
					<div
						className={clsx(
							"absolute left-[3px] top-[3px] h-[18px] w-[22px] border border-foreground/20 rounded-full bg-background shadow-sm transition-transform motion-interactive",
							checked ? "translate-x-[12px] border-none" : "translate-x-0",
						)}
					/>
				</div>
			</div>
		</div>
	);
}
