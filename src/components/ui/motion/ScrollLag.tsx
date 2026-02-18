// components/ui/motion/ScrollLag.tsx
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
	type ReactNode,
	useEffect,
	useState,
} from "react";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type ScrollLagProps = {
	children: ReactNode;
	as?: any;
	className?: string;
	style?: React.CSSProperties;
	magnitude?: number; // multiplier applied to scroll velocity
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
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const { scrollY } = useScroll();
	const velocity = useVelocity(scrollY);
	const [hasScrolled, setHasScrolled] = useState(false);

	useEffect(() => {
		const unsubscribe = scrollY.on("change", (latest) => {
			if (!hasScrolled && Math.abs(latest) > 0) setHasScrolled(true);
		});
		return () => unsubscribe();
	}, [scrollY, hasScrolled]);

	// Ensure an initial zero value to avoid any jump on first paint.
	const base = useMotionValue(0);
	const safeVelocity = useTransform(velocity, (v) =>
		Number.isFinite(v)
			? Math.max(-velocityClamp, Math.min(velocityClamp, v))
			: base.get(),
	);

	const smoothVelocity = useSpring(safeVelocity, {
		stiffness,
		damping,
		mass: 1,
		restSpeed: 0.0001,
	});
	const y = useTransform(smoothVelocity, (v) =>
		hasScrolled ? -v * magnitude : 0,
	);

	const Tag = motionAllowed ? (as ?? motion.div) : (as ?? "div");
	return (
		<Tag
			// If motion is disabled, drop the transform
			style={motionAllowed ? { ...style, y } : style}
			className={className}
			{...rest}
		>
			{children}
		</Tag>
	);
}
