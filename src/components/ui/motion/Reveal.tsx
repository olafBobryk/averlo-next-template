"use client";

import { Slot } from "@radix-ui/react-slot";
import {
	motion,
	type TargetAndTransition,
	useAnimationControls,
	useInView,
	type Variants,
} from "motion/react";
import {
	type ComponentProps,
	createContext,
	createElement,
	type ElementType,
	forwardRef,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import { getMotionTiming } from "@/components/ui/foundations/motionTiming";
import {
	type MotionSceneStageInput,
	useMotionSceneGate,
} from "@/components/ui/motion/MotionScene";
import { useAppReady } from "@/hooks/useAppReady";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

const SlotWithRef = forwardRef<HTMLElement, ComponentProps<typeof Slot>>(
	(props, ref) => <Slot ref={ref} {...props} />,
);
SlotWithRef.displayName = "SlotWithRef";
const MotionSlot = motion(SlotWithRef);

type RevealRegisteredItem = {
	id: string;
	element: HTMLElement;
	order: number;
	ready: boolean;
	played: boolean;
	play: (delay: number) => Promise<void> | void;
	showImmediately: () => void;
	onComplete: () => void;
};

type RevealRootContextValue = {
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

type RevealGroupContextValue = {
	active?: boolean;
	sceneReady: boolean;
	registerItem: (id: string) => () => void;
	completeItem: (id: string) => void;
};

const RevealRootContext = createContext<RevealRootContextValue | null>(null);
const RevealGroupContext = createContext<RevealGroupContextValue | null>(null);

function getStaticRevealTag(as?: ElementType) {
	return typeof as === "string" ? as : "div";
}

function sortByDocumentOrder(
	first: RevealRegisteredItem,
	second: RevealRegisteredItem,
) {
	if (first.element === second.element) return 0;
	const position = first.element.compareDocumentPosition(second.element);
	if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
	if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
	return first.order - second.order;
}

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

function restoreChildTransition({
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

export type RevealGroupProps = {
	children: ReactNode;
	as?: ElementType;
	className?: string;
	stagger?: number;
	delay?: number;
	duration?: number;
	once?: boolean;
	active?: boolean;
	waitFor?: MotionSceneStageInput;
	unlockStage?: MotionSceneStageInput;
	disableWhenReducedMotion?: boolean;
};

export function RevealGroup({
	children,
	as = "div",
	className,
	active,
	waitFor,
	unlockStage,
	disableWhenReducedMotion = true,
}: RevealGroupProps) {
	const disabled = useRevealAnimationsDisabled(disableWhenReducedMotion);
	const registeredItemsRef = useRef(new Set<string>());
	const completedItemsRef = useRef(new Set<string>());
	const completionFrameRef = useRef<number | null>(null);
	const { sceneReady, markReady } = useMotionSceneGate("RevealGroup", {
		waitFor,
		unlockStage,
	});

	const checkCompletion = useCallback(() => {
		completionFrameRef.current = null;
		if (registeredItemsRef.current.size === 0) {
			if (disabled || sceneReady) markReady();
			return;
		}
		if (completedItemsRef.current.size < registeredItemsRef.current.size)
			return;
		markReady();
	}, [disabled, markReady, sceneReady]);

	const scheduleCompletionCheck = useCallback(() => {
		if (completionFrameRef.current !== null) return;
		completionFrameRef.current = requestAnimationFrame(checkCompletion);
	}, [checkCompletion]);

	const registerItem = useCallback(
		(id: string) => {
			registeredItemsRef.current.add(id);
			return () => {
				registeredItemsRef.current.delete(id);
				completedItemsRef.current.delete(id);
				scheduleCompletionCheck();
			};
		},
		[scheduleCompletionCheck],
	);

	const completeItem = useCallback(
		(id: string) => {
			completedItemsRef.current.add(id);
			scheduleCompletionCheck();
		},
		[scheduleCompletionCheck],
	);

	useEffect(() => {
		if (!disabled && !sceneReady) return;
		scheduleCompletionCheck();
	}, [disabled, sceneReady, scheduleCompletionCheck]);

	useEffect(() => {
		return () => {
			if (completionFrameRef.current !== null) {
				cancelAnimationFrame(completionFrameRef.current);
			}
		};
	}, []);

	const contextValue = useMemo(
		() => ({
			active,
			sceneReady: disabled || sceneReady,
			registerItem,
			completeItem,
		}),
		[active, completeItem, disabled, registerItem, sceneReady],
	);
	const Tag = as ?? "div";

	return (
		<RevealGroupContext.Provider value={contextValue}>
			<Tag className={className}>{children}</Tag>
		</RevealGroupContext.Provider>
	);
}

export type RevealItemProps = {
	children?: ReactNode;
	as?: ElementType;
	staticAs?: ElementType;
	asChild?: boolean;
	handoffAfterReveal?: boolean;
	className?: string;
	variants?: Variants;
	disableTransform?: boolean;
	useViewport?: boolean;
	active?: boolean;
	waitFor?: MotionSceneStageInput;
	unlockStage?: MotionSceneStageInput;
	disableWhenReducedMotion?: boolean;
	viewportAmount?: number;
};

export function RevealItem(props: RevealItemProps) {
	const root = useContext(RevealRootContext);

	if (!root) {
		return (
			<RevealRoot disableWhenReducedMotion={props.disableWhenReducedMotion}>
				<RevealItemInner {...props} />
			</RevealRoot>
		);
	}

	return <RevealItemInner {...props} />;
}

function RevealItemInner({
	children,
	as = motion.div,
	staticAs,
	asChild = false,
	handoffAfterReveal = false,
	className,
	variants,
	disableTransform = false,
	active,
	waitFor,
	unlockStage,
	disableWhenReducedMotion = true,
	viewportAmount = 0.2,
}: RevealItemProps) {
	const id = useId();
	const root = useContext(RevealRootContext);
	const group = useContext(RevealGroupContext);
	const appReady = useAppReady();
	const itemMotionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const disabled = root?.disabled || !itemMotionAllowed;
	const controls = useAnimationControls();
	const revealTiming = getMotionTiming("grand");
	const [hasPlayed, setHasPlayed] = useState(false);
	const childRef = useRef<HTMLElement | null>(null);
	const viewportRef = useRef<HTMLElement | null>(null);
	const measureRef = asChild ? childRef : viewportRef;
	const isInViewport = useInView(measureRef, {
		once: true,
		amount: viewportAmount,
	});
	const originalTransitionRef = useRef<string | null>(null);
	const restoreRafRef = useRef<number | null>(null);
	const timeoutRef = useRef<number | null>(null);
	const { sceneReady, markReady } = useMotionSceneGate("RevealItem", {
		waitFor,
		unlockStage,
	});
	const isActive = active !== false && group?.active !== false;
	const isReady =
		disabled ||
		(appReady &&
			isInViewport &&
			isActive &&
			sceneReady &&
			group?.sceneReady !== false);

	useLayoutEffect(() => {
		if (!asChild || !handoffAfterReveal || disabled || hasPlayed) return;
		const node = childRef.current;
		if (!node) return;
		originalTransitionRef.current = node.style.transition;
		node.style.transition = "none";
	}, [asChild, disabled, handoffAfterReveal, hasPlayed]);

	useEffect(() => {
		return () => {
			if (restoreRafRef.current !== null) {
				cancelAnimationFrame(restoreRafRef.current);
			}
			if (timeoutRef.current !== null) {
				window.clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const completeReveal = useCallback(async () => {
		if (asChild && handoffAfterReveal) {
			await restoreChildTransition({
				node: childRef.current,
				originalTransition: originalTransitionRef.current,
				onRestored: () => setHasPlayed(true),
			});
			return;
		}
		setHasPlayed(true);
	}, [asChild, handoffAfterReveal]);

	const play = useCallback(
		async (delay: number) => {
			if (variants) {
				await new Promise<void>((resolve) => {
					timeoutRef.current = window.setTimeout(() => {
						timeoutRef.current = null;
						resolve();
					}, delay * 1000);
				});
				await controls.start("show");
				await completeReveal();
				return;
			}

			const target: TargetAndTransition = disableTransform
				? {
						opacity: 1,
						transition: { ...revealTiming, delay },
					}
				: {
						opacity: 1,
						y: 0,
						transition: { ...revealTiming, delay },
						transitionEnd: { transform: "none", y: 0 },
					};

			await controls.start(target);
			await completeReveal();
		},
		[completeReveal, controls, disableTransform, revealTiming, variants],
	);

	const showImmediately = useCallback(() => {
		controls.set(disableTransform ? { opacity: 1 } : { opacity: 1, y: 0 });
		setHasPlayed(true);
	}, [controls, disableTransform]);

	const onComplete = useCallback(() => {
		markReady();
		group?.completeItem(id);
	}, [group, id, markReady]);

	useEffect(() => {
		const node = measureRef.current;
		if (!node || !root) return;
		const unregisterRoot = root.registerItem({
			id,
			element: node,
			play,
			showImmediately,
			onComplete,
		});
		const unregisterGroup = group?.registerItem(id);

		return () => {
			unregisterGroup?.();
			unregisterRoot();
		};
	}, [group, id, measureRef, onComplete, play, root, showImmediately]);

	useEffect(() => {
		if (!isReady || !root) return;
		root.markReady(id);
	}, [id, isReady, root]);

	const usePlainAsChild = asChild && handoffAfterReveal && hasPlayed;

	if (disabled || usePlainAsChild) {
		if (asChild) {
			return (
				<SlotWithRef ref={childRef} className={className}>
					{children}
				</SlotWithRef>
			);
		}

		const Tag = getStaticRevealTag(staticAs ?? as);
		return createElement(Tag, { ref: viewportRef, className }, children);
	}

	const MotionTag = asChild ? MotionSlot : (as ?? motion.div);
	const baseVariants: Variants =
		variants ??
		({
			hidden: disableTransform ? { opacity: 0 } : { opacity: 0, y: 12 },
			show: disableTransform
				? { opacity: 1, transition: revealTiming }
				: {
						opacity: 1,
						y: 0,
						transition: revealTiming,
						transitionEnd: { transform: "none", y: 0 },
					},
		} as const);

	return (
		<MotionTag
			ref={asChild ? childRef : viewportRef}
			initial="hidden"
			animate={controls}
			variants={baseVariants}
			className={className}
		>
			{children}
		</MotionTag>
	);
}
