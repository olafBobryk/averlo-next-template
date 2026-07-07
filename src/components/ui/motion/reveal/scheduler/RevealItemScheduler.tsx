"use client";

import {
	motion,
	type TargetAndTransition,
	useAnimationControls,
	useInView,
	type Variants,
} from "motion/react";
import {
	createElement,
	type ElementType,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	getMotionTiming,
	type MotionDistance,
	type MotionIntensity,
	type MotionSurface,
} from "@/components/ui/foundations/motionTiming";
import {
	type MotionSceneStageInput,
	useMotionSceneGate,
} from "@/components/ui/motion/MotionScene";
import { useAppReady } from "@/hooks/useAppReady";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { RevealRoot } from "./RevealRootScheduler";
import {
	disabledRevealStyle,
	getStaticRevealTag,
	MotionSlot,
	type RevealRegisteredItem,
	RevealRootContext,
	restoreChildTransition,
	SlotWithRef,
} from "./shared";

export type RevealItemProps = {
	children?: ReactNode;
	as?: ElementType;
	staticAs?: ElementType;
	asChild?: boolean;
	handoffAfterReveal?: boolean;
	deferInteractionUntilRevealed?: boolean;
	className?: string;
	variants?: Variants;
	disableTransform?: boolean;
	useViewport?: boolean;
	active?: boolean;
	waitFor?: MotionSceneStageInput;
	unlockStage?: MotionSceneStageInput;
	intensity?: MotionIntensity;
	expressive?: number;
	distance?: MotionDistance | number;
	surface?: MotionSurface | number;
	disableWhenReducedMotion?: boolean;
	viewportAmount?: number;
};

export function RevealItem(props: RevealItemProps) {
	const root = useContext(RevealRootContext);

	if (!root) {
		return (
			<RevealRoot disableWhenReducedMotion={props.disableWhenReducedMotion}>
				<RevealItemInner {...props} />
			</RevealRoot>
		);
	}

	return <RevealItemInner {...props} />;
}

