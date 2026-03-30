"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Logo from "@/components/branding/Logo";
import { getMotionTiming } from "@/components/ui/foundations/motionTiming";
import { markAppReady } from "@/lib/appReadySignal";
import { Text } from "../ui/primitives/Text";

type Phase = "loading" | "revealing" | "transitioning" | "done";

// Matches getMotionTiming("grand") duration in ms
const GRAND_MS = 940;

export default function LoadingScreenMount() {
	const [phase, setPhase] = useState<Phase>("loading");

	// Prevent scroll until the loading screen is fully gone
	useEffect(() => {
		if (phase === "done") return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [phase]);

	useEffect(() => {
		let t1: ReturnType<typeof setTimeout> | undefined;
		Promise.all([
			document.fonts.ready,
			new Promise<void>((resolve) => setTimeout(resolve, 500)),
		]).then(() => {
			setPhase("revealing");
			t1 = setTimeout(() => {
				setPhase("transitioning");
			}, GRAND_MS);
		});
		return () => {
			clearTimeout(t1);
		};
	}, []);

	if (phase === "done") return null;

	return (
		<motion.div
			aria-hidden="true"
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-white pointer-events-none"
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
						WEBVIZION
					</Text>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}
