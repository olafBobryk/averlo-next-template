"use client";

import { Slot } from "@radix-ui/react-slot";
import { motion, useInView, type Variants } from "motion/react";
import {
	type ComponentProps,
	type ElementType,
	forwardRef,
	type ReactNode,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { getMotionTiming } from "@/components/ui/foundations/motionTiming";
import {
	type MotionSceneStageInput,
	useMotionSceneGate,
} from "@/components/ui/motion/MotionScene";
import { useAppReady } from "@/hooks/useAppReady";
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
	waitFor?: MotionSceneStageInput;
	unlockStage?: MotionSceneStageInput;
	disableWhenReducedMotion?: boolean;
};

export function RevealGroup({
	children,
	as = motion.div,
	className,
	stagger = 0.12,
	delay = 0,
	duration = 0.32,
	once = true,
	active,
	waitFor,
	unlockStage,
	disableWhenReducedMotion = true,
}: RevealGroupProps) {
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const appReady = useAppReady();
	const isControlled = typeof active === "boolean";
	const ref = useRef<HTMLElement | null>(null);
	const inView = useInView(ref, { amount: 0.1 });
	const [hasShown, setHasShown] = useState(false);
	const { hasWaitFor, sceneReady, markReady } = useMotionSceneGate(
		"RevealGroup",
		{ waitFor, unlockStage },
	);

	useEffect(() => {
		if (!motionAllowed || !appReady || !sceneReady) return;
		if (inView) {
			setHasShown(true);
			return;
		}
		if (!once) {
			setHasShown(false);
		}
	}, [appReady, inView, motionAllowed, once, sceneReady]);

	useEffect(() => {
		if (motionAllowed) return;
		if (isControlled && !active) return;
		if (hasWaitFor && !sceneReady) return;
		markReady();
	}, [active, hasWaitFor, isControlled, markReady, motionAllowed, sceneReady]);

	const variants: Variants = {
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
	};

	if (!motionAllowed) {
		const Tag = as ?? "div";
		return (
			<Tag
				className={[
					className,
					(isControlled && !active) || (hasWaitFor && !sceneReady)
						? "pointer-events-none opacity-0"
						: undefined,
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
		: appReady && sceneReady && inView
			? "show"
			: "hidden";
	const resolvedAnimateState =
		typeof active === "boolean"
			? active && appReady && sceneReady
				? "show"
				: "hidden"
			: animateState;

	const MotionTag = as ?? motion.div;
	return (
		<MotionTag
			ref={ref}
			initial="hidden"
			animate={resolvedAnimateState}
			variants={variants}
			className={className}
			onAnimationComplete={(definition: unknown) => {
				if (definition !== "show") return;
				markReady();
			}}
		>
			{children}
		</MotionTag>
	);
}

export type RevealItemProps = {
	children?: ReactNode;
	as?: ElementType;
	asChild?: boolean;
	handoffAfterReveal?: boolean;
	className?: string;
	variants?: Variants;
	disableTransform?: boolean;
	useViewport?: boolean;
	active?: boolean;
	waitFor?: MotionSceneStageInput;
	unlockStage?: MotionSceneStageInput;
	disableWhenReducedMotion?: boolean;
};

export function RevealItem({
	children,
	as = motion.div,
	asChild = false,
	handoffAfterReveal = false,
	className,
	variants,
	disableTransform = false,
	useViewport = false,
	active,
	waitFor,
	unlockStage,
	disableWhenReducedMotion = true,
}: RevealItemProps) {
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const appReady = useAppReady();
	const isControlled = typeof active === "boolean";
	const revealTiming = getMotionTiming("grand");
	const [hasPlayed, setHasPlayed] = useState(false);
	const childRef = useRef<HTMLElement | null>(null);
	const viewportRef = useRef<HTMLElement | null>(null);
	const measureRef = asChild ? childRef : viewportRef;
	const isInViewport = useInView(measureRef, { once: true, amount: 0.2 });
	const [hasShownViewport, setHasShownViewport] = useState(false);
	const originalTransitionRef = useRef<string | null>(null);
	const restoredRef = useRef(false);
	const restoreRafRef = useRef<number | null>(null);
	const { hasWaitFor, sceneReady, markReady } = useMotionSceneGate(
		"RevealItem",
		{ waitFor, unlockStage },
	);

	useEffect(() => {
		if (!useViewport || isControlled || !motionAllowed) return;
		if (!appReady || !sceneReady || !isInViewport) return;
		setHasShownViewport(true);
	}, [
		appReady,
		isControlled,
		isInViewport,
		motionAllowed,
		sceneReady,
		useViewport,
	]);

	useEffect(() => {
		if (motionAllowed) return;
		if (isControlled && !active) return;
		if (hasWaitFor && !sceneReady) return;
		markReady();
	}, [active, hasWaitFor, isControlled, markReady, motionAllowed, sceneReady]);

	useLayoutEffect(() => {
		if (!asChild || !handoffAfterReveal || !motionAllowed) return;
		if (hasPlayed || restoredRef.current) return;
		const node = childRef.current;
		if (!node) return;
		originalTransitionRef.current = node.style.transition;
		node.style.transition = "none";
	}, [asChild, handoffAfterReveal, hasPlayed, motionAllowed]);

	useLayoutEffect(() => {
		if (!asChild || !handoffAfterReveal || !motionAllowed) return;
		if (hasPlayed || restoredRef.current) return;
		const node = childRef.current;
		if (!node || typeof MutationObserver === "undefined") return;

		const observer = new MutationObserver(() => {
			const inlineOpacity = Number.parseFloat(node.style.opacity || "");
			if (Number.isNaN(inlineOpacity) || inlineOpacity < 0.99) return;
			observer.disconnect();
			if (restoredRef.current) return;
			restoredRef.current = true;
			if (restoreRafRef.current !== null) {
				cancelAnimationFrame(restoreRafRef.current);
			}
			restoreRafRef.current = requestAnimationFrame(() => {
				node.style.transition = originalTransitionRef.current ?? "";
				restoreRafRef.current = null;
				setHasPlayed(true);
			});
		});

		observer.observe(node, {
			attributes: true,
			attributeFilter: ["style"],
		});

		return () => observer.disconnect();
	}, [asChild, handoffAfterReveal, hasPlayed, motionAllowed]);

	useEffect(() => {
		return () => {
			if (restoreRafRef.current !== null) {
				cancelAnimationFrame(restoreRafRef.current);
			}
		};
	}, []);

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
						transitionEnd: { transform: "none", y: 0 },
					},
		} as const);

	const usePlainAsChild =
		asChild && handoffAfterReveal && hasPlayed && (!isControlled || active);

	if (!motionAllowed || usePlainAsChild) {
		const Tag = asChild ? Slot : (as ?? "div");
		return (
			<Tag
				className={[
					className,
					(isControlled && !active) || (hasWaitFor && !sceneReady)
						? "pointer-events-none opacity-0"
						: undefined,
				]
					.filter(Boolean)
					.join(" ")}
			>
				{children}
			</Tag>
		);
	}

	const MotionTag = asChild ? MotionSlot : (as ?? motion.div);
	const controlledProps = isControlled
		? {
				initial: "hidden" as const,
				animate: active && appReady && sceneReady ? "show" : "hidden",
			}
		: {};
	const viewportProps =
		!isControlled && useViewport
			? {
					initial: "hidden" as const,
					animate: hasShownViewport ? ("show" as const) : ("hidden" as const),
				}
			: {};
	const sceneProps =
		!isControlled && !useViewport && hasWaitFor
			? {
					initial: "hidden" as const,
					animate:
						appReady && sceneReady ? ("show" as const) : ("hidden" as const),
				}
			: {};

	return (
		<MotionTag
			ref={asChild ? childRef : useViewport ? viewportRef : undefined}
			variants={baseVariants}
			className={className}
			onAnimationComplete={(definition: unknown) => {
				if (definition === "show") {
					markReady();
				}
				const node = childRef.current;
				if (!asChild || !handoffAfterReveal || !motionAllowed || !node) return;
				if (restoredRef.current) return;
				if (definition === "hidden") return;
				const currentOpacity = Number.parseFloat(
					window.getComputedStyle(node).opacity,
				);
				if (Number.isNaN(currentOpacity) || currentOpacity < 0.99) return;
				restoredRef.current = true;
				if (restoreRafRef.current !== null) {
					cancelAnimationFrame(restoreRafRef.current);
				}
				restoreRafRef.current = requestAnimationFrame(() => {
					node.style.transition = originalTransitionRef.current ?? "";
					restoreRafRef.current = null;
					setHasPlayed(true);
				});
			}}
			{...controlledProps}
			{...viewportProps}
			{...sceneProps}
		>
			{children}
		</MotionTag>
	);
}
