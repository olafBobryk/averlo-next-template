// components/ui/Dropdown.tsx
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: trigger interaction is delegated through render props and nested controls */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: trigger wrapper behavior is delegated through render props and nested controls */
"use client";

import {
	ArrowSquareOut,
	CaretDown,
	DotsThreeVertical,
	PencilSimpleIcon,
	Trash,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { resolveMotionTransition } from "@/components/ui/foundations/motionTiming";
import Portal from "@/components/ui/overlays/Portal";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { Button, type ButtonBaseProps } from "./Button";
import { dropdownSurfaceClassName } from "./dropdownStyles";
import { Listbox, type ListboxOption } from "./Listbox";
import { Panel, type PanelProps } from "./Panel";

export type DropdownTriggerRenderProps = {
	ref: React.Ref<HTMLElement>;
	isOpen: boolean;
	isPinned: boolean;
	className?: string;

	// root mouse events (for hover open/close)
	onRootMouseEnter: () => void;
	onRootMouseLeave: () => void;

	// click handlers (already wired to pin/open behavior)
	onLeftClick?: (e: React.MouseEvent) => void;
	onRightClick: (e: React.MouseEvent) => void;

	// programmatic controls
	openMenu: (options?: { focusMenu?: boolean; pin?: boolean }) => void;
	closeMenu: (options?: { restoreFocus?: boolean }) => void;

	// built-in chevron icon you can use anywhere in the trigger
	chevronIcon: React.ReactNode;
};

export type DropdownProps = {
	renderTrigger: (props: DropdownTriggerRenderProps) => React.ReactNode;
	renderMenu: (helpers: {
		close: (options?: { restoreFocus?: boolean }) => void;
	}) => React.ReactNode;
	/**
	 * Optional handler for the "left" part of the trigger (e.g. your label).
	 * Behavior is the same as before: clicking left side pins + opens, then calls onLeftClick.
	 */
	onLeftClick?: () => void;
	className?: string;
	collisionPadding?: number;
	menuClassName?: string;
	portalTargetId?: string;
	menuWidth?: number | "trigger";
	menuMinWidth?: number;
	align?: "start" | "end";
	side?: "top" | "bottom";
	offset?: number;
	positionStrategy?: "fixed" | "absolute";
	disabled?: boolean;
	open?: boolean;
	openOnHover?: boolean;
	pinOnClick?: boolean;
	disableWhenReducedMotion?: boolean;
	autoFocusMenu?: boolean;
	onOpenChange?: (open: boolean) => void;
};

type DropdownSide = NonNullable<DropdownProps["side"]>;
export type DropdownPositionStrategy = "absolute" | "fixed";
type DropdownAnchorRef = { current: Element | null };

export type DropdownSurfaceProps = PanelProps<"div"> & {
	align?: "start" | "end";
	anchorRef?: DropdownAnchorRef;
	collisionPadding?: number;
	matchAnchorWidth?: boolean;
	offset?: number;
	portalTargetId?: string;
	positionStrategy?: DropdownPositionStrategy;
	ref?: React.Ref<HTMLDivElement>;
	side?: DropdownSide;
};

const DEFAULT_CHEVRON_ICON = ({ isOpen }: { isOpen: boolean }) => {
	return (
		<CaretDown
			aria-hidden
			data-is-open={isOpen}
			className="data-[is-open=true]:rotate-180 transition-transform motion-micro"
			size={15}
		/>
	);
};

const DEFAULT_MENU_MIN_WIDTH = 220;
const COLLISION_PADDING = 16;

function resolveDropdownSide({
	preferredSide,
	measuredHeight,
	availableAbove,
	availableBelow,
}: {
	preferredSide: DropdownSide;
	measuredHeight: number;
	availableAbove: number;
	availableBelow: number;
}): DropdownSide {
	const preferredAvailable =
		preferredSide === "top" ? availableAbove : availableBelow;
	const oppositeSide = preferredSide === "top" ? "bottom" : "top";
	const oppositeAvailable =
		oppositeSide === "top" ? availableAbove : availableBelow;

	if (measuredHeight <= preferredAvailable) return preferredSide;
	if (oppositeAvailable > preferredAvailable) return oppositeSide;
	return preferredSide;
}

function resolveAnchoredDropdownPosition({
	align,
	anchorRect,
	collisionPadding,
	explicitWidth,
	measuredHeight,
	measuredWidth,
	minWidth,
	offset,
	positionStrategy,
	side,
	wrapperRect,
	zIndex,
}: {
	align: "start" | "end";
	anchorRect: DOMRect;
	collisionPadding: number;
	explicitWidth?: number;
	measuredHeight: number;
	measuredWidth: number;
	minWidth?: number;
	offset: number;
	positionStrategy: DropdownPositionStrategy;
	side: DropdownSide;
	wrapperRect?: DOMRect;
	zIndex: number;
}) {
	const availableAbove = Math.max(
		0,
		anchorRect.top - offset - collisionPadding,
	);
	const availableBelow = Math.max(
		0,
		window.innerHeight - anchorRect.bottom - offset - collisionPadding,
	);
	const resolvedSide = resolveDropdownSide({
		availableAbove,
		availableBelow,
		measuredHeight,
		preferredSide: side,
	});
	const availableHeight =
		resolvedSide === "top" ? availableAbove : availableBelow;
	const maxHeight =
		measuredHeight > availableHeight ? availableHeight : undefined;
	const renderedHeight = maxHeight ?? measuredHeight;

	if (positionStrategy === "fixed") {
		let left =
			align === "end" ? anchorRect.right - measuredWidth : anchorRect.left;
		const maxLeft = Math.max(
			collisionPadding,
			window.innerWidth - measuredWidth - collisionPadding,
		);
		left = Math.min(Math.max(left, collisionPadding), maxLeft);
		const top =
			resolvedSide === "top"
				? Math.max(collisionPadding, anchorRect.top - renderedHeight - offset)
				: Math.max(
						collisionPadding,
						Math.min(
							anchorRect.bottom + offset,
							window.innerHeight - collisionPadding - renderedHeight,
						),
					);
		return {
			resolvedSide,
			style: {
				left,
				maxHeight,
				minWidth,
				overflowY: maxHeight === undefined ? undefined : "auto",
				position: "fixed",
				top,
				width: explicitWidth,
				zIndex,
			} satisfies React.CSSProperties,
		};
	}

	if (!wrapperRect) return undefined;
	const rawLeft =
		align === "end"
			? anchorRect.right - wrapperRect.left - measuredWidth
			: anchorRect.left - wrapperRect.left;
	const left = Math.max(
		0,
		Math.min(rawLeft, Math.max(0, wrapperRect.width - measuredWidth)),
	);
	return {
		resolvedSide,
		style: {
			bottom:
				resolvedSide === "top"
					? Math.max(0, wrapperRect.bottom - anchorRect.top + offset)
					: undefined,
			left,
			maxHeight,
			minWidth,
			overflowY: maxHeight === undefined ? undefined : "auto",
			position: "absolute",
			top:
				resolvedSide === "top"
					? undefined
					: anchorRect.bottom - wrapperRect.top + offset,
			width: explicitWidth,
			zIndex,
		} satisfies React.CSSProperties,
	};
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T) {
	if (!ref) return;
	if (typeof ref === "function") {
		ref(value);
		return;
	}
	ref.current = value;
}

function DropdownSurface({
	align = "start",
	anchorRef,
	className,
	collisionPadding = COLLISION_PADDING,
	matchAnchorWidth = false,
	offset = 8,
	padding = "none",
	portalTargetId,
	positionStrategy = "absolute",
	ref,
	shadow = "lg",
	side = "bottom",
	style,
	width = "auto",
	...props
}: DropdownSurfaceProps) {
	const panelRef = React.useRef<HTMLDivElement | null>(null);
	const [mountedPanelNode, setMountedPanelNode] =
		React.useState<HTMLDivElement | null>(null);
	const [positionStyle, setPositionStyle] =
		React.useState<React.CSSProperties>();

	const setPanelNode = React.useCallback(
		(node: HTMLDivElement | null) => {
			panelRef.current = node;
			setMountedPanelNode(node);
			assignRef(ref, node);
		},
		[ref],
	);

	const calculateFixedPosition = React.useCallback(() => {
		const anchor = anchorRef?.current;
		const panel = panelRef.current;
		if (!(anchor instanceof HTMLElement) || !panel) return;

		const anchorRect = anchor.getBoundingClientRect();
		const panelRect = panel.getBoundingClientRect();
		const explicitWidth = matchAnchorWidth ? anchorRect.width : undefined;
		const measuredWidth = explicitWidth ?? panelRect.width;
		const measuredHeight = panel.scrollHeight || panelRect.height;
		const position = resolveAnchoredDropdownPosition({
			align,
			anchorRect,
			collisionPadding,
			explicitWidth,
			measuredHeight,
			measuredWidth,
			minWidth: explicitWidth,
			offset,
			positionStrategy: "fixed",
			side,
			zIndex: 110,
		});
		setPositionStyle(position?.style);
	}, [align, anchorRef, collisionPadding, matchAnchorWidth, offset, side]);

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
					zIndex: 110,
					...positionStyle,
				} satisfies React.CSSProperties)
			: style;
	const panel = (
		<Panel
			background="card"
			className={clsx(
				dropdownSurfaceClassName,
				"dropdown-panel-enter z-50 min-w-48",
				positionStrategy === "fixed" ? "fixed" : "absolute mt-2",
				className,
			)}
			padding={padding}
			ref={setPanelNode}
			shadow={shadow}
			style={resolvedStyle}
			width={width}
			{...props}
		/>
	);

	return positionStrategy === "fixed" ? (
		<Portal target={portalTargetId}>{panel}</Portal>
	) : (
		panel
	);
}

