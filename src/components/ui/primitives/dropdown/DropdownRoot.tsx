/** biome-ignore-all lint/a11y/useKeyWithClickEvents: trigger interaction is delegated through render props and nested controls */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: trigger wrapper behavior is delegated through render props and nested controls */
"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import { spring } from "@/components/ui/foundations/spring";
import { Icon } from "@/components/ui/icons/Icon";
import Portal from "@/components/ui/overlays/Portal";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { getDropdownSurfaceClassName } from "../dropdownStyles";
import { COLLISION_PADDING, DEFAULT_MENU_MIN_WIDTH } from "./constants";
import { useDropdownFloating } from "./positioning";
import { dropdownSheetClassName } from "./sheet";
import type { DropdownProps } from "./types";
import type { DropdownCollectionController } from "./useDropdownCollectionController";

const toCssLength = (value: number | string) =>
	typeof value === "number" ? `${value}px` : value;

const DEFAULT_CHEVRON_ICON = ({ isOpen }: { isOpen: boolean }) => {
	return (
		<Icon
			name="chevron-down"
			aria-hidden
			data-is-open={isOpen}
			className="data-[is-open=true]:rotate-180 transition-transform motion-snap"
			style={{ width: 15, height: 15 }}
		/>
	);
};

export function DropdownRoot({
	renderTrigger,
	renderMenu,
	onLeftClick,
	className,
	collisionPadding = COLLISION_PADDING,
	menuClassName,
	menuElevation = "float",
	portalTargetId,
	menuWidth,
	menuMinWidth = DEFAULT_MENU_MIN_WIDTH,
	align = "end",
	side = "bottom",
	offset = 8,
	positionStrategy = "absolute",
	presentation = "auto",
	disabled,
	open,
	openOnHover = true,
	pinOnClick = openOnHover,
	disableWhenReducedMotion = true,
	autoFocusMenu = true,
	onOpenChange,
	collectionController,
	keepOpenWhileFocusWithin = false,
}: DropdownProps & {
	collectionController?: DropdownCollectionController;
	keepOpenWhileFocusWithin?: boolean;
}) {
	const reducedMotionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const motionDisabled = useMotionDisableOverride();
	const motionAllowed = reducedMotionAllowed && !motionDisabled;
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
	const [isPinned, setIsPinned] = React.useState(false);
	const rootRef = React.useRef<HTMLElement | null>(null);
	const menuRef = React.useRef<HTMLDivElement | null>(null);
	const [referenceNode, setReferenceNode] = React.useState<HTMLElement | null>(
		null,
	);
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
		if (!openOnHover || isPinned) return false;
		hoverTimeoutRef.current = window.setTimeout(() => {
			if (
				keepOpenWhileFocusWithin &&
				menuRef.current?.contains(document.activeElement)
			)
				return;
			setOpenState(false);
		}, 120);
		return true;
	}, [
		clearHoverTimeout,
		isPinned,
		openOnHover,
		setOpenState,
		keepOpenWhileFocusWithin,
	]);

	React.useEffect(() => {
		collectionController?.connectRootHoverHandlers({
			cancel: clearHoverTimeout,
			schedule: scheduleClose,
		});
		return () => collectionController?.connectRootHoverHandlers(undefined);
	}, [clearHoverTimeout, collectionController, scheduleClose]);

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

	const floating = useDropdownFloating({
		align,
		collisionPadding,
		enabled: isOpen,
		offset,
		presentation,
		reference: referenceNode,
		requiredWidth: menuWidth === "trigger" ? 0 : (menuWidth ?? menuMinWidth),
		side,
		strategy: positionStrategy,
	});

	React.useLayoutEffect(() => {
		setReferenceNode(isOpen ? rootRef.current : null);
	}, [isOpen]);

	// Focus once the panel is positioned: until then it is visibility-hidden and
	// none of its controls can take focus.
	const { isPositioned } = floating;
	React.useEffect(() => {
		if (!isOpen || !isPositioned) return;
		if (
			autoFocusMenu &&
			menuRef.current &&
			lastOpenMethodRef.current === "keyboard"
		) {
			const focusTarget = getMenuFocusableElements()[0];
			focusTarget?.focus({ preventScroll: true });
		}
	}, [isOpen, isPositioned, autoFocusMenu, getMenuFocusableElements]);

	React.useEffect(() => {
		if (!isOpen && !isPinned) return;
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				rootRef.current &&
				!rootRef.current.contains(target) &&
				menuRef.current &&
				!menuRef.current.contains(target) &&
				!collectionController?.containsTarget(target)
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
				!menuRef.current.contains(target) &&
				!collectionController?.containsTarget(target)
			) {
				closeMenu({ restoreFocus: false });
			}
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				if (event.defaultPrevented) return;
				event.preventDefault();
				if (collectionController?.closeDeepest({ focusParent: true })) return;
				closeMenu({ restoreFocus: true });
				return;
			}
			if (
				event.key === "Tab" &&
				collectionController &&
				collectionController.openPath.length > 0
			) {
				closeMenu({ restoreFocus: false });
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
		collectionController,
	]);

	const { setFloating, sheet } = floating;
	const setMenuNode = React.useCallback(
		(node: HTMLDivElement | null) => {
			menuRef.current = node;
			setFloating(node);
		},
		[setFloating],
	);

	const explicitWidth =
		menuWidth === "trigger" ? "var(--dropdown-anchor-width)" : menuWidth;
	const menuStyle: React.CSSProperties = sheet
		? { zIndex: 90 }
		: {
				...floating.floatingStyles,
				maxHeight: "var(--dropdown-available-height)",
				maxWidth: "var(--dropdown-available-width)",
				// The minimum never beats the space the panel has.
				minWidth: `min(${toCssLength(explicitWidth ?? menuMinWidth)}, var(--dropdown-available-width, 100vw))`,
				overflowY: floating.capped ? "auto" : undefined,
				visibility: floating.isPositioned ? undefined : "hidden",
				width: explicitWidth,
				zIndex: 90,
			};
	const resolvedMenuClassName = clsx(
		getDropdownSurfaceClassName(menuElevation),
		"flex w-fit flex-col overscroll-contain z-[91]",
		sheet ? "fixed" : positionStrategy === "fixed" ? "fixed" : "absolute",
		menuClassName,
		sheet && dropdownSheetClassName,
	);
	const menuMotionY = sheet ? 16 : floating.resolvedSide === "top" ? 6 : -6;
	const menuNode = motionAllowed ? (
		<AnimatePresence>
			{isOpen ? (
				<motion.div
					ref={setMenuNode}
					data-dropdown-presentation={sheet ? "sheet" : "anchored"}
					data-elevation={menuElevation}
					data-slot="float"
					data-surface-role="float"
					key="dropdown-menu"
					initial={{ opacity: 0, y: menuMotionY }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: menuMotionY }}
					transition={spring.smooth}
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
			data-dropdown-presentation={sheet ? "sheet" : "anchored"}
			data-elevation={menuElevation}
			data-slot="float"
			data-surface-role="float"
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
		<div className="max-w-full">
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

			<Portal target={portalTargetId}>{menuNode}</Portal>
		</div>
	);
}
