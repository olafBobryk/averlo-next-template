import type { MarketingSection, MarketingSectionBase } from "../types";
import { marketingSectionRegistry } from "./registry";

type RenderableMarketingSection =
	| MarketingSection
	| MarketingSectionBase<string>;

const formatSectionLabel = (
	section: RenderableMarketingSection,
	index: number,
) => {
	const source = section.id ?? section.blockType ?? `section-${index + 1}`;

	return source
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/[-_]+/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.replace(/\b\w/g, (letter) => letter.toUpperCase());
};

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
		const sectionId = section.id ?? `${section.blockType}-${index + 1}`;

		return (
			<div
				key={key}
				className="marketing-section-review-frame"
				data-marketing-section=""
				data-section-id={sectionId}
				data-section-label={formatSectionLabel(section, index)}
				data-section-type={section.blockType}
			>
				<Renderer section={section} />
			</div>
		);
	});
}