function DropdownRoot({
	renderTrigger,
	renderMenu,
	onLeftClick,
	className,
	collisionPadding = COLLISION_PADDING,
	menuClassName,
	portalTargetId,
	menuWidth,
	menuMinWidth = DEFAULT_MENU_MIN_WIDTH,
	align = "end",
	side = "bottom",
	offset = 8,
	positionStrategy = "absolute",
	disabled,
	open,
	openOnHover = true,
	pinOnClick = openOnHover,
	disableWhenReducedMotion = true,
	autoFocusMenu = true,
	onOpenChange,
}: DropdownProps) {
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
	const [isPinned, setIsPinned] = React.useState(false);
	const wrapperRef = React.useRef<HTMLDivElement | null>(null);
	const rootRef = React.useRef<HTMLElement | null>(null);
	const menuRef = React.useRef<HTMLDivElement | null>(null);
	const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>();
	const [resolvedSide, setResolvedSide] = React.useState<DropdownSide>(side);
	const hoverTimeoutRef = React.useRef<number | null>(null);
	const lastOpenMethodRef = React.useRef<"keyboard" | "pointer" | null>(null);
	const isOpenControlled = open !== undefined;
	const isOpen = open ?? uncontrolledOpen;

	const setOpenState = React.useCallback(
		(next: boolean) => {
			if (!isOpenControlled) {
				setUncontrolledOpen(next);
			}
			onOpenChange?.(next);
		},
		[isOpenControlled, onOpenChange],
	);

	React.useEffect(() => {
		if (!isOpen && isPinned) {
			setIsPinned(false);
		}
	}, [isOpen, isPinned]);

	const focusableSelector =
		'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';

	const isFocusableElement = React.useCallback((element: HTMLElement) => {
		if (!element.matches(focusableSelector)) return false;
		const style = window.getComputedStyle(element);
		const isDisabled =
			(element as HTMLButtonElement).disabled ||
			element.getAttribute("aria-disabled") === "true";
		return (
			style.visibility !== "hidden" && style.display !== "none" && !isDisabled
		);
	}, []);

	const getFocusableElements = React.useCallback(() => {
		return Array.from(
			document.querySelectorAll<HTMLElement>(focusableSelector),
		).filter((element) => {
			const style = window.getComputedStyle(element);
			const isDisabled =
				(element as HTMLButtonElement).disabled ||
				element.getAttribute("aria-disabled") === "true";
			return (
				style.visibility !== "hidden" && style.display !== "none" && !isDisabled
			);
		});
	}, []);

	const getTriggerFocusable = React.useCallback(() => {
		if (!rootRef.current) return null;
		if (isFocusableElement(rootRef.current)) return rootRef.current;
		return rootRef.current.querySelector<HTMLElement>(focusableSelector);
	}, [isFocusableElement]);

	const focusTrigger = React.useCallback(
		(options?: { preventScroll?: boolean }) => {
			const focusTarget = getTriggerFocusable();
			focusTarget?.focus({ preventScroll: options?.preventScroll });
		},
		[getTriggerFocusable],
	);

	const getMenuFocusableElements = React.useCallback(() => {
		if (!menuRef.current) return [];
		return Array.from(
			menuRef.current.querySelectorAll<HTMLElement>(
				'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
			),
		).filter((element) => {
			const style = window.getComputedStyle(element);
			const isDisabled =
				(element as HTMLButtonElement).disabled ||
				element.getAttribute("aria-disabled") === "true";
			return (
				style.visibility !== "hidden" && style.display !== "none" && !isDisabled
			);
		});
	}, []);

	const focusRelativeToTrigger = React.useCallback(
		(direction: "next" | "prev") => {
			const focusables = getFocusableElements();
			const triggerFocusable = getTriggerFocusable();
			if (!triggerFocusable) return;
			const triggerIndex = focusables.indexOf(triggerFocusable);
			if (triggerIndex === -1) return;
			const nextIndex =
				direction === "next" ? triggerIndex + 1 : triggerIndex - 1;
			const nextTarget = focusables[nextIndex];
			nextTarget?.focus({ preventScroll: true });
		},
		[getFocusableElements, getTriggerFocusable],
	);

	const clearHoverTimeout = React.useCallback(() => {
		if (hoverTimeoutRef.current != null) {
			window.clearTimeout(hoverTimeoutRef.current);
			hoverTimeoutRef.current = null;
		}
	}, []);

	const scheduleClose = React.useCallback(() => {
		clearHoverTimeout();
		hoverTimeoutRef.current = window.setTimeout(() => {
			if (!isPinned) {
				setOpenState(false);
			}
		}, 120);
	}, [clearHoverTimeout, isPinned, setOpenState]);

	const openMenu = React.useCallback(
		(options?: { focusMenu?: boolean; pin?: boolean }) => {
			if (disabled) return;
			lastOpenMethodRef.current = options?.focusMenu ? "keyboard" : "pointer";
			setOpenState(true);
			if (typeof options?.pin === "boolean") {
				setIsPinned(options.pin);
			}
		},
		[disabled, setOpenState],
	);

	const closeMenu = React.useCallback(
		(options?: { restoreFocus?: boolean }) => {
			const restoreFocus = options?.restoreFocus ?? true;
			clearHoverTimeout();
			setOpenState(false);
			setIsPinned(false);
			if (restoreFocus) {
				focusTrigger({ preventScroll: true });
			}
		},
		[clearHoverTimeout, focusTrigger, setOpenState],
	);

	const handleRootMouseEnter = () => {
		if (!openOnHover || disabled) return;
		clearHoverTimeout();
		if (!isPinned) openMenu();
	};

	const handleRootMouseLeave = () => {
		if (!openOnHover || disabled) return;
		if (!isPinned) scheduleClose();
	};

	const handleLeftClick = (event: React.MouseEvent) => {
		event.stopPropagation();
		if (disabled) return;
		lastOpenMethodRef.current = event.detail === 0 ? "keyboard" : "pointer";
		setIsPinned(true);
		setOpenState(true);
		onLeftClick?.();
	};

	const handleRightClick = (event: React.MouseEvent) => {
		event.stopPropagation();
		if (disabled) return;
		lastOpenMethodRef.current = event.detail === 0 ? "keyboard" : "pointer";

		if (openOnHover && pinOnClick) {
			setIsPinned((prev) => {
				const next = !prev;
				setOpenState(next);
				return next;
			});
			return;
		}

		setIsPinned(false);
		setOpenState(!isOpen);
	};

	const calculateMenuPosition = React.useCallback(() => {
		if (!rootRef.current) return;

		const rect = rootRef.current.getBoundingClientRect();
		const explicitWidth = menuWidth === "trigger" ? rect.width : menuWidth;
		const resolvedMinWidth =
			explicitWidth ?? (menuWidth === "trigger" ? rect.width : menuMinWidth);
		const measuredWidth =
			explicitWidth ??
			menuRef.current?.getBoundingClientRect().width ??
			resolvedMinWidth;
		const measuredHeight =
			menuRef.current?.scrollHeight ??
			menuRef.current?.getBoundingClientRect().height ??
			0;
		const position = resolveAnchoredDropdownPosition({
			align,
			anchorRect: rect,
			collisionPadding,
			explicitWidth,
			measuredHeight,
			measuredWidth,
			minWidth: resolvedMinWidth,
			offset,
			positionStrategy,
			side,
			wrapperRect: wrapperRef.current?.getBoundingClientRect(),
			zIndex: 90,
		});
		if (!position) return;
		setResolvedSide(position.resolvedSide);
		setMenuStyle(position.style);
	}, [
		align,
		collisionPadding,
		menuMinWidth,
		menuWidth,
		offset,
		positionStrategy,
		side,
	]);

	React.useEffect(() => {
		if (isOpen) {
			calculateMenuPosition();
		} else {
			setMenuStyle(undefined);
			setResolvedSide(side);
		}
	}, [isOpen, calculateMenuPosition, side]);

	React.useEffect(() => {
		if (!isOpen) return;
		if (
			autoFocusMenu &&
			menuRef.current &&
			lastOpenMethodRef.current === "keyboard"
		) {
			const focusTarget = menuRef.current.querySelector<HTMLElement>(
				'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
			);
			focusTarget?.focus({ preventScroll: true });
		}
		const handleResize = () => calculateMenuPosition();
		window.addEventListener("resize", handleResize);
		if (positionStrategy === "fixed") {
			window.addEventListener("scroll", handleResize, true);
		}
		return () => {
			window.removeEventListener("resize", handleResize);
			if (positionStrategy === "fixed") {
				window.removeEventListener("scroll", handleResize, true);
			}
		};
	}, [isOpen, calculateMenuPosition, autoFocusMenu, positionStrategy]);

	React.useEffect(() => {
		if (!isOpen && !isPinned) return;
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				rootRef.current &&
				!rootRef.current.contains(target) &&
				menuRef.current &&
				!menuRef.current.contains(target)
			) {
				closeMenu({ restoreFocus: false });
			}
		};
		const handleFocusOutside = (event: FocusEvent) => {
			const target = event.target as Node;
			if (
				rootRef.current &&
				!rootRef.current.contains(target) &&
				menuRef.current &&
				!menuRef.current.contains(target)
			) {
				closeMenu({ restoreFocus: false });
			}
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				closeMenu({ restoreFocus: true });
				return;
			}
			if (event.key !== "Tab" || !menuRef.current) return;
			const active = document.activeElement as HTMLElement | null;
			if (!active || !menuRef.current.contains(active)) return;

			const menuFocusables = getMenuFocusableElements();
			if (menuFocusables.length === 0) return;
			const first = menuFocusables[0];
			const last = menuFocusables[menuFocusables.length - 1];

			if (event.shiftKey && active === first) {
				event.preventDefault();
				closeMenu({ restoreFocus: false });
				focusRelativeToTrigger("prev");
			} else if (!event.shiftKey && active === last) {
				event.preventDefault();
				closeMenu({ restoreFocus: false });
				focusRelativeToTrigger("next");
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("focusin", handleFocusOutside);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("focusin", handleFocusOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [
		closeMenu,
		isOpen,
		isPinned,
		getMenuFocusableElements,
		focusRelativeToTrigger,
	]);

	const setMenuNode = React.useCallback(
		(node: HTMLDivElement | null) => {
			menuRef.current = node;
			if (node && isOpen) {
				calculateMenuPosition();
			}
		},
		[isOpen, calculateMenuPosition],
	);

	const baseMenuClassName = [
		dropdownSurfaceClassName,
		"w-fit z-[91]",
		positionStrategy === "fixed" ? "fixed" : "absolute",
	]
		.filter(Boolean)
		.join(" ");
	const resolvedMenuClassName = [baseMenuClassName, menuClassName]
		.filter(Boolean)
		.join(" ");
	const menuMotionY = resolvedSide === "top" ? 6 : -6;
	const menuNode = motionAllowed ? (
		<AnimatePresence>
			{isOpen ? (
				<motion.div
					ref={setMenuNode}
					key="dropdown-menu"
					initial={{ opacity: 0, y: menuMotionY }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: menuMotionY }}
					transition={resolveMotionTransition("disclosure")}
					style={menuStyle}
					className={resolvedMenuClassName}
					onMouseEnter={clearHoverTimeout}
					onMouseLeave={() => {
						if (!isPinned && openOnHover) scheduleClose();
					}}
				>
					{renderMenu({ close: closeMenu })}
				</motion.div>
			) : null}
		</AnimatePresence>
	) : isOpen ? (
		<div
			ref={setMenuNode}
			key="dropdown-menu"
			style={menuStyle}
			className={resolvedMenuClassName}
			onMouseEnter={clearHoverTimeout}
			onMouseLeave={() => {
				if (!isPinned && openOnHover) scheduleClose();
			}}
		>
			{renderMenu({ close: closeMenu })}
		</div>
	) : null;

	return (
		<div
			ref={wrapperRef}
			className={
				positionStrategy === "absolute" ? "relative max-w-full" : undefined
			}
		>
			{renderTrigger({
				ref: rootRef,
				isOpen,
				isPinned,
				className,
				onRootMouseEnter: handleRootMouseEnter,
				onRootMouseLeave: handleRootMouseLeave,
				onLeftClick: onLeftClick ? handleLeftClick : undefined,
				onRightClick: handleRightClick,
				openMenu,
				closeMenu,
				chevronIcon: <DEFAULT_CHEVRON_ICON isOpen={isOpen} />,
			})}

			{positionStrategy === "fixed" ? (
				<Portal target={portalTargetId}>{menuNode}</Portal>
			) : (
				menuNode
			)}
		</div>
	);
}

