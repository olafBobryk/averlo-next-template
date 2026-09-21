"use client";
import {
	animate,
	useInView,
	useMotionValue,
	useScroll,
	useSpring,
} from "motion/react";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import {
	getMotionTiming,
	resolveMotionTransition as resolveMotionCssTransition,
} from "@/components/ui/foundations/motionTiming";
import { getSpring } from "@/components/ui/foundations/spring";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { clampMotionProgress, type MotionSourceMode } from "../context";
import { useMotionParticipant } from "../scheduler/useMotionParticipant";
import {
	defaultScrollOffset,
	type MotionSourceRootProps,
	type MotionSourceStrategy,
	SourceFrame,
	useBreakpointActive,
	useProgressTarget,
	useSourceReady,
} from "../sourceShared";
export function MotionScrollSource({
	strategy,
	...props
}: MotionSourceRootProps & {
	strategy: Extract<MotionSourceStrategy, { type: "scroll" }>;
}) {
	const targetRef = useRef<HTMLElement | null>(null);
	const activeFrom = strategy.activeFrom ?? "base";
	const breakpointActive = useBreakpointActive(activeFrom);
	const appReady = useSourceReady();
	const motionAllowed = useMotionAllowed(true);
	const motionDisabled = useMotionDisableOverride();
	const enabled =
		appReady && motionAllowed && !motionDisabled && breakpointActive;
	const staticProgress = clampMotionProgress(strategy.staticProgress ?? 1);
	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: strategy.offset ?? defaultScrollOffset,
	});
	const springProgress = useSpring(scrollYProgress, getSpring("scroll"));
	const sourceProgress =
		strategy.smooth === false ? scrollYProgress : springProgress;
	const progress = useMotionValue(staticProgress);

	useEffect(() => {
		if (!enabled) {
			progress.jump(staticProgress);
			return;
		}
		progress.jump(sourceProgress.get());
		return sourceProgress.on("change", (value) => progress.set(value));
	}, [enabled, progress, sourceProgress, staticProgress]);

	return (
		<SourceFrame
			{...props}
			driver="motion"
			mode={enabled ? "animated" : "static-final"}
			progress={progress}
			strategyType="scroll"
			targetRef={targetRef}
		/>
	);
}

export function InteractionSource({
	strategy,
	...props
}: MotionSourceRootProps & {
	strategy: Extract<
		MotionSourceStrategy,
		{ type: "hover" } | { type: "owner-hover" }
	>;
}) {
	const targetRef = useRef<HTMLElement | null>(null);
	const [active, setActive] = useState(false);
	const appReady = useSourceReady();
	const motionAllowed = useMotionAllowed(true);
	const motionDisabled = useMotionDisableOverride();
	const enabled = appReady && motionAllowed && !motionDisabled;
	const mode: MotionSourceMode = !appReady
		? "static-final"
		: enabled
			? "animated"
			: "instant";
	const progress = useMotionValue(appReady ? 0 : 1);
	const timing = strategy.timing ?? "interactive";

	useEffect(() => {
		const root = targetRef.current;
		const trigger =
			strategy.type === "owner-hover"
				? root?.closest<HTMLElement>("[data-motion-owner]")
				: root;
		if (!trigger) return;

		let pointerActive = false;
		let focusActive = false;
		let focusFrame = 0;
		const sync = () => setActive(pointerActive || focusActive);
		const syncFocus = () => {
			cancelAnimationFrame(focusFrame);
			focusFrame = requestAnimationFrame(() => {
				focusActive =
					trigger.matches(":focus-visible") ||
					Boolean(trigger.querySelector(":focus-visible"));
				sync();
			});
		};
		const enter = () => {
			pointerActive = true;
			sync();
		};
		const leave = () => {
			pointerActive = false;
			sync();
		};

		trigger.addEventListener("pointerenter", enter);
		trigger.addEventListener("pointerleave", leave);
		trigger.addEventListener("focusin", syncFocus);
		trigger.addEventListener("focusout", syncFocus);
		return () => {
			cancelAnimationFrame(focusFrame);
			trigger.removeEventListener("pointerenter", enter);
			trigger.removeEventListener("pointerleave", leave);
			trigger.removeEventListener("focusin", syncFocus);
			trigger.removeEventListener("focusout", syncFocus);
		};
	}, [strategy.type]);

	useProgressTarget(
		progress,
		mode === "static-final" ? 1 : active ? 1 : 0,
		mode,
		timing,
		true,
	);

	return (
		<SourceFrame
			{...props}
			driver="motion"
			mode={mode}
			progress={progress}
			strategyType={strategy.type}
			targetRef={targetRef}
			timing={timing}
		/>
	);
}

