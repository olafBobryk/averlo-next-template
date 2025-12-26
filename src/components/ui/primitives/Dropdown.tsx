// components/ui/Dropdown.tsx
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import Portal from "@/components/Portal";

type DropdownTriggerRenderProps = {
	ref: React.Ref<HTMLDivElement>;
	isOpen: boolean;
	isPinned: boolean;
	className?: string;

	// root mouse events (for hover open/close)
	onRootMouseEnter: () => void;
	onRootMouseLeave: () => void;

	// click handlers (already wired to pin/open behavior)
	onLeftClick?: (e: React.MouseEvent) => void;
	onRightClick: (e: React.MouseEvent) => void;

	// built-in chevron icon you can use anywhere in the trigger
	chevronIcon: React.ReactNode;
};

type DropdownProps = {
	renderTrigger: (props: DropdownTriggerRenderProps) => React.ReactNode;
	renderMenu: (helpers: { close: () => void }) => React.ReactNode;
	/**
	 * Optional handler for the "left" part of the trigger (e.g. your label).
	 * Behavior is the same as before: clicking left side pins + opens, then calls onLeftClick.
	 */
	onLeftClick?: () => void;
	className?: string;
	portalTargetId?: string;
};

const DEFAULT_CHEVRON_ICON = ({ isOpen }: { isOpen: boolean }) => {
	return (
		<svg
			width={10}
			height={10}
			viewBox="0 0 10 10"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="w-2.5 h-2.5 data-[is-open=true]:rotate-180 transition-transform motion-micro"
			preserveAspectRatio="none"
			data-is-open={isOpen}
		>
			<title>chevron</title>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0.146154 2.43286C-0.048718 2.6353 -0.048718 2.96311 0.146154 3.16504L4.27794 7.44629C4.66818 7.85117 5.30126 7.85117 5.6915 7.44629L9.85377 3.13403C10.0466 2.93366 10.0491 2.60994 9.85876 2.40698C9.66439 2.19988 9.3441 2.19737 9.14673 2.40137L5.33824 6.34815C5.14287 6.55059 4.82657 6.55059 4.6312 6.34815L0.852689 2.43286C0.657817 2.23042 0.341525 2.23042 0.146154 2.43286Z"
				fill="black"
			/>
		</svg>
	);
};

export function Dropdown({
	renderTrigger,
	renderMenu,
	onLeftClick,
	className,
	portalTargetId,
}: DropdownProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [isPinned, setIsPinned] = React.useState(false);

	const rootRef = React.useRef<HTMLDivElement | null>(null);
	const menuRef = React.useRef<HTMLDivElement | null>(null);
	const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>();

	const hoverTimeoutRef = React.useRef<number | null>(null);

	const clearHoverTimeout = React.useCallback(() => {
		if (hoverTimeoutRef.current != null) {
			window.clearTimeout(hoverTimeoutRef.current);
			hoverTimeoutRef.current = null;
		}
	}, []);

	const scheduleClose = () => {
		clearHoverTimeout();
		hoverTimeoutRef.current = window.setTimeout(() => {
			if (!isPinned) {
				setIsOpen(false);
			}
		}, 120);
	};

	// hover open / close (unless pinned)
	const handleRootMouseEnter = () => {
		clearHoverTimeout();
		if (!isPinned) setIsOpen(true);
	};

	const handleRootMouseLeave = () => {
		if (!isPinned) scheduleClose();
	};

	// click on right side: toggle pinned
	const handleRightClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		clearHoverTimeout();
		setIsPinned((prev) => {
			const next = !prev;
			if (next) {
				setIsOpen(true);
			} else {
				setIsOpen(false);
			}
			return next;
		});
	};

	// click on left side: optional handler + pin
	const handleLeftClick = (e: React.MouseEvent) => {
		if (!onLeftClick) return;
		e.stopPropagation();
		clearHoverTimeout();
		setIsPinned(true);
		setIsOpen(true);
		onLeftClick();
	};

	// click outside closes everything
	React.useEffect(() => {
		if (!isOpen && !isPinned) return;

		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node;
			if (
				rootRef.current &&
				!rootRef.current.contains(target) &&
				menuRef.current &&
				!menuRef.current.contains(target)
			) {
				clearHoverTimeout();
				setIsOpen(false);
				setIsPinned(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen, isPinned, clearHoverTimeout]);

	// ---- POSITIONING ----
	const calculateMenuPosition = React.useCallback((explicitWidth?: number) => {
		if (!rootRef.current) return;

		const rect = rootRef.current.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const padding = 16;
		const top = rect.bottom + 8;

		const menuWidth =
			explicitWidth ?? menuRef.current?.getBoundingClientRect().width ?? 260;
		// default: align RIGHT edge of menu with RIGHT edge of trigger
		let left = rect.right - menuWidth;
		left = Math.max(left, padding);
		left = Math.min(left, viewportWidth - menuWidth - padding);

		setMenuStyle({
			position: "fixed",
			top,
			left,
			zIndex: 90,
		});
	}, []);

	// Recalculate when isOpen flips to true
	React.useEffect(() => {
		if (isOpen) {
			calculateMenuPosition();
		} else {
			setMenuStyle(undefined);
		}
	}, [isOpen, calculateMenuPosition]);

	// callback ref to recompute once the menu DOM node actually exists (and has real width)
	const setMenuNode = React.useCallback(
		(node: HTMLDivElement | null) => {
			menuRef.current = node;
			if (node && isOpen) {
				const width = node.getBoundingClientRect().width;
				// calculateMenuPosition(width);
			}
		},
		[isOpen],
	);

	const closeMenu = () => {
		clearHoverTimeout();
		setIsOpen(false);
		setIsPinned(false);
	};

	return (
		<>
			{renderTrigger({
				ref: rootRef,
				isOpen,
				isPinned,
				className,
				onRootMouseEnter: handleRootMouseEnter,
				onRootMouseLeave: handleRootMouseLeave,
				onLeftClick: onLeftClick ? handleLeftClick : undefined,
				onRightClick: handleRightClick,
				chevronIcon: <DEFAULT_CHEVRON_ICON isOpen={isOpen} />,
			})}

			<Portal target={portalTargetId}>
				<AnimatePresence>
					{isOpen && (
						<motion.div
							ref={setMenuNode}
							key="dropdown-menu"
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 6 }}
							transition={{
								duration: 0.2,
								ease: [0.25, 0.1, 0.25, 1],
							}}
							style={menuStyle}
							className="min-w-[220px] w-fit rounded-2xl fixed bg-white border border-[#020202]/[0.08] shadow-lg z-[91] overflow-hidden"
							onMouseEnter={clearHoverTimeout} // keep open when entering menu
							onMouseLeave={() => {
								if (!isPinned) scheduleClose(); // close only after leaving menu too
							}}
						>
							{renderMenu({ close: closeMenu })}
						</motion.div>
					)}
				</AnimatePresence>
			</Portal>
		</>
	);
}
