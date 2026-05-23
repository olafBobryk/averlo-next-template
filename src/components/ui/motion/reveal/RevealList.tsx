"use client";

import {
	RevealGroup,
	type RevealGroupProps,
} from "@/components/ui/motion/reveal/legacyCore";
import { type RevealStageAliasProps, resolveRevealStageAliases } from "./types";

export type RevealListProps = Omit<
	RevealGroupProps,
	"waitFor" | "unlockStage"
> &
	RevealStageAliasProps;

export function RevealList({
	after,
	unlock,
	waitFor,
	unlockStage,
	...props
}: RevealListProps) {
	const stages = resolveRevealStageAliases({
		after,
		unlock,
		waitFor,
		unlockStage,
	});

	return <RevealGroup {...props} {...stages} />;
}

export { RevealGroup, RevealList as List };
