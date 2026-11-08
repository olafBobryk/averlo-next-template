"use client";

import clsx from "clsx";
import {
	type AnimationPlaybackControls,
	animate,
	type MotionValue,
	motion,
	motionValue,
	useMotionValue,
	useTransform,
} from "motion/react";
import * as React from "react";
import { spring } from "@/components/ui/foundations/spring";
import { useAnimated } from "@/hooks/useMotionAllowed";

type Layer = { id: number; text: string };
type LayerState = { layers: Layer[]; flowId: number };
type LayerValues = {
	opacity: MotionValue<number>;
	y: MotionValue<number>;
	blur: MotionValue<number>;
	filter: MotionValue<string>;
};

/** Vertical travel of the entering and leaving text, in em. */
const TRAVEL_EM = 0.4;
const BLUR_PX = 3;
/** Sub-pixel tolerance for "the new text fits the box". */
const FIT_TOLERANCE_PX = 0.5;
/** Leaving text counts as gone (and the box may close) at this opacity. */
const GONE_OPACITY = 0.05;

function createLayerValues(visible: boolean): LayerValues {
	const blur = motionValue(visible ? 0 : BLUR_PX);
	const filter = motionValue(`blur(${blur.get()}px)`);
	blur.on("change", (value) => filter.set(`blur(${value}px)`));
	return {
		opacity: motionValue(visible ? 1 : 0),
		y: motionValue(0),
		blur,
		filter,
	};
}

/**
 * A control label that morphs when its text changes. Sequenced so no visible
 * glyph is ever outside the box:
 * - Grow: the box widens first; the new text fades in once it fits.
 * - Shrink: the old text fades out first, then the box closes while the new
 *   text fades in.
 * Text travels ±0.4em with a 3px blur on the feedback spring; the width uses
 * the disclosure spring. Reduced motion and `?motion=off` snap.
 */
