"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
	hasIntroDisabledSearchParam,
	useIntroDisableOverride,
	useMotionDisableOverride,
} from "@/components/ui/foundations/motionDisableOverride";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { markAppReady } from "@/lib/appReadySignal";
import {
	LayerFloodLoading,
	layerFloodExitDurationMs,
} from "./LayerFloodLoading";

type Phase = "loading" | "transitioning" | "done";

const EXIT_FADE_DURATION_MS = 420;
const EXIT_FADE_TRANSITION = {
	duration: EXIT_FADE_DURATION_MS / 1000,
	ease: "linear",
} as const;
const EXIT_UNMOUNT_FALLBACK_MS = EXIT_FADE_DURATION_MS + 120;

export default function LoadingScreenMount() {
	const immediateIntroDisabled = hasIntroDisabledSearchParam();
	const [phase, setPhase] = useState<Phase>(() =>
		hasIntroDisabledSearchParam() ? "done" : "loading",
	);
	const motionAllowed = useMotionAllowed(true);
	const motionDisabled = useMotionDisableOverride();
	const introOverrideDisabled = useIntroDisableOverride();
	const introDisabled =
		immediateIntroDisabled ||
		introOverrideDisabled ||
		motionDisabled ||
		!motionAllowed;

	useEffect(() => {
		if (!introDisabled) return;
		markAppReady();
		setPhase("done");
	}, [introDisabled]);

	useEffect(() => {
		if (!immediateIntroDisabled) return;

		document
			.querySelectorAll('[data-loading-screen-mount="true"]')
			.forEach((node) => {
				node.remove();
			});
	}, [immediateIntroDisabled]);

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
		t1 = setTimeout(() => {
			if (cancelled) return;
			markAppReady();
			setPhase("transitioning");
		}, layerFloodExitDurationMs);

		return () => {
			cancelled = true;
			clearTimeout(t1);
		};
	}, [introDisabled]);

	useEffect(() => {
		if (introDisabled || phase !== "transitioning") return;
		const doneId = setTimeout(() => {
			markAppReady();
			setPhase("done");
		}, EXIT_UNMOUNT_FALLBACK_MS);

		return () => clearTimeout(doneId);
	}, [introDisabled, phase]);

	if (immediateIntroDisabled || introDisabled || phase === "done") return null;

	return (
		<motion.div
			aria-hidden="true"
			className={`fixed inset-0 flex items-center justify-center bg-white pointer-events-none ${
				phase === "transitioning" ? "z-40" : "z-[9999]"
			}`}
			data-loading-screen-mount="true"
			animate={{ opacity: phase === "transitioning" ? 0 : 1 }}
			transition={EXIT_FADE_TRANSITION}
			onAnimationComplete={() => {
				if (phase !== "transitioning") return;
				markAppReady();
				setPhase("done");
			}}
		>
			<motion.div className="relative flex size-full items-center justify-center">
				<LayerFloodLoading />
				<motion.div
					aria-hidden="true"
					className="absolute inset-0 z-20 bg-white"
					initial={{ opacity: 0 }}
					animate={{ opacity: phase === "loading" ? 0 : 1 }}
					transition={EXIT_FADE_TRANSITION}
				/>
			</motion.div>
		</motion.div>
	);
}
