"use client";

import clsx from "clsx";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import {
	type ComponentProps,
	type ElementType,
	type ReactNode,
	useRef,
} from "react";
import { getSpring } from "@/components/ui/foundations/spring";
import { useAppReady } from "@/hooks/useAppReady";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

export type ScrollWidthRadius = {
	tl?: number;
	tr?: number;
	br?: number;
	bl?: number;
};

type ScrollWidthOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

export type ScrollWidthProps = {
	children: ReactNode;
	as?: ElementType;
	className?: string;
	frameClassName?: string;
	contentClassName?: string;
	coverClassName?: string;
	style?: React.CSSProperties;
	offset?: ScrollWidthOffset;
	startInset?: number;
	endInset?: number;
	startRadius?: ScrollWidthRadius;
	endRadius?: ScrollWidthRadius;
	progressRange?: [number, number];
	disableWhenReducedMotion?: boolean;
	smooth?: boolean;
	stiffness?: number;
	damping?: number;
	mass?: number;
} & Omit<ComponentProps<"div">, "children" | "className" | "style">;

const DEFAULT_OFFSET: ScrollWidthOffset = ["start end", "end start"];

function resolveRadius(radius?: ScrollWidthRadius) {
	return {
		tl: radius?.tl ?? 0,
		tr: radius?.tr ?? 0,
		br: radius?.br ?? 0,
		bl: radius?.bl ?? 0,
	};
}

export function ScrollWidth({
	children,
	as = "div",
	className,
	frameClassName,
	contentClassName,
	coverClassName,
	style,
	offset = DEFAULT_OFFSET,
	startInset = 0,
	endInset = 48,
	startRadius,
	endRadius,
	progressRange = [0, 1],
	disableWhenReducedMotion = true,
	smooth = true,
	stiffness,
	damping,
	mass,
	...rest
}: ScrollWidthProps) {
	const appReady = useAppReady();
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const motionReady = motionAllowed && appReady;
	const ref = useRef<HTMLElement | null>(null);
	const Tag = as ?? "div";
	const start = resolveRadius(startRadius);
	const end = resolveRadius(endRadius);
	const componentSpring = getSpring("component");
	const coverWidth = Math.max(startInset, endInset, 1);
	const startCoverScale = startInset / coverWidth;
	const endCoverScale = endInset / coverWidth;

	const { scrollYProgress } = useScroll({
		target: ref,
		offset,
	});

	const rawProgress = useTransform(scrollYProgress, progressRange, [0, 1], {
		clamp: true,
	});
	const springProgress = useSpring(rawProgress, {
		...componentSpring,
		stiffness: stiffness ?? componentSpring.stiffness,
		damping: damping ?? componentSpring.damping,
		mass: mass ?? componentSpring.mass,
	});
	const progress = smooth ? springProgress : rawProgress;

	const borderTopLeftRadius = useTransform(
		progress,
		[0, 1],
		[start.tl, end.tl],
	);
	const borderTopRightRadius = useTransform(
		progress,
		[0, 1],
		[start.tr, end.tr],
	);
	const borderBottomRightRadius = useTransform(
		progress,
		[0, 1],
		[start.br, end.br],
	);
	const borderBottomLeftRadius = useTransform(
		progress,
		[0, 1],
		[start.bl, end.bl],
	);
	const coverScale = useTransform(
		progress,
		[0, 1],
		[startCoverScale, endCoverScale],
	);

	const frameStyle = motionReady
		? {
				borderTopLeftRadius,
				borderTopRightRadius,
				borderBottomRightRadius,
				borderBottomLeftRadius,
				willChange: "border-radius",
			}
		: {
				borderTopLeftRadius: start.tl,
				borderTopRightRadius: start.tr,
				borderBottomRightRadius: start.br,
				borderBottomLeftRadius: start.bl,
			};
	const leftCoverStyle = motionReady
		? {
				scaleX: coverScale,
				originX: 0,
				willChange: "transform",
			}
		: {
				scaleX: startCoverScale,
				originX: 0,
			};
	const rightCoverStyle = motionReady
		? {
				scaleX: coverScale,
				originX: 1,
				willChange: "transform",
			}
		: {
				scaleX: startCoverScale,
				originX: 1,
			};

	return (
		<Tag
			ref={ref}
			className={clsx("relative min-w-0", className)}
			style={style}
			{...rest}
		>
			<motion.div
				className={clsx(
					"absolute inset-0 min-w-0 overflow-hidden box-border",
					frameClassName,
				)}
				style={frameStyle}
			>
				<div className={clsx("relative h-full w-full", contentClassName)}>
					{children}
				</div>
				<motion.div
					aria-hidden={true}
					className={clsx(
						"pointer-events-none absolute inset-y-0 left-0",
						coverClassName,
					)}
					style={{
						width: coverWidth,
						...leftCoverStyle,
					}}
				/>
				<motion.div
					aria-hidden={true}
					className={clsx(
						"pointer-events-none absolute inset-y-0 right-0",
						coverClassName,
					)}
					style={{
						width: coverWidth,
						...rightCoverStyle,
					}}
				/>
			</motion.div>
		</Tag>
	);
}
