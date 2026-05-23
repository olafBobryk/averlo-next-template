import { RevealHighlightText } from "./RevealHighlightText";
import { RevealImage } from "./RevealImage";
import { RevealItem } from "./RevealItem";
import { RevealList } from "./RevealList";
import { RevealRoot } from "./RevealRoot";
import { RevealScene } from "./RevealScene";
import { ScrambleReveal } from "./RevealScramble";
import { RevealText } from "./RevealText";

export type {
	RevealGroupItemProps,
	RevealGroupProps,
} from "./legacyCore";
export {
	RevealGroup,
	RevealGroupItem,
	RevealItem as RootScheduledRevealItem,
	useRevealAnimationsDisabled,
} from "./legacyCore";
export { RevealHighlightText } from "./RevealHighlightText";
export { RevealImage } from "./RevealImage";
export { RevealItem, type RevealItemProps } from "./RevealItem";
export { RevealList, type RevealListProps } from "./RevealList";
export { RevealRoot, type RevealRootProps } from "./RevealRoot";
export { RevealScene } from "./RevealScene";
export { ScrambleReveal } from "./RevealScramble";
export { RevealText } from "./RevealText";
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
};
