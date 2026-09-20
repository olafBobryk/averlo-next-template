"use client";

import { motion, useTransform } from "motion/react";
import {
	type CSSProperties,
	type HTMLAttributes,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { getGridRevealCellTiming } from "./gridRevealSequence";
import styles from "./MotionEffectGridReveal.module.css";
import { useMotionEffectProgress } from "./progress";

type GridDimensions = { columns: number; rows: number };
type GridLayout = GridDimensions & { height: number; width: number };

type MotionEffectGridRevealOwnProps = {
	range?: readonly [number, number];
	placeholderStyle?: CSSProperties;
	tileStyle: CSSProperties;
	tilesVisible?: boolean;
	targetCellAspectRatio?: number;
	minColumns?: number;
	maxColumns?: number;
};

export type MotionEffectGridRevealProps = MotionEffectGridRevealOwnProps &
	Omit<HTMLAttributes<HTMLDivElement>, keyof MotionEffectGridRevealOwnProps>;

const DEFAULT_GRID = { columns: 8, rows: 5 };
const TARGET_TILE_WIDTH = 96;
// Adjacent grid tracks can land on fractional device pixels. Give every
// independently composited tile a small overlap so those raster edges cannot
// expose the page underneath while the reveal is running.
const GRID_TILE_SEAM_OVERLAP_PX = 1;

function clamp(value: number, minimum: number, maximum: number) {
	return Math.min(Math.max(value, minimum), maximum);
}

export function getGridRevealDimensions(
	width: number,
	height: number,
	{
		targetCellAspectRatio = 3 / 4,
		minColumns = 6,
		maxColumns = 18,
	}: Pick<
		MotionEffectGridRevealOwnProps,
		"targetCellAspectRatio" | "minColumns" | "maxColumns"
	> = {},
): GridDimensions {
	if (
		!Number.isFinite(width) ||
		!Number.isFinite(height) ||
		width <= 0 ||
		height <= 0
	)
		return DEFAULT_GRID;

	const minimum = Math.max(2, Math.round(minColumns));
	const maximum = Math.max(minimum, Math.round(maxColumns));
	const aspect = Number.isFinite(targetCellAspectRatio)
		? clamp(targetCellAspectRatio, 0.35, 1.5)
		: 3 / 4;
	const columns = clamp(
		Math.round(width / TARGET_TILE_WIDTH),
		minimum,
		maximum,
	);
	const targetRows = Math.round(height / (width / columns / aspect));
	const maximumRows = Math.max(3, Math.floor(columns * 0.75));
	const rows = clamp(Math.min(targetRows, maximumRows), 2, maximumRows);

	return { columns, rows };
}

function GridClipTile({
	column,
	columns,
	containerHeight,
	containerWidth,
	progress,
	row,
	rows,
	rootDirection,
	tileStyle,
}: {
	column: number;
	columns: number;
	containerHeight: number;
	containerWidth: number;
	progress: ReturnType<typeof useMotionEffectProgress>["progress"];
	row: number;
	rows: number;
	rootDirection: "ltr" | "rtl";
	tileStyle: CSSProperties;
}) {
	const { direction, end, start } = getGridRevealCellTiming({
		column,
		columns,
		rootDirection,
		row,
	});
	const clipPath = useTransform(
		progress,
		[start, end],
		direction === "ltr"
			? ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]
			: ["inset(0 0 0 100%)", "inset(0 0 0 0%)"],
		{ clamp: true },
	);

	return (
		<motion.span
			className={styles.touchTile}
			data-motion-grid-column={column}
			data-motion-grid-direction={direction}
			data-motion-grid-end={end.toFixed(3)}
			data-motion-grid-row={row}
			data-motion-grid-start={start.toFixed(3)}
			data-motion-grid-tile=""
			style={
				{
					"--motion-grid-column": column,
					"--motion-grid-row": row,
					"--motion-grid-tile-overlap": `${GRID_TILE_SEAM_OVERLAP_PX}px`,
					clipPath,
					gridColumn: column + 1,
					gridRow: row + 1,
				} as unknown as CSSProperties
			}
		>
			<span
				className={styles.touchTileImage}
				style={{
					...tileStyle,
					height: containerHeight,
					left: `calc(${(-column * containerWidth) / columns}px + var(--motion-grid-tile-overlap))`,
					top: `calc(${(-row * containerHeight) / rows}px + var(--motion-grid-tile-overlap))`,
					width: containerWidth,
				}}
			/>
		</motion.span>
	);
}

