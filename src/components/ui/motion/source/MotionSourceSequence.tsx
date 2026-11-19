"use client";

import {
	animate,
	type MotionValue,
	motionValue,
	type UseScrollOptions,
	useMotionValue,
} from "motion/react";
import { usePathname } from "next/navigation";
import {
	type ComponentPropsWithoutRef,
	createContext,
	type ElementType,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import { useMotionDriver } from "@/components/ui/foundations/motionDriverContext";
import { motionTiming } from "@/components/ui/foundations/motionTiming";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { animateGsapProgress } from "../runtime/animateProgress";
import { getMotionStepEase } from "../runtime/timing";
import {
	MotionSourceContext,
	type MotionSourceContextValue,
	type MotionSourceMode,
} from "./context";
import {
	defaultStagger,
	getPageEntryScroll,
	type PlayIntro,
	registerEntryItem,
	startEntrySequence,
	unregisterEntryItem,
} from "./entrySequence";
import {
	MotionSchedulerContext,
	type RegisteredMotionParticipant,
	sortParticipantsByDocumentOrder,
	waitForMotionDelay,
} from "./scheduler/context";
import { useMotionParticipant } from "./scheduler/useMotionParticipant";
import {
	invalidateReach,
	layoutReach,
	type ReachSlot,
	reachAt,
	subscribeReachGroup,
} from "./scrollReach";
import { SlotWithRef, useSourceReady } from "./sourceShared";

type SequenceBaseProps = {
	children: ReactNode;
	as?: ElementType;
	className?: string;
	/** Seconds between items, measured against one item's `slow` reveal. */
	stagger?: number;
};

type TimeSequenceProps = SequenceBaseProps & {
	/** `reveal` children play in turn on the scheduler clock (default). */
	mode?: "time";
	once?: boolean;
};

type ScrollSequenceProps = SequenceBaseProps & {
	/**
	 * Scroll reveals: each `MotionSource.Item` shows `intro × reach`
	 * (motion spec V1–V3). `stagger` spaces the entry sequence and splits a
	 * grid row's scroll range.
	 */
	mode: "scroll";
	/** Items on screen at entry join the page's entry sequence (default on). */
	intro?: boolean;
	offset?: MotionSourceSequenceOffset;
	ready?: boolean;
};

export type MotionSourceSequenceOffset = UseScrollOptions["offset"];

export type MotionSourceSequenceProps = TimeSequenceProps | ScrollSequenceProps;

/**
 * Each item starts as its top edge clears the fold and completes once it
 * passes just above the middle, or at the max scroll when the page ends
 * first (V2).
 */
export const scrollSequenceOffset: UseScrollOptions["offset"] = [
	"start 95%",
	"start 55%",
];

export function MotionSourceSequence(props: MotionSourceSequenceProps) {
	return props.mode === "scroll" ? (
		<ScrollSequence {...props} />
	) : (
		<TimeSequence {...props} />
	);
}

function TimeSequence({
	children,
	as: Tag = "div",
	className,
	once = false,
	stagger = defaultStagger,
}: TimeSequenceProps) {
	const wrapperRef = useRef<HTMLElement | null>(null);
	const participantsRef = useRef(
		new Map<string, RegisteredMotionParticipant>(),
	);
	const completedRef = useRef(new Set<string>());
	const orderRef = useRef(0);
	const flushFrameRef = useRef<number | null>(null);
	const completionFrameRef = useRef<number | null>(null);
	const completionResolverRef = useRef<(() => void) | null>(null);
	const playbackCycleRef = useRef(0);
	const [started, setStarted] = useState(false);
	const startedRef = useRef(false);
	const disabledRef = useRef(false);

	const finish = useCallback(() => {
		completionResolverRef.current?.();
		completionResolverRef.current = null;
	}, []);

	const checkCompletion = useCallback(() => {
		completionFrameRef.current = null;
		if (!startedRef.current) return;
		const connected = [...participantsRef.current.values()].filter(
			(participant) => participant.element.isConnected,
		);
		if (
			connected.length === 0 ||
			connected.every((participant) => completedRef.current.has(participant.id))
		) {
			finish();
		}
	}, [finish]);

	const scheduleCompletionCheck = useCallback(() => {
		if (completionFrameRef.current !== null) return;
		completionFrameRef.current = requestAnimationFrame(checkCompletion);
	}, [checkCompletion]);

	const complete = useCallback(
		(id: string) => {
			completedRef.current.add(id);
			scheduleCompletionCheck();
		},
		[scheduleCompletionCheck],
	);

	const flushReadyParticipants = useCallback(() => {
		flushFrameRef.current = null;
		if (!startedRef.current) return;
		const participants = [...participantsRef.current.values()]
			.filter(
				(participant) =>
					participant.ready &&
					!participant.played &&
					participant.element.isConnected,
			)
			.sort(sortParticipantsByDocumentOrder);

		participants.forEach((participant, index) => {
			const playbackCycle = playbackCycleRef.current;
			participant.played = true;
			if (disabledRef.current) {
				participant.showImmediately();
				complete(participant.id);
				return;
			}
			void Promise.resolve(participant.play(index * stagger)).finally(() => {
				if (playbackCycle === playbackCycleRef.current)
					complete(participant.id);
			});
		});
		scheduleCompletionCheck();
	}, [complete, scheduleCompletionCheck, stagger]);

	const scheduleFlush = useCallback(() => {
		if (flushFrameRef.current !== null) return;
		flushFrameRef.current = requestAnimationFrame(flushReadyParticipants);
	}, [flushReadyParticipants]);

	const register = useCallback(
		({
			id,
			element,
			play,
			reset,
			showImmediately,
		}: Omit<RegisteredMotionParticipant, "order" | "ready" | "played">) => {
			participantsRef.current.set(id, {
				id,
				element,
				play,
				reset,
				showImmediately,
				order: orderRef.current,
				ready: false,
				played: false,
			});
			orderRef.current += 1;
			if (startedRef.current) scheduleCompletionCheck();
			return () => {
				participantsRef.current.delete(id);
				completedRef.current.delete(id);
				scheduleCompletionCheck();
			};
		},
		[scheduleCompletionCheck],
	);

	const markReady = useCallback(
		(id: string) => {
			const participant = participantsRef.current.get(id);
			if (!participant || participant.ready || participant.played) return;
			participant.ready = true;
			scheduleFlush();
		},
		[scheduleFlush],
	);

	const start = useCallback(() => {
		startedRef.current = true;
		setStarted(true);
		scheduleFlush();
		scheduleCompletionCheck();
	}, [scheduleCompletionCheck, scheduleFlush]);

	const play = useCallback(
		async (delay: number) => {
			const cycle = playbackCycleRef.current;
			await waitForMotionDelay(delay);
			if (cycle !== playbackCycleRef.current) return;
			return new Promise<void>((resolve) => {
				completionResolverRef.current = resolve;
				start();
			});
		},
		[start],
	);

	const showImmediately = useCallback(() => {
		disabledRef.current = true;
		start();
	}, [start]);

	const reset = useCallback(() => {
		playbackCycleRef.current += 1;
		startedRef.current = false;
		setStarted(false);
		if (flushFrameRef.current !== null) {
			cancelAnimationFrame(flushFrameRef.current);
			flushFrameRef.current = null;
		}
		if (completionFrameRef.current !== null) {
			cancelAnimationFrame(completionFrameRef.current);
			completionFrameRef.current = null;
		}
		completedRef.current.clear();
		for (const participant of participantsRef.current.values()) {
			participant.ready = false;
			participant.played = false;
			participant.reset();
		}
		finish();
	}, [finish]);

	const { disabled } = useMotionParticipant({
		elementRef: wrapperRef,
		once,
		play,
		reset,
		showImmediately,
	});
	disabledRef.current = disabled;
	const ignoreParticipantExit = useCallback(() => {}, []);

	const scheduler = useMemo(
		() => ({
			disabled,
			kind: "sequence" as const,
			started,
			register,
			markExited: ignoreParticipantExit,
			markReady,
		}),
		[disabled, ignoreParticipantExit, markReady, register, started],
	);

	useEffect(
		() => () => {
			playbackCycleRef.current += 1;
			if (flushFrameRef.current !== null)
				cancelAnimationFrame(flushFrameRef.current);
			if (completionFrameRef.current !== null)
				cancelAnimationFrame(completionFrameRef.current);
			finish();
		},
		[finish],
	);

	return (
		<MotionSchedulerContext.Provider value={scheduler}>
			<Tag
				ref={wrapperRef}
				className={className}
				data-motion-source-sequence=""
				data-motion-source-sequence-once={once}
				data-motion-source-sequence-stagger={stagger}
			>
				{children}
			</Tag>
		</MotionSchedulerContext.Provider>
	);
}

type SequenceItemRegistration = {
	reach: MotionValue<number>;
	unregister: () => void;
};

type ScrollSequenceContextValue = {
	/** Motion is allowed: off, every item renders final. */
	motionOn: boolean;
	/** `ready={false}` holds every item hidden. */
	active: boolean;
	/** App and driver ready: until then (SSR, hydration) items render final. */
	appReady: boolean;
	mode: MotionSourceMode;
	stagger: number;
	intro: boolean;
	register: (node: HTMLElement) => SequenceItemRegistration;
	/** An item's shown value, for the Sequence's own progress (its least revealed item). */
	report: (node: HTMLElement, value: number) => void;
};

const ScrollSequenceContext = createContext<ScrollSequenceContextValue | null>(
	null,
);

const itemDuration = Number(motionTiming.slow.duration);

/** The element's layout top in the document, without its own reveal translate. */
function measureItem(node: HTMLElement) {
	const rect = node.getBoundingClientRect();
	const transform = getComputedStyle(node).transform;
	const translateY =
		transform && transform !== "none"
			? new DOMMatrixReadOnly(transform).m42
			: 0;
	return { top: rect.top + window.scrollY - translateY, height: rect.height };
}

function byDocumentOrder(first: HTMLElement, second: HTMLElement) {
	return first.compareDocumentPosition(second) &
		Node.DOCUMENT_POSITION_FOLLOWING
		? -1
		: 1;
}

/**
 * Scroll reveals: every `MotionSource.Item` shows `reveal = intro(t) × reach(y)`
 * (motion spec V1–V3), each term eased on `slow`.
 * - `intro(t)`: the page's entry sequence (`entrySequence.ts`). Items on screen
 *   at entry play one timed sequence in reading order; every other item has
 *   intro = 1.
 * - `reach(y)`: scroll progress from the item's own position
 *   (`scrollReach.ts`), finishing at the max scroll at the latest. Items
 *   already past their start line at entry are reached (1).
 * Both are live all the time; nothing switches between them.
 */
function ScrollSequence({
	children,
	as: Tag = "div",
	className,
	intro = true,
	offset = scrollSequenceOffset,
	ready,
	stagger = defaultStagger,
}: ScrollSequenceProps) {
	const appReady = useSourceReady();
	const motionAllowed = useMotionAllowed(true);
	const motionDisabled = useMotionDisableOverride();
	const driver = useMotionDriver();
	const motionOn = motionAllowed && !motionDisabled;
	const active = ready !== false;
	const mode: MotionSourceMode =
		appReady && motionOn ? "animated" : "static-final";
	const items = useRef(
		new Map<HTMLElement, { reach: MotionValue<number>; value: number }>(),
	);
	const layout = useRef<{ nodes: HTMLElement[]; slots: ReachSlot[] }>({
		nodes: [],
		slots: [],
	});
	const activeRef = useRef(active);
	activeRef.current = active;
	const progress = useMotionValue(motionOn && !active ? 0 : 1);
	const offsetKey = JSON.stringify(offset);
	const resolvedStagger = Math.max(0, stagger);

	useLayoutEffect(() => {
		const parsedOffset = JSON.parse(offsetKey) as NonNullable<typeof offset>;
		return subscribeReachGroup({
			measure: () => {
				const nodes = [...items.current.keys()]
					.filter((node) => node.isConnected)
					.sort(byDocumentOrder);
				const viewportHeight = window.innerHeight;
				layout.current = {
					nodes,
					slots: layoutReach({
						items: nodes.map(measureItem),
						offset: parsedOffset,
						viewportHeight,
						maxScroll: document.documentElement.scrollHeight - viewportHeight,
						entryScroll: getPageEntryScroll(),
						itemDuration,
						stagger: resolvedStagger,
					}),
				};
			},
			update: (scrollY) => {
				const { nodes, slots } = layout.current;
				nodes.forEach((node, index) => {
					items.current
						.get(node)
						?.reach.set(activeRef.current ? reachAt(slots[index], scrollY) : 0);
				});
			},
		});
	}, [offsetKey, resolvedStagger]);

	useEffect(() => {
		void active;
		invalidateReach();
	}, [active]);

	const register = useCallback((node: HTMLElement) => {
		const reach = motionValue(0);
		items.current.set(node, { reach, value: 0 });
		invalidateReach();
		return {
			reach,
			unregister: () => {
				items.current.delete(node);
				invalidateReach();
			},
		};
	}, []);

	const report = useCallback(
		(node: HTMLElement, value: number) => {
			const entry = items.current.get(node);
			if (!entry) return;
			entry.value = value;
			let least = 1;
			for (const item of items.current.values())
				least = Math.min(least, item.value);
			progress.set(least);
		},
		[progress],
	);

	const sequence = useMemo<ScrollSequenceContextValue>(
		() => ({
			active,
			appReady,
			intro,
			mode,
			motionOn,
			register,
			report,
			stagger: resolvedStagger,
		}),
		[
			active,
			appReady,
			intro,
			mode,
			motionOn,
			register,
			report,
			resolvedStagger,
		],
	);
	const source = useMemo<MotionSourceContextValue>(
		() => ({ mode, progress, strategyType: "scroll" }),
		[mode, progress],
	);

	return (
		<ScrollSequenceContext.Provider value={sequence}>
			<MotionSourceContext.Provider value={source}>
				<Tag
					className={className}
					data-motion-source=""
					data-motion-source-driver={driver === "hybrid" ? "gsap" : "motion"}
					data-motion-source-mode={mode}
					data-motion-source-strategy="scroll"
					data-motion-source-sequence=""
					data-motion-source-sequence-mode="scroll"
					data-motion-source-sequence-stagger={stagger}
				>
					{children}
				</Tag>
			</MotionSourceContext.Provider>
		</ScrollSequenceContext.Provider>
	);
}

const easeSlow = getMotionStepEase("slow");

/** The entry intro runs at a constant rate over one `slow` reveal; the item eases it on `slow`. */
const playIntroGsap: PlayIntro = (intro, delay) => {
	const tween = animateGsapProgress(intro, 1, {
		delay,
		duration: itemDuration,
		linear: true,
	});
	return () => tween.kill();
};

const playIntroMotion: PlayIntro = (intro, delay) => {
	const controls = animate(intro, 1, {
		delay,
		duration: itemDuration,
		ease: "linear",
	});
	return () => controls.stop();
};

type MotionSourceItemOwnProps = {
	as?: ElementType;
	asChild?: boolean;
	children: ReactNode;
};

export type MotionSourceItemProps = MotionSourceItemOwnProps &
	Omit<ComponentPropsWithoutRef<"div">, keyof MotionSourceItemOwnProps>;

/**
 * One scroll reveal inside `MotionSource.Sequence mode="scroll"`. Effects
 * inside it see `ease(intro) × ease(reach)`, 0 to 1, and keep their own
 * `range` within it.
 */
export function MotionSourceItem({
	as: Tag = "div",
	asChild = false,
	children,
	...rest
}: MotionSourceItemProps) {
	const sequence = useContext(ScrollSequenceContext);
	if (!sequence) {
		throw new Error(
			'MotionSource.Item must be rendered inside MotionSource.Sequence mode="scroll".',
		);
	}
	const {
		active,
		appReady,
		intro: joins,
		motionOn,
		register,
		report,
	} = sequence;
	const stagger = sequence.stagger;
	const nodeRef = useRef<HTMLElement | null>(null);
	const driver = useMotionDriver();
	const pathname = usePathname();
	const intro = useMotionValue(0);
	const reach = useMotionValue(0);
	// Motion off: final. Held (`ready={false}`): hidden. Before the app is
	// ready (SSR, hydration): final. Otherwise both terms apply.
	const gate = !motionOn ? 1 : !active ? 0 : !appReady ? 1 : -1;
	const progress = useMotionValue(gate >= 0 ? gate : 0);
	useLayoutEffect(() => {
		const update = () =>
			progress.set(
				gate >= 0 ? gate : easeSlow(intro.get()) * easeSlow(reach.get()),
			);
		update();
		const unsubscribeIntro = intro.on("change", update);
		const unsubscribeReach = reach.on("change", update);
		return () => {
			unsubscribeIntro();
			unsubscribeReach();
		};
	}, [gate, intro, progress, reach]);

	useLayoutEffect(() => {
		const node = nodeRef.current;
		if (!node) return;
		registerEntryItem(
			node,
			{
				intro,
				joins,
				play: driver === "hybrid" ? playIntroGsap : playIntroMotion,
				// The Sequence's stable `register` doubles as its identity.
				sequence: register,
				stagger,
			},
			pathname,
		);
		const registration = register(node);
		reach.jump(registration.reach.get());
		const unsubscribeReach = registration.reach.on("change", (value) =>
			reach.set(value),
		);
		report(node, progress.get());
		const unsubscribeProgress = progress.on("change", (value) =>
			report(node, value),
		);
		return () => {
			unsubscribeProgress();
			unsubscribeReach();
			registration.unregister();
			unregisterEntryItem(node);
		};
	}, [
		driver,
		intro,
		joins,
		pathname,
		progress,
		reach,
		register,
		report,
		stagger,
	]);

	useEffect(() => {
		if (!appReady) return;
		startEntrySequence(motionOn, pathname);
	}, [appReady, motionOn, pathname]);

	const value = useMemo<MotionSourceContextValue>(
		() => ({ mode: sequence.mode, progress, strategyType: "scroll" }),
		[progress, sequence.mode],
	);
	const Frame = asChild ? SlotWithRef : Tag;

	return (
		<MotionSourceContext.Provider value={value}>
			<Frame ref={nodeRef} data-motion-source-item="" {...rest}>
				{children}
			</Frame>
		</MotionSourceContext.Provider>
	);
}
