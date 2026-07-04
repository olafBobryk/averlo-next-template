import { Reveal } from "@/components/ui/motion";
import { ScrollLag } from "@/components/ui/motion/ScrollLag";
import { ScrollParallax } from "@/components/ui/motion/ScrollParallax";
import { ScrollWidth } from "@/components/ui/motion/ScrollWidth";
import { Button } from "@/components/ui/primitives/Button";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";

type SearchParams = Promise<
	Record<string, string | string[] | undefined> | undefined
>;

type Scenario = "control" | "default" | "stress";

const SCENARIO_ORDER: Scenario[] = ["control", "default", "stress"];

const SCENARIO_CONFIG: Record<
	Scenario,
	{
		accentCount: number;
		bandCount: number;
		cardCount: number;
		description: string;
		includeLag: boolean;
		includeParallax: boolean;
		includeWidth: boolean;
		label: string;
	}
> = {
	control: {
		accentCount: 4,
		bandCount: 6,
		cardCount: 3,
		description:
			"Baseline fixture using shared shell and primitives with minimal scroll-linked motion.",
		includeLag: false,
		includeParallax: false,
		includeWidth: false,
		label: "Control",
	},
	default: {
		accentCount: 6,
		bandCount: 10,
		cardCount: 4,
		description:
			"Primary scoring fixture using shared shell, reveal, width, and parallax patterns in a deterministic long-scroll layout.",
		includeLag: true,
		includeParallax: true,
		includeWidth: true,
		label: "Default",
	},
	stress: {
		accentCount: 8,
		bandCount: 14,
		cardCount: 5,
		description:
			"Heavier deterministic fixture for overflow and tail-latency checks before loop changes graduate into real pages.",
		includeLag: true,
		includeParallax: true,
		includeWidth: true,
		label: "Stress",
	},
};

function getScenario(
	searchParams: Record<string, string | string[] | undefined> | undefined,
): Scenario {
	const raw = searchParams?.scenario;
	const value = Array.isArray(raw) ? raw[0] : raw;
	return value === "control" || value === "stress" ? value : "default";
}

function buildScenarioHref(scenario: Scenario) {
	return `/internal/scroll-performance?scenario=${scenario}`;
}

function MetricCard({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-md border border-border bg-background p-5">
			<Text variant="caption" tone="muted">
				{label}
			</Text>
			<Text as="p" variant="headingMd" className="mt-3">
				{value}
			</Text>
		</div>
	);
}

function ScenarioBand({
	bandIndex,
	cardCount,
	includeLag,
	includeParallax,
	includeWidth,
}: {
	bandIndex: number;
	cardCount: number;
	includeLag: boolean;
	includeParallax: boolean;
	includeWidth: boolean;
}) {
	const cards = Array.from({ length: cardCount }, (_, index) => index);
	const accent = `${String(bandIndex + 1).padStart(2, "0")}`;

	return (
		<Section
			as="section"
			padding="default"
			data-scroll-performance-band={bandIndex + 1}
		>
			<div className="mx-auto grid max-w-section-max gap-10 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
				<div className="grid content-start gap-4 lg:sticky lg:top-28">
					<Text variant="caption" tone="muted">
						Band {accent}
					</Text>
					{includeParallax ? (
						<ScrollParallax magnitude={50}>
							<Text as="h2" variant="headingXl">
								Deterministic scroll specimen
							</Text>
						</ScrollParallax>
					) : (
						<Text as="h2" variant="headingXl">
							Deterministic scroll specimen
						</Text>
					)}
					<Text as="p" tone="muted">
						Repeated shared primitives and motion wrappers with stable copy,
						layout, and asset-free rendering.
					</Text>
				</div>
				<div className="grid gap-5">
					{cards.map((cardIndex) => {
						const body = (
							<div className="rounded-md border border-border bg-surface p-6">
								<Text variant="caption" tone="muted">
									Segment {accent}.{cardIndex + 1}
								</Text>
								<Text as="h3" variant="headingMd" className="mt-4 max-w-xl">
									Shared typography and spacing stay fixed while the harness
									measures scroll behavior against a production-like preview.
								</Text>
								<Text as="p" tone="muted" className="mt-6 max-w-2xl">
									This route is review infrastructure only. It does not proxy
									the Home page, claim content ownership, or introduce
									provider-backed behavior.
								</Text>
							</div>
						);

						const laggedBody = includeLag ? (
							<ScrollLag magnitude={0.08}>{body}</ScrollLag>
						) : (
							body
						);

						if (!includeWidth) {
							return <div key={`${bandIndex}-${cardIndex}`}>{laggedBody}</div>;
						}

						return (
							<ScrollWidth
								key={`${bandIndex}-${cardIndex}`}
								className="min-h-[220px]"
								contentClassName="bg-background"
								coverClassName="bg-background"
								endInset={56}
								endRadius={{ bl: 18, br: 18, tl: 18, tr: 18 }}
								frameClassName="border border-border bg-background"
								startInset={12}
								startRadius={{ bl: 8, br: 8, tl: 8, tr: 8 }}
							>
								{laggedBody}
							</ScrollWidth>
						);
					})}
				</div>
			</div>
		</Section>
	);
}

