"use client";

import * as React from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { ErrorState, type ErrorStateProps } from "@/components/ui/misc/state/ErrorState";
import { Loader } from "@/components/ui/misc/Loader";
import {
	getMotionTiming,
	type MotionTimingPreset,
} from "@/components/ui/foundations/motionTiming";

type SuspenseBoundaryProps = {
	mode?: "controlled" | "suspense";
	loading?: boolean;
	fallback?: React.ReactNode;
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
	const resolvedFallback =
		fallback ?? (
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

	const content = error ? resolvedErrorFallback : loading ? resolvedFallback : children;

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
