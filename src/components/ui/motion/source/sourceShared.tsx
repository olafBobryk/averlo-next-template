"use client";
import { Slot } from "@radix-ui/react-slot";
import {
	animate,
	type MotionValue,
	type UseScrollOptions,
	useMotionValue,
} from "motion/react";
import { usePathname } from "next/navigation";
import {
	type ComponentPropsWithoutRef,
	type ElementType,
	forwardRef,
	type ReactNode,
	type Ref,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import { useMotionDriverReady } from "@/components/ui/foundations/motionDriverContext";
import type { MotionStep } from "@/components/ui/foundations/motionTiming";
import { spring } from "@/components/ui/foundations/spring";
import { useAppReady } from "@/hooks/useAppReady";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import {
	clampMotionProgress,
	MotionSourceContext,
	type MotionSourceContextValue,
	type MotionSourceMode,
} from "./context";
export type MotionSourceBreakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";
export type MotionSourceTiming = MotionStep;

export type MotionSourceStrategy =
	| {
			type: "scroll";
			offset?: UseScrollOptions["offset"];
			smooth?: boolean;
			activeFrom?: MotionSourceBreakpoint;
			staticProgress?: number;
			/**
			 * Content on screen when the source activates catches up from 0 to
			 * its live scroll progress with a timed `slow` intro, stops exactly
			 * there, then follows scroll. Off by default: scroll-linked poses
			 * (parallax, text shift) render their current pose at once.
			 * `MotionSource.Sequence mode="scroll"` turns it on.
			 */
			intro?: boolean;
			/** `false` holds the source hidden at progress 0 until it is ready. */
			ready?: boolean;
			/** Renders the static final state with no scroll motion. */
			disabled?: boolean;
	  }
	| { type: "hover"; timing?: MotionSourceTiming }
	| { type: "owner-hover"; timing?: MotionSourceTiming }
	| { type: "boolean"; active: boolean; timing?: MotionSourceTiming }
	| { type: "in-view"; amount?: number; once?: boolean }
	| {
			type: "reveal";
			duration?: number;
			ready?: boolean;
			once?: boolean;
	  };

type MotionSourceRootOwnProps = {
	as?: ElementType;
	asChild?: boolean;
	children: ReactNode;
	sourceRef?: Ref<HTMLElement>;
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

export const defaultScrollOffset: UseScrollOptions["offset"] = [
	"start end",
	"end start",
];

type MotionSourceEngine = "gsap" | "motion";

export type ScrollStrategy = Extract<MotionSourceStrategy, { type: "scroll" }>;

export type ScrollSourceProps = MotionSourceRootProps & {
	strategy: ScrollStrategy;
	/**
	 * Private to the scroll Sequence: a linear intro of this many seconds
	 * replaces the `slow` spring so each item's slice plays over `slow`.
	 */
	introDuration?: () => number;
};

export const SlotWithRef = forwardRef<
	HTMLElement,
	React.ComponentProps<typeof Slot>
>((props, ref) => <Slot ref={ref} {...props} />);
SlotWithRef.displayName = "MotionSourceSlot";

export function SourceFrame({
	as: Tag = "div",
	asChild = false,
	children,
	driver,
	mode,
	progress,
	strategyType,
	targetRef,
	timing,
	sourceRef,
	...rest
}: Omit<MotionSourceRootProps, "strategy"> &
	MotionSourceContextValue & {
		driver: MotionSourceEngine;
		targetRef: React.MutableRefObject<HTMLElement | null>;
		timing?: MotionSourceTiming;
	}) {
	const value = useMemo(
		() => ({ mode, progress, strategyType }),
		[mode, progress, strategyType],
	);
	const Frame = asChild ? SlotWithRef : Tag;
	const setTargetRef = useCallback(
		(node: HTMLElement | null) => {
			targetRef.current = node;
			if (typeof sourceRef === "function") {
				sourceRef(node);
			} else if (sourceRef) {
				sourceRef.current = node;
			}
		},
		[sourceRef, targetRef],
	);

	return (
		<MotionSourceContext.Provider value={value}>
			<Frame
				ref={setTargetRef}
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

export function useProgressTarget(
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
		const controls = animate(progress, target, spring[timing]);
		return () => controls.stop();
	}, [mode, progress, skipInitialAnimation, target, timing]);
}

export function useBreakpointActive(activeFrom: MotionSourceBreakpoint) {
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

export function useSourceReady() {
	const appReady = useAppReady();
	const driverReady = useMotionDriverReady();
	return appReady && driverReady;
}

/** Synchronous read of the motion gates, for post-hydration initial values. */
function isMotionOffNow() {
	const params = new URLSearchParams(window.location.search);
	return (
		document.documentElement.dataset.motionOverride === "off" ||
		["off", "false"].includes(params.get("motion")?.toLowerCase() ?? "") ||
		["off", "false"].includes(params.get("reveal")?.toLowerCase() ?? "") ||
		window.matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

function findHashTarget() {
	const hash = window.location.hash.slice(1);
	if (!hash) return null;
	try {
		return document.getElementById(decodeURIComponent(hash));
	} catch {
		return null;
	}
}

/** On screen at the scroll position the page loads at (a hash target's, if any). */
export function isInitiallyVisible(element: HTMLElement) {
	const rect = element.getBoundingClientRect();
	const hashTarget = findHashTarget();
	const maxScroll = Math.max(
		0,
		document.documentElement.scrollHeight - window.innerHeight,
	);
	const entryScroll = hashTarget
		? Math.max(
				0,
				Math.min(
					hashTarget.getBoundingClientRect().top + window.scrollY,
					maxScroll,
				),
			)
		: window.scrollY;
	const top = rect.top + window.scrollY - entryScroll;
	const bottom = rect.bottom + window.scrollY - entryScroll;
	return (
		rect.width > 0 &&
		rect.height > 0 &&
		top < window.innerHeight &&
		bottom > 0 &&
		rect.left < window.innerWidth &&
		rect.right > 0
	);
}

/**
 * Gating and catch-up state shared by both scroll drivers. The drivers own
 * the live scroll progress; this owns when it applies and the intro factor
 * (0 to 1) it is multiplied by, so the intro always lands on live progress.
 */
export function useScrollSourceState(strategy: ScrollStrategy) {
	const breakpointActive = useBreakpointActive(strategy.activeFrom ?? "base");
	const appReady = useSourceReady();
	const motionAllowed = useMotionAllowed(true);
	const motionDisabled = useMotionDisableOverride();
	const motionOn = motionAllowed && !motionDisabled && !strategy.disabled;
	const enabled =
		appReady && motionOn && breakpointActive && strategy.ready !== false;
	const staticProgress = clampMotionProgress(
		motionOn && strategy.ready === false ? 0 : (strategy.staticProgress ?? 1),
	);
	const intro = strategy.intro === true;
	// Client navigations mount after the app is ready: start hidden so an
	// intro never flashes the final state first, unless motion is already
	// known to be off. SSR and hydration render the final state.
	const progress = useMotionValue(
		intro && appReady && motionOn && !isMotionOffNow() ? 0 : staticProgress,
	);
	const introProgress = useMotionValue(0);
	const pathname = usePathname();
	const introRef = useRef({
		pathname,
		played: false,
		visible: null as boolean | null,
	});

	const syncRoute = useCallback(() => {
		const state = introRef.current;
		if (state.pathname === pathname) return;
		// A persistent source (the footer) catches up again on the new route.
		state.pathname = pathname;
		state.played = false;
		state.visible = null;
		introProgress.jump(0);
	}, [introProgress, pathname]);

	const shouldPlayIntro = useCallback(
		(target: HTMLElement) => {
			if (!intro) return false;
			const state = introRef.current;
			state.visible ??= isInitiallyVisible(target);
			return state.visible && !state.played;
		},
		[intro],
	);

	const markIntroPlayed = useCallback(() => {
		introRef.current.played = true;
	}, []);

	return {
		enabled,
		introProgress,
		markIntroPlayed,
		pathname,
		progress,
		shouldPlayIntro,
		staticProgress,
		syncRoute,
	};
}
