import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import homeComparison from "./homeComparison.fixture.json";
import { Icon, type IconName } from "./Icon";
import { catalogContract } from "./Icon.catalog";
import {
	createIconRegistry,
	IconProvider,
	useIconRegistry,
} from "./iconRegistry";

function RegistryGalleryContent() {
	const registry = useIconRegistry();
	const names = Object.keys(registry).sort() as IconName[];

	return (
		<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
			{names.map((name) => (
				<div
					className="flex min-w-0 items-center gap-2 rounded-lg border border-foreground/10 bg-surface px-3 py-2"
					key={name}
				>
					<Icon aria-hidden name={name} size="sm" />
					<code className="min-w-0 truncate text-2xs text-muted-foreground">
						{name}
					</code>
				</div>
			))}
		</div>
	);
}

const meta = {
	id: "ui-icons-icon",
	excludeStories: ["catalogContract"],
	title: "UI/Icons/Icon and Registry",
	component: Icon,
	subcomponents: { "Icon.Skeleton": Icon.Skeleton },
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj;

export const SizesFramesAndSemantics: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Icon data-testid="small-icon" name="check" size="sm" />
			<Icon data-testid="medium-icon" frame="default" name="plus" size="md" />
			<Icon data-testid="large-icon" name="arrow-right" size="lg" mirrorInRtl />
			<Icon.Skeleton size="md" />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByTestId("small-icon").querySelector("svg"),
		).toHaveAttribute("aria-hidden", "true");
		await expect(canvas.getByTestId("medium-icon")).toHaveClass(
			"rounded-button-sm",
		);
	},
};

export const RegistryExtension: Story = {
	render: () => {
		const registry = createIconRegistry({
			"catalog-mark": ({ className, ...props }) => (
				<svg className={className} viewBox="0 0 10 10" {...props}>
					<title>Catalog mark</title>
					<circle cx="5" cy="5" r="4" fill="currentColor" />
				</svg>
			),
		});
		return (
			<IconProvider registry={registry}>
				<Icon data-testid="registry-icon" name="catalog-mark" />
			</IconProvider>
		);
	},
	play: async ({ canvas }) => {
		await expect(
			canvas.getByTestId("registry-icon").querySelector("circle"),
		).toBeInTheDocument();
	},
};

export const RegistryGallery: Story = {
	render: () => <RegistryGalleryContent />,
	play: async ({ canvas }) => {
		const arrowRight = canvas.getByText("arrow-right");
		await expect(arrowRight).toBeVisible();
		await expect(
			arrowRight.closest("div")?.querySelector("svg"),
		).toBeInTheDocument();
	},
};

export const SemanticFillDefaults: Story = {
	render: () => (
		<div className="grid gap-5 p-6">
			<h2 className="text-lg font-semibold">Per-icon fill defaults</h2>
			{(["bolt", "sparkle", "home"] as const).map((name) => (
				<div key={name} className="flex items-center gap-6">
					<code className="w-20">{name}</code>
					<span
						data-testid={`${name}-default`}
						className="flex items-center gap-2"
					>
						<Icon name={name} size="lg" /> Default
					</span>
					<span
						data-testid={`${name}-regular`}
						className="flex items-center gap-2"
					>
						<Icon name={name} size="lg" weight="regular" /> Regular override
					</span>
					<span
						data-testid={`${name}-fill`}
						className="flex items-center gap-2"
					>
						<Icon name={name} size="lg" weight="fill" /> Fill override
					</span>
				</div>
			))}
		</div>
	),
	play: async ({ canvas }) => {
		const shape = (id: string) =>
			canvas.getByTestId(id).querySelector("svg")?.outerHTML;
		for (const name of ["bolt", "sparkle"]) {
			await expect(shape(`${name}-default`)).toBe(shape(`${name}-fill`));
			await expect(shape(`${name}-default`)).not.toBe(shape(`${name}-regular`));
		}
		await expect(shape("home-default")).toBe(shape("home-regular"));
	},
};

