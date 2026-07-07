"use client";

import {
	RevealGroupItem,
	type RevealGroupItemProps,
} from "@/components/ui/motion/reveal/scheduler/RevealGroupItemScheduler";
import type { RevealItemProps as CoreRevealItemProps } from "@/components/ui/motion/reveal/scheduler/RevealItemScheduler";
import { type RevealStageAliasProps, resolveRevealStageAliases } from "./types";

export type RevealItemProps = CoreRevealItemProps & RevealStageAliasProps;

export function RevealItem({
	after,
	unlock,
	waitFor,
	unlockStage,
	...props
}: RevealItemProps) {
	const stages = resolveRevealStageAliases({
		after,
		unlock,
		waitFor,
		unlockStage,
	});

	return <RevealGroupItem {...(props as RevealGroupItemProps)} {...stages} />;
}

export { RevealGroupItem, RevealItem as Item };
