"use client";

import type { VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import { RevealItem } from "@/components/ui/motion/Reveal";
import { textVariants } from "@/components/ui/primitives/Text";

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

export function RevealText({
	children,
	as = "span",
	className,
	charDelay = 0.025,
	variant,
	tone,
}: RevealTextProps) {
	const resolvedClass = textVariants({ variant, tone, className });
	const MotionTag = motionElements[as];
	const chars = children.split("");

	return (
		<RevealItem
			as={MotionTag}
			staticAs={as}
			className={resolvedClass}
			variants={{
				hidden: {},
				show: { transition: { staggerChildren: charDelay } },
			}}
			disableTransform
		>
			{chars.map((char, index) => (
				<span
					// biome-ignore lint/suspicious/noArrayIndexKey: stable positional index
					key={index}
					className="inline-block overflow-hidden"
					style={{ verticalAlign: "bottom", lineHeight: "1.05em" }}
				>
					<motion.span className="inline-block" variants={charVariants}>
						{char === " " ? "\u00A0" : char}
					</motion.span>
				</span>
			))}
		</RevealItem>
	);
}
