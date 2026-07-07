"use client";

import { Slot } from "@radix-ui/react-slot";
import { motion } from "motion/react";
import {
	type ComponentProps,
	type CSSProperties,
	createContext,
	type ElementType,
	forwardRef,
} from "react";

export const SlotWithRef = forwardRef<HTMLElement, ComponentProps<typeof Slot>>(
	(props, ref) => <Slot ref={ref} {...props} />,
);
SlotWithRef.displayName = "SlotWithRef";
export const MotionSlot = motion.create(SlotWithRef);

export type RevealRegisteredItem = {
	id: string;
	element: HTMLElement;
	order: number;
	ready: boolean;
	played: boolean;
	play: (delay: number) => Promise<void> | void;
	showImmediately: () => void;
	onComplete: () => void;
};

export type RevealRootContextValue = {
	disabled: boolean;
	registerItem: (item: {
		id: string;
		element: HTMLElement;
		play: RevealRegisteredItem["play"];
		showImmediately: RevealRegisteredItem["showImmediately"];
		onComplete: RevealRegisteredItem["onComplete"];
	}) => () => void;
	markReady: (id: string) => void;
};

export type RevealGroupContextValue = {
	started: boolean;
	disabled: boolean;
	registerItem: RevealRootContextValue["registerItem"];
	markReady: RevealRootContextValue["markReady"];
	completeItem: (id: string) => void;
};

export const RevealRootContext = createContext<RevealRootContextValue | null>(
	null,
);
export const RevealGroupContext = createContext<RevealGroupContextValue | null>(
	null,
);
export const disabledRevealStyle: CSSProperties = {
	opacity: 1,
	transform: "none",
	clipPath: "none",
};

export function getStaticRevealTag(as?: ElementType) {
	return typeof as === "string" ? as : "div";
}

export function waitForDelay(delay: number) {
	if (delay <= 0) return Promise.resolve();
	return new Promise<void>((resolve) => {
		window.setTimeout(resolve, delay * 1000);
	});
}

export function sortByDocumentOrder(
	first: RevealRegisteredItem,
	second: RevealRegisteredItem,
) {
	if (first.element === second.element) return 0;
	const position = first.element.compareDocumentPosition(second.element);
	if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
	if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
	return first.order - second.order;
}

export function restoreChildTransition({
	node,
	originalTransition,
	onRestored,
}: {
	node: HTMLElement | null;
	originalTransition: string | null;
	onRestored: () => void;
}) {
	if (!node) {
		onRestored();
		return Promise.resolve();
	}

	return new Promise<void>((resolve) => {
		requestAnimationFrame(() => {
			node.style.transition = originalTransition ?? "";
			onRestored();
			resolve();
		});
	});
}
