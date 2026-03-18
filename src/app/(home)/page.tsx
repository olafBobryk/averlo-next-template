"use client";

import { getVisibleDemoPages } from "@/app/demo/content";
import { ScrambleReveal } from "@/components/ui/motion/ScrambleReveal";
import { Button } from "@/components/ui/primitives/Button";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";

const demoPages = getVisibleDemoPages();
const demoGroups = demoPages.flatMap((page) => page.groups);
const demoItems = demoGroups.flatMap((group) => group.items);

const introStats = [
	{
		label: "Components",
		value: demoItems.filter((item) => item.kind === "component").length,
		description: "Reusable surfaces, inputs, overlays, and motion helpers.",
	},
	{
		label: "Categories",
		value: demoPages.length,
		description: "Browsable areas of the library with dedicated examples.",
	},
	{
		label: "Usage Patterns",
		value: demoItems.filter((item) => item.kind === "usage").length,
		description: "Copyable snippets that show the intended adoption path.",
	},
] as const;

export default function Home() {
	return (
		<main className="min-h-screen">
			<Section
				id="intro"
				height="hero"
				padding="hero"
				className="flex flex-col justify-center"
				innerClassName="flex w-full flex-col gap-8 md:gap-10"
			>
				<Section.Background>
					<div className="absolute inset-0 bg-linear-to-br from-primary/16 via-background to-background" />
					{/* 
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.72),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(39,110,241,0.14),transparent_28%)]" /> */}
					<div className="absolute -left-16 top-10 h-52 w-52 rounded-full bg-primary/14 blur-3xl" />
					{/* <div className="absolute -right-8 bottom-6 h-64 w-64 rounded-full bg-primary/8 blur-3xl" /> */}
				</Section.Background>

				<div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(21rem,0.95fr)] lg:items-center">
					<div className="flex flex-col gap-6">
						<Text variant="caption" className="text-primary uppercase">
							Agent-Driven Component Library
						</Text>
						<Text
							as="h1"
							variant="heading2xxl"
							className="max-w-3xl text-balance"
						>
							A live reference for reusable UI, system conventions, and
							documentation that agents can build from without guessing.
						</Text>
						<Text
							as="p"
							variant="body"
							tone="muted"
							className="max-w-xl text-pretty"
						>
							The demo route is the working surface for the library. Components,
							usage patterns, and folder-level guidance all live together so a
							person reviewing the system and an agent extending it can start
							from the same source of truth.
						</Text>
						<div className="flex flex-wrap gap-3">
							<Button href="/demo" variant="primary" size="md">
								Open Demo Catalog
							</Button>
							<Button href="/settings" variant="outline" size="md">
								View Settings
							</Button>
						</div>
					</div>

					<Panel
						display="flex"
						padding="lg"
						gap="lg"
						background="transparent"
						shadow="none"
						className="overflow-hidden rounded-[2rem] border border-primary/12 bg-linear-to-b from-white/88 via-white/78 to-white/62 backdrop-blur"
					>
						<div className="flex items-start justify-between gap-4">
							<div className="flex flex-col gap-2">
								<Text variant="caption" className="text-primary uppercase">
									System Snapshot
								</Text>
								<Text
									as="h2"
									variant="headingLg"
									className="max-w-sm text-balance"
								>
									Browsable primitives, categories, and copyable implementation
									patterns.
								</Text>
							</div>
							<div className="mt-2 h-16 w-16 rounded-full bg-linear-to-br from-primary/85 to-primary/20 blur-xl" />
						</div>

						<div className="grid gap-4 sm:grid-cols-3">
							{introStats.map((stat, index) => (
								<div
									key={stat.label}
									className="rounded-[1.5rem] border border-border/10 bg-background/72 p-5"
								>
									<div className="flex flex-col gap-2">
										<Text variant="caption" tone="muted" className="uppercase">
											{stat.label}
										</Text>
										<ScrambleReveal
											delayMs={220 + index * 120}
											maintainSpace
											mode="numeric"
											textVariant="2xxl"
										>
											{String(stat.value)}
										</ScrambleReveal>
										<Text variant="body" tone="muted">
											{stat.description}
										</Text>
									</div>
								</div>
							))}
						</div>

						<div className="rounded-[1.5rem] border border-primary/12 bg-linear-to-r from-primary/10 via-primary/4 to-transparent p-5">
							<Text variant="bodyStrong">
								The docs are meant to be operational: demo pages show the
								component, AGENTS files explain where it belongs, and the page
								structure gives agents an unambiguous way to extend the system
								without inventing parallel UI.
							</Text>
						</div>
					</Panel>
				</div>
			</Section>
		</main>
	);
}