function RevealItemInner({
	children,
	as = motion.div,
	staticAs,
	asChild = false,
	handoffAfterReveal = false,
	deferInteractionUntilRevealed = false,
	className,
	variants,
	disableTransform = false,
	useViewport = true,
	active,
	waitFor,
	unlockStage,
	intensity,
	expressive,
	distance,
	surface,
	disableWhenReducedMotion = true,
	viewportAmount = 0.2,
}: RevealItemProps) {
	const id = useId();
	const root = useContext(RevealRootContext);
	const appReady = useAppReady();
	const itemMotionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const disabled = root?.disabled || !itemMotionAllowed;
	const controls = useAnimationControls();
	const revealTiming = useMemo(
		() =>
			getMotionTiming("grand", { intensity, expressive, distance, surface }),
		[intensity, expressive, distance, surface],
	);
	const [hasPlayed, setHasPlayed] = useState(false);
	const childRef = useRef<HTMLElement | null>(null);
	const viewportRef = useRef<HTMLElement | null>(null);
	const measureRef = asChild ? childRef : viewportRef;
	const mountedRef = useRef(false);
	const isInViewport = useInView(measureRef, {
		once: true,
		amount: viewportAmount,
	});
	const originalTransitionRef = useRef<string | null>(null);
	const restoreRafRef = useRef<number | null>(null);
	const timeoutRef = useRef<number | null>(null);
	const playRef = useRef<RevealRegisteredItem["play"]>(() => undefined);
	const showImmediatelyRef = useRef<RevealRegisteredItem["showImmediately"]>(
		() => undefined,
	);
	const onCompleteRef = useRef<RevealRegisteredItem["onComplete"]>(
		() => undefined,
	);
	const { sceneReady, markReady } = useMotionSceneGate("RevealItem", {
		waitFor,
		unlockStage,
	});
	const isReady =
		disabled ||
		(appReady &&
			(useViewport ? isInViewport : true) &&
			active !== false &&
			sceneReady);

	useLayoutEffect(() => {
		mountedRef.current = true;

		return () => {
			mountedRef.current = false;
		};
	}, []);

	useLayoutEffect(() => {
		if (!asChild || !handoffAfterReveal || disabled || hasPlayed) return;
		const node = childRef.current;
		if (!node) return;
		originalTransitionRef.current = node.style.transition;
		node.style.transition = "none";
	}, [asChild, disabled, handoffAfterReveal, hasPlayed]);

	useEffect(() => {
		return () => {
			if (restoreRafRef.current !== null) {
				cancelAnimationFrame(restoreRafRef.current);
			}
			if (timeoutRef.current !== null) {
				window.clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const completeReveal = useCallback(async () => {
		if (!mountedRef.current) return;

		if (asChild && handoffAfterReveal) {
			await restoreChildTransition({
				node: childRef.current,
				originalTransition: originalTransitionRef.current,
				onRestored: () => {
					if (mountedRef.current) {
						setHasPlayed(true);
					}
				},
			});
			return;
		}

		if (!mountedRef.current) return;
		setHasPlayed(true);
	}, [asChild, handoffAfterReveal]);

	const play = useCallback(
		async (delay: number) => {
			if (variants) {
				await new Promise<void>((resolve) => {
					timeoutRef.current = window.setTimeout(() => {
						timeoutRef.current = null;
						resolve();
					}, delay * 1000);
				});
				if (!mountedRef.current) return;

				await controls.start("show");
				if (!mountedRef.current) return;
				await completeReveal();
				return;
			}

			const target: TargetAndTransition = disableTransform
				? {
						opacity: 1,
						transition: { ...revealTiming, delay },
					}
				: {
						opacity: 1,
						y: 0,
						transition: { ...revealTiming, delay },
						transitionEnd: { transform: "none", y: 0 },
					};

			if (!mountedRef.current) return;
			await controls.start(target);
			if (!mountedRef.current) return;
			await completeReveal();
		},
		[completeReveal, controls, disableTransform, revealTiming, variants],
	);

	const showImmediately = useCallback(() => {
		if (!mountedRef.current) return;
		if (variants) {
			controls.set("show");
			setHasPlayed(true);
			return;
		}
		controls.set(disableTransform ? { opacity: 1 } : { opacity: 1, y: 0 });
		setHasPlayed(true);
	}, [controls, disableTransform, variants]);

	const onComplete = useCallback(() => {
		markReady();
	}, [markReady]);

	playRef.current = play;
	showImmediatelyRef.current = showImmediately;
	onCompleteRef.current = onComplete;

	const registeredPlay = useCallback((delay: number) => {
		return playRef.current(delay);
	}, []);

	const registeredShowImmediately = useCallback(() => {
		showImmediatelyRef.current();
	}, []);

	const registeredOnComplete = useCallback(() => {
		onCompleteRef.current();
	}, []);

	useEffect(() => {
		if (hasPlayed) return;
		const node = measureRef.current;
		if (!node || !root) return;
		const unregisterRoot = root.registerItem({
			id,
			element: node,
			play: registeredPlay,
			showImmediately: registeredShowImmediately,
			onComplete: registeredOnComplete,
		});

		return () => unregisterRoot();
	}, [
		hasPlayed,
		id,
		measureRef,
		registeredOnComplete,
		registeredPlay,
		registeredShowImmediately,
		root,
	]);

	useEffect(() => {
		if (hasPlayed) return;
		if (!isReady || !root) return;
		root.markReady(id);
	}, [hasPlayed, id, isReady, root]);

	const usePlainAsChild = asChild && handoffAfterReveal && hasPlayed;
	const interactionLocked =
		deferInteractionUntilRevealed && !disabled && !hasPlayed;
	const revealClassName = interactionLocked
		? [className, "pointer-events-none"].filter(Boolean).join(" ")
		: className;
	const interactionLockProps = interactionLocked
		? ({ "aria-hidden": true, inert: true } as const)
		: {};

	if (disabled || usePlainAsChild) {
		if (asChild) {
			return (
				<SlotWithRef
					ref={childRef}
					className={revealClassName}
					data-reveal-item=""
					style={disabledRevealStyle}
					{...interactionLockProps}
				>
					{children}
				</SlotWithRef>
			);
		}

		const Tag = getStaticRevealTag(staticAs ?? as);
		return createElement(
			Tag,
			{
				ref: viewportRef,
				className: revealClassName,
				"data-reveal-item": "",
				style: disabledRevealStyle,
				...interactionLockProps,
			},
			children,
		);
	}

	const MotionTag = asChild ? MotionSlot : (as ?? motion.div);
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

	return (
		<MotionTag
			ref={asChild ? childRef : viewportRef}
			initial="hidden"
			animate={controls}
			variants={baseVariants}
			className={revealClassName}
			data-reveal-item=""
			{...interactionLockProps}
		>
			{children}
		</MotionTag>
	);
}
