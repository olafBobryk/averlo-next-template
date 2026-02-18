"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { spring } from "@/components/ui/foundations/spring";
import { IconSwap } from "@/components/ui/helpers/IconSwap";
import { Button } from "@/components/ui/primitives/Button";
import { Icon } from "@/components/ui/icons/Icon";
import { Text } from "@/components/ui/primitives/Text";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type AccordionProps = {
	title: React.ReactNode;
	children?: React.ReactNode;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
	className?: string;
	buttonClassName?: string;
	contentClassName?: string;
	iconClassName?: string;
	titleClassName?: string;
	disableWhenReducedMotion?: boolean;
	forceReducedMotion?: boolean;
};

export function Accordion({
	title,
	children,
	defaultOpen = false,
	open,
	onOpenChange,
	disabled = false,
	className,
	buttonClassName,
	contentClassName,
	iconClassName,
	titleClassName,
	disableWhenReducedMotion = true,
	forceReducedMotion,
}: AccordionProps) {
	const id = React.useId();
	const isControlled = open !== undefined;
	const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
	const isOpen = isControlled ? open : internalOpen;
	const contentId = `accordion-content-${id}`;
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const shouldAnimate = motionAllowed && forceReducedMotion !== true;

	const handleToggle = () => {
		if (disabled) return;
		const next = !isOpen;
		if (!isControlled) setInternalOpen(next);
		onOpenChange?.(next);
	};

	const textContent =
		typeof children === "string" || typeof children === "number" ? (
			<Text
				as="p"
				variant="body"
				className={clsx("whitespace-pre-line", contentClassName)}
			>
				{children}
			</Text>
		) : (
			<div className={contentClassName}>{children}</div>
		);

	return (
		<div
			className={clsx(
				"flex w-full flex-col rounded-[10px] group transition-colors motion-micro",
				"bg-surface/60 text-foreground",
				"has-[.accordion-trigger:hover]:bg-foreground/5",
				"has-[.accordion-trigger:active]:bg-foreground/10",
				disabled ? "opacity-60" : undefined,
				className,
			)}
			data-group-open={isOpen ? "true" : "false"}
		>
			<Button
				variant="ghost"
				align="left"
				size="md"
				onClick={handleToggle}
				disabled={disabled}
				aria-expanded={isOpen}
				aria-controls={contentId}
				contentClassName="flex w-full min-w-0 items-center gap-2.5"
				className={clsx(
					"w-full shadow-none !p-[15px] rounded-[10px]",
					"text-left transition-colors motion-interactive",
					"hover:opacity-100 active:opacity-100",
					"accordion-trigger",
					buttonClassName,
				)}
			>
				<span
					className={clsx(
						"min-w-0 flex-1 truncate text-left transition-colors text-foreground/60 group-data-[group-open=true]:text-foreground motion-interactive",
						titleClassName,
					)}
				>
					{title}
				</span>
				<IconSwap
					size="md"
					className={clsx(
						"text-foreground/60 group-data-[group-open=true]:text-foreground",
						iconClassName,
					)}
					activeIndex={isOpen ? 1 : 0}
					items={[
						{
							icon: <Icon name="plus" size="sm" animate />,
							inactiveClassName: "rotate-45",
							activeClassName: "rotate-0",
						},
						{
							icon: <Icon name="minus" size="sm" animate />,
							inactiveClassName: "-rotate-45",
							activeClassName: "rotate-0",
						},
					]}
				/>
			</Button>
			<div>
				{shouldAnimate ? (
					<AnimatePresence initial={false}>
						{isOpen ? (
							<motion.div
								id={contentId}
								className="overflow-hidden"
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={spring.component}
							>
								<div className="p-[15px]">{textContent}</div>
							</motion.div>
						) : null}
					</AnimatePresence>
				) : isOpen ? (
					<div id={contentId} className="overflow-hidden">
						<div className="p-[15px]">{textContent}</div>
					</div>
				) : null}
			</div>
		</div>
	);
}
