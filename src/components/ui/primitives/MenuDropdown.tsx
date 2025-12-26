// components/ui/MenuDropdown.tsx
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
"use client";

import Link from "next/link";
import type * as React from "react";
import { Dropdown } from "./Dropdown";

export type MenuItemBase = {
	id: string;
	label: string;
};

export type MenuItemAction = MenuItemBase & {
	type?: "action";
	onClick: () => void;
	href?: never;
};

export type MenuItemLink = MenuItemBase & {
	type: "link";
	href: string;
	onClick?: () => void;
};

export type MenuItem = MenuItemAction | MenuItemLink;

type MenuDropdownProps = {
	items: MenuItem[];
	className?: string;
	portalTargetId?: string;
	children?: React.ReactNode;
};

const ThreeDotsIcon: React.FC<{ isOpen?: boolean }> = ({ isOpen }) => (
	<svg
		width={16}
		height={16}
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		// biome-ignore lint/style/useTemplate: <explanation>
		className={"motion-micro " + isOpen ? "opacity-100" : "opacity-90"}
	>
		<title>More options</title>
		<circle cx="3" cy="8" r="1" fill="#020202" />
		<circle cx="8" cy="8" r="1" fill="#020202" />
		<circle cx="13" cy="8" r="1" fill="#020202" />
	</svg>
);

export function MenuDropdown({
	items,
	className,
	portalTargetId,
	children,
}: MenuDropdownProps) {
	return (
		<Dropdown
			className={className}
			portalTargetId={portalTargetId}
			renderTrigger={({
				ref,
				isOpen,
				onRootMouseEnter,
				onRootMouseLeave,
				onRightClick,
			}) => (
				// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
				<div
					ref={ref}
					onMouseEnter={onRootMouseEnter}
					onMouseLeave={onRootMouseLeave}
					onClick={onRightClick}
					className={[
						"flex h-8 w-8 items-center justify-center rounded-full border border-[#020202]/[0.08] bg-[#f5f7f9]",
						"cursor-pointer motion-interactive hover:bg-[#e5e7eb] active:scale-[0.97]",
					].join(" ")}
				>
					{children ? children : <ThreeDotsIcon isOpen={isOpen} />}
				</div>
			)}
			renderMenu={({ close }) => (
				<div className="flex flex-col gap-2 p-2">
					{/* Menu items */}
					<div className="flex flex-col">
						{items.map((item) => {
							const baseClasses =
								"flex w-full items-center cursor-pointer justify-between px-3 py-1.5 text-sm " +
								"transition-colors motion-micro text-left rounded-lg " +
								"bg-white text-foreground/80 hover:bg-surface";

							if (item.type === "link") {
								return (
									<Link
										key={item.id}
										href={item.href}
										className={baseClasses}
										onClick={() => {
											item.onClick?.();
											close();
										}}
									>
										<span>{item.label}</span>
									</Link>
								);
							}

							// default: action button
							return (
								<button
									key={item.id}
									type="button"
									className={baseClasses}
									onClick={() => {
										item.onClick();
										close();
									}}
								>
									<span>{item.label}</span>
								</button>
							);
						})}
					</div>
				</div>
			)}
		/>
	);
}
