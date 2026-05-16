"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import Image from "next/image";
import * as React from "react";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import { getMotionTiming } from "@/components/ui/foundations/motionTiming";
import { PaginationControls } from "@/components/ui/misc/PaginationControls";
import type { ButtonProps } from "@/components/ui/primitives/Button";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

export type ImageSwitcherImage = {
	src: string;
	alt: string;
	blurDataURL?: string | null;
};

type CarouselDirection = -1 | 1;

type ImageSwitcherLayer = {
	direction: CarouselDirection;
	index: number;
	key: number;
};

export type ImageSwitcherProps = {
	images: readonly ImageSwitcherImage[];
	initialIndex?: number;
	intervalMs?: number;
	sizes?: string;
	className?: string;
	frameClassName?: string;
	imageClassName?: string;
	controlsClassName?: string;
	paginationVariant?: ButtonProps["variant"];
	paginationButtonSize?: ButtonProps["size"];
	nextLabel?: string;
	prevLabel?: string;
	preserveIconDirection?: boolean;
	enableSwipe?: boolean;
	onIndexChange?: (index: number) => void;
};

const defaultIntervalMs = 4500;
const defaultSwipeOffsetThreshold = 72;
const imageSwitcherTransition = getMotionTiming("grand");

function getWrappedImageIndex(index: number, total: number) {
	if (total <= 0) return 0;
	return (index + total) % total;
}

function getImageKey(image: ImageSwitcherImage) {
	return image.src;
}

function getImagePlaceholder(
	image: ImageSwitcherImage,
	loadedImageKeys: Set<string>,
) {
	return image.blurDataURL && !loadedImageKeys.has(getImageKey(image))
		? "blur"
		: undefined;
}

function getRevealClip(direction: CarouselDirection) {
	return direction === 1
		? {
				WebkitClipPath: "inset(0 0 0 100%)",
				clipPath: "inset(0 0 0 100%)",
			}
		: {
				WebkitClipPath: "inset(0 100% 0 0)",
				clipPath: "inset(0 100% 0 0)",
			};
}

const fullRevealClip = {
	WebkitClipPath: "inset(0 0 0 0)",
	clipPath: "inset(0 0 0 0)",
} as const;

