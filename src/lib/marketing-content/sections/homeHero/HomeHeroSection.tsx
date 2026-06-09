"use client";

import { Reveal } from "@/components/ui/motion";
import { Button } from "@/components/ui/primitives/Button";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import { getMarketingLinkHref } from "../../links";
import type { HomeHeroSectionBlock } from "../../types";

type HomeHeroSectionProps = {
	section: HomeHeroSectionBlock;
};

export function HomeHeroSection({ section }: HomeHeroSectionProps) {
	const description = section.descriptions[0]?.text ?? "";

	return (
		<Section id="hero" padding="hero">
			<Reveal.List className="mx-auto flex min-h-[70vh] max-w-section-max flex-col justify-center gap-8">
				<Reveal.Item>
					<Text as="h1" variant="heading" className="max-w-3xl">
						{section.headline}
					</Text>
				</Reveal.Item>
				<Reveal.Item>
					<Text as="p" tone="muted" className="max-w-2xl">
						{description}
					</Text>
				</Reveal.Item>
				<Reveal.Item>
					<Button href={getMarketingLinkHref(section.cta)}>
						{section.cta.label}
					</Button>
				</Reveal.Item>
			</Reveal.List>
		</Section>
	);
}