export default async function ScrollPerformancePage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const resolvedSearchParams = await searchParams;
	const scenario = getScenario(resolvedSearchParams);
	const config = SCENARIO_CONFIG[scenario];
	const accentRows = Array.from(
		{ length: config.accentCount },
		(_, index) => index,
	);
	const bands = Array.from({ length: config.bandCount }, (_, index) => index);

	return (
		<main
			data-scroll-performance-root="true"
			data-scroll-performance-scenario={scenario}
		>
			<Section padding="hero">
				<div className="mx-auto grid max-w-section-max gap-8">
					<header className="grid gap-4">
						<Text as="h1" variant="headingXl">
							Scroll Performance Harness
						</Text>
						<Text as="p" tone="muted" className="max-w-3xl">
							Purpose-built internal route for deterministic scroll scoring in a
							production-like local preview. The shared shell, global mounts,
							primitives, and motion wrappers stay real; the page fixture stays
							fixed and source-free.
						</Text>
					</header>
					<div className="flex flex-wrap gap-3">
						{SCENARIO_ORDER.map((option) => (
							<Button
								key={option}
								href={buildScenarioHref(option)}
								variant={option === scenario ? "primary" : "outline"}
							>
								{SCENARIO_CONFIG[option].label}
							</Button>
						))}
					</div>
					<div className="grid gap-4 md:grid-cols-3">
						<MetricCard label="Scenario" value={config.label} />
						<MetricCard
							label="Fixture bands"
							value={String(config.bandCount)}
						/>
						<MetricCard
							label="Cards per band"
							value={String(config.cardCount)}
						/>
					</div>
					<Text as="p" tone="muted" className="max-w-3xl">
						{config.description}
					</Text>
					<div className="grid gap-3 md:grid-cols-2">
						<div className="rounded-md border border-border bg-surface p-5">
							<Text variant="caption" tone="muted">
								Automation target
							</Text>
							<Text as="p" className="mt-3">
								{`/internal/scroll-performance?scenario=${scenario}`}
							</Text>
						</div>
						<div className="rounded-md border border-border bg-surface p-5">
							<Text variant="caption" tone="muted">
								Motion flags
							</Text>
							<Text as="p" className="mt-3">
								Manual review can still use <code>?motion=off&reveal=off</code>;{" "}
								the score runner measures the route without those overrides.
							</Text>
						</div>
					</div>
				</div>
			</Section>

			<Section padding="default">
				<Reveal.List className="mx-auto grid max-w-section-max gap-4 md:grid-cols-3">
					<Reveal.Item>
						<MetricCard
							label="Lag wrapper"
							value={config.includeLag ? "On" : "Off"}
						/>
					</Reveal.Item>
					<Reveal.Item>
						<MetricCard
							label="Parallax wrapper"
							value={config.includeParallax ? "On" : "Off"}
						/>
					</Reveal.Item>
					<Reveal.Item>
						<MetricCard
							label="Width wrapper"
							value={config.includeWidth ? "On" : "Off"}
						/>
					</Reveal.Item>
				</Reveal.List>
			</Section>

			<Section padding="flush-x">
				<div className="mx-auto grid max-w-section-max gap-4 px-[var(--spacing-section-x)]">
					{accentRows.map((index) => (
						<div
							key={index}
							className="h-8 rounded-full bg-[linear-gradient(90deg,var(--color-primary)_0%,transparent_70%)] opacity-60"
						/>
					))}
				</div>
			</Section>

			{bands.map((bandIndex) => (
				<ScenarioBand
					key={bandIndex}
					bandIndex={bandIndex}
					cardCount={config.cardCount}
					includeLag={config.includeLag}
					includeParallax={config.includeParallax}
					includeWidth={config.includeWidth}
				/>
			))}

			<Section padding="default">
				<div className="mx-auto grid max-w-section-max gap-6 rounded-md border border-border bg-background p-6">
					<Text as="h2" variant="headingMd">
						Harness notes
					</Text>
					<Text as="p" tone="muted">
						This surface is intentionally deterministic. It exists so the
						scroll-performance loop can compare bounded candidates before any
						wins are promoted into public page work.
					</Text>
					<div className="flex flex-wrap gap-3">
						<Button href="/internal/demo/ui/motion" variant="ghost">
							Motion demos
						</Button>
						<Button
							href="/internal/intelligence?view=benchmarks"
							variant="ghost"
						>
							Benchmark pattern reference
						</Button>
						<Button href={buildScenarioHref("default")} variant="ghost">
							Reset to default
						</Button>
					</div>
				</div>
			</Section>
		</main>
	);
}