export function MorphLabel({
	children,
	className,
}: {
	children: string;
	className?: string;
}) {
	const animated = useAnimated();
	const boxRef = React.useRef<HTMLSpanElement>(null);
	const values = React.useRef(new Map<number, LayerValues>());
	const running = React.useRef(new Map<number, AnimationPlaybackControls[]>());
	const widthRun = React.useRef<AnimationPlaybackControls>(undefined);
	// A negative width means "auto": the box follows its in-flow text at rest.
	const width = useMotionValue(-1);
	const widthStyle = useTransform(width, (value) =>
		value < 0 ? "auto" : `${value}px`,
	);

	const [state, setState] = React.useState<LayerState>(() => ({
		layers: [{ id: 0, text: children }],
		flowId: 0,
	}));
	let { layers } = state;
	const latest = layers[layers.length - 1];
	if (latest.text !== children) {
		// The new text renders out of flow first so the old width can be read.
		layers = [...layers, { id: latest.id + 1, text: children }];
		setState({ layers, flowId: state.flowId });
	}
	const current = layers[layers.length - 1];

	const valuesFor = React.useCallback((id: number) => {
		let layerValues = values.current.get(id);
		if (!layerValues) {
			layerValues = createLayerValues(id === 0);
			values.current.set(id, layerValues);
		}
		return layerValues;
	}, []);

	const stopLayer = React.useCallback((id: number) => {
		for (const run of running.current.get(id) ?? []) run.stop();
		running.current.delete(id);
	}, []);

	const removeLayer = React.useCallback(
		(id: number) => {
			stopLayer(id);
			values.current.delete(id);
			setState((previous) => ({
				...previous,
				layers: previous.layers.filter((layer) => layer.id !== id),
			}));
		},
		[stopLayer],
	);

	React.useLayoutEffect(() => {
		const box = boxRef.current;
		const next = box?.querySelector<HTMLElement>(
			`[data-morph-id="${current.id}"]`,
		);
		if (!box || !next || state.flowId === current.id) return;

		widthRun.current?.stop();
		const outgoing = layers.filter((layer) => layer.id !== current.id);
		const nextValues = valuesFor(current.id);

		if (!animated) {
			for (const layer of outgoing) {
				stopLayer(layer.id);
				values.current.delete(layer.id);
			}
			width.set(-1);
			nextValues.opacity.set(1);
			nextValues.y.set(0);
			nextValues.blur.set(0);
			setState({ layers: [current], flowId: current.id });
			return;
		}

		const from = box.getBoundingClientRect().width;
		const to = next.getBoundingClientRect().width;
		const travel =
			Number.parseFloat(getComputedStyle(box).fontSize) * TRAVEL_EM;
		const growing = to > from + FIT_TOLERANCE_PX;

		// Hold the old width while the new text takes over the flow.
		width.set(from);
		setState({ layers, flowId: current.id });
		nextValues.opacity.set(0);
		nextValues.y.set(travel);
		nextValues.blur.set(BLUR_PX);

		let entered = false;
		const enter = () => {
			if (entered) return;
			entered = true;
			stopLayer(current.id);
			running.current.set(current.id, [
				animate(nextValues.opacity, 1, spring.feedback),
				animate(nextValues.y, 0, spring.feedback),
				animate(nextValues.blur, 0, spring.feedback),
			]);
		};

		let sized = false;
		const resize = () => {
			if (sized) return;
			sized = true;
			const run = animate(width, to, {
				...spring.disclosure,
				onUpdate: (value) => {
					// Growing: the new text arrives only once it fits.
					if (growing && value >= to - FIT_TOLERANCE_PX) enter();
				},
				onComplete: () => {
					enter();
					if (widthRun.current === run) width.set(-1);
				},
			});
			widthRun.current = run;
			// Shrinking: the new text is narrower than the box throughout.
			if (!growing) enter();
		};

		const outgoingValues = outgoing.map((layer) => valuesFor(layer.id));
		const gone = () =>
			outgoingValues.every(({ opacity }) => opacity.get() <= GONE_OPACITY);

		for (const [index, layer] of outgoing.entries()) {
			const { opacity, y, blur } = outgoingValues[index];
			stopLayer(layer.id);
			const fadeOut = animate(opacity, 0, {
				...spring.feedback,
				onUpdate: (value) => {
					// Shrinking waits for the old text to leave.
					if (!growing && gone()) resize();
					// Gone text leaves the DOM without waiting for the spring's tail.
					if (
						value <= GONE_OPACITY &&
						running.current.get(layer.id)?.[0] === fadeOut
					)
						removeLayer(layer.id);
				},
			});
			running.current.set(layer.id, [
				fadeOut,
				animate(y, -travel, spring.feedback),
				animate(blur, BLUR_PX, spring.feedback),
			]);
			fadeOut.then(() => {
				if (running.current.get(layer.id)?.[0] === fadeOut)
					removeLayer(layer.id);
			});
		}
		if (growing || gone()) resize();
	}, [
		animated,
		current,
		layers,
		removeLayer,
		state.flowId,
		stopLayer,
		valuesFor,
		width,
	]);

	React.useEffect(
		() => () => {
			widthRun.current?.stop();
			for (const runs of running.current.values())
				for (const run of runs) run.stop();
		},
		[],
	);

	return (
		<motion.span
			ref={boxRef}
			data-slot="morph-label"
			className={clsx(
				"relative inline-block min-w-0 max-w-full whitespace-nowrap align-bottom",
				className,
			)}
			style={{ width: widthStyle }}
		>
			{layers.map((layer) => {
				const inFlow = layer.id === state.flowId;
				return (
					<motion.span
						key={layer.id}
						data-morph-id={layer.id}
						style={{
							opacity: valuesFor(layer.id).opacity,
							y: valuesFor(layer.id).y,
							filter: valuesFor(layer.id).filter,
						}}
						data-morph-layer={layer.id === current.id ? "current" : "leaving"}
						aria-hidden={layer.id === current.id ? undefined : true}
						className={
							inFlow
								? "block truncate"
								: "pointer-events-none absolute top-0 left-0"
						}
					>
						{layer.text}
					</motion.span>
				);
			})}
		</motion.span>
	);
}
