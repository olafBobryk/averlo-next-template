"use client";

import { AnimatePresence, motion } from "motion/react";
import { resolveMotionTransition } from "@/components/ui/foundations/motionTiming";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type InteractionGateProps = {
	active: boolean;
	actionLabel: string;
	ariaLabel?: string;
	description?: string;
	onActivate: () => void;
	title?: string;
};

const overlayTransition = resolveMotionTransition("overlay");
const panelTransition = resolveMotionTransition("disclosure");

export function InteractionGate({
	active,
	actionLabel,
	ariaLabel,
	description,
	onActivate,
	title,
}: InteractionGateProps) {
	const motionAllowed = useMotionAllowed(true);
	const overlayMotion = motionAllowed
		? {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: overlayTransition,
			}
		: {};
	const panelMotion = motionAllowed
		? {
				initial: { opacity: 0, y: 10, scale: 0.98 },
				animate: { opacity: 1, y: 0, scale: 1 },
				exit: { opacity: 0, y: 10, scale: 0.98 },
				transition: panelTransition,
			}
		: {};

	return (
		<AnimatePresence>
			{active ? (
				<motion.div
					key="interaction-gate"
					className="absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-b from-black/25 to-black/70 px-[var(--spacing-section-x)]"
					{...overlayMotion}
				>
					<motion.div
						className="pointer-events-auto flex max-w-sm flex-col items-center gap-3 text-center"
						{...panelMotion}
					>
						{title ? (
							<Text as="p" variant="bodyStrong" className="text-white">
								{title}
							</Text>
						) : null}
						{description ? (
							<Text as="p" variant="caption" className="text-white/75">
								{description}
							</Text>
						) : null}
						<Button
							type="button"
							variant="primary"
							size="sm"
							onClick={onActivate}
							aria-label={ariaLabel ?? actionLabel}
						>
							{actionLabel}
						</Button>
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