/** A presentational mask driven exclusively by the nearest MotionSource. */
export function MotionEffectGridReveal({
	className,
	maxColumns,
	minColumns,
	placeholderStyle,
	range = [0, 1],
	targetCellAspectRatio,
	tileStyle,
	tilesVisible = true,
	...rest
}: MotionEffectGridRevealProps) {
	const { mode, progress } = useMotionEffectProgress("GridReveal", range);
	const placeholderFilter = useTransform(
		progress,
		[0, 0.28],
		["blur(28px)", "blur(16px)"],
		{ clamp: true },
	);
	const placeholderScale = useTransform(progress, [0, 1], [1.06, 1.02], {
		clamp: true,
	});
	const rootRef = useRef<HTMLDivElement | null>(null);
	const [layout, setLayout] = useState<GridLayout>({
		...DEFAULT_GRID,
		height: 0,
		width: 0,
	});
	const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
	const [isComplete, setIsComplete] = useState(
		() => mode !== "animated" || progress.get() >= 0.999,
	);

	useLayoutEffect(() => {
		if (mode !== "animated") {
			setIsComplete(true);
			return;
		}
		setIsComplete(false);
		const update = (value = progress.get()) => {
			const next = value >= 0.999;
			setIsComplete((current) => (current === next ? current : next));
		};
		const unsubscribe = progress.on("change", update);
		let active = true;
		queueMicrotask(() => {
			if (active) update();
		});
		return () => {
			active = false;
			unsubscribe();
		};
	}, [mode, progress]);

	useLayoutEffect(() => {
		const node = rootRef.current;
		if (!node) return;
		const update = () => {
			setDirection(getComputedStyle(node).direction === "rtl" ? "rtl" : "ltr");
			const next = getGridRevealDimensions(
				node.clientWidth,
				node.clientHeight,
				{ maxColumns, minColumns, targetCellAspectRatio },
			);
			setLayout((current) =>
				current.columns === next.columns &&
				current.height === node.clientHeight &&
				current.rows === next.rows &&
				current.width === node.clientWidth
					? current
					: { ...next, height: node.clientHeight, width: node.clientWidth },
			);
		};
		update();
		const observer = new ResizeObserver(update);
		observer.observe(node);
		return () => observer.disconnect();
	}, [maxColumns, minColumns, targetCellAspectRatio]);

	const tiles = useMemo(
		() =>
			Array.from({ length: layout.columns * layout.rows }, (_, index) => ({
				column: index % layout.columns,
				row: Math.floor(index / layout.columns),
			})),
		[layout.columns, layout.rows],
	);

	return (
		<div
			{...rest}
			aria-hidden="true"
			className={[styles.root, className].filter(Boolean).join(" ")}
			data-motion-effect="grid-reveal"
			data-motion-grid-columns={layout.columns}
			data-motion-grid-complete={isComplete ? "true" : "false"}
			data-motion-grid-rows={layout.rows}
			data-motion-grid-renderer="tile-clips"
			data-motion-grid-root-direction={direction}
			ref={rootRef}
			style={
				{
					"--motion-grid-columns": layout.columns,
					"--motion-grid-rows": layout.rows,
					...(rest.style ?? {}),
				} as CSSProperties
			}
		>
			{!isComplete && placeholderStyle ? (
				<motion.span
					aria-hidden="true"
					className={styles.placeholder}
					data-motion-grid-placeholder=""
					style={{
						...placeholderStyle,
						filter: placeholderFilter,
						scale: placeholderScale,
					}}
				/>
			) : null}
			{!isComplete && tilesVisible ? (
				<span aria-hidden="true" className={styles.touchTiles}>
					{tiles.map(({ column, row }) => (
						<GridClipTile
							column={column}
							columns={layout.columns}
							containerHeight={layout.height}
							containerWidth={layout.width}
							key={`${row}-${column}`}
							progress={progress}
							rootDirection={direction}
							row={row}
							rows={layout.rows}
							tileStyle={tileStyle}
						/>
					))}
				</span>
			) : null}
			{isComplete ? (
				<span
					className={styles.image}
					data-motion-grid-complete-image={isComplete ? "" : undefined}
					data-motion-grid-image=""
					style={tileStyle}
				/>
			) : null}
		</div>
	);
}
