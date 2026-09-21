"use client";
import { useMotionValue } from "motion/react";
import { useCallback, useLayoutEffect, useRef } from "react";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { animateGsapProgress } from "../../runtime/animateProgress";
import { type gsap, ScrollTrigger } from "../../runtime/gsap";
import { toScrollTriggerPosition } from "../../runtime/scrollOffsets";
import { clampMotionProgress } from "../context";
import { useMotionParticipant } from "../scheduler/useMotionParticipant";
import {
	defaultScrollOffset,
	type MotionSourceRootProps,
	type MotionSourceStrategy,
	SourceFrame,
	useBreakpointActive,
	useSourceReady,
} from "../sourceShared";

export function GsapScrollSource({
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
	const progress = useMotionValue(staticProgress);
	const offset = strategy.offset ?? defaultScrollOffset;
	const start = toScrollTriggerPosition(offset?.[0], "top bottom");
	const end = toScrollTriggerPosition(offset?.[1], "bottom top");

	useLayoutEffect(() => {
		if (!enabled) {
			progress.jump(staticProgress);
			return;
		}
		const target = targetRef.current;
		if (!target) return;

		const trigger = ScrollTrigger.create({
			end,
			invalidateOnRefresh: true,
			onRefresh: (self) => progress.jump(self.progress),
			onUpdate: (self) => progress.set(self.progress),
			start,
			trigger: target,
		});
		progress.jump(trigger.progress);
		return () => trigger.kill();
	}, [enabled, end, progress, start, staticProgress]);

	return (
		<SourceFrame
			{...props}
			driver="gsap"
			mode={enabled ? "animated" : "static-final"}
			progress={progress}
			strategyType="scroll"
			targetRef={targetRef}
		/>
	);
}

export function GsapInViewSource({
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
	const progress = useMotionValue(appReady ? 0 : 1);
	const tweenRef = useRef<gsap.core.Tween | null>(null);
	const hasEnteredRef = useRef(false);

	useLayoutEffect(() => {
		if (!enabled) {
			tweenRef.current?.kill();
			progress.jump(1);
			return;
		}
		const target = targetRef.current;
		if (!target) return;
		const amount = Math.max(0, Math.min(1, strategy.amount ?? 0.2));
		const once = strategy.once ?? true;
		if (!hasEnteredRef.current || !once) progress.jump(0);
		const tweenTo = (value: number) => {
			tweenRef.current?.kill();
			tweenRef.current = animateGsapProgress(progress, value);
		};
		const show = () => {
			hasEnteredRef.current = true;
			tweenTo(1);
		};
		const hide = () => {
			if (!once || !hasEnteredRef.current) tweenTo(0);
		};
		const trigger = ScrollTrigger.create({
			end: () => `bottom top+=${target.offsetHeight * amount}`,
			invalidateOnRefresh: true,
			onEnter: show,
			onEnterBack: show,
			onLeave: hide,
			onLeaveBack: hide,
			start: () => `top bottom-=${target.offsetHeight * amount}`,
			trigger: target,
		});
		return () => {
			trigger.kill();
			tweenRef.current?.kill();
		};
	}, [enabled, progress, strategy.amount, strategy.once]);

	return (
		<SourceFrame
			{...props}
			driver="gsap"
			mode={enabled ? "animated" : "static-final"}
			progress={progress}
			strategyType="in-view"
			targetRef={targetRef}
		/>
	);
}

export function GsapRevealSource({
	strategy,
	...props
}: MotionSourceRootProps & {
	strategy: Extract<MotionSourceStrategy, { type: "reveal" }>;
}) {
	const targetRef = useRef<HTMLElement | null>(null);
	const appReady = useSourceReady();
	const progress = useMotionValue(appReady ? 0 : 1);
	const tweenRef = useRef<gsap.core.Tween | null>(null);
	const completionResolverRef = useRef<(() => void) | null>(null);
	const finish = useCallback(() => {
		completionResolverRef.current?.();
		completionResolverRef.current = null;
	}, []);
	const stop = useCallback(() => {
		tweenRef.current?.kill();
		tweenRef.current = null;
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
				tweenRef.current = animateGsapProgress(progress, 1, {
					duration: strategy.duration,
					delay,
					onComplete: () => {
						tweenRef.current = null;
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
			driver="gsap"
			mode={appReady && !disabled ? "animated" : "static-final"}
			progress={progress}
			strategyType="reveal"
			targetRef={targetRef}
		/>
	);
}
