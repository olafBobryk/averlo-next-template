// components/ui/motion/ScrollParallax.tsx
"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useMemo, useRef, type ComponentProps, type ReactNode } from "react";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type ScrollParallaxProps = {
	children: ReactNode;
	as?: any;
	className?: string;
	style?: React.CSSProperties;
	magnitude?: number; // max translation in px (positive moves down when scrolling down)
	disableWhenReducedMotion?: boolean;
	direction?: "down" | "up";
	stiffness?: number;
	damping?: number;
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
	...rest
}: ScrollParallaxProps) {
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const ref = useRef<HTMLElement | null>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});

	const amplitude = useMemo(
		() => (direction === "down" ? magnitude : -magnitude),
		[magnitude, direction],
	);

	// Map progress so translation crosses 0 at mid-scroll: start -> 0 -> end
	const rawY = useTransform(scrollYProgress, [0, 0.5, 1], [-amplitude, 0, amplitude]);
	const y = useSpring(rawY, {
		stiffness,
		damping,
		mass: 1,
		restSpeed: 0.001,
	});

	const Tag = motionAllowed ? (as ?? motion.div) : (as ?? "div");
	const passthroughStyle = motionAllowed ? { ...style, y } : style;

	return (
		<Tag ref={ref} className={className} style={passthroughStyle} {...rest}>
			{children}
		</Tag>
	);
}