type DropdownMenuEvent =
	| React.MouseEvent<HTMLElement>
	| React.KeyboardEvent<HTMLElement>;

type DropdownIcon = Exclude<React.ReactNode, string | number>;

export type DropdownMenuOption = {
	active?: boolean;
	className?: string;
	disabled?: boolean;
	dividerAfter?: boolean;
	dividerBefore?: boolean;
	href?: string;
	id?: string;
	label: React.ReactNode;
	layout?: "default" | "presentation";
	leadingIcon?: DropdownIcon;
	onSelect?: (event: DropdownMenuEvent) => void;
	textClassName?: string;
	tone?: "danger" | "default";
	trailingIcon?: DropdownIcon;
};

type DropdownTriggerButtonProps = Omit<ButtonBaseProps, "children" | "href"> &
	Omit<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		"children" | "onClick" | "onKeyDown" | "onMouseEnter" | "onMouseLeave"
	>;

type DropdownCompoundProps = Pick<
	DropdownProps,
	| "align"
	| "collisionPadding"
	| "menuClassName"
	| "menuMinWidth"
	| "menuWidth"
	| "offset"
	| "openOnHover"
	| "pinOnClick"
	| "portalTargetId"
	| "positionStrategy"
	| "side"
> & {
	ariaLabel: string;
	disabled?: boolean;
	listClassName?: string;
	menuContentClassName?: string;
	onOpenChange?: (open: boolean) => void;
	optionActiveClassName?: string;
	optionClassName?: string;
	triggerButtonProps?: DropdownTriggerButtonProps;
	triggerContent?: React.ReactNode;
};

