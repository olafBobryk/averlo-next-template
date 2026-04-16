"use client";

import { MotionScene } from "@/components/ui/motion/MotionScene";
import { RevealGroup, RevealItem } from "@/components/ui/motion/Reveal";
import { Button } from "@/components/ui/primitives/Button";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";

const heroDescription =
	"Compose pages from shared primitives, motion, and layout building blocks so every screen stays consistent, adaptable, and easy to extend.";

export function HomeHeroSection() {
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
									A design system built for full control.
								</Text>
							</RevealItem>
							<RevealItem
								className="justify-end self-end lg:hidden"
								variants={{
									hidden: { opacity: 0, x: -20 },
									show: { opacity: 1, x: 0 },
								}}
							>
								<Text
									as="p"
									variant="body"
									tone="muted"
									interactive={false}
									className="text-shadow max-w-400"
								>
									{heroDescription}
								</Text>
							</RevealItem>
						</div>
						<RevealItem
							variants={{
								hidden: { opacity: 0, x: -20 },
								show: { opacity: 1, x: 0 },
							}}
						>
							<Button variant="primary" size="md" className="!">
								Contact
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
						<Text
							as="p"
							variant="body"
							tone="muted"
							interactive={false}
							className="max-w-75"
						>
							{heroDescription}
						</Text>
					</RevealItem>
				</RevealGroup>
			</Section>
		</MotionScene>
	);
}
