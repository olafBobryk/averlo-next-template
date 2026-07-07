"use client";

import { useInView } from "motion/react";
import {
	type ElementType,
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
import {
	type MotionSceneStageInput,
	useMotionSceneGate,
	useOptionalMotionScene,
} from "@/components/ui/motion/MotionScene";
import { useAppReady } from "@/hooks/useAppReady";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import {
	RevealGroupContext,
	type RevealRegisteredItem,
	RevealRootContext,
	sortByDocumentOrder,
	waitForDelay,
} from "./_scheduler";
import { RevealRoot } from "./RevealRoot";
import { type RevealStageAliasProps, resolveRevealStageAliases } from "./types";

export type RevealGroupProps = {
	children: ReactNode;
	as?: ElementType;
	className?: string;
	disabled?: boolean;
	stagger?: number;
	/** @deprecated RevealGroup is now a boundary-only local scheduler. */
	delay?: number;
	/** @deprecated RevealGroup item duration is controlled by RevealGroupItem. */
	duration?: number;
	/** @deprecated Reveal groups play once through the root scheduler. */
	once?: boolean;
	active?: boolean;
	waitFor?: MotionSceneStageInput;
	unlockOnStartStage?: MotionSceneStageInput;
	unlockStage?: MotionSceneStageInput;
	disableWhenReducedMotion?: boolean;
	viewportAmount?: number;
};

export function RevealGroup(props: RevealGroupProps) {
	const root = useContext(RevealRootContext);

	if (!root) {
		return (
			<RevealRoot disableWhenReducedMotion={props.disableWhenReducedMotion}>
				<RevealGroupInner {...props} />
			</RevealRoot>
		);
	}

	return <RevealGroupInner {...props} />;
}

function RevealGroupInner({
	children,
	as = "div",
	className,
	disabled: disabledOverride = false,
	stagger = 0.18,
	active,
	waitFor,
	unlockOnStartStage,
	unlockStage,
	disableWhenReducedMotion = true,
	viewportAmount = 0.2,
}: RevealGroupProps) {
	const id = useId();
	const root = useContext(RevealRootContext);
	const appReady = useAppReady();
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const disabled = disabledOverride || root?.disabled || !motionAllowed;
	const [hasPlayed, setHasPlayed] = useState(false);
	const [started, setStarted] = useState(false);
	const viewportRef = useRef<HTMLElement | null>(null);
	const mountedRef = useRef(false);
	const startedRef = useRef(false);
	const itemsRef = useRef(new Map<string, RevealRegisteredItem>());
	const completedItemsRef = useRef(new Set<string>());
	const orderRef = useRef(0);
	const flushFrameRef = useRef<number | null>(null);
	const completionFrameRef = useRef<number | null>(null);
	const completionResolverRef = useRef<(() => void) | null>(null);
	const playRef = useRef<RevealRegisteredItem["play"]>(() => undefined);
	const showImmediatelyRef = useRef<RevealRegisteredItem["showImmediately"]>(
		() => undefined,
	);
	const onCompleteRef = useRef<RevealRegisteredItem["onComplete"]>(
		() => undefined,
	);
	const isInViewport = useInView(viewportRef, {
		once: true,
		amount: viewportAmount,
	});
	const { sceneReady, markReady } = useMotionSceneGate("RevealGroup", {
		waitFor,
		unlockStage,
	});
	const scene = useOptionalMotionScene();
	const isReady =
		disabled || (appReady && isInViewport && active !== false && sceneReady);

	const finishGroup = useCallback(() => {
		if (mountedRef.current) {
			setHasPlayed(true);
		}
		const resolve = completionResolverRef.current;
		completionResolverRef.current = null;
		resolve?.();
	}, []);

	const checkCompletion = useCallback(() => {
		completionFrameRef.current = null;
		if (!startedRef.current) return;

		const connectedItems = [...itemsRef.current.values()].filter(
			(item) => item.element.isConnected,
		);
		if (connectedItems.length === 0) {
			finishGroup();
			return;
		}

		const allComplete = connectedItems.every((item) =>
			completedItemsRef.current.has(item.id),
		);
		if (allComplete) {
			finishGroup();
		}
	}, [finishGroup]);

	const scheduleCompletionCheck = useCallback(() => {
		if (completionFrameRef.current !== null) return;
		completionFrameRef.current = requestAnimationFrame(checkCompletion);
	}, [checkCompletion]);

	const flushReadyItems = useCallback(() => {
		flushFrameRef.current = null;
		if (!startedRef.current) return;

		const readyItems = [...itemsRef.current.values()]
			.filter((item) => item.ready && !item.played && item.element.isConnected)
			.sort(sortByDocumentOrder);

		readyItems.forEach((item, index) => {
			item.played = true;

			if (disabled) {
				item.showImmediately();
				item.onComplete();
				return;
			}

			Promise.resolve(item.play(index * stagger)).finally(item.onComplete);
		});

		scheduleCompletionCheck();
	}, [disabled, scheduleCompletionCheck, stagger]);

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

			if (startedRef.current) {
				scheduleCompletionCheck();
			}

			return () => {
				itemsRef.current.delete(id);
				completedItemsRef.current.delete(id);
				scheduleCompletionCheck();
			};
		},
		[scheduleCompletionCheck],
	);

	const markItemReady = useCallback(
		(id: string) => {
			const item = itemsRef.current.get(id);
			if (!item || item.ready || item.played) return;
			item.ready = true;
			scheduleFlush();
		},
		[scheduleFlush],
	);

	const completeItem = useCallback(
		(id: string) => {
			completedItemsRef.current.add(id);
			scheduleCompletionCheck();
		},
		[scheduleCompletionCheck],
	);

	const startGroup = useCallback(() => {
		startedRef.current = true;
		scene?.markStages(unlockOnStartStage);
		if (mountedRef.current) {
			setStarted(true);
		}
		scheduleFlush();
		scheduleCompletionCheck();
	}, [scheduleCompletionCheck, scheduleFlush, scene, unlockOnStartStage]);

	const play = useCallback(
		async (delay: number) => {
			await waitForDelay(delay);
			if (!mountedRef.current) return;

			return new Promise<void>((resolve) => {
				completionResolverRef.current = resolve;
				startGroup();
			});
		},
		[startGroup],
	);

	const showImmediately = useCallback(() => {
		if (!mountedRef.current) return;

		completionResolverRef.current = null;
		startedRef.current = true;
		setStarted(true);

		for (const item of itemsRef.current.values()) {
			if (item.played || !item.element.isConnected) continue;
			item.ready = true;
			item.played = true;
			item.showImmediately();
			item.onComplete();
		}

		finishGroup();
	}, [finishGroup]);

	const onComplete = useCallback(() => {
		markReady();
	}, [markReady]);

	playRef.current = play;
	showImmediatelyRef.current = showImmediately;
	onCompleteRef.current = onComplete;

	const registeredPlay = useCallback((delay: number) => {
		return playRef.current(delay);
	}, []);

	const registeredShowImmediately = useCallback(() => {
		showImmediatelyRef.current();
	}, []);

	const registeredOnComplete = useCallback(() => {
		onCompleteRef.current();
	}, []);

	useLayoutEffect(() => {
		mountedRef.current = true;

		return () => {
			mountedRef.current = false;
		};
	}, []);

	useEffect(() => {
		if (hasPlayed) return;
		const node = viewportRef.current;
		if (!node || !root) return;
		const unregisterRoot = root.registerItem({
			id,
			element: node,
			play: registeredPlay,
			showImmediately: registeredShowImmediately,
			onComplete: registeredOnComplete,
		});

		return () => unregisterRoot();
	}, [
		hasPlayed,
		id,
		registeredOnComplete,
		registeredPlay,
		registeredShowImmediately,
		root,
	]);

	useEffect(() => {
		if (hasPlayed) return;
		if (!isReady || !root) return;
		root.markReady(id);
	}, [hasPlayed, id, isReady, root]);

	useEffect(() => {
		return () => {
			if (flushFrameRef.current !== null) {
				cancelAnimationFrame(flushFrameRef.current);
			}
			if (completionFrameRef.current !== null) {
				cancelAnimationFrame(completionFrameRef.current);
			}
		};
	}, []);

	const contextValue = useMemo(
		() => ({
			started,
			disabled,
			registerItem,
			markReady: markItemReady,
			completeItem,
		}),
		[completeItem, disabled, markItemReady, registerItem, started],
	);
	const Tag = as ?? "div";

	return (
		<RevealGroupContext.Provider value={contextValue}>
			<Tag ref={viewportRef} className={className}>
				{children}
			</Tag>
		</RevealGroupContext.Provider>
	);
}

export type RevealListProps = Omit<
	RevealGroupProps,
	"waitFor" | "unlockStage"
> &
	RevealStageAliasProps;

export function RevealList({
	after,
	unlock,
	waitFor,
	unlockStage,
	...props
}: RevealListProps) {
	const stages = resolveRevealStageAliases({
		after,
		unlock,
		waitFor,
		unlockStage,
	});

	return <RevealGroup {...props} {...stages} />;
}

export { RevealList as List };
