// components/ui/motion/Reveal.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import { useMemo, type ComponentProps, type ReactNode } from "react";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type RevealGroupProps = {
	children: ReactNode;
	as?: any;
	className?: string;
	stagger?: number;
	delay?: number;
	duration?: number;
	once?: boolean;
	disableWhenReducedMotion?: boolean;
};

export function RevealGroup({
	children,
	as = motion.div,
	className,
	stagger = 0.12,
	delay = 0,
	// Match motion-macro timing from globals.css (320ms)
	duration = 0.32,
	once = true,
	disableWhenReducedMotion = true,
}: RevealGroupProps) {
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);

	const variants = useMemo<Variants>(
		() => ({
			hidden: { opacity: 0, y: 12 },
			show: {
				opacity: 1,
				y: 0,
				transition: { staggerChildren: stagger, delayChildren: delay, ease: "easeOut", duration },
			},
		}),
		[stagger, delay, duration],
	);

	if (!motionAllowed) {
		const Tag = as ?? "div";
		return <Tag className={className}>{children}</Tag>;
	}

	const MotionTag = as ?? motion.div;
	return (
		<MotionTag
			initial="hidden"
			whileInView="show"
			viewport={{ once, amount: 0.2 }}
			variants={variants}
			className={className}
		>
			{children}
		</MotionTag>
	);
}

type RevealItemProps = {
	children: ReactNode;
	as?: any;
	className?: string;
	variants?: Variants;
	disableWhenReducedMotion?: boolean;
};

export function RevealItem({
	children,
	as = motion.div,
	className,
	variants,
	disableWhenReducedMotion = true,
}: RevealItemProps) {
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);

	const baseVariants: Variants =
		variants ??
		({
			hidden: { opacity: 0, y: 12 },
			// Match motion-macro duration to align with group timing
			show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.32 } },
		} as const);

	if (!motionAllowed) {
		const Tag = as ?? "div";
		return <Tag className={className}>{children}</Tag>;
	}

	const MotionTag = as ?? motion.div;
	return (
		<MotionTag variants={baseVariants} className={className}>
			{children}
		</MotionTag>
	);
}
