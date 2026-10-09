"use client";

import * as MotionEffect from "@/components/ui/motion/effect";
import * as MotionSource from "@/components/ui/motion/source";
import { Button } from "@/components/ui/primitives/Button";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import { getMarketingLinkHref } from "../../links";
import type { HomeHeroSectionBlock } from "../../types";
import {
	HomeHeroPreviewCollage,
	HomeHeroPreviewCollageSkeleton,
} from "./HomeHeroPreviewCollage";

type HomeHeroSectionProps = { section: HomeHeroSectionBlock };

function HomeHeroSectionRoot({ section }: HomeHeroSectionProps) {
	return (
		<Section
			id={section.id ?? "home-hero"}
			height="hero"
			className="max-sm:min-h-[64rem]"
			background="background"
			padding="hero"
			innerClassName="items-center"
		>
			<Section.Background>
				<HomeHeroPreviewCollage services={section.services} />
			</Section.Background>
			<MotionSource.Sequence className="relative flex w-full grow flex-col items-start justify-start lg:justify-center">
				<div className="relative grid max-w-150 justify-items-start gap-7 lg:max-w-[38%] before:pointer-events-none before:absolute before:inset-x-0 before:-inset-y-6 before:-z-10 before:rounded-full before:bg-background/90 before:blur-2xl">
					<MotionSource.Root strategy={{ type: "reveal" }}>
						<MotionEffect.Entrance axis="x" distance={-20}>
							<Text
								as="h1"
								variant="headingHero"
								className="max-sm:text-[2.5rem] sm:max-lg:text-5xl"
							>
								{section.headline}
							</Text>
						</MotionEffect.Entrance>
					</MotionSource.Root>
					<MotionSource.Root strategy={{ type: "reveal" }}>
						<MotionEffect.Entrance axis="x" distance={-20}>
							<Text as="p" variant="body" tone="muted" className="max-w-110">
								{section.descriptions[0]?.text ?? ""}
							</Text>
						</MotionEffect.Entrance>
					</MotionSource.Root>
					<MotionSource.Root strategy={{ type: "reveal" }}>
						<MotionEffect.Entrance axis="x" distance={-20}>
							<Button
								href={getMarketingLinkHref(section.cta)}
								variant="primary"
								size="md"
							>
								{section.cta.label}
							</Button>
						</MotionEffect.Entrance>
					</MotionSource.Root>
				</div>
			</MotionSource.Sequence>
		</Section>
	);
}
function HomeHeroSectionSkeleton({ section }: HomeHeroSectionProps) {
	return (
		<Section
			id={section.id ?? "home-hero"}
			height="hero"
			className="max-sm:min-h-[64rem]"
			background="background"
			padding="hero"
			innerClassName="items-center"
		>
			<Section.Background>
				<HomeHeroPreviewCollageSkeleton services={section.services} />
			</Section.Background>
			<div className="relative flex w-full grow flex-col items-start justify-start lg:justify-center">
				<div className="relative grid max-w-150 justify-items-start gap-7 lg:max-w-[38%] before:pointer-events-none before:absolute before:inset-x-0 before:-inset-y-6 before:-z-10 before:rounded-full before:bg-background/90 before:blur-2xl">
					<Text.Skeleton
						as="h1"
						variant="headingHero"
						className="max-sm:text-[2.5rem] sm:max-lg:text-5xl"
					>
						{section.headline}
					</Text.Skeleton>
					<Text.Skeleton as="p" variant="body" className="max-w-110">
						{section.descriptions[0]?.text ?? ""}
					</Text.Skeleton>
					<Button.Skeleton variant="primary" size="md">
						{section.cta.label}
					</Button.Skeleton>
				</div>
			</div>
		</Section>
	);
}
export const HomeHeroSection = Object.assign(HomeHeroSectionRoot, {
	Skeleton: HomeHeroSectionSkeleton,
});