export type DropdownMenuProps = DropdownCompoundProps & {
	options: DropdownMenuOption[];
};

export type DropdownListboxProps<T> = DropdownCompoundProps & {
	emptyState?: React.ReactNode;
	onSelect: (
		value: T,
		option: ListboxOption<T>,
		event: DropdownMenuEvent,
	) => void;
	options: ListboxOption<T>[];
};

export type DropdownNavigableOption = {
	disabled?: boolean;
	selected?: boolean;
};

export function useDropdownListNavigation({
	isOpen,
	options,
}: {
	isOpen: boolean;
	options: readonly DropdownNavigableOption[];
}) {
	const [activeIndex, setActiveIndex] = React.useState(-1);
	const listRef = React.useRef<HTMLDivElement | null>(null);
	const focusOnOpenRef = React.useRef(false);
	const pendingOpenIndexRef = React.useRef<number | null>(null);
	const selectedIndex = options.findIndex(
		(option) => option.selected && !option.disabled,
	);
	const enabledIndices = React.useMemo(
		() =>
			options
				.map((option, index) => ({ index, option }))
				.filter(({ option }) => !option.disabled)
				.map(({ index }) => index),
		[options],
	);
	const getBoundaryIndex = React.useCallback(
		(boundary: "first" | "last") =>
			boundary === "first"
				? (enabledIndices[0] ?? -1)
				: (enabledIndices.at(-1) ?? -1),
		[enabledIndices],
	);
	const getNextIndex = React.useCallback(
		(current: number, direction: 1 | -1) => {
			if (enabledIndices.length === 0) return -1;
			const currentPosition = enabledIndices.indexOf(current);
			const nextPosition =
				currentPosition === -1
					? direction === 1
						? 0
						: enabledIndices.length - 1
					: (currentPosition + direction + enabledIndices.length) %
						enabledIndices.length;
			return enabledIndices[nextPosition] ?? enabledIndices[0] ?? -1;
		},
		[enabledIndices],
	);
	const prepareKeyboardOpen = React.useCallback(
		(direction?: 1 | -1) => {
			pendingOpenIndexRef.current = direction
				? getBoundaryIndex(direction === 1 ? "first" : "last")
				: selectedIndex >= 0
					? selectedIndex
					: getBoundaryIndex("first");
			focusOnOpenRef.current = true;
		},
		[getBoundaryIndex, selectedIndex],
	);
	const preparePointerOpen = React.useCallback(() => {
		focusOnOpenRef.current = false;
		pendingOpenIndexRef.current = null;
		setActiveIndex(-1);
	}, []);

	React.useEffect(() => {
		if (!isOpen) {
			focusOnOpenRef.current = false;
			pendingOpenIndexRef.current = null;
			setActiveIndex(-1);
			return;
		}
		const nextIndex = pendingOpenIndexRef.current ?? -1;
		pendingOpenIndexRef.current = null;
		setActiveIndex(nextIndex);
		if (!focusOnOpenRef.current) return;
		window.requestAnimationFrame(() => {
			listRef.current?.focus({ preventScroll: true });
			focusOnOpenRef.current = false;
		});
	}, [isOpen]);

	React.useEffect(() => {
		if (!isOpen || activeIndex < 0) return;
		listRef.current
			?.querySelector<HTMLElement>(`[data-option-index="${activeIndex}"]`)
			?.scrollIntoView({ block: "nearest" });
	}, [activeIndex, isOpen]);

	React.useEffect(() => {
		if (!isOpen || activeIndex < 0 || enabledIndices.includes(activeIndex))
			return;
		setActiveIndex(getBoundaryIndex("first"));
	}, [activeIndex, enabledIndices, getBoundaryIndex, isOpen]);

	return {
		activeIndex,
		getBoundaryIndex,
		getNextIndex,
		listRef,
		prepareKeyboardOpen,
		preparePointerOpen,
		setActiveIndex,
	};
}

