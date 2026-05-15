import type { ComponentType } from "react";
import type { MarketingSection } from "../types";
import { HomeHeroSection } from "./homeHero/HomeHeroSection";

type MarketingSectionRenderer<TSection extends MarketingSection> =
	ComponentType<{
		section: TSection;
	}>;

export const marketingSectionRegistry = {
	homeHero: HomeHeroSection,
} satisfies {
	[TBlockType in MarketingSection["blockType"]]: MarketingSectionRenderer<
		Extract<MarketingSection, { blockType: TBlockType }>
	>;
};
