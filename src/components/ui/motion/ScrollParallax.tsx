"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import {
	type ComponentProps,
	type ElementType,
	type ReactNode,
	useRef,
} from "react";
import { useAppReady } from "@/hooks/useAppReady";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type ScrollParallaxProps = {
	children: ReactNode;
	as?: ElementType;
	className?: string;
	style?: React.CSSProperties;
	magnitude?: number;
	disableWhenReducedMotion?: boolean;
	direction?: "down" | "up";
	stiffness?: number;
	damping?: number;
	smooth?: boolean;
} & Omit<ComponentProps<"div">, "children" | "className" | "style">;

export function ScrollParallax({
	children,
	as = motion.div,
	className,
	style,
	magnitude = 80,
	disableWhenReducedMotion = true,
	direction = "down",
	stiffness = 140,
	damping = 18,
	smooth = true,
	...rest
}: ScrollParallaxProps) {
	const appReady = useAppReady();
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const motionReady = motionAllowed && appReady;
	const ref = useRef<HTMLElement | null>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});

	const amplitude = direction === "down" ? magnitude : -magnitude;
	const rawY = useTransform(
		scrollYProgress,
		[0, 0.5, 1],
		[-amplitude, 0, amplitude],
	);
	const springY = useSpring(rawY, {
		stiffness,
		damping,
		mass: 1,
		restSpeed: 0.001,
	});
	const y = smooth ? springY : rawY;

	const Tag = motionReady ? (as ?? motion.div) : (as ?? "div");
	const passthroughStyle = motionReady
		? { willChange: "transform", ...style, y }
		: style;

	return (
		<Tag ref={ref} className={className} style={passthroughStyle} {...rest}>
			{children}
		</Tag>
	);
}
