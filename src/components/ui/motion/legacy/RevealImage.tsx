"use client";

import clsx from "clsx";
import { AnimatePresence, motion, type Variants } from "motion/react";
import Image, { type ImageProps } from "next/image";
import * as React from "react";
import { getMotionTiming } from "@/components/ui/foundations/motionTiming";
import {
	RevealItem,
	type RevealItemProps,
} from "@/components/ui/motion/legacy/Reveal";
import {
	useMotionSceneGate,
	useOptionalMotionScene,
} from "@/components/ui/motion/MotionScene";
import { useAppReady } from "@/hooks/useAppReady";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type RevealImageOwnProps = {
	imageClassName?: string;
	fallback?: React.ReactNode;
	fallbackClassName?: string;
	contentClassName?: string;
	overlay?: React.ReactNode;
	revealDelay?: number;
	onLoadStateChange?: (loaded: boolean) => void;
	onRevealStateChange?: (revealed: boolean) => void;
	variants?: Variants;
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
		| "disableWhenReducedMotion"
	> &
	RevealImageOwnProps;

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
	active,
	waitFor,
	unlockStage,
	disableWhenReducedMotion = true,
	imageClassName,
	fallback,
	fallbackClassName,
	contentClassName,
	overlay,
	revealDelay = 0,
	onLoadStateChange,
	onRevealStateChange,
	placeholder,
	src,
	onLoad,
	fill,
	...imageProps
}: RevealImageProps) {
	const appReady = useAppReady();
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const scene = useOptionalMotionScene();
	const { markReady } = useMotionSceneGate("RevealImage", { unlockStage });
	const sourceKey = getSourceKey(src);
	const isBlur = placeholder === "blur";
	const [loaded, setLoaded] = React.useState(isBlur);
	const [revealed, setRevealed] = React.useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset state when the image source identity changes
	React.useEffect(() => {
		setLoaded(isBlur);
		setRevealed(false);
	}, [isBlur, sourceKey]);

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
	const sceneReady = scene ? scene.isStageReady(waitFor) : true;
	const shouldRevealImage = loaded && appReady && sceneReady;

	React.useEffect(() => {
		if (!loaded || !shouldRevealImage) return;
		if (motionAllowed && !hasCustomRevealVariants) return;
		setRevealed(true);
	}, [hasCustomRevealVariants, loaded, motionAllowed, shouldRevealImage]);

	const revealTransition = motionAllowed
		? {
				...getMotionTiming("grand"),
				delay: revealDelay,
			}
		: undefined;
	const resolvedFallback =
		fallback ?? (placeholder === "blur" ? null : <div />);
	const imageMotionClassName = clsx(
		fill
			? "relative h-full w-full overflow-hidden"
			: "relative h-full w-full overflow-hidden",
	);

	return (
		<RevealItem
			as={as}
			asChild={asChild}
			className={className}
			variants={variants}
			disableTransform={disableTransform}
			useViewport={useViewport}
			active={active}
			waitFor={waitFor}
			disableWhenReducedMotion={disableWhenReducedMotion}
		>
			<div className={clsx("relative min-w-0", contentClassName)}>
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
						motionAllowed
							? hasCustomRevealVariants
								? {
										opacity: shouldRevealImage ? 1 : 0,
										clipPath: "inset(0% 0% 0% 0%)",
										scale: 1,
									}
								: shouldRevealImage
									? {
											opacity: 1,
											clipPath: "inset(0% 0% 0% 0%)",
											scale: 1,
											radius: 20,
										}
									: {
											opacity: 0.8,
											clipPath: "inset(100% 0% 0% 0%)",
											scale: 1,
											radius: 0,
										}
							: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
					}
					transition={hasCustomRevealVariants ? undefined : revealTransition}
					onAnimationComplete={() => {
						if (!shouldRevealImage) return;
						if (revealed || hasCustomRevealVariants) return;
						setRevealed(true);
					}}
				>
					<Image
						key={sourceKey}
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
		</RevealItem>
	);
}
