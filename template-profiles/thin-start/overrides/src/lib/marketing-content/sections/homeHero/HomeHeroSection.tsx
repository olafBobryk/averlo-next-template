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

function HomeHeroSectionRoot({ section }: HomeHeroSectionProps) {
	const description = section.descriptions[0]?.text ?? "";

	return (
		<Section
			id={section.id ?? "home-hero"}
			padding="hero"
			data-section-id={section.id ?? "home-hero"}
			data-section-label="Home Hero"
			data-section-type={section.blockType}
		>
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

function HomeHeroSectionSkeleton({ section }: HomeHeroSectionProps) {
	const description =
		section.descriptions[0]?.text ?? "A clear product description";
	return (
		<Section
			id={section.id ?? "home-hero"}
			padding="hero"
			data-section-id={section.id ?? "home-hero"}
			data-section-label="Home Hero"
			data-section-type={section.blockType}
		>
			<div className="mx-auto flex min-h-[70vh] max-w-section-max flex-col justify-center gap-8">
				<Text.Skeleton as="h1" variant="heading" className="max-w-3xl">
					{section.headline}
				</Text.Skeleton>
				<Text.Skeleton as="p" className="max-w-2xl">
					{description}
				</Text.Skeleton>
				<Button.Skeleton>{section.cta.label}</Button.Skeleton>
			</div>
		</Section>
	);
}

export const HomeHeroSection = Object.assign(HomeHeroSectionRoot, {
	Skeleton: HomeHeroSectionSkeleton,
});
