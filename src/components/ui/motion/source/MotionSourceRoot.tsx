"use client";

import { Slot } from "@radix-ui/react-slot";
import {
	animate,
	type MotionValue,
	type UseScrollOptions,
	useMotionValue,
} from "motion/react";
import {
	type ComponentPropsWithoutRef,
	type ElementType,
	forwardRef,
	type ReactNode,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import {
	getMotionTiming,
	type MotionTimingPreset,
} from "@/components/ui/foundations/motionTiming";
import { gsap, ScrollTrigger } from "@/components/ui/motion/runtime/gsap";
import { getGsapTiming } from "@/components/ui/motion/runtime/timing";
import { useAppReady } from "@/hooks/useAppReady";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import {
	clampMotionProgress,
	MotionSourceContext,
	type MotionSourceContextValue,
	type MotionSourceMode,
} from "./context";
import { useMotionParticipant } from "./scheduler/useMotionParticipant";

export type MotionSourceBreakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";
export type MotionSourceTiming = MotionTimingPreset;

export type MotionSourceStrategy =
	| {
			type: "scroll";
			offset?: UseScrollOptions["offset"];
			smooth?: boolean;
			activeFrom?: MotionSourceBreakpoint;
			staticProgress?: number;
	  }
	| { type: "hover"; timing?: MotionSourceTiming }
	| { type: "owner-hover"; timing?: MotionSourceTiming }
	| { type: "boolean"; active: boolean; timing?: MotionSourceTiming }
	| { type: "in-view"; amount?: number; once?: boolean }
	| { type: "reveal"; ready?: boolean; once?: boolean };

type MotionSourceRootOwnProps = {
	as?: ElementType;
	asChild?: boolean;
	children: ReactNode;
	strategy: MotionSourceStrategy;
};

export type MotionSourceRootProps = MotionSourceRootOwnProps &
	Omit<ComponentPropsWithoutRef<"div">, keyof MotionSourceRootOwnProps | "ref">;

const breakpointQueries: Record<MotionSourceBreakpoint, string> = {
	base: "(min-width: 0px)",
	sm: "(min-width: 640px)",
	md: "(min-width: 768px)",
	lg: "(min-width: 1024px)",
	xl: "(min-width: 1280px)",
	"2xl": "(min-width: 1536px)",
};

const defaultScrollOffset: UseScrollOptions["offset"] = [
	"start end",
	"end start",
];

type MotionSourceDriver = "gsap" | "motion";

function toScrollTriggerPoint(point: unknown) {
	if (typeof point === "number") return `${point * 100}%`;
	if (point === "start") return "top";
	if (point === "end") return "bottom";
	return String(point);
}

function toScrollTriggerPosition(value: unknown, fallback: string) {
	if (Array.isArray(value)) {
		return value.map(toScrollTriggerPoint).join(" ");
	}
	if (typeof value === "string") {
		return value.split(/\s+/).map(toScrollTriggerPoint).join(" ");
	}
	return fallback;
}

const SlotWithRef = forwardRef<HTMLElement, React.ComponentProps<typeof Slot>>(
	(props, ref) => <Slot ref={ref} {...props} />,
);
SlotWithRef.displayName = "MotionSourceSlot";

export function MotionSourceRoot(props: MotionSourceRootProps) {
	switch (props.strategy.type) {
		case "scroll":
			return <ScrollSource {...props} strategy={props.strategy} />;
		case "hover":
			return <InteractionSource {...props} strategy={props.strategy} />;
		case "owner-hover":
			return <InteractionSource {...props} strategy={props.strategy} />;
		case "boolean":
			return <BooleanSource {...props} strategy={props.strategy} />;
		case "in-view":
			return <InViewSource {...props} strategy={props.strategy} />;
		case "reveal":
			return <RevealSource {...props} strategy={props.strategy} />;
	}
}

function ScrollSource({
	strategy,
	...props
}: MotionSourceRootProps & {
	strategy: Extract<MotionSourceStrategy, { type: "scroll" }>;
}) {
	const targetRef = useRef<HTMLElement | null>(null);
	const activeFrom = strategy.activeFrom ?? "base";
	const breakpointActive = useBreakpointActive(activeFrom);
	const appReady = useAppReady();
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

function InteractionSource({
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
	const appReady = useAppReady();
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

function BooleanSource({
	strategy,
	...props
}: MotionSourceRootProps & {
	strategy: Extract<MotionSourceStrategy, { type: "boolean" }>;
}) {
	const targetRef = useRef<HTMLElement | null>(null);
	const appReady = useAppReady();
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

function InViewSource({
	strategy,
	...props
}: MotionSourceRootProps & {
	strategy: Extract<MotionSourceStrategy, { type: "in-view" }>;
}) {
	const targetRef = useRef<HTMLElement | null>(null);
	const appReady = useAppReady();
	const motionAllowed = useMotionAllowed(true);
	const motionDisabled = useMotionDisableOverride();
	const enabled = appReady && motionAllowed && !motionDisabled;
	const progress = useMotionValue(appReady ? 0 : 1);
	const amount = clampMotionProgress(strategy.amount ?? 0.2);
	const once = strategy.once ?? true;

	useLayoutEffect(() => {
		if (!enabled) {
			progress.jump(1);
			return;
		}
		const target = targetRef.current;
		if (!target) return;

		let tween: gsap.core.Tween | null = null;
		let hasEntered = false;
		const setTarget = (value: number) => {
			tween?.kill();
			const proxy = { value: progress.get() };
			tween = gsap.to(proxy, {
				...getGsapTiming("grand"),
				onUpdate: () => progress.set(proxy.value),
				value,
			});
		};
		const show = () => {
			hasEntered = true;
			setTarget(1);
		};
		const hide = () => {
			if (!once || !hasEntered) setTarget(0);
		};
		const trigger = ScrollTrigger.create({
			end: `bottom ${amount * 100}%`,
			invalidateOnRefresh: true,
			onEnter: show,
			onEnterBack: show,
			onLeave: hide,
			onLeaveBack: hide,
			start: `top ${(1 - amount) * 100}%`,
			trigger: target,
		});

		if (trigger.isActive || (once && trigger.progress > 0)) show();
		else progress.jump(0);

		return () => {
			tween?.kill();
			trigger.kill();
		};
	}, [amount, enabled, once, progress]);

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

function RevealSource({
	strategy,
	...props
}: MotionSourceRootProps & {
	strategy: Extract<MotionSourceStrategy, { type: "reveal" }>;
}) {
	const targetRef = useRef<HTMLElement | null>(null);
	const appReady = useAppReady();
	const progress = useMotionValue(appReady ? 0 : 1);
	const animationRef = useRef<gsap.core.Tween | null>(null);
	const completionResolverRef = useRef<(() => void) | null>(null);
	const finish = useCallback(() => {
		completionResolverRef.current?.();
		completionResolverRef.current = null;
	}, []);
	const stop = useCallback(() => {
		animationRef.current?.kill();
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
				const proxy = { value: progress.get() };
				animationRef.current = gsap.to(proxy, {
					...getGsapTiming("grand"),
					delay,
					onUpdate: () => progress.set(proxy.value),
					onComplete: () => {
						animationRef.current = null;
						finish();
					},
					value: 1,
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

function SourceFrame({
	as: Tag = "div",
	asChild = false,
	children,
	driver,
	mode,
	progress,
	strategyType,
	targetRef,
	timing,
	...rest
}: Omit<MotionSourceRootProps, "strategy"> &
	MotionSourceContextValue & {
		driver: MotionSourceDriver;
		targetRef: React.RefObject<HTMLElement | null>;
		timing?: MotionSourceTiming;
	}) {
	const value = useMemo(
		() => ({ mode, progress, strategyType }),
		[mode, progress, strategyType],
	);
	const Frame = asChild ? SlotWithRef : Tag;

	return (
		<MotionSourceContext.Provider value={value}>
			<Frame
				ref={targetRef}
				data-motion-source=""
				data-motion-source-driver={driver}
				data-motion-source-mode={mode}
				data-motion-source-strategy={strategyType}
				data-motion-source-timing={timing}
				{...rest}
			>
				{children}
			</Frame>
		</MotionSourceContext.Provider>
	);
}

function useProgressTarget(
	progress: MotionValue<number>,
	target: number,
	mode: MotionSourceMode,
	timing: MotionSourceTiming,
	skipInitialAnimation = false,
) {
	const hasSettledInitialTarget = useRef(false);

	useEffect(() => {
		if (mode !== "animated") {
			progress.jump(target);
			return;
		}
		if (skipInitialAnimation && !hasSettledInitialTarget.current) {
			hasSettledInitialTarget.current = true;
			progress.jump(target);
			return;
		}
		hasSettledInitialTarget.current = true;
		const controls = animate(progress, target, getMotionTiming(timing));
		return () => controls.stop();
	}, [mode, progress, skipInitialAnimation, target, timing]);
}

function useBreakpointActive(activeFrom: MotionSourceBreakpoint) {
	const [active, setActive] = useState(activeFrom === "base");
	useEffect(() => {
		const media = window.matchMedia(breakpointQueries[activeFrom]);
		const update = () => setActive(media.matches);
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, [activeFrom]);
	return active;
}
