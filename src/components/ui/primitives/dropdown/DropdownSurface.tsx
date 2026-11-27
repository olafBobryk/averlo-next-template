"use client";

import clsx from "clsx";
import * as React from "react";
import { ScrollArea } from "@/components/ui/misc/ScrollArea";
import Portal from "@/components/ui/overlays/Portal";
import {
	dropdownChromeClassName,
	dropdownElevationClassName,
} from "../dropdownStyles";
import { Float } from "../surfaces";
import { COLLISION_PADDING } from "./constants";
import { useDropdownFloating } from "./positioning";
import { dropdownSheetClassName } from "./sheet";
import type { DropdownSurfaceProps } from "./types";

function assignRef<T>(ref: React.Ref<T> | undefined, value: T) {
	if (!ref) return;
	if (typeof ref === "function") {
		ref(value);
		return;
	}
	ref.current = value;
}

export function DropdownSurface({
	align = "start",
	anchorRef,
	children,
	className,
	collisionPadding = COLLISION_PADDING,
	display = "flex",
	matchAnchorWidth = false,
	offset = 8,
	overflow = "hidden",
	padding = "none",
	portalTargetId,
	positionStrategy = "absolute",
	presentation = "auto",
	ref,
	elevation = "float",
	side = "bottom",
	style,
	width = "auto",
	zIndex = 110,
	...props
}: DropdownSurfaceProps) {
	const [mountedPanelNode, setMountedPanelNode] =
		React.useState<HTMLDivElement | null>(null);
	const fixed = positionStrategy === "fixed";
	const [anchor, setAnchor] = React.useState<Element | null>(null);
	// The anchor ref is read after commit; setState bails when it is unchanged.
	React.useLayoutEffect(() => {
		setAnchor(anchorRef?.current ?? null);
	});
	const floating = useDropdownFloating({
		align,
		alignFirstOption: side === "left" || side === "right",
		collisionPadding,
		enabled: fixed,
		offset,
		presentation,
		reference: anchor,
		side,
		strategy: "fixed",
	});
	const { setFloating, sheet } = floating;

	const setPanelNode = React.useCallback(
		(node: HTMLDivElement | null) => {
			setMountedPanelNode(node);
			setFloating(node);
		},
		[setFloating],
	);

	// A cascade can pass a new registration callback on each render. Forward it
	// separately so that ref changes never detach and remeasure the panel.
	React.useLayoutEffect(() => {
		assignRef(ref, mountedPanelNode);
		return () => assignRef(ref, null);
	}, [ref, mountedPanelNode]);

	const resolvedStyle: React.CSSProperties | undefined = !fixed
		? style
		: sheet
			? { ...style, position: "fixed", zIndex }
			: {
					...style,
					...floating.floatingStyles,
					maxHeight: "var(--dropdown-available-height)",
					maxWidth: "var(--dropdown-available-width)",
					minWidth: matchAnchorWidth
						? "var(--dropdown-anchor-width)"
						: undefined,
					visibility: floating.isPositioned
						? (style?.visibility ?? "visible")
						: "hidden",
					width: matchAnchorWidth ? "var(--dropdown-anchor-width)" : undefined,
					zIndex,
				};
	const panel = (
		<Float
			className={clsx(
				"dropdown-panel-enter z-50 min-w-48",
				dropdownChromeClassName,
				elevation === "float" && dropdownElevationClassName,
				fixed ? "fixed" : "absolute mt-2",
				className,
				sheet && fixed && dropdownSheetClassName,
			)}
			data-dropdown-presentation={
				fixed ? (sheet ? "sheet" : "anchored") : undefined
			}
			display={display}
			padding={padding}
			overflow={overflow}
			ref={setPanelNode}
			elevation={elevation}
			style={resolvedStyle}
			width={width}
			{...props}
		>
			{/* The panel stays fixed; capped content scrolls inside it (FR-005,
			    scroll S8). A pass-through panel (`overflow="visible"`) lets its
			    content's own surface and shadow show until the content is capped. */}
			<ScrollArea
				edge={0}
				className={clsx(
					"flex flex-col",
					overflow === "visible" &&
						!floating.capped &&
						!sheet &&
						"overflow-visible!",
				)}
			>
				{children}
			</ScrollArea>
		</Float>
	);

	return fixed ? <Portal target={portalTargetId}>{panel}</Portal> : panel;
}
