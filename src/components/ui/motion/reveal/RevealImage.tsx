"use client";

import clsx from "clsx";
import {
	AnimatePresence,
	motion,
	type Transition,
	useInView,
	type Variants,
} from "motion/react";
import Image, { type ImageProps } from "next/image";
import * as React from "react";
import { getMotionTiming } from "@/components/ui/foundations/motionTiming";
import {
	useMotionSceneGate,
	useOptionalMotionScene,
} from "@/components/ui/motion/MotionScene";
import { useRevealAnimationsDisabled } from "@/components/ui/motion/reveal/legacyCore";
import { useAppReady } from "@/hooks/useAppReady";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { RevealItem, type RevealItemProps } from "./RevealItem";
import { type RevealStageAliasProps, resolveRevealStageAliases } from "./types";

type RevealImageOwnProps = {
	imageClassName?: string;
	fallback?: React.ReactNode;
	fallbackClassName?: string;
	contentClassName?: string;
	overlay?: React.ReactNode;
	disableWrapperReveal?: boolean;
	disableRevealAnimation?: boolean;
	loadStrategy?: "ignore-load" | "wait-for-load";
	revealDelay?: number;
	onLoadStateChange?: (loaded: boolean) => void;
	onRevealStateChange?: (revealed: boolean) => void;
	variants?: Variants;
};

export type RevealImageClipRevealOrigin =
	| "bottom-left"
	| "bottom-right"
	| "top-left"
	| "top-right";

export type RevealImageClipRevealTransition = {
	duration: number;
	ease: readonly [number, number, number, number];
};

export function getCornerClipRevealVariants({
	finalRadius = 20,
	origin = "bottom-left",
	transition = {
		duration: 1.18,
		ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
	},
}: {
	finalRadius?: number;
	origin?: RevealImageClipRevealOrigin;
	transition?: RevealImageClipRevealTransition;
}): Variants {
	return {
		hidden: {
			...cornerClipHiddenInsetValues[origin],
			"--clip-radius": "0px",
			clipPath: cornerClipPath,
			opacity: 1,
			scale: 1,
			transition: {
				...transition,
				"--clip-radius": cornerClipRadiusTransition,
			},
		},
		show: {
			...cornerClipRevealedInsetValues,
			"--clip-radius": `${finalRadius}px`,
			clipPath: cornerClipPath,
			opacity: 1,
			scale: 1,
			transition: {
				...transition,
				"--clip-radius": cornerClipRadiusTransition,
			},
		},
	};
}

const cornerClipHiddenInsetValues: Record<
	RevealImageClipRevealOrigin,
	{
		"--clip-bottom": string;
		"--clip-left": string;
		"--clip-right": string;
		"--clip-top": string;
	}
> = {
	"bottom-left": {
		"--clip-bottom": "0%",
		"--clip-left": "0%",
		"--clip-right": "100%",
		"--clip-top": "100%",
	},
	"bottom-right": {
		"--clip-bottom": "0%",
		"--clip-left": "100%",
		"--clip-right": "0%",
		"--clip-top": "100%",
	},
	"top-left": {
		"--clip-bottom": "100%",
		"--clip-left": "0%",
		"--clip-right": "100%",
		"--clip-top": "0%",
	},
	"top-right": {
		"--clip-bottom": "100%",
		"--clip-left": "100%",
		"--clip-right": "0%",
		"--clip-top": "0%",
	},
};
const cornerClipRevealedInsetValues = {
	"--clip-bottom": "0%",
	"--clip-left": "0%",
	"--clip-right": "0%",
	"--clip-top": "0%",
} as const;
const cornerClipPath =
	"inset(var(--clip-top) var(--clip-right) var(--clip-bottom) var(--clip-left) round var(--clip-radius))";
const cornerClipRadiusTransition: Transition = {
	duration: 1.72,
	ease: [0.16, 1, 0.3, 1],
};

