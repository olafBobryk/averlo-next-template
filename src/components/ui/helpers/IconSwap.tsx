"use client";

import clsx from "clsx";
import * as React from "react";
import { useAnimated } from "@/hooks/useMotionAllowed";

type IconSwapItem = {
	key?: React.Key;
	icon: React.ReactNode;
	className?: string;
	activeClassName?: string;
	inactiveClassName?: string;
};

type IconSwapSize = "sm" | "md" | "lg";

type IconSwapBaseProps = {
	size?: IconSwapSize;
	className?: string;
	/** Extra transition classes. Reduced motion and `?motion=off` are gated internally. */
	transitionClassName?: string;
};

type IconSwapListProps = IconSwapBaseProps & {
	items: IconSwapItem[];
	activeIndex: number;
	swapKey?: never;
	children?: never;
};

type IconSwapKeyedProps = IconSwapBaseProps & {
	/** Identity of the current icon; a new key swaps the previous icon out. */
	swapKey: React.Key;
	/** The current icon. */
	children: React.ReactNode;
	items?: never;
	activeIndex?: never;
};

export type IconSwapProps = IconSwapListProps | IconSwapKeyedProps;

const sizeClasses: Record<IconSwapSize, string> = {
	sm: "h-[15px] w-[15px]",
	md: "h-5 w-5",
	lg: "h-6 w-6",
};

const getIconSwapItemKey = (item: IconSwapItem): React.Key => {
	if (item.key != null) return item.key;
	if (React.isValidElement<{ name?: unknown }>(item.icon)) {
		if (item.icon.key != null) return item.icon.key;
		if (typeof item.icon.props.name === "string") return item.icon.props.name;
	}
	return String(item.icon);
};

type KeyedEntry = { key: React.Key; icon: React.ReactNode; entering: boolean };
type KeyedState = { activeKey: React.Key | undefined; entries: KeyedEntry[] };

/**
 * Keeps the current icon plus the one it replaced, in a stable order, so a
 * swap crossfades and a quick swap back reverses from the current state.
 */
function useKeyedEntries(
	swapKey: React.Key | undefined,
	children: React.ReactNode,
): KeyedEntry[] {
	const [state, setState] = React.useState<KeyedState>(() => ({
		activeKey: swapKey,
		entries:
			swapKey === undefined
				? []
				: [{ key: swapKey, icon: children, entering: false }],
	}));
	let current = state;
	if (swapKey !== undefined && state.activeKey !== swapKey) {
		const known = state.entries.some((entry) => entry.key === swapKey);
		const outgoing = state.entries.filter(
			(entry) => entry.key === state.activeKey,
		);
		current = {
			activeKey: swapKey,
			entries: known
				? state.entries
				: [...outgoing, { key: swapKey, icon: children, entering: true }],
		};
		setState(current);
	}
	// The active icon always renders the latest children.
	return current.entries.map((entry) =>
		entry.key === swapKey ? { ...entry, icon: children } : entry,
	);
}

export function IconSwap(props: IconSwapProps) {
	const {
		size = "md",
		className,
		transitionClassName,
		swapKey,
		children,
	} = props;
	const animated = useAnimated();
	const keyedEntries = useKeyedEntries(swapKey, children);
	const keyed = swapKey !== undefined;
	const items: (IconSwapItem & { entering?: boolean })[] = keyed
		? keyedEntries
		: (props.items ?? []);
	const activeIndex = keyed
		? keyedEntries.findIndex((entry) => entry.key === swapKey)
		: (props.activeIndex ?? 0);

	return (
		<span
			data-slot="icon-swap"
			className={clsx(
				"relative flex shrink-0 items-center justify-center ",
				sizeClasses[size],
				className,
			)}
		>
			{items.map((item, index) => {
				const isActive = index === activeIndex;
				return (
					<span
						key={getIconSwapItemKey(item)}
						data-state={isActive ? "active" : "inactive"}
						aria-hidden={isActive ? undefined : true}
						className={clsx(
							"absolute inset-0 flex items-center justify-center transition-all motion-snap motion-reduce:transition-none",
							sizeClasses[size],
							transitionClassName,
							!animated && "transition-none",
							animated &&
								item.entering &&
								"starting:opacity-0 starting:scale-50",
							isActive
								? clsx("opacity-100 scale-100", item.activeClassName)
								: clsx("opacity-0 scale-50", item.inactiveClassName),
							item.className,
						)}
					>
						{item.icon}
					</span>
				);
			})}
		</span>
	);
}
