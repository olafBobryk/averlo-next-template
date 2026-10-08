"use client";

import clsx from "clsx";
import * as React from "react";
import Portal from "@/components/ui/overlays/Portal";
import {
	dropdownChromeClassName,
	dropdownElevationClassName,
} from "../dropdownStyles";
import { Float } from "../surfaces";
import { COLLISION_PADDING } from "./constants";
import { resolveAnchoredDropdownPosition } from "./positioning";
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
	className,
	collisionPadding = COLLISION_PADDING,
	matchAnchorWidth = false,
	offset = 8,
	overflow = "hidden",
	padding = "none",
	portalTargetId,
	positionStrategy = "absolute",
	ref,
	elevation = "float",
	side = "bottom",
	style,
	width = "auto",
	zIndex = 110,
	...props
}: DropdownSurfaceProps) {
	const panelRef = React.useRef<HTMLDivElement | null>(null);
	const [mountedPanelNode, setMountedPanelNode] =
		React.useState<HTMLDivElement | null>(null);
	const [positionStyle, setPositionStyle] =
		React.useState<React.CSSProperties>();

	const setPanelNode = React.useCallback((node: HTMLDivElement | null) => {
		panelRef.current = node;
		setMountedPanelNode(node);
	}, []);

	// A cascade can pass a new registration callback on each render. Forward it
	// separately so that ref changes never detach and remeasure the panel.
	React.useLayoutEffect(() => {
		assignRef(ref, mountedPanelNode);
		return () => assignRef(ref, null);
	}, [ref, mountedPanelNode]);

	const calculateFixedPosition = React.useCallback(() => {
		const anchor = anchorRef?.current;
		const panel = panelRef.current;
		if (!(anchor instanceof HTMLElement) || !panel) return;

		const anchorRect = anchor.getBoundingClientRect();
		const panelRect = panel.getBoundingClientRect();
		const firstOption = panel.querySelector<HTMLElement>(
			'[role="menuitem"], [role="option"]',
		);
		const contentInset = firstOption
			? firstOption.getBoundingClientRect().top - panelRect.top
			: 0;
		const alignedAnchorRect =
			side === "left" || side === "right"
				? new DOMRect(
						anchorRect.x,
						anchorRect.y - contentInset,
						anchorRect.width,
						anchorRect.height + contentInset * 2,
					)
				: anchorRect;
		const explicitWidth = matchAnchorWidth ? anchorRect.width : undefined;
		const measuredWidth = explicitWidth ?? panelRect.width;
		const measuredHeight = panel.scrollHeight || panelRect.height;
		const position = resolveAnchoredDropdownPosition({
			align,
			anchorRect: alignedAnchorRect,
			collisionPadding,
			explicitWidth,
			measuredHeight,
			measuredWidth,
			minWidth: explicitWidth,
			offset,
			positionStrategy: "fixed",
			side,
			zIndex,
		});
		setPositionStyle(position?.style);
	}, [
		align,
		anchorRef,
		collisionPadding,
		matchAnchorWidth,
		offset,
		side,
		zIndex,
	]);

	React.useLayoutEffect(() => {
		if (positionStrategy !== "fixed") {
			setPositionStyle(undefined);
			return;
		}
		if (mountedPanelNode) calculateFixedPosition();
	}, [calculateFixedPosition, mountedPanelNode, positionStrategy]);

	React.useEffect(() => {
		if (positionStrategy !== "fixed") return;
		const handleViewportChange = () => calculateFixedPosition();
		window.addEventListener("resize", handleViewportChange);
		window.addEventListener("scroll", handleViewportChange, true);
		return () => {
			window.removeEventListener("resize", handleViewportChange);
			window.removeEventListener("scroll", handleViewportChange, true);
		};
	}, [calculateFixedPosition, positionStrategy]);

	const resolvedStyle =
		positionStrategy === "fixed"
			? ({
					...style,
					left: 0,
					position: "fixed",
					top: 0,
					visibility: positionStyle
						? (style?.visibility ?? "visible")
						: "hidden",
					zIndex,
					...positionStyle,
				} satisfies React.CSSProperties)
			: style;
	const panel = (
		<Float
			className={clsx(
				"dropdown-panel-enter z-50 min-w-48",
				dropdownChromeClassName,
				elevation === "float" && dropdownElevationClassName,
				positionStrategy === "fixed" ? "fixed" : "absolute mt-2",
				className,
			)}
			padding={padding}
			overflow={overflow}
			ref={setPanelNode}
			elevation={elevation}
			style={resolvedStyle}
			width={width}
			{...props}
			onAnimationEnd={(event) => {
				if (positionStrategy === "fixed") calculateFixedPosition();
				props.onAnimationEnd?.(event);
			}}
		/>
	);

	return positionStrategy === "fixed" ? (
		<Portal target={portalTargetId}>{panel}</Portal>
	) : (
		panel
	);
}
