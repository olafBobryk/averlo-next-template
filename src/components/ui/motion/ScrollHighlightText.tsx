"use client";

import type { MotionValue } from "motion/react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { getSpring } from "@/components/ui/foundations/spring";
import { useAppReady } from "@/hooks/useAppReady";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type Props = {
	children: string;
	className?: string;
};

export function ScrollHighlightText({ children, className }: Props) {
	const ref = useRef<HTMLSpanElement>(null);
	const appReady = useAppReady();
	const motionAllowed = useMotionAllowed(true);
	const motionReady = motionAllowed && appReady;
	const { scrollYProgress: rawProgress } = useScroll(
		motionReady
			? { target: ref, offset: ["start end", "start center"] }
			: { offset: ["start end", "start center"] },
	);
	const scrollYProgress = useSpring(
		rawProgress,
		getSpring("scroll", { expressive: 1, intensity: "hero" }),
	);

	const chars = children.split("");

	if (!motionReady) {
		return <span className={className}>{children}</span>;
	}

	return (
		<span ref={ref} className={className}>
			<span className="sr-only">{children}</span>
			<span aria-hidden={true}>
				{chars.map((char, index) => (
					<HighlightChar
						// biome-ignore lint/suspicious/noArrayIndexKey: character position is the identity
						key={`${char}-${index}`}
						char={char}
						scrollYProgress={scrollYProgress}
						start={index / chars.length}
						end={(index + 1) / chars.length}
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