function renderDropdownIcon(icon?: DropdownIcon) {
	return icon ?? null;
}

function normalizeMenuOptions(options: DropdownMenuOption[]) {
	const defaultOptions = options.filter((option) => option.tone !== "danger");
	const dangerOptions = options.filter((option) => option.tone === "danger");
	return [
		...defaultOptions,
		...dangerOptions.map((option, index) => ({
			...option,
			dividerBefore:
				index === 0 && defaultOptions.length > 0 ? true : option.dividerBefore,
		})),
	];
}

function DropdownMenu({
	align = "start",
	ariaLabel = "More options",
	collisionPadding,
	disabled,
	listClassName,
	menuClassName,
	menuContentClassName,
	menuMinWidth = DEFAULT_MENU_MIN_WIDTH,
	menuWidth,
	offset,
	onOpenChange,
	openOnHover = true,
	optionActiveClassName,
	optionClassName,
	options,
	pinOnClick = false,
	portalTargetId,
	positionStrategy = "absolute",
	side = "bottom",
	triggerButtonProps,
	triggerContent,
}: DropdownMenuProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const listId = React.useId();
	const normalizedOptions = React.useMemo(
		() => normalizeMenuOptions(options),
		[options],
	);
	const navigationOptions = React.useMemo(
		() =>
			normalizedOptions.map((option) => ({
				disabled: option.disabled,
				selected: option.active,
			})),
		[normalizedOptions],
	);
	const navigation = useDropdownListNavigation({
		isOpen,
		options: navigationOptions,
	});
	const handleOpenChange = React.useCallback(
		(next: boolean) => {
			setIsOpen(next);
			onOpenChange?.(next);
		},
		[onOpenChange],
	);

	return (
		<DropdownRoot
			align={align}
			autoFocusMenu={false}
			collisionPadding={collisionPadding}
			disabled={disabled}
			menuClassName={clsx("max-w-[calc(100vw-32px)]", menuClassName)}
			menuMinWidth={menuMinWidth}
			menuWidth={menuWidth}
			offset={offset}
			onOpenChange={handleOpenChange}
			openOnHover={openOnHover}
			pinOnClick={pinOnClick}
			portalTargetId={portalTargetId}
			positionStrategy={positionStrategy}
			renderTrigger={(trigger) => (
				<Button
					{...triggerButtonProps}
					align={triggerButtonProps?.align ?? "center"}
					aria-activedescendant={
						trigger.isOpen && navigation.activeIndex >= 0
							? `${listId}-option-${navigation.activeIndex}`
							: undefined
					}
					aria-controls={trigger.isOpen ? listId : undefined}
					aria-expanded={trigger.isOpen}
					aria-haspopup="menu"
					aria-label={ariaLabel}
					disabled={disabled}
					onClick={(event) => {
						if (!trigger.isOpen) navigation.preparePointerOpen();
						trigger.onRightClick(event);
					}}
					onKeyDown={(event) => {
						if (disabled) return;
						if (event.key === "ArrowDown" || event.key === "ArrowUp") {
							event.preventDefault();
							const direction = event.key === "ArrowDown" ? 1 : -1;
							if (!trigger.isOpen) {
								navigation.prepareKeyboardOpen(direction);
								trigger.openMenu({ focusMenu: true });
								return;
							}
							navigation.setActiveIndex((current) =>
								navigation.getNextIndex(current, direction),
							);
							return;
						}
						if (
							(event.key === "Enter" || event.key === " ") &&
							!trigger.isOpen
						) {
							event.preventDefault();
							navigation.prepareKeyboardOpen();
							trigger.openMenu({ focusMenu: true });
						}
					}}
					onMouseEnter={trigger.onRootMouseEnter}
					onMouseLeave={trigger.onRootMouseLeave}
					ref={trigger.ref}
					size={triggerButtonProps?.size ?? "icon-sm"}
					variant={triggerButtonProps?.variant ?? "ghost"}
				>
					{triggerContent ?? <DotsThreeVertical aria-hidden size={15} />}
				</Button>
			)}
			renderMenu={({ close }) => (
				<Listbox
					activeIndex={navigation.activeIndex}
					ariaActivedescendant={
						navigation.activeIndex >= 0
							? `${listId}-option-${navigation.activeIndex}`
							: undefined
					}
					className={menuContentClassName}
					disabled={disabled}
					listClassName={listClassName}
					listId={listId}
					listRef={navigation.listRef}
					listTabIndex={0}
					onActiveIndexChange={navigation.setActiveIndex}
					onKeyDown={(event) => {
						if (event.key === "ArrowDown" || event.key === "ArrowUp") {
							event.preventDefault();
							const direction = event.key === "ArrowDown" ? 1 : -1;
							navigation.setActiveIndex((current) =>
								navigation.getNextIndex(current, direction),
							);
							return;
						}
						if (event.key === "Home" || event.key === "End") {
							event.preventDefault();
							navigation.setActiveIndex(
								navigation.getBoundaryIndex(
									event.key === "Home" ? "first" : "last",
								),
							);
							return;
						}
						if (event.key !== "Enter" && event.key !== " ") return;
						const option = normalizedOptions[navigation.activeIndex];
						if (!option || option.disabled) return;
						event.preventDefault();
						option.onSelect?.(event);
						if (option.href) window.location.assign(option.href);
						close();
					}}
					onSelect={(option, _index, event) => {
						if (disabled || option.value.disabled) {
							event.preventDefault();
							return;
						}
						option.value.onSelect?.(event);
						close();
					}}
					optionActiveClassName={optionActiveClassName}
					optionClassName={clsx("text-left", optionClassName)}
					optionIdPrefix={`${listId}-option`}
					optionRole="menuitem"
					options={normalizedOptions.map((option, index) => ({
						className: option.className,
						content: (
							<>
								{option.leadingIcon ? (
									<span className="flex shrink-0 items-center">
										{renderDropdownIcon(option.leadingIcon)}
									</span>
								) : null}
								<span
									className={clsx(
										"min-w-0 flex-1",
										option.layout === "presentation"
											? "overflow-visible whitespace-normal"
											: "truncate text-sm",
										option.tone === "danger"
											? "text-inherit"
											: option.active
												? "text-foreground"
												: "text-foreground/80",
										option.textClassName,
									)}
								>
									{option.label}
								</span>
								{option.trailingIcon ? (
									<span className="flex shrink-0 items-center">
										{renderDropdownIcon(option.trailingIcon)}
									</span>
								) : null}
							</>
						),
						disabled: option.disabled,
						dividerAfter: option.dividerAfter,
						dividerBefore: option.dividerBefore,
						href: option.href,
						key: option.id ?? index,
						layout: option.layout,
						selected: option.active,
						tone: option.tone,
						value: option,
					}))}
					role="menu"
				/>
			)}
			side={side}
		/>
	);
}

