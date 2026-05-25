import { GraphMap, type GraphMapView } from "@/components/ui/misc/GraphMap";
import { Button } from "@/components/ui/primitives/Button";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";

const REFERENCE_LINKS = [
	{
		title: "Real Favicon Generator",
		summary:
			"Generate a favicon set, pinned assets, and manifest files before copying the final outputs into `public/`.",
		href: "https://realfavicongenerator.net/",
	},
];

type ReferenceGraphViewId = "graph-system" | "content-only";

const REFERENCE_GRAPH_VIEWS: GraphMapView<ReferenceGraphViewId>[] = [
	{
		id: "graph-system",
		title: "3D + 2D Graph System",
		description:
			"Reusable graph UX shell: 3D overview, 2D focus, node details, legend, and focus gate stay stable while content changes.",
		nodes: [
			{
				id: "entry:graph-map",
				label: "GraphMap",
				kind: "entry",
				weight: 5,
				guideX: 0,
				guideY: 0,
				detail: {
					title: "GraphMap renderer",
					summary:
						"The reusable graph canvas component. Product surfaces should feed graph views into this renderer instead of rebuilding graph UX.",
					paths: ["src/components/ui/misc/GraphMap.tsx"],
					tags: ["renderer", "3D overview", "2D focus"],
				},
			},
			{
				id: "surface:provider",
				label: "Data provider",
				kind: "surface",
				weight: 4,
				guideX: -720,
				guideY: -180,
				detail: {
					title: "Graph data provider",
					summary:
						"Server-side code builds nodes and links. The client renderer only receives ready-to-render graph views.",
					tags: ["content only", "server built"],
				},
			},
			{
				id: "file:node",
				label: "Nodes",
				kind: "file",
				weight: 3,
				guideX: -360,
				guideY: 260,
				detail: {
					title: "Node content",
					summary:
						"Nodes carry labels, kinds, weights, paths, and detail metadata. This is the part each product graph changes.",
					tags: ["label", "kind", "detail"],
				},
			},
			{
				id: "file:link",
				label: "Connections",
				kind: "file",
				weight: 3,
				guideX: 360,
				guideY: 260,
				detail: {
					title: "Connection content",
					summary:
						"Links describe relationships between nodes. Visual meaning is mapped by the graph renderer.",
					tags: ["source", "target", "weight"],
				},
			},
			{
				id: "resolver:3d",
				label: "3D overview",
				kind: "resolver",
				weight: 4,
				guideX: 620,
				guideY: -220,
				detail: {
					title: "3D overview",
					summary:
						"Shows the whole system with physics, semantic node colors, and always-visible chip-style labels.",
					tags: ["overview", "physics"],
				},
			},
			{
				id: "resolver:2d",
				label: "2D focus",
				kind: "resolver",
				weight: 4,
				guideX: 760,
				guideY: 120,
				detail: {
					title: "2D focus map",
					summary:
						"Centers the current node and keeps direct neighbors visible for local navigation.",
					tags: ["focus", "neighbors"],
				},
			},
			{
				id: "docs:reference",
				label: "Reference",
				kind: "docs",
				weight: 2,
				guideX: 0,
				guideY: 460,
				detail: {
					title: "Reference usage",
					summary:
						"Use this page as the implementation reference for future 3D + 2D graph surfaces in this design system.",
					paths: ["src/app/(site)/(marketing)/internal/reference/page.tsx"],
					tags: ["example", "pattern"],
				},
			},
		],
		links: [
			{ source: "entry:graph-map", target: "surface:provider", weight: 3 },
			{ source: "surface:provider", target: "file:node", weight: 2 },
			{ source: "surface:provider", target: "file:link", weight: 2 },
			{ source: "entry:graph-map", target: "resolver:3d", weight: 3 },
			{ source: "entry:graph-map", target: "resolver:2d", weight: 3 },
			{ source: "entry:graph-map", target: "docs:reference", weight: 1 },
			{ source: "file:node", target: "resolver:3d", weight: 2 },
			{ source: "file:link", target: "resolver:2d", weight: 2 },
		],
	},
	{
		id: "content-only",
		title: "Content-Only Swap",
		description:
			"The same graph shell with a different product map. Only nodes and connections change.",
		nodes: [
			{
				id: "entry:product",
				label: "Product map",
				kind: "entry",
				weight: 5,
				guideX: 0,
				guideY: 0,
				detail: {
					title: "Product map entry",
					summary:
						"A product-specific graph can reuse the same controls, focus lock, detail panel, and label treatment.",
					tags: ["entry", "content swap"],
				},
			},
			{
				id: "task:journey",
				label: "Journey",
				kind: "task",
				weight: 4,
				guideX: -620,
				guideY: -180,
				detail: {
					title: "Journey node",
					summary:
						"Use task nodes for workflows, product journeys, or system flows.",
					tags: ["workflow"],
				},
			},
			{
				id: "mode:state",
				label: "States",
				kind: "mode",
				weight: 3,
				guideX: -560,
				guideY: 240,
				detail: {
					title: "State node",
					summary:
						"Use mode nodes to show states, variants, or operating modes.",
					tags: ["state"],
				},
			},
			{
				id: "dependency:data",
				label: "Data",
				kind: "dependency",
				weight: 3,
				guideX: 520,
				guideY: -230,
				detail: {
					title: "Data dependency",
					summary:
						"Dependency nodes show packages, services, schemas, or data boundaries.",
					tags: ["dependency"],
				},
			},
			{
				id: "assertion:tests",
				label: "Checks",
				kind: "assertion",
				weight: 2,
				guideX: 620,
				guideY: 210,
				detail: {
					title: "Verification checks",
					summary:
						"Assertion nodes make validation and acceptance criteria visible inside the map.",
					tags: ["verification"],
				},
			},
		],
		links: [
			{ source: "entry:product", target: "task:journey", weight: 3 },
			{ source: "entry:product", target: "mode:state", weight: 2 },
			{ source: "entry:product", target: "dependency:data", weight: 2 },
			{ source: "task:journey", target: "assertion:tests", weight: 1 },
			{ source: "dependency:data", target: "assertion:tests", weight: 2 },
		],
	},
];

