"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import * as React from "react";
import { spring } from "@/components/ui/foundations/spring";
import { Icon, type IconName } from "@/components/ui/icons/Icon";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type IconProp = IconName | Exclude<React.ReactNode, string | number>;

type SegmentedControlOption<T extends string> = {
	value: T;
	label: React.ReactNode;
	disabled?: boolean;
	icon?: IconProp;
	leadingIcon?: IconProp;
	trailingIcon?: IconProp;
};

type SegmentedControlLayout = "equal" | "auto" | "columns";

type SegmentedControlProps<T extends string> = {
	options: readonly SegmentedControlOption<T>[];
	value?: T;
	defaultValue?: T;
	onChange?: (value: T) => void;
	disabled?: boolean;
	layout?: SegmentedControlLayout;
	columns?: number;
	roundedFull?: boolean;
	pillClassName?: string;
	buttonClassName?: string;
	textClassName?: string;
	activeTextClassName?: string;
	inactiveTextClassName?: string;
	ariaLabel?: string;
	ariaLabelledBy?: string;
	ariaDescribedBy?: string;
	className?: string;
	disableWhenReducedMotion?: boolean;
};

function renderIcon(icon?: IconProp) {
	if (!icon) return null;
	if (typeof icon === "string") {
		return <Icon name={icon as IconName} size="sm" />;
	}
	return icon;
}

export function SegmentedControl<T extends string>({
	options,
	value,
	defaultValue,
	onChange,
	disabled,
	layout = "equal",
	columns,
	roundedFull = false,
	pillClassName,
	buttonClassName,
	textClassName,
	activeTextClassName,
	inactiveTextClassName,
	ariaLabel,
	ariaLabelledBy,
	ariaDescribedBy,
	className,
	disableWhenReducedMotion = true,
}: SegmentedControlProps<T>) {
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = React.useState<T | undefined>(
		defaultValue ?? options[0]?.value,
	);
	const layoutId = React.useId();

	React.useEffect(() => {
		if (!isControlled && internalValue === undefined && options[0]?.value) {
			setInternalValue(options[0].value);
		}
	}, [isControlled, internalValue, options]);

	const selectedValue =
		(isControlled ? value : internalValue) ?? options[0]?.value;
	const isColumns = layout === "columns";
	const columnCount = isColumns
		? Math.max(columns ?? options.length, 1)
		: undefined;
	const wrapperRadius = roundedFull ? "rounded-full" : "rounded-[10px]";
	const pillRadius = roundedFull ? "rounded-full" : "rounded-[6px]";
	const buttonRadius = roundedFull ? "pill" : "sm";

	const handleSelect = (next: T) => {
		if (next === selectedValue) return;
		if (!isControlled) setInternalValue(next);
		onChange?.(next);
	};

	return (
		<fieldset
			className={clsx(
				"relative gap-[5px] bg-surface/70 p-[5px]",
				wrapperRadius,
				isColumns ? "grid" : "flex items-center",
				layout === "auto" ? "w-fit" : "w-full",
				className,
			)}
			style={
				columnCount
					? { gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }
					: undefined
			}
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledBy}
			aria-describedby={ariaDescribedBy}
			disabled={disabled}
		>
			{options.map((option) => {
				const isSelected = option.value === selectedValue;
				const isDisabled = Boolean(disabled || option.disabled);
				const leadingIcon = option.leadingIcon ?? option.icon;
				const trailingIcon = option.trailingIcon;

				return (
					<div
						key={option.value}
						className={clsx(
							"relative min-w-0 max-w-full",
							layout === "equal" || layout === "columns"
								? "flex-1"
								: "flex-initial",
						)}
					>
						{isSelected ? (
							motionAllowed ? (
								<motion.div
									layoutId={`${layoutId}-pill`}
									className={clsx(
										"absolute inset-0 bg-foreground/10",
										pillRadius,
										pillClassName,
									)}
									transition={{ layout: spring.interactive }}
								/>
							) : (
								<div
									className={clsx(
										"absolute inset-0 bg-foreground/10",
										pillRadius,
										pillClassName,
									)}
								/>
							)
						) : null}
						<Button
							variant="ghost"
							align="center"
							size="md"
							radius={buttonRadius}
							aria-pressed={isSelected}
							disabled={isDisabled}
							onClick={() => handleSelect(option.value)}
							className={clsx(
								"relative z-10 w-full min-w-0",
								"!px-[15px] !py-[9px] text-sm transition-colors motion-interactive",
								isSelected
									? "text-foreground"
									: "text-foreground/60 hover:text-foreground",
								layout === "auto" ? "w-auto max-w-full" : "w-full",
								buttonClassName,
							)}
						>
							{leadingIcon ? (
								<span className="flex shrink-0 items-center">
									{renderIcon(leadingIcon)}
								</span>
							) : null}
							<Text
								as="span"
								variant="body"
								className={clsx(
									"min-w-0 truncate",
									textClassName,
									isSelected
										? clsx("text-foreground", activeTextClassName)
										: clsx("text-foreground/60", inactiveTextClassName),
								)}
							>
								{option.label}
							</Text>
							{trailingIcon ? (
								<span className="flex shrink-0 items-center">
									{renderIcon(trailingIcon)}
								</span>
							) : null}
						</Button>
					</div>
				);
			})}
		</fieldset>
	);
}