export function ImageSwitcher({
	images,
	initialIndex = 0,
	intervalMs = defaultIntervalMs,
	sizes = "100vw",
	className,
	frameClassName,
	imageClassName,
	controlsClassName,
	paginationVariant,
	paginationButtonSize,
	nextLabel = "Next image",
	prevLabel = "Previous image",
	preserveIconDirection = false,
	enableSwipe = true,
	onIndexChange,
}: ImageSwitcherProps) {
	const motionAllowed = useMotionAllowed(true);
	const motionDisabled = useMotionDisableOverride();
	const shouldAnimate = motionAllowed && !motionDisabled;
	const imageCount = images.length;
	const canSwitch = imageCount > 1;
	const canSwipe = enableSwipe && canSwitch;
	const pointerStartXRef = React.useRef<number | null>(null);
	const initialWrappedIndex = getWrappedImageIndex(initialIndex, imageCount);
	const [activeIndex, setActiveIndex] = React.useState(initialWrappedIndex);
	const [settledIndex, setSettledIndex] = React.useState(initialWrappedIndex);
	const [incomingLayer, setIncomingLayer] =
		React.useState<ImageSwitcherLayer | null>(null);
	const [queuedLayer, setQueuedLayer] =
		React.useState<ImageSwitcherLayer | null>(null);
	const [loadedImageKeys, setLoadedImageKeys] = React.useState<Set<string>>(
		() => new Set(),
	);
	const [timerResetAt, setTimerResetAt] = React.useState(() => Date.now());
	const transitionKeyRef = React.useRef(0);
	const activeIndexRef = React.useRef(activeIndex);
	const incomingLayerRef = React.useRef<ImageSwitcherLayer | null>(null);
	const incomingClearFrameRef = React.useRef<number | null>(null);
	const baseImage = images[settledIndex] ?? images[0];
	const incomingImage = incomingLayer ? images[incomingLayer.index] : null;

	React.useEffect(() => {
		activeIndexRef.current = activeIndex;
	}, [activeIndex]);

	React.useEffect(() => {
		incomingLayerRef.current = incomingLayer;
	}, [incomingLayer]);

	React.useEffect(() => {
		return () => {
			if (incomingClearFrameRef.current !== null) {
				window.cancelAnimationFrame(incomingClearFrameRef.current);
			}
		};
	}, []);

	const markImageLoaded = React.useCallback((image: ImageSwitcherImage) => {
		const imageKey = getImageKey(image);

		setLoadedImageKeys((currentKeys) => {
			if (currentKeys.has(imageKey)) {
				return currentKeys;
			}

			const nextKeys = new Set(currentKeys);
			nextKeys.add(imageKey);
			return nextKeys;
		});
	}, []);

	const clearIncomingFrame = React.useCallback(() => {
		if (incomingClearFrameRef.current === null) return;
		window.cancelAnimationFrame(incomingClearFrameRef.current);
		incomingClearFrameRef.current = null;
	}, []);

	const requestImage = React.useCallback(
		(index: number, direction: CarouselDirection, resetTimer = true) => {
			if (imageCount <= 0) return;
			const previousIndex = activeIndexRef.current;
			const nextIndex = getWrappedImageIndex(index, imageCount);
			if (nextIndex === previousIndex) return;

			if (resetTimer) {
				setTimerResetAt(Date.now());
			}

			activeIndexRef.current = nextIndex;
			setActiveIndex(nextIndex);
			onIndexChange?.(nextIndex);

			if (!shouldAnimate) {
				setSettledIndex(nextIndex);
				incomingLayerRef.current = null;
				clearIncomingFrame();
				setIncomingLayer(null);
				setQueuedLayer(null);
				return;
			}

			const nextTransitionKey = transitionKeyRef.current + 1;
			transitionKeyRef.current = nextTransitionKey;
			const nextLayer: ImageSwitcherLayer = {
				direction,
				index: nextIndex,
				key: nextTransitionKey,
			};

			if (incomingLayerRef.current) {
				setQueuedLayer(nextLayer);
				return;
			}

			incomingLayerRef.current = nextLayer;
			clearIncomingFrame();
			setIncomingLayer(nextLayer);
		},
		[clearIncomingFrame, imageCount, onIndexChange, shouldAnimate],
	);

	const requestRelativeImage = React.useCallback(
		(delta: number, direction: CarouselDirection, resetTimer = true) => {
			requestImage(activeIndexRef.current + delta, direction, resetTimer);
		},
		[requestImage],
	);

	React.useEffect(() => {
		if (!canSwitch || intervalMs <= 0) return undefined;
		const elapsedSinceReset = Math.max(0, Date.now() - timerResetAt);
		const timeoutDuration = Math.max(0, intervalMs - elapsedSinceReset);

		const timeoutId = window.setTimeout(() => {
			requestRelativeImage(1, 1, false);
		}, timeoutDuration);

		return () => window.clearTimeout(timeoutId);
	}, [canSwitch, intervalMs, requestRelativeImage, timerResetAt]);

	React.useEffect(() => {
		if (activeIndex >= imageCount) {
			const nextIndex = getWrappedImageIndex(activeIndex, imageCount);
			activeIndexRef.current = nextIndex;
			setActiveIndex(nextIndex);
		}
		if (settledIndex >= imageCount) {
			setSettledIndex(getWrappedImageIndex(settledIndex, imageCount));
		}
		setIncomingLayer((currentLayer) => {
			if (!currentLayer || currentLayer.index < imageCount) {
				return currentLayer;
			}

			incomingLayerRef.current = null;
			return null;
		});
		setQueuedLayer((currentLayer) =>
			currentLayer && currentLayer.index >= imageCount ? null : currentLayer,
		);
	}, [activeIndex, imageCount, settledIndex]);

	React.useEffect(() => {
		if (shouldAnimate) return;

		setSettledIndex(activeIndexRef.current);
		incomingLayerRef.current = null;
		clearIncomingFrame();
		setIncomingLayer(null);
		setQueuedLayer(null);
	}, [clearIncomingFrame, shouldAnimate]);

	React.useEffect(() => {
		if (!shouldAnimate || incomingLayer || !queuedLayer) return;

		if (queuedLayer.index === settledIndex) {
			setQueuedLayer(null);
			return;
		}

		incomingLayerRef.current = queuedLayer;
		clearIncomingFrame();
		setIncomingLayer(queuedLayer);
		setQueuedLayer(null);
	}, [
		clearIncomingFrame,
		incomingLayer,
		queuedLayer,
		settledIndex,
		shouldAnimate,
	]);

	if (!baseImage) return null;

	function completeIncomingLayer(completedKey: number) {
		const completedLayer = incomingLayerRef.current;

		if (!completedLayer || completedLayer.key !== completedKey) {
			return;
		}

		setSettledIndex(completedLayer.index);
		clearIncomingFrame();
		incomingClearFrameRef.current = window.requestAnimationFrame(() => {
			incomingClearFrameRef.current = null;
			setIncomingLayer((latestLayer) => {
				if (!latestLayer || latestLayer.key !== completedKey) {
					return latestLayer;
				}

				incomingLayerRef.current = null;
				return null;
			});
		});
	}

	function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
		if (!canSwipe) return;
		pointerStartXRef.current = event.clientX;
		event.currentTarget.setPointerCapture(event.pointerId);
	}

	function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
		const startX = pointerStartXRef.current;
		pointerStartXRef.current = null;

		if (event.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}

		if (!canSwipe || startX === null) return;
		const offsetX = event.clientX - startX;

		if (offsetX <= -defaultSwipeOffsetThreshold) {
			requestRelativeImage(1, 1);
			return;
		}

		if (offsetX >= defaultSwipeOffsetThreshold) {
			requestRelativeImage(-1, -1);
		}
	}

	return (
		<div className={clsx("flex w-full flex-col gap-4", className)}>
			<motion.div
				className={clsx(
					"relative h-80 w-full touch-pan-y overflow-hidden rounded-xl bg-surface",
					frameClassName,
				)}
				onPointerDown={handlePointerDown}
				onPointerUp={handlePointerUp}
				onPointerCancel={() => {
					pointerStartXRef.current = null;
				}}
			>
				<Image
					key={`image-switcher-base-${baseImage.src}`}
					src={baseImage.src}
					alt={incomingImage ? "" : baseImage.alt}
					fill
					loading="eager"
					placeholder={getImagePlaceholder(baseImage, loadedImageKeys)}
					blurDataURL={baseImage.blurDataURL ?? undefined}
					sizes={sizes}
					className={clsx("object-cover object-center", imageClassName)}
					draggable={false}
					onLoad={() => markImageLoaded(baseImage)}
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 opacity-0"
				>
					{images.map((image) => (
						<span key={getImageKey(image)} className="absolute inset-0">
							<Image
								src={image.src}
								alt=""
								fill
								loading="eager"
								placeholder={getImagePlaceholder(image, loadedImageKeys)}
								blurDataURL={image.blurDataURL ?? undefined}
								sizes={sizes}
								className={clsx("object-cover object-center", imageClassName)}
								draggable={false}
								onLoad={() => markImageLoaded(image)}
							/>
						</span>
					))}
				</div>
				{incomingLayer && incomingImage ? (
					<motion.div
						key={incomingLayer.key}
						className="absolute inset-0 will-change-[clip-path]"
						initial={getRevealClip(incomingLayer.direction)}
						animate={fullRevealClip}
						transition={imageSwitcherTransition}
						onAnimationComplete={() => completeIncomingLayer(incomingLayer.key)}
					>
						<Image
							src={incomingImage.src}
							alt={incomingImage.alt}
							fill
							loading="eager"
							placeholder={getImagePlaceholder(incomingImage, loadedImageKeys)}
							blurDataURL={incomingImage.blurDataURL ?? undefined}
							sizes={sizes}
							className={clsx("object-cover object-center", imageClassName)}
							draggable={false}
							onLoad={() => markImageLoaded(incomingImage)}
						/>
					</motion.div>
				) : null}
			</motion.div>
			{canSwitch ? (
				<PaginationControls
					buttonSize={paginationButtonSize}
					className={controlsClassName}
					current={activeIndex + 1}
					nextLabel={nextLabel}
					onNext={() => requestRelativeImage(1, 1)}
					onPrev={() => requestRelativeImage(-1, -1)}
					preserveIconDirection={preserveIconDirection}
					prevLabel={prevLabel}
					total={imageCount}
					variant={paginationVariant}
				/>
			) : null}
		</div>
	);
}
