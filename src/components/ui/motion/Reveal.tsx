"use client";

import { Slot } from "@radix-ui/react-slot";
import { motion, useInView, type Variants } from "motion/react";
import {
	type ComponentProps,
	type ElementType,
	forwardRef,
	type ReactNode,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { getMotionTiming } from "@/components/ui/foundations/motionTiming";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

const SlotWithRef = forwardRef<HTMLElement, ComponentProps<typeof Slot>>(
	(props, ref) => <Slot ref={ref} {...props} />,
);
SlotWithRef.displayName = "SlotWithRef";
const MotionSlot = motion(SlotWithRef);

export type RevealGroupProps = {
	children: ReactNode;
	as?: ElementType;
	className?: string;
	stagger?: number;
	delay?: number;
	duration?: number;
	once?: boolean;
	active?: boolean;
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
	active,
	disableWhenReducedMotion = true,
}: RevealGroupProps) {
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const isControlled = typeof active === "boolean";
	const ref = useRef<HTMLElement | null>(null);
	const inView = useInView(ref, { amount: 0.1 });
	const [hasShown, setHasShown] = useState(false);

	const variants = useMemo<Variants>(
		() => ({
			hidden: { opacity: 0, y: 12 },
			show: {
				opacity: 1,
				y: 0,
				transition: {
					staggerChildren: stagger,
					delayChildren: delay,
					ease: "easeOut",
					duration,
				},
			},
		}),
		[stagger, delay, duration],
	);

	useEffect(() => {
		if (!motionAllowed) return;
		if (inView) {
			setHasShown(true);
		} else if (!once) {
			setHasShown(false);
		}
	}, [inView, motionAllowed, once]);

	if (!motionAllowed) {
		const Tag = as ?? "div";
		return (
			<Tag
				className={[
					className,
					isControlled && !active ? "pointer-events-none opacity-0" : undefined,
				]
					.filter(Boolean)
					.join(" ")}
			>
				{children}
			</Tag>
		);
	}

	const animateState = once
		? hasShown
			? "show"
			: "hidden"
		: inView
			? "show"
			: "hidden";
	const resolvedAnimateState =
		typeof active === "boolean" ? (active ? "show" : "hidden") : animateState;

	const MotionTag = as ?? motion.div;
	return (
		<MotionTag
			ref={ref}
			initial="hidden"
			animate={resolvedAnimateState}
			variants={variants}
			className={className}
		>
			{children}
		</MotionTag>
	);
}

export type RevealItemProps = {
	children?: ReactNode;
	as?: ElementType;
	asChild?: boolean;
	className?: string;
	variants?: Variants;
	disableTransform?: boolean;
	useViewport?: boolean;
	active?: boolean;
	disableWhenReducedMotion?: boolean;
};

export function RevealItem({
	children,
	as = motion.div,
	asChild = false,
	className,
	variants,
	disableTransform = false,
	useViewport = false,
	active,
	disableWhenReducedMotion = true,
}: RevealItemProps) {
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const isControlled = typeof active === "boolean";
	const revealTiming = getMotionTiming("grand");
	const childRef = useRef<HTMLElement | null>(null);
	const originalTransitionRef = useRef<string | null>(null);
	const restoredRef = useRef(false);
	const restoreRafRef = useRef<number | null>(null);

	// Temporarily remove the child's own transition while the reveal animation runs
	// to avoid timing conflicts, then restore it after the animation completes.
	useEffect(() => {
		if (isControlled || !asChild || !motionAllowed) return;
		if (restoredRef.current) return;
		const node = childRef.current;
		if (!node) return;
		originalTransitionRef.current = node.style.transition;
		node.style.transition = "none";
	}, [isControlled, asChild, motionAllowed]);

	// Clear any queued restore on unmount
	useEffect(() => {
		return () => {
			if (restoreRafRef.current !== null) {
				cancelAnimationFrame(restoreRafRef.current);
			}
		};
	}, []);

	const handleAnimationComplete = (definition: unknown) => {
		// Only restore the child's transition when the "show" reveal finishes.
		// Framer also fires this for the initial "hidden" cascade on client-side
		// navigation — guard with definition check to avoid premature restore.
		if (definition !== "show") return;
		if (isControlled) return;
		if (!asChild || !motionAllowed) return;
		if (restoredRef.current) return;
		const node = childRef.current;
		if (!node) return;
		restoredRef.current = true;
		if (restoreRafRef.current !== null) {
			cancelAnimationFrame(restoreRafRef.current);
		}
		restoreRafRef.current = requestAnimationFrame(() => {
			node.style.transition = originalTransitionRef.current ?? "";
			restoreRafRef.current = null;
			// Note: intentionally NOT swapping MotionSlot → Slot here.
			// Doing so causes React to unmount/remount children (e.g. ScrambleReveal),
			// which resets their hasPlayed refs and triggers double animations.
		});
	};

	const baseVariants: Variants =
		variants ??
		({
			hidden: disableTransform ? { opacity: 0 } : { opacity: 0, y: 12 },
			show: disableTransform
				? { opacity: 1, transition: revealTiming }
				: {
						opacity: 1,
						y: 0,
						transition: revealTiming,
						// Drop transform after the animation to avoid flicker on scroll
						transitionEnd: { transform: "none", y: 0 },
					},
		} as const);

	if (!motionAllowed) {
		const Tag = asChild ? Slot : (as ?? "div");
		return (
			<Tag
				className={[
					className,
					isControlled && !active ? "pointer-events-none opacity-0" : undefined,
				]
					.filter(Boolean)
					.join(" ")}
			>
				{children}
			</Tag>
		);
	}

	const MotionTag = asChild ? MotionSlot : (as ?? motion.div);
	const viewportProps =
		!isControlled && useViewport
			? {
					initial: "hidden",
					whileInView: "show",
					viewport: { once: true, amount: 0.2 },
				}
			: {};
	const controlledProps = isControlled
		? {
				initial: "hidden" as const,
				animate: active ? "show" : "hidden",
			}
		: {};

	return (
		<MotionTag
			ref={asChild ? childRef : undefined}
			variants={baseVariants}
			className={className}
			onAnimationComplete={handleAnimationComplete}
			{...controlledProps}
			{...viewportProps}
		>
			{children}
		</MotionTag>
	);
}
