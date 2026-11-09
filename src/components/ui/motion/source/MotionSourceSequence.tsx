"use client";

import { type UseScrollOptions, useMotionValue } from "motion/react";
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
import { motionTiming } from "@/components/ui/foundations/motionTiming";
import { getMotionStepEase } from "../runtime/timing";
import {
	clampMotionProgress,
	MotionSourceContext,
	type MotionSourceContextValue,
} from "./context";
import { ScrollSource } from "./MotionSourceRoot";
import {
	MotionSchedulerContext,
	type RegisteredMotionParticipant,
	sortParticipantsByDocumentOrder,
	waitForMotionDelay,
} from "./scheduler/context";
import { useMotionParticipant } from "./scheduler/useMotionParticipant";
import { SlotWithRef } from "./sourceShared";

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
	 * One scroll progress owned by the Sequence; each `MotionSource.Item`
	 * child gets a staggered sub-range of it.
	 */
	mode: "scroll";
	/** Catch-up intro for content on screen at activation (default on). */
	intro?: boolean;
	offset?: MotionSourceSequenceOffset;
	ready?: boolean;
};

export type MotionSourceSequenceOffset = UseScrollOptions["offset"];

export type MotionSourceSequenceProps = TimeSequenceProps | ScrollSequenceProps;

/**
 * Starts as the top edge clears the fold and completes once it passes just
 * above the middle, so the batch is fully shown before the reading line.
 */
export const scrollSequenceOffset: UseScrollOptions["offset"] = [
	"start 95%",
	"start 55%",
];

const defaultStagger = 0.18;

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

type ItemRange = readonly [number, number];

type ScrollSequenceSlices = {
	register: (
		node: HTMLElement,
		setRange: (range: ItemRange) => void,
	) => () => void;
};

const ScrollSequenceContext = createContext<ScrollSequenceSlices | null>(null);

/**
 * Sub-range i of n: each item spans one `slow` reveal and starts `stagger`
 * seconds after the previous one, normalised to the whole sequence. The
 * linear intro over the same total therefore plays each slice over `slow`,
 * and each item eases within its slice (`getScrollSequenceItemProgress`).
 */
export function getScrollSequenceRanges(count: number, stagger: number) {
	const span = Number(motionTiming.slow.duration);
	const step = Math.max(0, stagger);
	const total = span + Math.max(0, count - 1) * step;
	return Array.from(
		{ length: count },
		(_, index): ItemRange => [
			(index * step) / total,
			(index * step + span) / total,
		],
	);
}

function getScrollSequenceDuration(count: number, stagger: number) {
	return (
		Number(motionTiming.slow.duration) +
		Math.max(0, count - 1) * Math.max(0, stagger)
	);
}

function ScrollSequence({
	children,
	as,
	className,
	intro = true,
	offset = scrollSequenceOffset,
	ready,
	stagger = defaultStagger,
}: ScrollSequenceProps) {
	const itemsRef = useRef(new Map<HTMLElement, (range: ItemRange) => void>());
	const frameRef = useRef<number | null>(null);

	const connectedItems = useCallback(
		() =>
			[...itemsRef.current.keys()]
				.filter((node) => node.isConnected)
				.sort((first, second) =>
					first.compareDocumentPosition(second) &
					Node.DOCUMENT_POSITION_FOLLOWING
						? -1
						: 1,
				),
		[],
	);

	const assignRanges = useCallback(() => {
		frameRef.current = null;
		const nodes = connectedItems();
		const ranges = getScrollSequenceRanges(nodes.length, stagger);
		nodes.forEach((node, index) => {
			itemsRef.current.get(node)?.(ranges[index]);
		});
	}, [connectedItems, stagger]);

	const scheduleAssign = useCallback(() => {
		if (frameRef.current !== null) return;
		frameRef.current = requestAnimationFrame(assignRanges);
	}, [assignRanges]);

	const register = useCallback<ScrollSequenceSlices["register"]>(
		(node, setRange) => {
			itemsRef.current.set(node, setRange);
			scheduleAssign();
			return () => {
				itemsRef.current.delete(node);
				scheduleAssign();
			};
		},
		[scheduleAssign],
	);

	// Items register in their layout effects, before this one runs, so the
	// first painted frame already has its sub-ranges.
	useLayoutEffect(() => {
		if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
		assignRanges();
	}, [assignRanges]);

	useEffect(
		() => () => {
			if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
		},
		[],
	);

	const introDuration = useCallback(
		() => getScrollSequenceDuration(connectedItems().length, stagger),
		[connectedItems, stagger],
	);
	const slices = useMemo(() => ({ register }), [register]);

	return (
		<ScrollSequenceContext.Provider value={slices}>
			<ScrollSource
				as={as}
				className={className}
				data-motion-source-sequence=""
				data-motion-source-sequence-mode="scroll"
				data-motion-source-sequence-stagger={stagger}
				introDuration={introDuration}
				strategy={{ type: "scroll", intro, offset, ready }}
			>
				{children}
			</ScrollSource>
		</ScrollSequenceContext.Provider>
	);
}

