"use client";

import {
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from "react";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import {
	type RevealRegisteredItem,
	RevealRootContext,
	sortByDocumentOrder,
} from "./_scheduler";

export type RevealRootProps = {
	children: ReactNode;
	stagger?: number;
	disabled?: boolean;
	disableWhenReducedMotion?: boolean;
};

export function RevealRoot({
	children,
	stagger = 0.08,
	disabled = false,
	disableWhenReducedMotion = true,
}: RevealRootProps) {
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const urlDisabled = useMotionDisableOverride();
	const resolvedDisabled = disabled || urlDisabled || !motionAllowed;
	const itemsRef = useRef(new Map<string, RevealRegisteredItem>());
	const orderRef = useRef(0);
	const flushFrameRef = useRef<number | null>(null);

	const flushReadyItems = useCallback(() => {
		flushFrameRef.current = null;
		const readyItems = [...itemsRef.current.values()]
			.filter((item) => item.ready && !item.played && item.element.isConnected)
			.sort(sortByDocumentOrder);

		readyItems.forEach((item, index) => {
			item.played = true;

			if (resolvedDisabled) {
				item.showImmediately();
				item.onComplete();
				return;
			}

			Promise.resolve(item.play(index * stagger)).finally(item.onComplete);
		});
	}, [resolvedDisabled, stagger]);

	const scheduleFlush = useCallback(() => {
		if (flushFrameRef.current !== null) return;
		flushFrameRef.current = requestAnimationFrame(flushReadyItems);
	}, [flushReadyItems]);

	const registerItem = useCallback(
		({
			id,
			element,
			play,
			showImmediately,
			onComplete,
		}: {
			id: string;
			element: HTMLElement;
			play: RevealRegisteredItem["play"];
			showImmediately: RevealRegisteredItem["showImmediately"];
			onComplete: RevealRegisteredItem["onComplete"];
		}) => {
			itemsRef.current.set(id, {
				id,
				element,
				play,
				showImmediately,
				onComplete,
				order: orderRef.current,
				ready: false,
				played: false,
			});
			orderRef.current += 1;

			return () => {
				itemsRef.current.delete(id);
			};
		},
		[],
	);

	const markReady = useCallback(
		(id: string) => {
			const item = itemsRef.current.get(id);
			if (!item || item.ready || item.played) return;
			item.ready = true;
			scheduleFlush();
		},
		[scheduleFlush],
	);

	useEffect(() => {
		if (!resolvedDisabled) return;
		for (const item of itemsRef.current.values()) {
			if (!item.played) {
				item.ready = true;
			}
		}
		scheduleFlush();
	}, [resolvedDisabled, scheduleFlush]);

	useEffect(() => {
		return () => {
			if (flushFrameRef.current !== null) {
				cancelAnimationFrame(flushFrameRef.current);
			}
		};
	}, []);

	const contextValue = useMemo(
		() => ({
			disabled: resolvedDisabled,
			registerItem,
			markReady,
		}),
		[markReady, registerItem, resolvedDisabled],
	);

	return (
		<RevealRootContext.Provider value={contextValue}>
			{children}
		</RevealRootContext.Provider>
	);
}

export function useRevealAnimationsDisabled(disableWhenReducedMotion = true) {
	const context = useContext(RevealRootContext);
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const urlDisabled = useMotionDisableOverride();
	return context?.disabled ?? (urlDisabled || !motionAllowed);
}