export const RegistryWeightOverride: Story = {
	render: () => {
		const registry = createIconRegistry(
			{
				bolt: (props) => (
					<svg
						viewBox="0 0 24 24"
						data-weight={props.weight}
						aria-hidden="true"
					>
						<path d="M12 2 4 14h7l-1 8 10-13h-7z" />
					</svg>
				),
			},
			{ bolt: "regular" },
		);
		return (
			<IconProvider registry={registry}>
				<Icon name="bolt" data-testid="registry-default" />
				<Icon name="bolt" weight="fill" data-testid="caller-override" />
			</IconProvider>
		);
	},
	play: async ({ canvas }) => {
		await expect(
			canvas.getByTestId("registry-default").querySelector("svg"),
		).toHaveAttribute("data-weight", "regular");
		await expect(
			canvas.getByTestId("caller-override").querySelector("svg"),
		).toHaveAttribute("data-weight", "fill");
	},
};

export const HomePackComparison: Story = {
	parameters: { layout: "fullscreen" },
	render: () => (
		<div className="mx-auto max-w-5xl p-6 sm:p-10">
			<h1 className="text-2xl font-semibold">One home, nine icon families</h1>
			<p className="mt-2 mb-7 text-sm text-muted-foreground">
				Original upstream geometry and stroke weights. Compare at actual UI
				sizes, then in a 16px navigation row. Phosphor is the current app
				default.
			</p>
			<div className="overflow-x-auto">
				<table className="w-full min-w-[660px] text-left text-sm">
					<thead>
						<tr className="text-muted-foreground">
							<th className="pb-3 font-normal">Pack / variant</th>
							{[16, 20, 24, 32].map((size) => (
								<th key={size} className="pb-3 text-center font-normal">
									{size}px
								</th>
							))}
							<th className="pb-3 pl-6 font-normal">In a sidebar</th>
						</tr>
					</thead>
					<tbody>
						{homeComparison.map((pack) => (
							<tr key={pack.name} className="border-t border-border">
								<th className="py-4 pr-8 font-normal">
									<a
										className="font-semibold hover:underline"
										href={pack.source}
										target="_blank"
										rel="noreferrer"
									>
										{pack.name}
									</a>
									<div className="mt-1 text-xs text-muted-foreground">
										{pack.variant}
									</div>
								</th>
								{[16, 20, 24, 32].map((size) => (
									<td key={size} className="px-4">
										<img
											alt={`${pack.name} home at ${size}px`}
											className="mx-auto dark:invert"
											width={size}
											height={size}
											src={`data:image/svg+xml,${encodeURIComponent(pack.svg)}`}
										/>
									</td>
								))}
								<td className="py-3 pl-6">
									<div className="flex h-9 items-center gap-2 rounded-md bg-surface px-3">
										<img
											alt=""
											className="dark:invert"
											width={16}
											height={16}
											src={`data:image/svg+xml,${encodeURIComponent(pack.svg)}`}
										/>
										<span>Overview</span>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<p className="mt-6 text-sm text-muted-foreground">
				OpenAI is the published Apps SDK UI reference, not a claim that every
				ChatGPT screen uses this exact glyph. Lucide and Feather share an
				intentionally similar visual lineage. No pack has been switched in the
				app.
			</p>
		</div>
	),
	play: async ({ canvas }) => {
		await expect(canvas.getAllByRole("img")).toHaveLength(36);
		for (const image of canvas.getAllByRole("img")) {
			await expect(image).toHaveAttribute(
				"src",
				expect.stringContaining("data:image/svg+xml,"),
			);
		}
	},
};

export const OpenAIDefaultAndState: Story = {
	render: () => (
		<div className="flex items-center gap-6 p-6">
			<Icon name="home" data-testid="sdk-home" size="lg" />
			<Icon name="pin" weight="regular" data-testid="pin-outline" size="lg" />
			<Icon name="pin" weight="fill" data-testid="pin-filled" size="lg" />
			<Icon name="github" data-testid="brand-fallback" size="lg" />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByTestId("sdk-home").querySelector("svg"),
		).toHaveAttribute("viewBox", "0 0 24 24");
		await expect(
			canvas
				.getByTestId("pin-outline")
				.querySelector("path")
				?.getAttribute("d"),
		).not.toEqual(
			canvas.getByTestId("pin-filled").querySelector("path")?.getAttribute("d"),
		);
		await expect(
			canvas.getByTestId("brand-fallback").querySelector("svg"),
		).toBeInTheDocument();
		await expect(
			canvas.getByTestId("sdk-home").querySelector("svg"),
		).not.toHaveAttribute("weight");
	},
};
