"use client";

import {
	type HTMLMotionProps,
	type MotionStyle,
	motion,
	useTransform,
} from "motion/react";
import {
	type CSSProperties,
	type ElementType,
	type HTMLAttributes,
	type ReactNode,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	getGridRevealCellProgress,
	getGridRevealCellTiming,
} from "./gridRevealSequence";
import styles from "./MotionEffectCounterpartReveal.module.css";
import { useMotionEffectProgress } from "./progress";

export type MotionEffectCounterpartRevealLayer = "base" | "counterpart";

export type MotionEffectCounterpartRevealAnchorProps = Pick<
	HTMLAttributes<HTMLElement>,
	"aria-hidden"
> & {
	"data-motion-counterpart-anchor": "";
};

export type MotionEffectCounterpartRevealRenderProps = {
	anchorProps: MotionEffectCounterpartRevealAnchorProps;
	layer: MotionEffectCounterpartRevealLayer;
};

export type MotionEffectCounterpartRevealStrategy =
	| {
			type?: "circle";
			collapsedRadius?: number | "anchor";
	  }
	| {
			type: "swipe";
			axis?: "block" | "inline";
			origin?: "end" | "start";
	  }
	| {
			type: "grid";
			columns?: number;
			rows?: number;
	  };

type MotionEffectCounterpartRevealOwnProps = {
	as?: ElementType;
	range?: readonly [number, number];
	/** Controls only how the decorative counterpart is revealed. */
	reveal?: MotionEffectCounterpartRevealStrategy;
	renderLayer: (props: MotionEffectCounterpartRevealRenderProps) => ReactNode;
};

export type MotionEffectCounterpartRevealProps =
	MotionEffectCounterpartRevealOwnProps &
		Omit<
			HTMLMotionProps<"div">,
			keyof MotionEffectCounterpartRevealOwnProps | "ref"
		>;

const anchorProps: MotionEffectCounterpartRevealAnchorProps = {
	"aria-hidden": true,
	"data-motion-counterpart-anchor": "",
};

function finiteRadius(value: number) {
	return Number.isFinite(value) ? Math.max(0, value) : 0;
}

type CounterpartGeometry = {
	anchorRadius: number;
	direction: "ltr" | "rtl";
	height: number;
	width: number;
	x: number;
	y: number;
};

const initialGeometry: CounterpartGeometry = {
	anchorRadius: 0,
	direction: "ltr",
	height: 0,
	width: 0,
	x: 0,
	y: 0,
};

type CounterpartMaskProps = {
	children: ReactNode;
	geometry: CounterpartGeometry;
	progress: ReturnType<typeof useMotionEffectProgress>["progress"];
	reveal: MotionEffectCounterpartRevealStrategy;
};

function maskLayerProps(type: "circle" | "grid" | "swipe") {
	return {
		"aria-hidden": true,
		className: styles.counterpart,
		"data-motion-counterpart-layer": "counterpart",
		"data-motion-counterpart-reveal": type,
	} as const;
}

function CircleCounterpartMask({
	children,
	geometry,
	progress,
	reveal,
}: CounterpartMaskProps & {
	reveal: Extract<MotionEffectCounterpartRevealStrategy, { type?: "circle" }>;
}) {
	const start =
		reveal.collapsedRadius === "anchor"
			? geometry.anchorRadius
			: finiteRadius(reveal.collapsedRadius ?? 0);
	const end =
		Math.max(
			Math.hypot(geometry.x, geometry.y),
			Math.hypot(geometry.width - geometry.x, geometry.y),
			Math.hypot(geometry.x, geometry.height - geometry.y),
			Math.hypot(geometry.width - geometry.x, geometry.height - geometry.y),
		) + 16;
	const clipPath = useTransform(
		progress,
		(value) =>
			`circle(${start + (end - start) * value}px at ${geometry.x}px ${geometry.y}px)`,
	);

	return (
		<motion.div {...maskLayerProps("circle")} style={{ clipPath }}>
			{children}
		</motion.div>
	);
}

function swipeInsets(
	axis: "block" | "inline",
	origin: "end" | "start",
	direction: "ltr" | "rtl",
) {
	if (axis === "block")
		return origin === "start" ? "0% 0% 100% 0%" : "100% 0% 0% 0%";
	const physicalOrigin =
		direction === "rtl"
			? origin === "start"
				? "right"
				: "left"
			: origin === "start"
				? "left"
				: "right";
	return physicalOrigin === "left" ? "0% 100% 0% 0%" : "0% 0% 0% 100%";
}

function SwipeCounterpartMask({
	children,
	geometry,
	progress,
	reveal,
}: CounterpartMaskProps & {
	reveal: Extract<MotionEffectCounterpartRevealStrategy, { type: "swipe" }>;
}) {
	const hidden = swipeInsets(
		reveal.axis ?? "inline",
		reveal.origin ?? "start",
		geometry.direction,
	);
	const clipPath = useTransform(
		progress,
		[0, 1],
		[`inset(${hidden})`, "inset(0% 0% 0% 0%)"],
	);

	return (
		<motion.div {...maskLayerProps("swipe")} style={{ clipPath }}>
			{children}
		</motion.div>
	);
}

function boundedGridCount(value: number | undefined, fallback: number) {
	return Math.min(12, Math.max(2, Math.round(value ?? fallback)));
}

const GRID_MASK_SEAM_OVERLAP_PX = 1;

