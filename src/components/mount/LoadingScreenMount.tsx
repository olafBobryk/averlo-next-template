"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Logo from "@/components/branding/Logo";
import {
	hasIntroDisabledSearchParam,
	useIntroDisableOverride,
} from "@/components/ui/foundations/motionDisableOverride";
import { getMotionTiming } from "@/components/ui/foundations/motionTiming";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { markAppReady } from "@/lib/appReadySignal";
import { Text } from "../ui/primitives/Text";

type Phase = "loading" | "revealing" | "transitioning" | "done";

const REVEAL_DURATION_MS = Math.round(
	Number(getMotionTiming("grand").duration ?? 0) * 1000,
);
const EXIT_REVEAL_HANDOFF_MS = 180;

export default function LoadingScreenMount() {
	const immediateIntroDisabled = hasIntroDisabledSearchParam();
	const [phase, setPhase] = useState<Phase>(() =>
		hasIntroDisabledSearchParam() ? "done" : "loading",
	);
	const motionAllowed = useMotionAllowed(true);
	const introOverrideDisabled = useIntroDisableOverride();
	const introDisabled =
		immediateIntroDisabled || introOverrideDisabled || !motionAllowed;

	useEffect(() => {
		if (!introDisabled) return;
		markAppReady();
		setPhase("done");
	}, [introDisabled]);

	// Prevent scroll until the loading screen is fully gone
	useEffect(() => {
		if (introDisabled || phase === "done") return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [introDisabled, phase]);

	useEffect(() => {
		if (introDisabled) return;
		let t1: ReturnType<typeof setTimeout> | undefined;
		let cancelled = false;
		Promise.all([
			document.fonts.ready,
			new Promise<void>((resolve) => setTimeout(resolve, 500)),
		]).then(() => {
			if (cancelled) return;
			setPhase("revealing");
			t1 = setTimeout(() => {
				if (cancelled) return;
				setPhase("transitioning");
			}, REVEAL_DURATION_MS);
		});
		return () => {
			cancelled = true;
			clearTimeout(t1);
		};
	}, [introDisabled]);

	useEffect(() => {
		if (introDisabled || phase !== "transitioning") return;
		const readyId = setTimeout(() => {
			markAppReady();
		}, EXIT_REVEAL_HANDOFF_MS);

		return () => clearTimeout(readyId);
	}, [introDisabled, phase]);

	if (introDisabled || phase === "done") return null;

	return (
		<motion.div
			aria-hidden="true"
			className={`fixed inset-0 flex items-center justify-center bg-white pointer-events-none ${
				phase === "transitioning" ? "z-40" : "z-[9999]"
			}`}
			data-loading-screen-mount="true"
			animate={{ opacity: phase === "transitioning" ? 0 : 1 }}
			transition={getMotionTiming("grand")}
			onAnimationComplete={() => {
				if (phase !== "transitioning") return;
				markAppReady();
				setPhase("done");
			}}
		>
			<motion.div
				className="flex items-stretch"
				transition={getMotionTiming("grand")}
			>
				<Logo as="span" variant="mark" size="lg" />
				<motion.div
					initial={{ maxWidth: 0 }}
					animate={{ maxWidth: phase === "loading" ? 0 : 420 }}
					className="overflow-hidden flex items-center"
					transition={getMotionTiming("grand")}
				>
					<div className="min-w-0.5 rounded-full bg-primary h-full mx-3" />
					<Text variant="heading2xxl" className="font-black!">
						AVERLO
					</Text>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}
