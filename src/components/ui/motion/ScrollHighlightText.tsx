"use client";

import type { MotionValue } from "motion/react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

// Spring that caps the max speed of the highlight sweep.
// Soft stiffness + overdamped mass means fast scrolling causes the
// animation to lag and play through rather than snap to the end.
const highlightSpring = { stiffness: 55, damping: 20, mass: 1 } as const;

type Props = {
	children: string;
	className?: string;
};

export function ScrollHighlightText({ children, className }: Props) {
	const ref = useRef<HTMLSpanElement>(null);
	const motionAllowed = useMotionAllowed(true);
	const { scrollYProgress: rawProgress } = useScroll({
		target: ref,
		offset: ["start end", "start center"],
	});
	const scrollYProgress = useSpring(rawProgress, highlightSpring);

	const chars = children.split("");

	if (!motionAllowed) {
		return <span className={className}>{children}</span>;
	}

	return (
		<span ref={ref} className={className}>
			<span className="sr-only">{children}</span>
			<span aria-hidden={true}>
				{chars.map((char, i) => (
					<HighlightChar
						// biome-ignore lint/suspicious/noArrayIndexKey: character position is the identity
						key={i}
						char={char}
						scrollYProgress={scrollYProgress}
						start={i / chars.length}
						end={(i + 1) / chars.length}
					/>
				))}
			</span>
		</span>
	);
}

function HighlightChar({
	char,
	scrollYProgress,
	start,
	end,
}: {
	char: string;
	scrollYProgress: MotionValue<number>;
	start: number;
	end: number;
}) {
	const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
	return <motion.span style={{ opacity }}>{char}</motion.span>;
}