export type RevealImageProps = ImageProps &
	Pick<
		RevealItemProps,
		| "as"
		| "asChild"
		| "className"
		| "disableTransform"
		| "useViewport"
		| "active"
		| "waitFor"
		| "unlockStage"
		| "after"
		| "unlock"
		| "disableWhenReducedMotion"
		| "viewportAmount"
	> &
	RevealImageOwnProps &
	RevealStageAliasProps & {
		revealFinalRadius?: number;
		revealOrigin?: RevealImageClipRevealOrigin;
		revealTransition?: RevealImageClipRevealTransition;
		revealVariant?: "vertical-inset" | "corner-clip";
	};

function getSourceKey(src: ImageProps["src"]) {
	if (!src) return "";
	if (typeof src === "string") return src;
	if ("src" in src) return src.src;
	return src.default.src;
}

export function RevealImage({
	as,
	asChild = false,
	className,
	variants,
	disableTransform = false,
	useViewport = false,
	viewportAmount = 0.2,
	active,
	after,
	unlock,
	waitFor,
	unlockStage,
	disableWhenReducedMotion = true,
	imageClassName,
	fallback,
	fallbackClassName,
	contentClassName,
	overlay,
	disableWrapperReveal = false,
	disableRevealAnimation = false,
	loadStrategy = "ignore-load",
	revealDelay = 0,
	revealFinalRadius = 20,
	revealOrigin = "bottom-left",
	revealTransition,
	revealVariant = "vertical-inset",
	onLoadStateChange,
	onRevealStateChange,
	placeholder,
	src,
	onLoad,
	fill,
	...imageProps
}: RevealImageProps) {
	const stages = resolveRevealStageAliases({
		after,
		unlock,
		waitFor,
		unlockStage,
	});
	const appReady = useAppReady();
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const revealDisabled = useRevealAnimationsDisabled(disableWhenReducedMotion);
	const revealAnimationDisabled = revealDisabled || disableRevealAnimation;
	const scene = useOptionalMotionScene();
	const { markReady } = useMotionSceneGate("RevealImage", {
		unlockStage: stages.unlockStage,
	});
	const sourceKey = getSourceKey(src);
	const imageRef = React.useRef<HTMLImageElement | null>(null);
	const contentRef = React.useRef<HTMLDivElement | null>(null);
	const [loaded, setLoaded] = React.useState(false);
	const [revealed, setRevealed] = React.useState(false);
	const isInViewport = useInView(contentRef, {
		once: true,
		amount: viewportAmount,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset state when the image source identity changes
	React.useEffect(() => {
		setLoaded(false);
		setRevealed(false);
	}, [sourceKey]);

	React.useEffect(() => {
		const image = imageRef.current;
		if (!image?.complete || image.naturalWidth <= 0) return;
		setLoaded(true);
	});

	React.useEffect(() => {
		onLoadStateChange?.(loaded);
	}, [loaded, onLoadStateChange]);

	React.useEffect(() => {
		onRevealStateChange?.(revealed);
	}, [onRevealStateChange, revealed]);

	React.useEffect(() => {
		if (!revealed) return;
		markReady();
	}, [markReady, revealed]);

	const hasCustomRevealVariants = Boolean(variants);
	const sceneReady = scene ? scene.isStageReady(stages.waitFor) : true;
	const loadReady = loadStrategy === "ignore-load" || loaded;
	const shouldRevealImage =
		revealAnimationDisabled ||
		(loadReady &&
			appReady &&
			sceneReady &&
			active !== false &&
			(useViewport ? isInViewport : true));

	React.useEffect(() => {
		if (!shouldRevealImage) return;
		if (motionAllowed && !revealAnimationDisabled && !hasCustomRevealVariants) {
			return;
		}
		setRevealed(true);
	}, [
		hasCustomRevealVariants,
		motionAllowed,
		revealAnimationDisabled,
		shouldRevealImage,
	]);

	const defaultRevealTransition =
		motionAllowed && !revealDisabled
			? {
					...getMotionTiming("grand"),
					delay: revealDelay,
				}
			: undefined;
	const resolvedCustomRevealTransition = revealTransition
		? {
				...revealTransition,
				delay: revealDelay,
			}
		: revealTransition;
	const resolvedFallback =
		fallback ?? (placeholder === "blur" ? null : <div />);
	const imageMotionClassName = clsx("relative h-full w-full overflow-hidden");
	const imageRevealTransition =
		revealVariant === "corner-clip"
			? {
					...(resolvedCustomRevealTransition ?? defaultRevealTransition),
					"--clip-radius": {
						...cornerClipRadiusTransition,
						delay: revealDelay,
					},
				}
			: defaultRevealTransition;
	const hiddenImageState =
		revealVariant === "corner-clip"
			? {
					...cornerClipHiddenInsetValues[revealOrigin],
					"--clip-radius": "0px",
					clipPath: cornerClipPath,
					opacity: 1,
					scale: 1,
				}
			: {
					opacity: 0.8,
					clipPath: "inset(100% 0% 0% 0%)",
					scale: 1,
					radius: 0,
				};
	const revealedImageState =
		revealVariant === "corner-clip"
			? {
					...cornerClipRevealedInsetValues,
					"--clip-radius": `${revealFinalRadius}px`,
					clipPath: cornerClipPath,
					opacity: 1,
					scale: 1,
				}
			: {
					opacity: 1,
					clipPath: "inset(0% 0% 0% 0%)",
					scale: 1,
					radius: revealFinalRadius,
				};

	const imageContent = (
		<div
			ref={contentRef}
			className={clsx(
				"relative min-w-0",
				fill && "h-full w-full",
				contentClassName,
			)}
		>
			<AnimatePresence initial={false}>
				{!loaded && resolvedFallback ? (
					<motion.div
						key={`reveal-image-fallback-${sourceKey}`}
						className={clsx(
							"absolute inset-0 z-10 overflow-hidden",
							fallbackClassName,
						)}
						initial={{ opacity: 1 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={getMotionTiming("interactive")}
						aria-hidden={true}
					>
						{resolvedFallback}
					</motion.div>
				) : null}
			</AnimatePresence>

			<motion.div
				className={imageMotionClassName}
				initial={false}
				animate={
					revealAnimationDisabled
						? revealedImageState
						: motionAllowed
							? hasCustomRevealVariants
								? {
										opacity: shouldRevealImage ? 1 : 0,
										clipPath:
											revealVariant === "corner-clip"
												? cornerClipPath
												: "inset(0% 0% 0% 0%)",
										scale: 1,
										...(revealVariant === "corner-clip"
											? {
													...cornerClipRevealedInsetValues,
													"--clip-radius": `${revealFinalRadius}px`,
												}
											: null),
									}
								: shouldRevealImage
									? revealedImageState
									: hiddenImageState
							: revealedImageState
				}
				transition={
					revealAnimationDisabled
						? { duration: 0 }
						: hasCustomRevealVariants
							? undefined
							: imageRevealTransition
				}
				onAnimationComplete={() => {
					if (!shouldRevealImage) return;
					if (revealed || hasCustomRevealVariants) return;
					setRevealed(true);
				}}
			>
				<Image
					key={sourceKey}
					ref={imageRef}
					src={src}
					fill={fill}
					placeholder={placeholder}
					onLoad={(event) => {
						onLoad?.(event);
						setLoaded(true);
					}}
					className={clsx("h-full w-full", imageClassName)}
					{...imageProps}
				/>
				{overlay}
			</motion.div>
		</div>
	);

	if (disableWrapperReveal) {
		return <div className={className}>{imageContent}</div>;
	}

	return (
		<RevealItem
			as={as}
			asChild={asChild}
			className={className}
			variants={variants}
			disableTransform={disableTransform}
			useViewport={useViewport}
			viewportAmount={viewportAmount}
			active={shouldRevealImage}
			waitFor={stages.waitFor}
			disableWhenReducedMotion={disableWhenReducedMotion}
		>
			{imageContent}
		</RevealItem>
	);
}