function DropdownListbox<T>({
	align = "start",
	ariaLabel,
	collisionPadding,
	disabled,
	emptyState,
	listClassName,
	menuClassName,
	menuContentClassName,
	menuMinWidth = DEFAULT_MENU_MIN_WIDTH,
	menuWidth,
	offset,
	onOpenChange,
	onSelect,
	openOnHover = false,
	optionActiveClassName,
	optionClassName,
	options,
	pinOnClick = false,
	portalTargetId,
	positionStrategy = "absolute",
	side = "bottom",
	triggerButtonProps,
	triggerContent,
}: DropdownListboxProps<T>) {
	const [isOpen, setIsOpen] = React.useState(false);
	const listId = React.useId();
	const navigation = useDropdownListNavigation({ isOpen, options });
	const handleOpenChange = React.useCallback(
		(next: boolean) => {
			setIsOpen(next);
			onOpenChange?.(next);
		},
		[onOpenChange],
	);

	return (
		<DropdownRoot
			align={align}
			autoFocusMenu={false}
			collisionPadding={collisionPadding}
			disabled={disabled}
			menuClassName={clsx("max-w-[calc(100vw-32px)]", menuClassName)}
			menuMinWidth={menuMinWidth}
			menuWidth={menuWidth}
			offset={offset}
			onOpenChange={handleOpenChange}
			openOnHover={openOnHover}
			pinOnClick={pinOnClick}
			portalTargetId={portalTargetId}
			positionStrategy={positionStrategy}
			renderTrigger={(trigger) => (
				<Button
					{...triggerButtonProps}
					aria-activedescendant={
						trigger.isOpen && navigation.activeIndex >= 0
							? `${listId}-option-${navigation.activeIndex}`
							: undefined
					}
					aria-controls={trigger.isOpen ? listId : undefined}
					aria-expanded={trigger.isOpen}
					aria-haspopup="listbox"
					aria-label={ariaLabel}
					disabled={disabled}
					onClick={(event) => {
						if (!trigger.isOpen) navigation.preparePointerOpen();
						trigger.onRightClick(event);
					}}
					onKeyDown={(event) => {
						if (disabled) return;
						if (event.key === "ArrowDown" || event.key === "ArrowUp") {
							event.preventDefault();
							const direction = event.key === "ArrowDown" ? 1 : -1;
							if (!trigger.isOpen) {
								navigation.prepareKeyboardOpen(direction);
								trigger.openMenu({ focusMenu: true });
								return;
							}
							navigation.setActiveIndex((current) =>
								navigation.getNextIndex(current, direction),
							);
							return;
						}
						if (
							(event.key === "Enter" || event.key === " ") &&
							!trigger.isOpen
						) {
							event.preventDefault();
							navigation.prepareKeyboardOpen();
							trigger.openMenu({ focusMenu: true });
						}
					}}
					onMouseEnter={trigger.onRootMouseEnter}
					onMouseLeave={trigger.onRootMouseLeave}
					ref={trigger.ref}
					size={triggerButtonProps?.size ?? "md"}
					variant={triggerButtonProps?.variant ?? "secondary"}
				>
					{triggerContent}
				</Button>
			)}
			renderMenu={({ close }) => (
				<Listbox
					activeIndex={navigation.activeIndex}
					ariaActivedescendant={
						navigation.activeIndex >= 0
							? `${listId}-option-${navigation.activeIndex}`
							: undefined
					}
					className={menuContentClassName}
					disabled={disabled}
					emptyState={emptyState}
					listClassName={listClassName}
					listId={listId}
					listRef={navigation.listRef}
					listTabIndex={0}
					onActiveIndexChange={navigation.setActiveIndex}
					onKeyDown={(event) => {
						if (event.key === "ArrowDown" || event.key === "ArrowUp") {
							event.preventDefault();
							const direction = event.key === "ArrowDown" ? 1 : -1;
							navigation.setActiveIndex((current) =>
								navigation.getNextIndex(current, direction),
							);
							return;
						}
						if (event.key === "Home" || event.key === "End") {
							event.preventDefault();
							navigation.setActiveIndex(
								navigation.getBoundaryIndex(
									event.key === "Home" ? "first" : "last",
								),
							);
							return;
						}
						if (event.key !== "Enter" && event.key !== " ") return;
						const option = options[navigation.activeIndex];
						if (!option || option.disabled || disabled) return;
						event.preventDefault();
						onSelect(option.value, option, event);
						close();
					}}
					onSelect={(option, _index, event) => {
						if (disabled || option.disabled) {
							event.preventDefault();
							return;
						}
						onSelect(option.value, option, event);
						close();
					}}
					optionActiveClassName={optionActiveClassName}
					optionClassName={optionClassName}
					optionIdPrefix={`${listId}-option`}
					options={options}
				/>
			)}
			side={side}
		/>
	);
}

