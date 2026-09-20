export const GRID_REVEAL_STAGGER_SPAN = 0.7;
export const GRID_REVEAL_WINDOW = 0.3;

export type GridRevealDirection = "ltr" | "rtl";

export function getGridRevealCellTiming({
	column,
	columns,
	rootDirection,
	row,
}: {
	column: number;
	columns: number;
	rootDirection: GridRevealDirection;
	row: number;
}) {
	const ltrDirection: GridRevealDirection = row % 2 === 0 ? "ltr" : "rtl";
	const direction =
		rootDirection === "rtl"
			? ltrDirection === "ltr"
				? "rtl"
				: "ltr"
			: ltrDirection;
	const orderedColumn = direction === "ltr" ? column : columns - column - 1;
	const start =
		(orderedColumn / Math.max(1, columns - 1)) * GRID_REVEAL_STAGGER_SPAN;
	const end = Math.min(1, start + GRID_REVEAL_WINDOW);

	return { direction, end, start };
}

export function getGridRevealCellProgress(
	progress: number,
	start: number,
	end: number,
) {
	if (progress <= start) return 0;
	if (progress >= end) return 1;
	return (progress - start) / Math.max(Number.EPSILON, end - start);
}
