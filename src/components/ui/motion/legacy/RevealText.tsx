"use client";

import type { VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import { textVariants } from "@/components/ui/primitives/Text";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type TextAs = "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const motionElements = {
	span: motion.span,
	p: motion.p,
	div: motion.div,
	h1: motion.h1,
	h2: motion.h2,
	h3: motion.h3,
	h4: motion.h4,
	h5: motion.h5,
	h6: motion.h6,
} as const;

const charVariants = {
	hidden: { opacity: 0, y: "105%" },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", stiffness: 350, damping: 30, mass: 0.7 },
	},
} as const;

type RevealTextProps = {
	children: string;
	as?: TextAs;
	className?: string;
	charDelay?: number;
} & VariantProps<typeof textVariants>;

/**
 * Like RevealItem, but splits text into per-character staggered spans.
 * Must be a direct child of RevealGroup (inherits hidden/show variant cascade).
 */
export function RevealText({
	children,
	as = "span",
	className,
	charDelay = 0.025,
	variant,
	tone,
}: RevealTextProps) {
	const motionAllowed = useMotionAllowed(true);
	const resolvedClass = textVariants({ variant, tone, className });

	if (!motionAllowed) {
		const Tag = as;
		return <Tag className={resolvedClass}>{children}</Tag>;
	}

	const MotionTag = motionElements[as];
	const chars = children.split("");

	return (
		<MotionTag
			className={resolvedClass}
			variants={{
				hidden: {},
				show: { transition: { staggerChildren: charDelay } },
			}}
		>
			{chars.map((char, i) => (
				<span
					// biome-ignore lint/suspicious/noArrayIndexKey: stable positional index
					key={i}
					className="inline-block overflow-hidden"
					style={{ verticalAlign: "bottom", lineHeight: "1.05em" }}
				>
					<motion.span className="inline-block" variants={charVariants}>
						{char === " " ? "\u00A0" : char}
					</motion.span>
				</span>
			))}
		</MotionTag>
	);
}