export function BooleanSource({
	strategy,
	...props
}: MotionSourceRootProps & {
	strategy: Extract<MotionSourceStrategy, { type: "boolean" }>;
}) {
	const targetRef = useRef<HTMLElement | null>(null);
	const appReady = useSourceReady();
	const motionAllowed = useMotionAllowed(true);
	const motionDisabled = useMotionDisableOverride();
	const enabled = appReady && motionAllowed && !motionDisabled;
	const mode: MotionSourceMode = !appReady
		? "static-final"
		: enabled
			? "animated"
			: "instant";
	const progress = useMotionValue(appReady ? Number(strategy.active) : 1);
	const timing = strategy.timing ?? "interactive";
	useProgressTarget(
		progress,
		mode === "static-final" ? 1 : Number(strategy.active),
		mode,
		timing,
		true,
	);

	return (
		<SourceFrame
			{...props}
			driver="motion"
			mode={mode}
			progress={progress}
			strategyType="boolean"
			targetRef={targetRef}
			timing={timing}
		/>
	);
}

export function MotionInViewSource({
	strategy,
	...props
}: MotionSourceRootProps & {
	strategy: Extract<MotionSourceStrategy, { type: "in-view" }>;
}) {
	const targetRef = useRef<HTMLElement | null>(null);
	const appReady = useSourceReady();
	const motionAllowed = useMotionAllowed(true);
	const motionDisabled = useMotionDisableOverride();
	const enabled = appReady && motionAllowed && !motionDisabled;
	const inView = useInView(targetRef, {
		amount: strategy.amount ?? 0.2,
		once: strategy.once ?? true,
	});
	const progress = useMotionValue(appReady ? 0 : 1);
	useProgressTarget(
		progress,
		enabled ? Number(inView) : 1,
		enabled ? "animated" : "static-final",
		"grand",
	);

	return (
		<SourceFrame
			{...props}
			driver="motion"
			mode={enabled ? "animated" : "static-final"}
			progress={progress}
			strategyType="in-view"
			targetRef={targetRef}
		/>
	);
}

export function MotionRevealSource({
	strategy,
	...props
}: MotionSourceRootProps & {
	strategy: Extract<MotionSourceStrategy, { type: "reveal" }>;
}) {
	const targetRef = useRef<HTMLElement | null>(null);
	const appReady = useSourceReady();
	const progress = useMotionValue(appReady ? 0 : 1);
	const animationRef = useRef<ReturnType<typeof animate> | null>(null);
	const completionResolverRef = useRef<(() => void) | null>(null);
	const finish = useCallback(() => {
		completionResolverRef.current?.();
		completionResolverRef.current = null;
	}, []);
	const stop = useCallback(() => {
		animationRef.current?.stop();
		animationRef.current = null;
		finish();
	}, [finish]);
	const { disabled } = useMotionParticipant({
		elementRef: targetRef,
		once: strategy.once ?? true,
		ready: strategy.ready ?? true,
		play: (delay) => {
			stop();
			return new Promise<void>((resolve) => {
				completionResolverRef.current = resolve;
				const duration = strategy.duration;
				const transition =
					Number.isFinite(duration) && duration !== undefined && duration > 0
						? { ...resolveMotionCssTransition("reveal"), duration }
						: getMotionTiming("grand");
				animationRef.current = animate(progress, 1, {
					...transition,
					delay,
					onComplete: () => {
						animationRef.current = null;
						finish();
					},
				});
			});
		},
		reset: () => {
			stop();
			progress.jump(0);
		},
		showImmediately: () => {
			stop();
			progress.jump(1);
		},
	});

	useLayoutEffect(() => {
		if (!appReady || disabled) {
			progress.jump(1);
			return;
		}
		progress.jump(0);
		return stop;
	}, [appReady, disabled, progress, stop]);

	return (
		<SourceFrame
			{...props}
			driver="motion"
			mode={appReady && !disabled ? "animated" : "static-final"}
			progress={progress}
			strategyType="reveal"
			targetRef={targetRef}
		/>
	);
}
