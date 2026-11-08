"use client";

import {
	autoUpdate,
	flip,
	offset as offsetMiddleware,
	type Placement,
	shift,
	size,
	useFloating,
} from "@floating-ui/react-dom";
import * as React from "react";
import { MIN_ANCHORED_HEIGHT } from "./constants";
import type {
	DropdownPositionStrategy,
	DropdownPresentation,
	DropdownSide,
} from "./types";

type Options = {
	align: "start" | "end";
	/** Align the first option with the anchor row (cascading side panels). */
	alignFirstOption?: boolean;
	collisionPadding: number;
	enabled: boolean;
	offset: number;
	presentation: DropdownPresentation;
	reference: Element | null;
	/** Narrowest width the anchored panel may take before it cannot fit. */
	requiredWidth?: number;
	side: DropdownSide;
	strategy: DropdownPositionStrategy;
};

/** Content height the panel wants: its box plus anything scrolled inside it. */
function requiredHeight(floating: HTMLElement) {
	let hidden = Math.max(0, floating.scrollHeight - floating.clientHeight);
	for (const area of floating.querySelectorAll<HTMLElement>(
		'[data-scroll-area="y"]',
	)) {
		hidden += Math.max(0, area.scrollHeight - area.clientHeight);
	}
	return floating.offsetHeight + hidden;
}

/**
 * The single dropdown placement engine (floating-ui). Placement, flip, shift
 * and the height/width caps stay internal; callers keep the public
 * side/align/offset/collisionPadding/positionStrategy props.
 *
 * Caps are written as CSS variables so the anchored and sheet presentations
 * can read them without fighting over inline styles.
 */
export function useDropdownFloating({
	align,
	alignFirstOption = false,
	collisionPadding,
	enabled,
	offset,
	presentation,
	reference,
	requiredWidth = 0,
	side,
	strategy,
}: Options) {
	const [sheet, setSheet] = React.useState(presentation === "sheet");
	const [capped, setCapped] = React.useState(false);
	const sheetRef = React.useRef(sheet);
	sheetRef.current = sheet;

	const floating = useFloating({
		elements: { reference: enabled ? reference : null },
		middleware: [
			offsetMiddleware(({ elements }) => {
				if (!alignFirstOption) return offset;
				const option = elements.floating.querySelector<HTMLElement>(
					'[role="menuitem"], [role="option"]',
				);
				const inset = option
					? option.getBoundingClientRect().top -
						elements.floating.getBoundingClientRect().top
					: 0;
				return { alignmentAxis: -inset, mainAxis: offset };
			}),
			flip({
				crossAxis: "alignment",
				// A side panel with no room on either side drops below instead.
				fallbackAxisSideDirection: "end",
				padding: collisionPadding,
			}),
			shift({ padding: collisionPadding }),
			size({
				padding: collisionPadding,
				apply({ availableHeight, availableWidth, elements, placement, rects }) {
					const element = elements.floating;
					element.style.setProperty(
						"--dropdown-anchor-width",
						`${rects.reference.width}px`,
					);
					const xSide =
						placement.startsWith("left") || placement.startsWith("right");
					const viewportWidth =
						document.documentElement.clientWidth - collisionPadding * 2;
					const maxWidth = xSide ? availableWidth : viewportWidth;
					const height = Math.max(0, Math.floor(availableHeight));
					element.style.setProperty(
						"--dropdown-available-height",
						`${height}px`,
					);
					element.style.setProperty(
						"--dropdown-available-width",
						`${Math.max(0, Math.floor(maxWidth))}px`,
					);
					if (!sheetRef.current) {
						setCapped(element.scrollHeight > height + 1);
					}
					if (presentation !== "auto") return;
					const wanted = requiredHeight(element);
					// Auto docks to the bottom edge only when the anchored panel
					// cannot reach its minimum size in the space it has.
					const minimum = Math.min(MIN_ANCHORED_HEIGHT, wanted);
					setSheet(height < minimum || maxWidth < requiredWidth);
				},
			}),
		],
		open: enabled,
		placement: `${side}-${align}` as Placement,
		strategy,
		transform: false,
		whileElementsMounted: autoUpdate,
	});

	React.useEffect(() => {
		if (presentation !== "auto") setSheet(presentation === "sheet");
	}, [presentation]);

	const resolvedSide = floating.placement.split("-")[0] as DropdownSide;
	return {
		capped: capped && !sheet,
		floatingStyles: floating.floatingStyles,
		isPositioned: floating.isPositioned,
		resolvedSide,
		setFloating: floating.refs.setFloating,
		sheet,
	};
}
