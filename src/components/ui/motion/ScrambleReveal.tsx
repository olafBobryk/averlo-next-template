// components/ui/motion/ScrambleReveal.tsx
"use client";

import clsx from "clsx";
import { animate } from "motion";
import { useInView } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";
import * as React from "react";
import { motionTiming } from "@/components/ui/foundations/motionTiming";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

const DEFAULT_CHARACTERS =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}<>?/|~";

type ScrambleRevealOwnProps = {
	text?: string;
	children?: string;
	as?: any;
	className?: string;
	characters?: string;
	durationMs?: number;
	tickMs?: number;
	delayMs?: number;
	delay?: number;
	revealStep?: number;
	useViewport?: boolean;
	once?: boolean;
	preserveWhitespace?: boolean;
	disableWhenReducedMotion?: boolean;
	maintainSpace?: boolean;
};

type ScrambleRevealProps = ScrambleRevealOwnProps &
	Omit<ComponentPropsWithoutRef<"span">, keyof ScrambleRevealOwnProps | "as">;

export function ScrambleReveal({
	text,
	children,
	as,
	className,
	characters = DEFAULT_CHARACTERS,
	durationMs = 1500,
	tickMs = 50,
	delayMs = 0,
	delay,
	revealStep,
	useViewport = true,
	once = true,
	preserveWhitespace = true,
	disableWhenReducedMotion = true,
	maintainSpace = false,
	...rest
}: ScrambleRevealProps) {
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const resolvedChildren =
		typeof children === "string" || typeof children === "number"
			? String(children)
			: "";
	const finalText = text ?? resolvedChildren;
	const Tag = (as ?? "span") as any;
	const ref = React.useRef<HTMLElement | null>(null);
	const inView = useInView(ref, { amount: 0.2, once: false });

	const [displayText, setDisplayText] = React.useState(finalText);
	const [hasPlayed, setHasPlayed] = React.useState(false);
	const animationRef = React.useRef<ReturnType<typeof animate> | null>(null);

	const resolvedCharacters = characters?.length
		? characters
		: DEFAULT_CHARACTERS;
	const resolvedTickMs = Math.max(1, tickMs);
	const resolvedDurationMs = Math.max(0, durationMs);

	const stopAnimation = () => {
		if (animationRef.current) {
			animationRef.current.stop();
			animationRef.current = null;
		}
	};

	const chars = finalText.split("");
	const buildFrame = (revealedCount: number) =>
		chars
			.map((char, index) => {
				if (index < revealedCount) return char;
				if (preserveWhitespace && /\s/.test(char)) return char;
				const randomIndex = Math.floor(
					Math.random() * resolvedCharacters.length,
				);
				return resolvedCharacters.charAt(randomIndex) || char;
			})
			.join("");

	React.useEffect(() => {
		setHasPlayed(false);
		setDisplayText(finalText);
	}, [finalText]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: parameters are intentionally fine-grained
	React.useEffect(() => {
		stopAnimation();

		if (!motionAllowed || finalText.length === 0) {
			setDisplayText(finalText);
			return undefined;
		}

		const shouldReveal = useViewport ? inView : true;
		if (once && hasPlayed) {
			setDisplayText(finalText);
			return undefined;
		}

		if (!shouldReveal) {
			setDisplayText(buildFrame(0));
			if (!once) setHasPlayed(false);
			return undefined;
		}

		const totalChars = finalText.length;
		const resolvedRevealStep = Math.max(1, revealStep ?? 1);
		const totalSteps = Math.ceil(totalChars / resolvedRevealStep);
		const resolvedDelayMs =
			typeof delay === "number"
				? Math.max(0, delay) * 1000
				: Math.max(0, delayMs);
		const totalDurationMs = Math.max(1, resolvedDurationMs + resolvedDelayMs);
		const delayRatio = resolvedDelayMs / totalDurationMs;

		const minUpdateMs = Math.max(1, resolvedTickMs);
		let lastUpdateMs = 0;

		setDisplayText(buildFrame(0));
		animationRef.current = animate(0, 1, {
			duration: Math.max(0.001, totalDurationMs / 1000),
			ease: motionTiming.component.ease,
			onUpdate: (progress) => {
				const now = performance.now();
				if (now - lastUpdateMs < minUpdateMs) return;
				lastUpdateMs = now;

				const revealProgress =
					delayRatio > 0
						? Math.max(
								0,
								Math.min(
									1,
									(progress - delayRatio) / Math.max(0.0001, 1 - delayRatio),
								),
							)
						: progress;
				const stepIndex = Math.min(
					totalSteps,
					Math.floor(revealProgress * totalSteps),
				);
				const revealedCount = Math.min(
					totalChars,
					stepIndex * resolvedRevealStep,
				);
				setDisplayText(buildFrame(revealedCount));
			},
			onComplete: () => {
				setDisplayText(finalText);
				setHasPlayed(true);
			},
		});

		return () => stopAnimation();
	}, [
		delayMs,
		delay,
		finalText,
		hasPlayed,
		inView,
		motionAllowed,
		once,
		preserveWhitespace,
		resolvedCharacters,
		revealStep,
		resolvedDurationMs,
		resolvedTickMs,
		tickMs,
		useViewport,
	]);

	if (!motionAllowed || finalText.length === 0) {
		return (
			<Tag className={className} {...rest}>
				{finalText}
			</Tag>
		);
	}

	if (maintainSpace) {
		return (
			<Tag
				ref={ref}
				className={clsx("relative inline-block align-baseline", className)}
				{...rest}
			>
				<span className="relative opacity-0">{finalText}WWW</span>
				<span className="absolute inset-0" aria-hidden="true">
					{displayText}
				</span>
				<span className="sr-only">{finalText}</span>
			</Tag>
		);
	}

	return (
		<>
			<Tag ref={ref} className={className} aria-hidden="true" {...rest}>
				{displayText}
			</Tag>
			<span className="sr-only">{finalText}</span>
		</>
	);
}
