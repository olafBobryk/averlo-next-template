import { RevealHighlightText } from "./RevealHighlightText";
import { RevealImage } from "./RevealImage";
import { RevealItem } from "./RevealItem";
import { RevealList } from "./RevealList";
import { NumericReveal } from "./RevealNumeric";
import { RevealRoot } from "./RevealRoot";
import { RevealScene } from "./RevealScene";
import { ScrambleReveal } from "./RevealScramble";
import { RevealText } from "./RevealText";

export { RevealHighlightText } from "./RevealHighlightText";
export {
	getCornerClipRevealVariants,
	RevealImage,
	type RevealImageClipRevealOrigin,
	type RevealImageClipRevealTransition,
	type RevealImageProps,
} from "./RevealImage";
export { RevealItem, type RevealItemProps } from "./RevealItem";
export { RevealList, type RevealListProps } from "./RevealList";
export {
	NumericReveal,
	type NumericRevealAnimation,
	type NumericRevealProps,
} from "./RevealNumeric";
export { RevealRoot, type RevealRootProps } from "./RevealRoot";
export { RevealScene } from "./RevealScene";
export { ScrambleReveal } from "./RevealScramble";
export { RevealText } from "./RevealText";
export type { RevealGroupItemProps } from "./scheduler/RevealGroupItemScheduler";
export { RevealGroupItem } from "./scheduler/RevealGroupItemScheduler";
export type { RevealGroupProps } from "./scheduler/RevealGroupScheduler";
export { RevealGroup } from "./scheduler/RevealGroupScheduler";
export { RevealItem as RootScheduledRevealItem } from "./scheduler/RevealItemScheduler";
export { useRevealAnimationsDisabled } from "./scheduler/RevealRootScheduler";
export type { RevealStageAliasProps } from "./types";

export const Reveal = {
	Root: RevealRoot,
	Scene: RevealScene,
	List: RevealList,
	Item: RevealItem,
	Image: RevealImage,
	HighlightText: RevealHighlightText,
	Text: RevealText,
	Scramble: ScrambleReveal,
	Numeric: NumericReveal,
};
