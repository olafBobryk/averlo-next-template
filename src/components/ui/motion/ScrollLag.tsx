"use client";

import {
	motion,
	useMotionValue,
	useScroll,
	useSpring,
	useTransform,
	useVelocity,
} from "motion/react";
import {
	type ComponentProps,
	type ElementType,
	type ReactNode,
	useEffect,
	useState,
} from "react";
import { useAppReady } from "@/hooks/useAppReady";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type ScrollLagProps = {
	children: ReactNode;
	as?: ElementType;
	className?: string;
	style?: React.CSSProperties;
	magnitude?: number;
	stiffness?: number;
	damping?: number;
	velocityClamp?: number;
	disableWhenReducedMotion?: boolean;
} & Omit<ComponentProps<"div">, "children" | "className" | "style">;

export function ScrollLag({
	children,
	as = motion.div,
	className,
	style,
	magnitude = 0.15,
	stiffness = 220,
	damping = 22,
	velocityClamp = 2000,
	disableWhenReducedMotion = true,
	...rest
}: ScrollLagProps) {
	const appReady = useAppReady();
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const motionReady = motionAllowed && appReady;
	const { scrollY } = useScroll();
	const velocity = useVelocity(scrollY);
	const [hasScrolled, setHasScrolled] = useState(false);

	useEffect(() => {
		const unsubscribe = scrollY.on("change", (latest) => {
			if (!hasScrolled && Math.abs(latest) > 0) setHasScrolled(true);
		});
		return () => unsubscribe();
	}, [hasScrolled, scrollY]);

	const base = useMotionValue(0);
	const safeVelocity = useTransform(velocity, (value) =>
		Number.isFinite(value)
			? Math.max(-velocityClamp, Math.min(velocityClamp, value))
			: base.get(),
	);

	const smoothVelocity = useSpring(safeVelocity, {
		stiffness,
		damping,
		mass: 1,
		restSpeed: 0.0001,
	});
	const y = useTransform(smoothVelocity, (value) =>
		hasScrolled ? -value * magnitude : 0,
	);

	const Tag = motionReady ? (as ?? motion.div) : (as ?? "div");
	return (
		<Tag
			style={motionReady ? { ...style, y } : style}
			className={className}
			{...rest}
		>
			{children}
		</Tag>
	);
}
