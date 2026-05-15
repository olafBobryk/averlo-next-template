"use client";

import { MotionScene } from "@/components/ui/motion/MotionScene";
import { RevealGroup, RevealItem } from "@/components/ui/motion/Reveal";
import { Button } from "@/components/ui/primitives/Button";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import type { HomeHeroSectionBlock } from "../../types";

type HomeHeroSectionProps = {
	section: HomeHeroSectionBlock;
};

export function HomeHeroSection({ section }: HomeHeroSectionProps) {
	const description = section.descriptions[0]?.text ?? "";

	return (
		<MotionScene>
			<Section id="hero" height="hero" background="background" padding="hero">
				<Section.Background
					interactive
					className="flex justify-center rtl:-scale-x-100"
				>
					<div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_at_top,rgb(var(--color-primary-rgb)_/_0.24),transparent_62%)]" />
					<div className="absolute left-1/2 top-0 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-primary/12 blur-[120px]" />
				</Section.Background>
				<RevealGroup className="w-full flex flex-col justify-between grow">
					<div className="flex flex-col gap-10 max-w-150 items-start">
						<div className="space-y-[25px]">
							<RevealItem
								variants={{
									hidden: { opacity: 0, x: -20 },
									show: { opacity: 1, x: 0 },
								}}
							>
								<Text as="h1" variant="headingHero">
									{section.headline}
								</Text>
							</RevealItem>
							<RevealItem
								className="justify-end self-end lg:hidden"
								variants={{
									hidden: { opacity: 0, x: -20 },
									show: { opacity: 1, x: 0 },
								}}
							>
								<HeroDescription
									description={description}
									className="text-shadow max-w-400"
								/>
							</RevealItem>
						</div>
						<RevealItem
							variants={{
								hidden: { opacity: 0, x: -20 },
								show: { opacity: 1, x: 0 },
							}}
						>
							<Button href={section.cta.href} variant="primary" size="md">
								{section.cta.label}
							</Button>
						</RevealItem>
					</div>
					<div className="h-100 md:hidden" />

					<RevealItem
						className="justify-end self-end hidden lg:flex"
						variants={{
							hidden: { opacity: 0, x: 20 },
							show: { opacity: 1, x: 0 },
						}}
					>
						<HeroDescription description={description} className="max-w-75" />
					</RevealItem>
				</RevealGroup>
			</Section>
		</MotionScene>
	);
}

function HeroDescription({
	description,
	className,
}: {
	description: string;
	className?: string;
}) {
	return (
		<Text
			as="p"
			variant="body"
			tone="muted"
			interactive={false}
			className={className}
		>
			{description}
		</Text>
	);
}
