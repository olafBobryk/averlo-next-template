"use client";

import clsx from "clsx";
import * as React from "react";

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
						"absolute right-0 z-50 mt-2 min-w-48 rounded-md border border-border bg-background p-1 shadow-lg",
						menuClassName,
					)}
				>
					{children}
				</div>
			) : null}
		</div>
	);
}