function GridCounterpartMask({
	children,
	geometry,
	progress,
	reveal,
}: CounterpartMaskProps & {
	reveal: Extract<MotionEffectCounterpartRevealStrategy, { type: "grid" }>;
}) {
	const columns = boundedGridCount(reveal.columns, 6);
	const rows = boundedGridCount(reveal.rows, 4);
	const cells = useMemo(
		() =>
			Array.from({ length: columns * rows }, (_, index) => ({
				column: index % columns,
				row: Math.floor(index / columns),
			})),
		[columns, rows],
	);
	const maskImage = useMemo(
		() => cells.map(() => "linear-gradient(#000 0 0)").join(", "),
		[cells],
	);
	const opacity = useTransform(progress, (value) => (value <= 0.001 ? 0 : 1));
	const maskPosition = useTransform(progress, (value) => {
		const cellWidth = geometry.width / columns;
		const cellHeight = geometry.height / rows;
		return cells
			.map(({ column, row }) => {
				const { direction, end, start } = getGridRevealCellTiming({
					column,
					columns,
					rootDirection: geometry.direction,
					row,
				});
				const local = getGridRevealCellProgress(value, start, end);
				const revealedWidth = cellWidth * local;
				const x =
					direction === "ltr"
						? column * cellWidth - GRID_MASK_SEAM_OVERLAP_PX
						: (column + 1) * cellWidth -
							revealedWidth -
							GRID_MASK_SEAM_OVERLAP_PX;
				return `${x}px ${row * cellHeight - GRID_MASK_SEAM_OVERLAP_PX}px`;
			})
			.join(", ");
	});
	const maskSize = useTransform(progress, (value) => {
		const cellWidth = geometry.width / columns;
		const cellHeight = geometry.height / rows;
		return cells
			.map(({ column, row }) => {
				const { end, start } = getGridRevealCellTiming({
					column,
					columns,
					rootDirection: geometry.direction,
					row,
				});
				const local = getGridRevealCellProgress(value, start, end);
				if (local <= 0) return "0px 0px";
				return `${Math.max(
					0,
					cellWidth * local + GRID_MASK_SEAM_OVERLAP_PX * 2,
				)}px ${cellHeight + GRID_MASK_SEAM_OVERLAP_PX * 2}px`;
			})
			.join(", ");
	});
	const style = {
		WebkitMaskImage: maskImage,
		WebkitMaskPosition: maskPosition,
		WebkitMaskRepeat: "no-repeat",
		WebkitMaskSize: maskSize,
		maskImage,
		maskPosition,
		maskRepeat: "no-repeat",
		maskSize,
		opacity,
	} as MotionStyle & CSSProperties;

	return (
		<motion.div
			{...maskLayerProps("grid")}
			data-motion-counterpart-grid-columns={columns}
			data-motion-counterpart-grid-rows={rows}
			style={style}
		>
			{children}
		</motion.div>
	);
}

function CounterpartMask(props: CounterpartMaskProps) {
	if (props.reveal.type === "swipe")
		return <SwipeCounterpartMask {...props} reveal={props.reveal} />;
	if (props.reveal.type === "grid")
		return <GridCounterpartMask {...props} reveal={props.reveal} />;
	return <CircleCounterpartMask {...props} reveal={props.reveal} />;
}

/**
 * Renders one semantic layer and one decorative counterpart in identical
 * geometry. The nearest MotionSource drives a reversible reveal strategy while
 * rendering and accessible semantics remain strategy-independent.
 */
export function MotionEffectCounterpartReveal({
	as: Tag = "div",
	className,
	range = [0, 1],
	reveal = { type: "circle" },
	renderLayer,
	style,
	...rest
}: MotionEffectCounterpartRevealProps) {
	const { progress } = useMotionEffectProgress("CounterpartReveal", range);
	const rootRef = useRef<HTMLElement | null>(null);
	const [geometry, setGeometry] = useState(initialGeometry);
	const MotionTag = useMemo(() => motion.create(Tag), [Tag]);

	useLayoutEffect(() => {
		const root = rootRef.current;
		const anchor = root?.querySelector<HTMLElement>(
			'[data-motion-counterpart-layer="base"] [data-motion-counterpart-anchor]',
		);
		if (!root || !anchor) return;

		const measure = () => {
			const rootRect = root.getBoundingClientRect();
			const anchorRect = anchor.getBoundingClientRect();
			const next: CounterpartGeometry = {
				anchorRadius: Math.hypot(anchorRect.width / 2, anchorRect.height / 2),
				direction: getComputedStyle(root).direction === "rtl" ? "rtl" : "ltr",
				height: rootRect.height,
				width: rootRect.width,
				x: anchorRect.left - rootRect.left + anchorRect.width / 2,
				y: anchorRect.top - rootRect.top + anchorRect.height / 2,
			};
			setGeometry((current) =>
				Object.entries(next).every(
					([key, value]) => current[key as keyof CounterpartGeometry] === value,
				)
					? current
					: next,
			);
		};

		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(root);
		observer.observe(anchor);
		return () => observer.disconnect();
	}, []);

	return (
		<MotionTag
			ref={rootRef}
			data-motion-effect="counterpart-reveal"
			{...rest}
			className={[styles.root, className].filter(Boolean).join(" ")}
			style={
				{
					...style,
					"--motion-counterpart-progress": progress,
				} as MotionStyle
			}
		>
			<div className={styles.base} data-motion-counterpart-layer="base">
				{renderLayer({ anchorProps, layer: "base" })}
			</div>
			<CounterpartMask geometry={geometry} progress={progress} reveal={reveal}>
				{renderLayer({ anchorProps, layer: "counterpart" })}
			</CounterpartMask>
		</MotionTag>
	);
}
