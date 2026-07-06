"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "@/components/branding/Logo";

const diagonalHoldMs = 520;
const diagonalSweepDurationMs = 1800;
const diagonalSweepGapsMs = [0, 90, 70, 50] as const;
const diagonalBleedPercent = 30;
const diagonalTiltPercent = 24;
const fadeOutDurationMs = 280;
const layerConfigs = [
	{ id: "outer", scale: 5.8, opacity: 0.16 },
	{ id: "wide", scale: 5.06, opacity: 0.36 },
	{ id: "mid", scale: 4.32, opacity: 0.56 },
	{ id: "core", scale: 3.58, opacity: 0.76 },
] as const;
const layerCount = layerConfigs.length;

const finalLayerLaunchMs =
	diagonalHoldMs + getCompressedDiagonalStaggerMs(layerCount - 1);
const closeHandoffMs = finalLayerLaunchMs + diagonalSweepDurationMs * 0.9;
const lastAnimationEndMs = finalLayerLaunchMs + diagonalSweepDurationMs;

export const layerFloodExitDurationMs = closeHandoffMs;

function clamp(value: number, min = 0, max = 1) {
	return Math.max(min, Math.min(max, value));
}

function easeInQuad(value: number) {
	const progress = clamp(value);

	return progress * progress;
}

function relativeTime(timeMs: number, delayMs: number, durationMs: number) {
	return clamp((timeMs - delayMs) / durationMs);
}

function getCompressedDiagonalStaggerMs(order: number) {
	let delayMs = 0;

	for (let index = 1; index <= order; index += 1) {
		delayMs += diagonalSweepGapsMs[index] ?? diagonalSweepGapsMs.at(-1) ?? 0;
	}

	return delayMs;
}

function getLayerProgress(progressMs: number, order: number) {
	const launchDelayMs = diagonalHoldMs + getCompressedDiagonalStaggerMs(order);

	return relativeTime(progressMs, launchDelayMs, diagonalSweepDurationMs);
}

function getExitOpacity(progressMs: number) {
	return 1 - relativeTime(progressMs, closeHandoffMs, fadeOutDurationMs);
}

function getDiagonalMaskPolygon(progress: number) {
	const startX = 72 + diagonalTiltPercent / 2;
	const endX = 28 - diagonalTiltPercent / 2;
	const edge = startX + (endX - startX) * easeInQuad(progress);
	const topX = edge - diagonalTiltPercent / 2;
	const bottomX = edge + diagonalTiltPercent / 2;
	const leftX = -diagonalBleedPercent;
	const topY = -diagonalBleedPercent;
	const bottomY = 100 + diagonalBleedPercent;

	return `polygon(${leftX}% ${topY}%, ${topX.toFixed(3)}% ${topY}%, ${bottomX.toFixed(3)}% ${bottomY}%, ${leftX}% ${bottomY}%)`;
}

function useLayerFloodProgress() {
	const [progressMs, setProgressMs] = useState(0);
	const startTimeRef = useRef<number | null>(null);

	useEffect(() => {
		let frameId = 0;
		let cancelled = false;

		const tick = (timestamp: number) => {
			if (cancelled) return;
			startTimeRef.current ??= timestamp;
			const elapsed = timestamp - startTimeRef.current;
			setProgressMs(Math.min(elapsed, lastAnimationEndMs));

			if (elapsed < lastAnimationEndMs) {
				frameId = requestAnimationFrame(tick);
			}
		};

		frameId = requestAnimationFrame(tick);

		return () => {
			cancelled = true;
			cancelAnimationFrame(frameId);
		};
	}, []);

	return progressMs;
}

export function LayerFloodLoading() {
	const progressMs = useLayerFloodProgress();
	const exitOpacity = getExitOpacity(progressMs);

	return (
		<div
			aria-hidden="true"
			className="relative flex size-full items-center justify-center overflow-hidden"
			data-loading-screen-layer-flood="true"
			style={{ opacity: exitOpacity }}
		>
			{layerConfigs.map((layer, index) => {
				const progress = getLayerProgress(progressMs, index);

				return (
					<div
						className="absolute inset-0 flex items-center justify-center text-foreground"
						key={layer.id}
						style={{
							clipPath: getDiagonalMaskPolygon(progress),
							opacity: layer.opacity,
						}}
					>
						<div style={{ transform: `scale(${layer.scale})` }}>
							<Logo
								as="span"
								variant="mark"
								size="lg"
								interactive={false}
								className="drop-shadow-[0_0_24px_rgba(25,27,37,0.14)]"
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
}
