import type { MotionSceneStageInput } from "@/components/ui/motion/MotionScene";

export type RevealStageAliasProps = {
	after?: MotionSceneStageInput;
	unlock?: MotionSceneStageInput;
	waitFor?: MotionSceneStageInput;
	unlockStage?: MotionSceneStageInput;
};

export function resolveRevealStageAliases({
	after,
	unlock,
	waitFor,
	unlockStage,
}: RevealStageAliasProps) {
	return {
		waitFor: waitFor ?? after,
		unlockStage: unlockStage ?? unlock,
	};
}
