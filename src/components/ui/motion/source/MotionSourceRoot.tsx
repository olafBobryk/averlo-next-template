"use client";
import { useMotionDriver } from "@/components/ui/foundations/motionDriverContext";
import {
	GsapInViewSource,
	GsapRevealSource,
	GsapScrollSource,
} from "./drivers/hybrid";
import {
	BooleanSource,
	InteractionSource,
	MotionInViewSource,
	MotionRevealSource,
	MotionScrollSource,
} from "./drivers/motion";
import type { MotionSourceRootProps } from "./sourceShared";

export type {
	MotionSourceBreakpoint,
	MotionSourceRootProps,
	MotionSourceStrategy,
	MotionSourceTiming,
} from "./sourceShared";
export function MotionSourceRoot(props: MotionSourceRootProps) {
	const driver = useMotionDriver();
	switch (props.strategy.type) {
		case "scroll":
			return driver === "hybrid" ? (
				<GsapScrollSource {...props} strategy={props.strategy} />
			) : (
				<MotionScrollSource {...props} strategy={props.strategy} />
			);
		case "hover":
			return <InteractionSource {...props} strategy={props.strategy} />;
		case "owner-hover":
			return <InteractionSource {...props} strategy={props.strategy} />;
		case "boolean":
			return <BooleanSource {...props} strategy={props.strategy} />;
		case "in-view":
			return driver === "hybrid" ? (
				<GsapInViewSource {...props} strategy={props.strategy} />
			) : (
				<MotionInViewSource {...props} strategy={props.strategy} />
			);
		case "reveal":
			return driver === "hybrid" ? (
				<GsapRevealSource {...props} strategy={props.strategy} />
			) : (
				<MotionRevealSource {...props} strategy={props.strategy} />
			);
	}
}
