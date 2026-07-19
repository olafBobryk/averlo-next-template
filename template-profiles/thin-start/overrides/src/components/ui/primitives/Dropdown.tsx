"use client";

import clsx from "clsx";
import * as React from "react";
import { Panel, type PanelProps } from "@/components/ui/primitives/Panel";

export type DropdownPositionStrategy = "absolute" | "fixed";

export type DropdownPanelProps = PanelProps<"div"> & {
	align?: "start" | "end";
	anchorRef?: { current: Element | null };
	offset?: number;
	portalTargetId?: string;
	positionStrategy?: DropdownPositionStrategy;
	ref?: React.Ref<HTMLDivElement>;
};

export function DropdownPanel({
	align = "start",
	anchorRef,
	className,
	offset = 8,
	positionStrategy = "absolute",
	ref,
	style,
	...props
}: DropdownPanelProps) {
	const [fixedStyle, setFixedStyle] = React.useState<React.CSSProperties>();

	React.useLayoutEffect(() => {
		if (positionStrategy !== "fixed") return;
		const update = () => {
			const anchor = anchorRef?.current;
			if (!(anchor instanceof HTMLElement)) return;
			const bounds = anchor.getBoundingClientRect();
			setFixedStyle({
				left: align === "end" ? bounds.right : bounds.left,
				top: bounds.bottom + offset,
				transform: align === "end" ? "translateX(-100%)" : undefined,
			});
		};
		update();
		window.addEventListener("resize", update);
		window.addEventListener("scroll", update, true);
		return () => {
			window.removeEventListener("resize", update);
			window.removeEventListener("scroll", update, true);
		};
	}, [align, anchorRef, offset, positionStrategy]);

	return (
		<Panel
			className={clsx(
				"dropdown-panel-enter z-50 min-w-48",
				positionStrategy === "fixed" ? "fixed" : "absolute mt-2",
				className,
			)}
			padding="none"
			ref={ref}
			shadow="lg"
			style={{ ...style, ...fixedStyle }}
			{...props}
		/>
	);
}

export type DropdownTriggerRenderProps = {
	isOpen: boolean;
	openMenu: () => void;
	closeMenu: () => void;
	toggleMenu: () => void;
};

type DropdownProps = {
	children: React.ReactNode;
	className?: string;
	menuClassName?: string;
	renderTrigger: (props: DropdownTriggerRenderProps) => React.ReactNode;
};

export function Dropdown({
	children,
	className,
	menuClassName,
	renderTrigger,
}: DropdownProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const rootRef = React.useRef<HTMLDivElement | null>(null);

	React.useEffect(() => {
		if (!isOpen) return;
		const onPointerDown = (event: PointerEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, [isOpen]);

	return (
		<div ref={rootRef} className={clsx("relative inline-block", className)}>
			{renderTrigger({
				isOpen,
				openMenu: () => setIsOpen(true),
				closeMenu: () => setIsOpen(false),
				toggleMenu: () => setIsOpen((current) => !current),
			})}
			{isOpen ? (
				<div
					className={clsx(
						"dropdown-panel-enter absolute right-0 z-50 mt-2 min-w-48 rounded-xl border border-border bg-surface p-1.5 shadow-lg",
						menuClassName,
					)}
				>
					{children}
				</div>
			) : null}
		</div>
	);
}
