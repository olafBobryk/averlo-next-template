"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
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

type ImageSwitcherPreloadItem = {
	image: ImageSwitcherImage;
	key: string;
};

export type ImageSwitcherProps = {
	images: readonly ImageSwitcherImage[];
	initialIndex?: number;
	selectedIndex?: number;
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
	showControls?: boolean;
	onIndexChange?: (index: number) => void;
};

const defaultIntervalMs = 4500;
const defaultSwipeOffsetThreshold = 72;
const imageSwitcherTransition = getMotionTiming("grand");

function getWrappedImageIndex(index: number, total: number) {
	if (total <= 0) return 0;
	return (index + total) % total;
}

function getImageDirection(
	currentIndex: number,
	nextIndex: number,
	total: number,
): CarouselDirection {
	const forwardDistance = getWrappedImageIndex(nextIndex - currentIndex, total);
	const backwardDistance = getWrappedImageIndex(
		currentIndex - nextIndex,
		total,
	);
	return forwardDistance <= backwardDistance ? 1 : -1;
}

function getImageKey(image: ImageSwitcherImage) {
	return image.src;
}

function getImagePreloadItems(
	images: readonly ImageSwitcherImage[],
): ImageSwitcherPreloadItem[] {
	const seenImageKeys = new Map<string, number>();

	return images.map((image) => {
		const imageKey = getImageKey(image);
		const occurrence = seenImageKeys.get(imageKey) ?? 0;
		seenImageKeys.set(imageKey, occurrence + 1);

		return {
			image,
			key: occurrence === 0 ? imageKey : `${imageKey}-${occurrence}`,
		};
	});
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
	selectedIndex,
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
	showControls = true,
	onIndexChange,
}: ImageSwitcherProps) {
	const motionAllowed = useMotionAllowed(true);
	const motionDisabled = useMotionDisableOverride();
	const shouldAnimate = motionAllowed && !motionDisabled;
	const imageCount = images.length;
	const canSwitch = imageCount > 1;
	const canSwipe = enableSwipe && canSwitch;
	const pointerStartXRef = React.useRef<number | null>(null);
	const initialWrappedIndex = getWrappedImageIndex(
		selectedIndex ?? initialIndex,
		imageCount,
	);
	const [activeIndex, setActiveIndex] = React.useState(initialWrappedIndex);
	const [settledIndex, setSettledIndex] = React.useState(initialWrappedIndex);
	const [incomingLayers, setIncomingLayers] = React.useState<
		ImageSwitcherLayer[]
	>([]);
	const [loadedImageKeys, setLoadedImageKeys] = React.useState<Set<string>>(
		() => new Set(),
	);
	const [timerResetAt, setTimerResetAt] = React.useState(() => Date.now());
	const transitionKeyRef = React.useRef(0);
	const activeIndexRef = React.useRef(activeIndex);
	const baseImage = images[settledIndex] ?? images[0];
	const preloadItems = React.useMemo(
		() => getImagePreloadItems(images),
		[images],
	);

	React.useEffect(() => {
		activeIndexRef.current = activeIndex;
	}, [activeIndex]);

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

	const requestImage = React.useCallback(
		(
			index: number,
			direction: CarouselDirection,
			resetTimer = true,
			notifyChange = true,
		) => {
			if (imageCount <= 0) return;
			const previousIndex = activeIndexRef.current;
			const nextIndex = getWrappedImageIndex(index, imageCount);
			if (nextIndex === previousIndex) return;

			if (resetTimer) {
				setTimerResetAt(Date.now());
			}

			activeIndexRef.current = nextIndex;
			setActiveIndex(nextIndex);
			if (notifyChange) onIndexChange?.(nextIndex);

			if (!shouldAnimate) {
				setSettledIndex(nextIndex);
				setIncomingLayers([]);
				return;
			}

			const nextTransitionKey = transitionKeyRef.current + 1;
			transitionKeyRef.current = nextTransitionKey;
			const nextLayer: ImageSwitcherLayer = {
				direction,
				index: nextIndex,
				key: nextTransitionKey,
			};

			setIncomingLayers((currentLayers) => [...currentLayers, nextLayer]);
		},
		[imageCount, onIndexChange, shouldAnimate],
	);

	const requestRelativeImage = React.useCallback(
		(delta: number, direction: CarouselDirection, resetTimer = true) => {
			requestImage(activeIndexRef.current + delta, direction, resetTimer);
		},
		[requestImage],
	);

	React.useEffect(() => {
		if (selectedIndex === undefined || imageCount <= 0) return;
		const nextIndex = getWrappedImageIndex(selectedIndex, imageCount);
		const currentIndex = activeIndexRef.current;
		if (nextIndex === currentIndex) return;

		requestImage(
			nextIndex,
			getImageDirection(currentIndex, nextIndex, imageCount),
			false,
			false,
		);
	}, [imageCount, requestImage, selectedIndex]);

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
		setIncomingLayers((currentLayers) =>
			currentLayers.filter((layer) => layer.index < imageCount),
		);
	}, [activeIndex, imageCount, settledIndex]);

	React.useEffect(() => {
		if (shouldAnimate) return;

		setSettledIndex(activeIndexRef.current);
		setIncomingLayers([]);
	}, [shouldAnimate]);

	if (!baseImage) return null;

	function completeIncomingLayer(completedKey: number) {
		setIncomingLayers((currentLayers) =>
			currentLayers.filter((layer) => layer.key !== completedKey),
		);

		if (completedKey !== transitionKeyRef.current) return;
		setSettledIndex(activeIndexRef.current);
		setIncomingLayers([]);
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
				data-image-switcher-active-index={activeIndex}
				className={clsx(
					"relative h-80 w-full touch-pan-y overflow-hidden rounded-xl bg-surface",
					frameClassName,
				)}
				onPointerDown={handlePointerDown}
				onDragStartCapture={(event) => {
					if (canSwipe) event.preventDefault();
				}}
				onPointerUp={handlePointerUp}
				onPointerCancel={() => {
					pointerStartXRef.current = null;
				}}
			>
				<Image
					key={`image-switcher-base-${baseImage.src}`}
					src={baseImage.src}
					alt={incomingLayers.length > 0 ? "" : baseImage.alt}
					fill
					loading="eager"
					placeholder={getImagePlaceholder(baseImage, loadedImageKeys)}
					blurDataURL={baseImage.blurDataURL ?? undefined}
					sizes={sizes}
					className={clsx(
						"object-cover object-center",
						canSwipe && "pointer-events-none select-none",
						imageClassName,
					)}
					draggable={false}
					onLoad={() => markImageLoaded(baseImage)}
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 opacity-0"
				>
					{preloadItems.map(({ image, key }) => (
						<span key={key} className="absolute inset-0">
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
				<AnimatePresence initial={false}>
					{incomingLayers.map((incomingLayer, layerIndex) => {
						const incomingImage = images[incomingLayer.index];
						if (!incomingImage) return null;
						const isLatestLayer = layerIndex === incomingLayers.length - 1;

						return (
							<motion.div
								key={incomingLayer.key}
								className="absolute inset-0 will-change-[clip-path]"
								style={{ zIndex: incomingLayer.key }}
								initial={getRevealClip(incomingLayer.direction)}
								animate={fullRevealClip}
								transition={imageSwitcherTransition}
								onAnimationComplete={() =>
									completeIncomingLayer(incomingLayer.key)
								}
							>
								<Image
									src={incomingImage.src}
									alt={isLatestLayer ? incomingImage.alt : ""}
									fill
									loading="eager"
									placeholder={getImagePlaceholder(
										incomingImage,
										loadedImageKeys,
									)}
									blurDataURL={incomingImage.blurDataURL ?? undefined}
									sizes={sizes}
									className={clsx(
										"object-cover object-center",
										canSwipe && "pointer-events-none select-none",
										imageClassName,
									)}
									draggable={false}
									onLoad={() => markImageLoaded(incomingImage)}
								/>
							</motion.div>
						);
					})}
				</AnimatePresence>
			</motion.div>
			{canSwitch && showControls ? (
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