type DropdownMenuFactoryHandler = (event: DropdownMenuEvent) => void;

export const dropdownMenuOptions = {
	delete({
		disabled,
		label = "Delete",
		onSelect,
	}: {
		disabled?: boolean;
		label?: React.ReactNode;
		onSelect?: DropdownMenuFactoryHandler;
	}): DropdownMenuOption {
		return {
			disabled,
			id: "delete",
			label,
			leadingIcon: <Trash aria-hidden size={12} />,
			onSelect,
			tone: "danger",
		};
	},
	edit({
		disabled,
		onSelect,
	}: {
		disabled?: boolean;
		onSelect: DropdownMenuFactoryHandler;
	}): DropdownMenuOption {
		return {
			disabled,
			id: "edit",
			label: "Edit",
			leadingIcon: <PencilSimpleIcon aria-hidden size={12} />,
			onSelect,
		};
	},
	open({
		href,
		leadingIcon,
	}: {
		href: string;
		leadingIcon?: DropdownIcon;
	}): DropdownMenuOption {
		return {
			href,
			id: "open",
			label: "Open",
			leadingIcon: leadingIcon ?? <ArrowSquareOut aria-hidden size={12} />,
		};
	},
};

export const Dropdown = Object.assign(DropdownRoot, {
	Listbox: DropdownListbox,
	Menu: DropdownMenu,
	Panel: DropdownSurface,
	menuOptions: dropdownMenuOptions,
});
