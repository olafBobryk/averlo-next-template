"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { focusRing } from "@/components/ui/foundations/focus";
import { spring } from "@/components/ui/foundations/spring";
import { Icon } from "@/components/ui/icons/Icon";
import type { AccordionProps } from "@/components/ui/misc/Accordion.shared";
import { Text } from "@/components/ui/primitives/Text";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

export function AccordionClient({
	buttonClassName,
	children,
	className,
	contentClassName,
	defaultOpen = false,
	description,
	disabled = false,
	disableWhenReducedMotion = true,
	forceReducedMotion,
	icon,
	iconClassName,
	onOpenChange,
	open,
	title,
	titleClassName,
	triggerClassName,
}: AccordionProps) {
	const id = React.useId();
	const contentId = `accordion-content-${id}`;
	const isControlled = open !== undefined;
	const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
	const isOpen = isControlled ? open : internalOpen;
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const shouldAnimate = motionAllowed && forceReducedMotion !== true;
	const [isContentOverflowVisible, setIsContentOverflowVisible] =
		React.useState(() => Boolean(open ?? defaultOpen));

	React.useEffect(() => {
		if (!isOpen || !shouldAnimate) setIsContentOverflowVisible(isOpen);
	}, [isOpen, shouldAnimate]);

	function handleToggle() {
		if (disabled) return;
		const nextOpen = !isOpen;
		if (!isControlled) setInternalOpen(nextOpen);
		onOpenChange?.(nextOpen);
	}

	return (
		<div
			className={clsx(
				"group/accordion rounded-md border border-border/70 bg-surface/60 transition-colors motion-micro",
				disabled && "opacity-60",
				className,
			)}
			data-open={isOpen ? "true" : "false"}
		>
			<button
				aria-controls={contentId}
				aria-expanded={isOpen}
				className={clsx(
					"flex min-h-11 w-full cursor-pointer items-center gap-1.5 rounded-md px-3 py-2.5 text-left transition-colors motion-interactive hover:bg-muted/55 disabled:cursor-not-allowed",
					focusRing.visibleDefault,
					buttonClassName,
					triggerClassName,
				)}
				disabled={disabled}
				onClick={handleToggle}
				type="button"
			>
				{icon ? (
					<span
						className={clsx(
							"grid size-6 shrink-0 place-items-center text-muted-foreground [&_svg]:size-3.5",
							iconClassName,
						)}
					>
						{icon}
					</span>
				) : null}
				<span className="grid min-w-0 flex-1 gap-0.5">
					<Text
						as="span"
						className={clsx("font-medium", titleClassName)}
						variant="support"
					>
						{title}
					</Text>
					{description ? (
						<Text as="span" tone="muted" variant="caption">
							{description}
						</Text>
					) : null}
				</span>
				<span
					aria-hidden
					className="grid size-6 shrink-0 place-items-center text-muted-foreground transition-transform motion-micro group-data-[open=true]/accordion:rotate-180"
				>
					<Icon name="chevron-down" size="sm" />
				</span>
			</button>
			{shouldAnimate ? (
				<AnimatePresence initial={false}>
					{isOpen ? (
						<motion.div
							animate={{ height: "auto", opacity: 1 }}
							className={
								isContentOverflowVisible
									? "!overflow-visible"
									: "overflow-hidden"
							}
							exit={{ height: 0, opacity: 0 }}
							id={contentId}
							initial={{ height: 0, opacity: 0 }}
							onAnimationComplete={() => {
								if (isOpen) setIsContentOverflowVisible(true);
							}}
							transition={spring.disclosure}
						>
							<div
								className={clsx(
									"border-t border-border/70 p-3",
									contentClassName,
								)}
							>
								{children}
							</div>
						</motion.div>
					) : null}
				</AnimatePresence>
			) : isOpen ? (
				<div className="!overflow-visible" id={contentId}>
					<div
						className={clsx("border-t border-border/70 p-3", contentClassName)}
					>
						{children}
					</div>
				</div>
			) : null}
		</div>
	);
}
