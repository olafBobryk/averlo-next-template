"use client";

import clsx from "clsx";
import { AnimatePresence, motion, type Variants } from "motion/react";
import Image, { type ImageProps } from "next/image";
import * as React from "react";
import { getMotionTiming } from "@/components/ui/foundations/motionTiming";
import { Skeleton } from "@/components/ui/misc/Skeleton";
import {
	RevealItem,
	type RevealItemProps,
} from "@/components/ui/motion/Reveal";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type RevealImageOwnProps = {
	imageClassName?: string;
	fallback?: React.ReactNode;
	fallbackClassName?: string;
	contentClassName?: string;
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
		| "disableWhenReducedMotion"
	> &
	RevealImageOwnProps;

function getSourceKey(src: ImageProps["src"]) {
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
	disableWhenReducedMotion = true,
	imageClassName,
	fallback,
	fallbackClassName,
	contentClassName,
	onLoadStateChange,
	onRevealStateChange,
	placeholder,
	src,
	onLoadingComplete,
	onLoad,
	fill,
	...imageProps
}: RevealImageProps) {
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const sourceKey = getSourceKey(src);
	const [loaded, setLoaded] = React.useState(false);
	const [revealed, setRevealed] = React.useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset state when the image source identity changes
	React.useEffect(() => {
		setLoaded(false);
		setRevealed(false);
	}, [sourceKey]);

	React.useEffect(() => {
		onLoadStateChange?.(loaded);
	}, [loaded, onLoadStateChange]);

	React.useEffect(() => {
		onRevealStateChange?.(revealed);
	}, [revealed, onRevealStateChange]);

	const revealTransition = motionAllowed
		? getMotionTiming("component")
		: undefined;
	const resolvedFallback =
		fallback ??
		(placeholder === "blur" ? null : (
			<Skeleton className="h-full w-full rounded-none" />
		));
	const imageMotionClassName = clsx(
		fill ? "relative h-full w-full" : "relative w-fit h-fit",
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
							? loaded
								? { opacity: 1, scale: 1, filter: "blur(0px)" }
								: { opacity: 0, scale: 0.985, filter: "blur(10px)" }
							: { opacity: 1, scale: 1, filter: "blur(0px)" }
					}
					transition={revealTransition}
					onAnimationComplete={() => {
						if (!loaded) return;
						if (revealed) return;
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
						}}
						onLoadingComplete={(image) => {
							onLoadingComplete?.(image);
							setLoaded(true);
							if (!motionAllowed) {
								setRevealed(true);
							}
						}}
						className={clsx(fill ? "h-full w-full" : undefined, imageClassName)}
						{...imageProps}
					/>
				</motion.div>
			</div>
		</RevealItem>
	);
}
