import {
	MotionProvider,
	MotionScope,
} from "@/components/ui/foundations/MotionProvider";
import { RevealHighlightText } from "./reveal/RevealHighlightText";
import { RevealImage } from "./reveal/RevealImage";
import { RevealItem } from "./reveal/RevealItem";
import { RevealList } from "./reveal/RevealList";
import { NumericReveal } from "./reveal/RevealNumeric";
import { RevealRoot } from "./reveal/RevealRoot";
import { RevealScene } from "./reveal/RevealScene";
import { ScrambleReveal } from "./reveal/RevealScramble";
import { RevealText } from "./reveal/RevealText";

export type {
	RevealImageClipRevealOrigin,
	RevealImageClipRevealTransition,
	RevealImageProps,
} from "./reveal/RevealImage";
export type { RevealItemProps } from "./reveal/RevealItem";
export type { RevealListProps } from "./reveal/RevealList";
export type {
	NumericRevealAnimation,
	NumericRevealProps,
} from "./reveal/RevealNumeric";
export type { RevealRootProps } from "./reveal/RevealRoot";
export { MotionProvider, MotionScope, NumericReveal };

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