const easeItemSlice = getMotionStepEase("slow");

/**
 * An item's progress at Sequence progress `value`: its linear position in
 * the slice, eased on the `slow` curve. The ease is monotonic and fixes 0
 * and 1, so the catch-up intro (which scales the Sequence progress) still
 * lands on exactly the value pure scrolling gives, and never passes it.
 */
function getScrollSequenceItemProgress(value: number, [start, end]: ItemRange) {
	if (end <= start) return value >= end ? 1 : 0;
	return easeItemSlice(clampMotionProgress((value - start) / (end - start)));
}

type MotionSourceItemOwnProps = {
	as?: ElementType;
	asChild?: boolean;
	children: ReactNode;
};

export type MotionSourceItemProps = MotionSourceItemOwnProps &
	Omit<ComponentPropsWithoutRef<"div">, keyof MotionSourceItemOwnProps>;

/**
 * One staggered slice of a scroll Sequence's progress. Effects inside it
 * see 0 to 1 across the slice, eased on `slow`, and keep their own `range`
 * within it.
 */
export function MotionSourceItem({
	as: Tag = "div",
	asChild = false,
	children,
	...rest
}: MotionSourceItemProps) {
	const slices = useContext(ScrollSequenceContext);
	const source = useContext(MotionSourceContext);
	if (!slices || !source) {
		throw new Error(
			'MotionSource.Item must be rendered inside MotionSource.Sequence mode="scroll".',
		);
	}
	const nodeRef = useRef<HTMLElement | null>(null);
	const [range, setRange] = useState<ItemRange>([0, 1]);
	const progress = useMotionValue(
		getScrollSequenceItemProgress(source.progress.get(), range),
	);
	const parentProgress = source.progress;

	useLayoutEffect(() => {
		const node = nodeRef.current;
		if (!node) return;
		return slices.register(node, (next) =>
			setRange((current) =>
				current[0] === next[0] && current[1] === next[1] ? current : next,
			),
		);
	}, [slices]);

	useLayoutEffect(() => {
		progress.jump(getScrollSequenceItemProgress(parentProgress.get(), range));
		return parentProgress.on("change", (value) =>
			progress.set(getScrollSequenceItemProgress(value, range)),
		);
	}, [parentProgress, progress, range]);

	const value = useMemo<MotionSourceContextValue>(
		() => ({ mode: source.mode, progress, strategyType: source.strategyType }),
		[progress, source.mode, source.strategyType],
	);
	const Frame = asChild ? SlotWithRef : Tag;

	return (
		<MotionSourceContext.Provider value={value}>
			<Frame
				ref={nodeRef}
				data-motion-source-item=""
				data-motion-source-item-range={`${range[0].toFixed(4)} ${range[1].toFixed(4)}`}
				{...rest}
			>
				{children}
			</Frame>
		</MotionSourceContext.Provider>
	);
}