export default function ReferencePage() {
	return (
		<main>
			<Section padding={"hero"}>
				<div className="flex flex-col gap-6">
					<header className="flex flex-col gap-2">
						<Text as="h1" variant="headingLg">
							Reference
						</Text>
						<Text variant="body" tone="muted">
							Repo-level utility links and operational notes belong here, not in
							the dictionary.
						</Text>
					</header>

					<div className="grid gap-4">
						{REFERENCE_LINKS.map((link) => (
							<Panel key={link.href} display="flex" padding="md" gap="sm">
								<Text as="h2" variant="headingSm">
									{link.title}
								</Text>
								<Text variant="body" tone="muted">
									{link.summary}
								</Text>
								<div className="flex flex-wrap gap-2">
									<Button
										href={link.href}
										size="sm"
										variant="outline"
										target="_blank"
										rel="noreferrer"
									>
										Open link
									</Button>
								</div>
							</Panel>
						))}
					</div>
				</div>
			</Section>

			<Section padding="default">
				<div className="grid gap-3">
					<Text as="h2" variant="headingMd">
						3D + 2D Graph Reference
					</Text>
					<Text variant="body" tone="muted">
						This live example uses the same graph shell as Template
						Intelligence. Future graph surfaces should keep the interaction
						model and replace only the graph views, nodes, and connections.
					</Text>
				</div>
			</Section>

			<GraphMap<ReferenceGraphViewId>
				graphs={REFERENCE_GRAPH_VIEWS}
				ariaLabel="Design system graph reference"
				backHref="/internal/reference"
				backLabel="Reference"
				asMain={false}
			/>
		</main>
	);
}
