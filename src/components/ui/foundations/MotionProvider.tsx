"use client";

import type { ReactNode } from "react";
import { GlobalMotionScheduler } from "@/components/ui/motion/source/scheduler/GlobalMotionScheduler";
import { type MotionDriver, MotionDriverProvider } from "./motionDriverContext";

type MotionProviderProps = {
	children: ReactNode;
	driver?: MotionDriver;
};

/** Owns the motion driver and the one global scheduler (FR-005, FR-006). */
export function MotionProvider({ children, driver }: MotionProviderProps) {
	return (
		<MotionDriverProvider driver={driver}>
			<GlobalMotionScheduler>{children}</GlobalMotionScheduler>
		</MotionDriverProvider>
	);
}
