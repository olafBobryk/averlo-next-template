"use client";
import { Slot } from "@radix-ui/react-slot";
import { animate, type MotionValue, type UseScrollOptions } from "motion/react";
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
import { useMotionDriverReady } from "@/components/ui/foundations/motionDriverContext";
import {
	getMotionTiming,
	type MotionTimingPreset,
} from "@/components/ui/foundations/motionTiming";
import { useAppReady } from "@/hooks/useAppReady";
import {
	MotionSourceContext,
	type MotionSourceContextValue,
	type MotionSourceMode,
} from "./context";
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

const SlotWithRef = forwardRef<HTMLElement, React.ComponentProps<typeof Slot>>(
	(props, ref) => <Slot ref={ref} {...props} />,
);
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
		const controls = animate(progress, target, getMotionTiming(timing));
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
