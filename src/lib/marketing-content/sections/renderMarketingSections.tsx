import type { MarketingSection, MarketingSectionBase } from "../types";
import { marketingSectionRegistry } from "./registry";

type RenderableMarketingSection =
	| MarketingSection
	| MarketingSectionBase<string>;

const isKnownSection = (
	section: RenderableMarketingSection,
): section is MarketingSection => section.blockType in marketingSectionRegistry;

function reportUnknownSection(blockType: string) {
	if (process.env.NODE_ENV === "production") return;
	// eslint-disable-next-line no-console
	console.warn(`[marketing-content] Unknown section blockType: ${blockType}`);
}

export function renderMarketingSections(
	sections: ReadonlyArray<RenderableMarketingSection>,
) {
	return sections.map((section, index) => {
		const key = section.id ?? `${section.blockType}-${index}`;

		if (!isKnownSection(section)) {
			reportUnknownSection(section.blockType);
			return null;
		}

		const Renderer = marketingSectionRegistry[section.blockType];
		return <Renderer key={key} section={section} />;
	});
}
