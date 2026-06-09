"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import {
	getMotionTiming,
	type MotionTimingPreset,
} from "@/components/ui/foundations/motionTiming";
import { Loader } from "@/components/ui/misc/Loader";
import {
	ErrorState,
	type ErrorStateProps,
} from "@/components/ui/misc/state/ErrorState";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type SuspenseBoundaryProps = {
	mode?: "controlled" | "suspense";
	loading?: boolean;
	fallback?: React.ReactNode;
	ghost?: boolean;
	error?: boolean;
	errorFallback?: React.ReactNode | ErrorStateProps | null;
	children: React.ReactNode;
	className?: string;
	disableWhenReducedMotion?: boolean;
	forceReducedMotion?: boolean;
	timingPreset?: MotionTimingPreset;
};

export function SuspenseBoundary({
	mode = "controlled",
	loading = false,
	fallback,
	ghost = false,
	error = false,
	errorFallback,
	children,
	className,
	disableWhenReducedMotion = true,
	forceReducedMotion,
	timingPreset = "micro",
}: SuspenseBoundaryProps) {
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const shouldAnimate = motionAllowed && forceReducedMotion !== true;
	const resolvedErrorFallback = resolveErrorFallback(errorFallback);
	const resolvedFallback = fallback ?? (
		<div className="flex items-center justify-center py-10">
			<Loader className="text-muted-foreground" />
		</div>
	);

	if (mode === "suspense") {
		return (
			<SuspenseBoundaryError fallback={resolvedErrorFallback}>
				<React.Suspense
					fallback={
						shouldAnimate ? (
							<motion.div
								className={clsx(className)}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={getMotionTiming(timingPreset)}
							>
								{resolvedFallback}
							</motion.div>
						) : className ? (
							<div className={className}>{resolvedFallback}</div>
						) : (
							resolvedFallback
						)
					}
				>
					{shouldAnimate ? (
						<motion.div
							className={clsx(className)}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={getMotionTiming(timingPreset)}
						>
							{children}
						</motion.div>
					) : className ? (
						<div className={className}>{children}</div>
					) : (
						children
					)}
				</React.Suspense>
			</SuspenseBoundaryError>
		);
	}

	const overlayContent = error
		? resolvedErrorFallback
		: loading
			? resolvedFallback
			: null;

	if (ghost) {
		const contentHidden = Boolean(overlayContent);

		if (!shouldAnimate) {
			return (
				<div className={clsx("relative", className)}>
					<div
						className={clsx(
							"relative",
							contentHidden
								? "pointer-events-none select-none opacity-0"
								: undefined,
						)}
						aria-hidden={contentHidden || undefined}
					>
						{children}
					</div>
					{overlayContent ? (
						<div
							className="absolute inset-0 z-[1]"
							aria-hidden={!contentHidden || undefined}
						>
							{overlayContent}
						</div>
					) : null}
				</div>
			);
		}

		return (
			<div className={clsx("relative", className)}>
				<motion.div
					className={clsx(
						"relative",
						contentHidden ? "pointer-events-none select-none" : undefined,
					)}
					aria-hidden={contentHidden || undefined}
					initial={false}
					animate={{ opacity: contentHidden ? 0 : 1 }}
					transition={getMotionTiming(timingPreset)}
				>
					{children}
				</motion.div>
				{overlayContent ? (
					<motion.div
						className="absolute inset-0 z-[1]"
						aria-hidden={!contentHidden || undefined}
						initial={false}
						animate={{ opacity: contentHidden ? 1 : 0 }}
						transition={getMotionTiming(timingPreset)}
					>
						{overlayContent}
					</motion.div>
				) : null}
			</div>
		);
	}

	const content = error
		? resolvedErrorFallback
		: loading
			? resolvedFallback
			: children;

	if (!shouldAnimate) {
		if (className) {
			return <div className={className}>{content}</div>;
		}
		return <>{content}</>;
	}

	return (
		<AnimatePresence mode="wait" initial={false}>
			<motion.div
				key={error ? "error" : loading ? "fallback" : "content"}
				className={clsx(className)}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={getMotionTiming(timingPreset)}
			>
				{content}
			</motion.div>
		</AnimatePresence>
	);
}

type SuspenseBoundaryErrorProps = {
	fallback: React.ReactNode;
	children: React.ReactNode;
};

type SuspenseBoundaryErrorState = {
	hasError: boolean;
};

class SuspenseBoundaryError extends React.Component<
	SuspenseBoundaryErrorProps,
	SuspenseBoundaryErrorState
> {
	state: SuspenseBoundaryErrorState = { hasError: false };

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidUpdate(prevProps: SuspenseBoundaryErrorProps) {
		if (this.state.hasError && prevProps.children !== this.props.children) {
			this.setState({ hasError: false });
		}
	}

	render() {
		if (this.state.hasError) {
			return this.props.fallback;
		}
		return this.props.children;
	}
}

function resolveErrorFallback(
	errorFallback: SuspenseBoundaryProps["errorFallback"],
): React.ReactNode {
	if (errorFallback === null) return null;
	if (errorFallback === undefined) {
		return <ErrorState />;
	}
	if (React.isValidElement(errorFallback)) {
		return errorFallback;
	}
	if (typeof errorFallback === "object") {
		return <ErrorState {...(errorFallback as ErrorStateProps)} />;
	}
	return errorFallback;
}
