"use client";

import { forceCollide, forceX, forceY } from "d3-force";
import dynamic from "next/dynamic";
import {
	type ComponentType,
	type MutableRefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type {
	ForceGraphMethods as ForceGraph2DMethods,
	ForceGraphProps as ForceGraph2DProps,
	GraphData as GraphData2D,
	LinkObject as LinkObject2D,
	NodeObject as NodeObject2D,
} from "react-force-graph-2d";
import type {
	ForceGraphMethods as ForceGraph3DMethods,
	ForceGraphProps as ForceGraph3DProps,
	GraphData as GraphData3D,
	LinkObject as LinkObject3D,
	NodeObject as NodeObject3D,
} from "react-force-graph-3d";
import {
	Group,
	LineBasicMaterial,
	Mesh,
	MeshBasicMaterial,
	SphereGeometry,
	type SpriteMaterial,
} from "three";
import SpriteText from "three-spritetext";
import {
	Chip,
	chipCanvasTokens,
	getChipCanvasMetrics,
} from "@/components/ui/misc/Chip";
import { InteractionGate } from "@/components/ui/misc/InteractionGate";
import { SegmentedControl } from "@/components/ui/misc/SegmentedControl";
import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";

type ViewMode = "3d" | "2d-focus";
type VisualNodeKind =
	| "component"
	| "topic"
	| "action"
	| "service"
	| "parameter";
type VisualLinkKind =
	| "publish"
	| "subscribe"
	| "action-client"
	| "action-server"
	| "service-client"
	| "service-provider"
	| "parameter-owner";
type FocusLinkEmphasis = "primary" | "context";

export type GraphMapViewId = string;

export type GraphMapNodeKind =
	| "assertion"
	| "boundary"
	| "concept"
	| "dependency"
	| "docs"
	| "entry"
	| "file"
	| "flag"
	| "mode"
	| "resolver"
	| "rewrite"
	| "script"
	| "source-type"
	| "surface"
	| "task";

export type GraphMapNode = {
	id: string;
	label: string;
	kind: GraphMapNodeKind;
	weight: number;
	path?: string;
	group?: string;
	guideX?: number;
	guideY?: number;
	detail: {
		title: string;
		summary?: string;
		metrics?: Record<string, string | number>;
		paths?: string[];
		notes?: string[];
		tags?: string[];
	};
};

export type GraphMapLink = {
	source: string;
	target: string;
	weight: number;
	label?: string;
};

export type GraphMapView<TViewId extends GraphMapViewId = GraphMapViewId> = {
	id: TViewId;
	title: string;
	description: string;
	canvas?: {
		width: number;
		height: number;
		background: string;
		accent: string;
		defaultZoom: number;
		minZoom: number;
		cardScaleFloor: number;
		linkOpacity: number;
		selectedLinkOpacity: number;
		labelPriority: GraphMapNodeKind[];
		selectedNeighborhoodDefault: boolean;
		stageHeightVh: number;
		fixedBackdrop: boolean;
		promptLabel: string;
	};
	nodes: GraphMapNode[];
	links: GraphMapLink[];
};

type GraphNode = GraphMapNode & {
	color: string;
	visualKind: VisualNodeKind;
	layoutX: number;
	layoutY: number;
	layoutZ: number;
	x?: number;
	y?: number;
	z?: number;
	vx?: number;
	vy?: number;
	vz?: number;
	fx?: number;
	fy?: number;
	fz?: number;
	degree?: number;
};

type GraphLink = GraphMapLink & {
	visualKind: VisualLinkKind;
	curvature?: number;
};

type FocusNode = GraphNode & {
	hop: 0 | 1 | 2;
	focusVisible: boolean;
	focusRevealed: boolean;
	x: number;
	y: number;
	focusX: number;
	focusY: number;
	fx?: number;
	fy?: number;
};

type FocusLink = GraphLink & {
	emphasis: FocusLinkEmphasis;
	focusVisible: boolean;
	focusRevealed: boolean;
};

type RenderNode3D = NodeObject3D<GraphNode>;
type RenderLink3D = LinkObject3D<GraphNode, GraphLink>;
type RenderNode2D = NodeObject2D<FocusNode>;
type RenderLink2D = LinkObject2D<FocusNode, FocusLink>;
type Graph3DMethods = ForceGraph3DMethods<GraphNode, GraphLink>;
type Graph2DMethods = ForceGraph2DMethods<FocusNode, FocusLink>;
type Graph3DComponentProps = ForceGraph3DProps<GraphNode, GraphLink> & {
	ref?: MutableRefObject<Graph3DMethods | undefined>;
};
type Graph2DComponentProps = ForceGraph2DProps<FocusNode, FocusLink> & {
	ref?: MutableRefObject<Graph2DMethods | undefined>;
};

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
	ssr: false,
	loading: () => (
		<div className="grid h-full place-items-center text-sm">
			Preparing 3D graph
		</div>
	),
}) as ComponentType<Graph3DComponentProps>;

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
	ssr: false,
	loading: () => (
		<div className="grid h-full place-items-center text-sm">
			Preparing focus graph
		</div>
	),
}) as ComponentType<Graph2DComponentProps>;

const GRAPH_VIEW_MODE_OPTIONS = [
	{ value: "3d", label: "3D overview" },
	{ value: "2d-focus", label: "2D focus" },
] as const;
const PRIMARY_SEGMENTED_CLASS =
	"border border-primary/15 bg-white/85 shadow-[2px_4px_15px_-2px_rgba(1,1,3,0.08)] backdrop-blur";
const PRIMARY_SEGMENTED_PILL_CLASS = "!bg-primary";
const PRIMARY_SEGMENTED_ACTIVE_TEXT_CLASS = "!text-primary-foreground";
const PRIMARY_SEGMENTED_INACTIVE_TEXT_CLASS =
	"!text-foreground/55 group-hover:!text-foreground";

const NODE_COLORS: Record<GraphMapNode["kind"], string> = {
	assertion: "#7c3aed",
	boundary: "#0f766e",
	concept: "#2563eb",
	dependency: "#b45309",
	docs: "#475569",
	entry: "#0f172a",
	file: "#0f766e",
	flag: "#be123c",
	mode: "#2563eb",
	resolver: "#7c3aed",
	rewrite: "#0891b2",
	script: "#9333ea",
	"source-type": "#64748b",
	surface: "#d97706",
	task: "#16a34a",
};

const VISUAL_NODE_LABELS: Record<VisualNodeKind, string> = {
	action: "Decision",
	component: "Entry",
	parameter: "Package",
	service: "Resolver",
	topic: "File",
};

const LINK_STYLES: Record<
	VisualLinkKind,
	{ label: string; color: string; width: number }
> = {
	"action-client": {
		label: "drives",
		color: "#be123c",
		width: 3.1,
	},
	"action-server": {
		label: "resolved by",
		color: "#7c3aed",
		width: 3.1,
	},
	"parameter-owner": {
		label: "owns",
		color: "#64748b",
		width: 1.1,
	},
	publish: {
		label: "maps to",
		color: "#2563eb",
		width: 2.2,
	},
	"service-client": {
		label: "calls",
		color: "#0891b2",
		width: 2.8,
	},
	"service-provider": {
		label: "provides",
		color: "#0f766e",
		width: 2.8,
	},
	subscribe: {
		label: "depends on",
		color: "#16a34a",
		width: 2.2,
	},
};
const LINK_STYLE_ENTRIES = Object.entries(LINK_STYLES) as Array<
	[VisualLinkKind, (typeof LINK_STYLES)[VisualLinkKind]]
>;

const DEFAULT_GRAPH_WIDTH = 1120;
const DEFAULT_GRAPH_HEIGHT = 720;
const LAYOUT_SCALE = 0.34;
const FIRST_HOP_RADIUS = 220;
const SECOND_HOP_RADIUS = 430;

type D3ForceSetter<TValue> = {
	strength?: (value: TValue) => unknown;
	distance?: (value: TValue) => unknown;
};

function getVisualNodeKind(node: GraphMapNode): VisualNodeKind {
	if (
		node.kind === "entry" ||
		node.kind === "concept" ||
		node.kind === "task" ||
		node.kind === "surface" ||
		node.kind === "mode"
	) {
		return "component";
	}
	if (node.kind === "flag" || node.kind === "rewrite") return "action";
	if (node.kind === "resolver" || node.kind === "script") return "service";
	if (node.kind === "assertion" || node.kind === "dependency") {
		return "parameter";
	}
	return "topic";
}

function getConnectionCount(node: GraphMapNode & { degree?: number }) {
	return Math.max(node.weight, node.degree ?? 0);
}

function getNodeMatchesQuery(node: GraphMapNode, query: string) {
	const normalizedQuery = query.trim().toLowerCase();
	if (!normalizedQuery) return true;

	return [
		node.id,
		node.label,
		node.kind,
		node.group,
		node.path,
		node.detail.title,
		node.detail.summary,
		...(node.detail.paths ?? []),
		...(node.detail.notes ?? []),
		...(node.detail.tags ?? []),
	]
		.filter((value): value is string => Boolean(value))
		.some((value) => value.toLowerCase().includes(normalizedQuery));
}

function getLinkEndpointId(endpoint: unknown) {
	if (typeof endpoint === "object" && endpoint !== null) {
		const nodeEndpoint = endpoint as { id?: string | number };
		return nodeEndpoint.id ? String(nodeEndpoint.id) : "";
	}

	return endpoint ? String(endpoint) : "";
}

function getVisualLinkKind(
	source: GraphNode | undefined,
	target: GraphNode | undefined,
	link: GraphMapLink,
): VisualLinkKind {
	if (
		source?.visualKind === "parameter" ||
		target?.visualKind === "parameter"
	) {
		return "parameter-owner";
	}
	if (source?.visualKind === "action") return "action-client";
	if (target?.visualKind === "action") return "action-server";
	if (source?.visualKind === "service") return "service-client";
	if (target?.visualKind === "service") return "service-provider";
	if ((link.weight ?? 1) >= 3 || source?.visualKind === "component") {
		return "publish";
	}
	return "subscribe";
}

function physicsDepthSeed(id: string) {
	const hash = hashString(id);
	return ((hash % 11) - 5) * 90;
}

function hashString(value: string) {
	let hash = 0;
	for (let index = 0; index < value.length; index += 1) {
		hash = (hash * 31 + value.charCodeAt(index)) % 997;
	}
	return hash;
}

function getVisibleGraphData(
	view: GraphMapView,
	query: string,
): GraphData3D<GraphNode, GraphLink> {
	const visibleNodes = view.nodes.filter((node) =>
		getNodeMatchesQuery(node, query),
	);
	const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
	const visibleLinks = view.links.filter(
		(link) =>
			visibleNodeIds.has(String(link.source)) &&
			visibleNodeIds.has(String(link.target)),
	);
	const degreeByNodeId = new Map<string, number>();

	for (const link of visibleLinks) {
		const sourceId = String(link.source);
		const targetId = String(link.target);
		degreeByNodeId.set(sourceId, (degreeByNodeId.get(sourceId) ?? 0) + 1);
		degreeByNodeId.set(targetId, (degreeByNodeId.get(targetId) ?? 0) + 1);
	}

	const nodes: GraphNode[] = visibleNodes.map((node) => {
		const layoutX = (node.guideX ?? 0) * LAYOUT_SCALE;
		const layoutY = (node.guideY ?? 0) * LAYOUT_SCALE;
		const layoutZ = getGuideZ(node);
		const visualKind = getVisualNodeKind(node);

		return {
			...node,
			color: NODE_COLORS[node.kind],
			degree: degreeByNodeId.get(node.id) ?? 0,
			layoutX,
			layoutY,
			layoutZ,
			visualKind,
			x: layoutX,
			y: layoutY,
			z: layoutZ,
		};
	});
	const nodeById = new Map(nodes.map((node) => [node.id, node]));
	const links: GraphLink[] = visibleLinks.map((link) => {
		const source = nodeById.get(String(link.source));
		const target = nodeById.get(String(link.target));
		return {
			...link,
			visualKind: getVisualLinkKind(source, target, link),
		};
	});

	return { nodes, links };
}

function getGuideZ(node: GraphMapNode) {
	if (node.kind === "entry") return 0;
	if (
		node.kind === "concept" ||
		node.kind === "task" ||
		node.kind === "surface" ||
		node.kind === "mode"
	) {
		return 120;
	}
	if (node.kind === "file" || node.kind === "script") return 230;
	if (node.kind === "dependency") return -220;
	if (node.kind === "docs" || node.kind === "source-type") return -160;
	return physicsDepthSeed(node.id);
}

function useElementSize<TElement extends HTMLElement>() {
	const ref = useRef<TElement | null>(null);
	const [width, setWidth] = useState(DEFAULT_GRAPH_WIDTH);
	const [height, setHeight] = useState(DEFAULT_GRAPH_HEIGHT);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const observer = new ResizeObserver(([entry]) => {
			setWidth(Math.max(320, Math.floor(entry?.contentRect.width ?? width)));
			setHeight(Math.max(420, Math.floor(entry?.contentRect.height ?? height)));
		});
		observer.observe(element);
		return () => observer.disconnect();
	}, [height, width]);

	return { ref, width, height };
}

function isLinkConnectedToNode(
	link: RenderLink3D | RenderLink2D | GraphLink | FocusLink,
	nodeId: string | null,
) {
	if (!nodeId) return false;
	return (
		getLinkEndpointId(link.source) === nodeId ||
		getLinkEndpointId(link.target) === nodeId
	);
}

function linkDistance(kind: VisualLinkKind) {
	if (kind === "parameter-owner") return 115;
	if (kind === "action-client" || kind === "action-server") return 210;
	if (kind === "service-client" || kind === "service-provider") return 185;
	return 170;
}

function focusLinkDistance(link: FocusLink) {
	if (!link.focusVisible) return 360;
	if (link.emphasis === "primary") return linkDistance(link.visualKind) + 18;
	return linkDistance(link.visualKind) + 52;
}

function focusLinkStrength(link: FocusLink) {
	if (!link.focusVisible) return 0.002;
	return link.emphasis === "primary" ? 0.58 : 0.2;
}

function degreeScale(degree: number) {
	return Math.min(1.34, 1 + Math.sqrt(Math.max(0, degree)) * 0.055);
}

function nodeRadius(kind: VisualNodeKind, degree = 0) {
	let radius: number;
	switch (kind) {
		case "component":
			radius = 12;
			break;
		case "topic":
			radius = 8;
			break;
		case "action":
		case "service":
			radius = 10;
			break;
		case "parameter":
			radius = 6;
			break;
		default:
			radius = 7;
	}
	return radius * degreeScale(degree);
}

function nodeSize(kind: VisualNodeKind, degree = 0) {
	switch (kind) {
		case "component":
			return 28 * degreeScale(degree);
		case "topic":
			return 18 * degreeScale(degree);
		case "action":
		case "service":
			return 22 * degreeScale(degree);
		case "parameter":
			return 13 * degreeScale(degree);
		default:
			return 12 * degreeScale(degree);
	}
}

function focusGuideStrength(node: FocusNode) {
	if (!node.focusVisible) return 0.015;
	if (node.hop === 0) return 1;
	if (node.hop === 1) return 0.12;
	return 0.08;
}

function focusChargeStrength(node: FocusNode) {
	if (!node.focusVisible) return -24;
	const degreePush = Math.min(380, getConnectionCount(node) * 24);
	if (node.hop === 0) return -980 - degreePush;
	if (node.hop === 1) return -560 - degreePush;
	return -340 - degreePush * 0.55;
}

function focusCollisionRadius(node: FocusNode) {
	if (!node.focusVisible) return 2;
	return (
		focusNodeRadius(node) + (node.hop === 0 ? 42 : node.hop === 1 ? 32 : 24)
	);
}

function labelTextHeight(kind: VisualNodeKind) {
	switch (kind) {
		case "component":
			return 16;
		case "topic":
			return 13;
		case "action":
		case "service":
			return 14;
		case "parameter":
			return 11;
		default:
			return 12;
	}
}

function labelOffset(kind: VisualNodeKind) {
	switch (kind) {
		case "component":
			return 16;
		case "topic":
			return 12;
		case "action":
		case "service":
			return 14;
		case "parameter":
			return 10;
		default:
			return 11;
	}
}

function estimateLabelWidth(label: string, textHeight: number) {
	return Math.min(
		280,
		Math.max(
			46,
			label.length * textHeight * 0.48 + chipCanvasTokens.paddingX * 2,
		),
	);
}

function linkOpacityForMode(
	link: RenderLink3D | RenderLink2D,
	hoveredId: string | null,
) {
	if (!hoveredId) {
		return "emphasis" in link && link.emphasis === "context" ? 0.36 : 0.68;
	}
	return isLinkConnectedToNode(link, hoveredId) ? 0.82 : 0.42;
}

function graphLinkColor(link: RenderLink3D, _hoveredId: string | null) {
	return LINK_STYLES[link.visualKind].color;
}

function hexToRgba(hex: string, opacity: number) {
	const value = hex.replace("#", "");
	const numericValue = Number.parseInt(value, 16);
	const red = (numericValue >> 16) & 255;
	const green = (numericValue >> 8) & 255;
	const blue = numericValue & 255;
	return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

function graphLinkMaterial(link: RenderLink3D, hoveredId: string | null) {
	return new LineBasicMaterial({
		color: graphLinkColor(link, hoveredId),
		transparent: true,
		opacity: linkOpacityForMode(link, hoveredId),
	});
}

function graphLinkWidth(link: RenderLink3D, hoveredId: string | null) {
	const base = LINK_STYLES[link.visualKind].width;
	if (!hoveredId) return base;
	return isLinkConnectedToNode(link, hoveredId) ? base + 0.6 : 1.35;
}

function createLabeledNode(node: RenderNode3D) {
	const group = new Group();
	const connectionCount = getConnectionCount(node);
	const sphereRadius = nodeRadius(node.visualKind, connectionCount);
	const sphere = new Mesh(
		new SphereGeometry(sphereRadius, 22, 14),
		new MeshBasicMaterial({
			color: node.color,
			transparent: true,
			opacity: 0.96,
		}),
	);
	const labelText = String(node.label ?? node.id ?? "");
	const label = new SpriteText(labelText);
	const textHeight = labelTextHeight(node.visualKind);
	const chipMetrics = getChipCanvasMetrics(textHeight);
	label.textHeight = textHeight;
	label.color = chipCanvasTokens.textColor;
	label.backgroundColor = chipCanvasTokens.backgroundColor;
	label.borderColor = chipCanvasTokens.borderColor;
	label.borderWidth = chipCanvasTokens.borderWidth;
	label.borderRadius = chipMetrics.borderRadius;
	label.padding = chipMetrics.padding;
	label.fontFace = chipCanvasTokens.fontFamily;
	label.fontWeight = String(chipCanvasTokens.fontWeight);
	const labelMaterial = label.material as SpriteMaterial;
	labelMaterial.transparent = true;
	labelMaterial.alphaTest = 0.01;
	labelMaterial.depthWrite = false;
	labelMaterial.needsUpdate = true;
	label.position.set(
		sphereRadius +
			chipCanvasTokens.labelGap +
			labelOffset(node.visualKind) +
			estimateLabelWidth(labelText, textHeight) / 2,
		0,
		0,
	);

	group.add(sphere);
	group.add(label);
	return group;
}

function buildFocusGraphData(
	graphData: GraphData3D<GraphNode, GraphLink>,
	selectedId: string | null,
): GraphData2D<FocusNode, FocusLink> {
	const nodes: FocusNode[] = graphData.nodes.map((node) => ({
		...node,
		hop: 2,
		focusVisible: false,
		focusRevealed: false,
		x: node.layoutX,
		y: node.layoutY,
		focusX: node.layoutX,
		focusY: node.layoutY,
		fx: undefined,
		fy: undefined,
	}));
	const links: FocusLink[] = graphData.links.map((link) => ({
		...link,
		source: getLinkEndpointId(link.source),
		target: getLinkEndpointId(link.target),
		emphasis: "context",
		focusVisible: false,
		focusRevealed: false,
	}));

	const focusGraphData = { nodes, links };
	applyFocusGraphState(selectedId, null, focusGraphData);
	return focusGraphData;
}

function getFocusNeighbors(
	graphData: GraphData2D<FocusNode, FocusLink>,
): Map<string, Set<string>> {
	const neighborsById = new Map<string, Set<string>>();
	for (const node of graphData.nodes) {
		neighborsById.set(node.id, new Set());
	}
	graphData.links.forEach((link) => {
		const source = getLinkEndpointId(link.source);
		const target = getLinkEndpointId(link.target);
		if (!source || !target) return;
		neighborsById.get(source)?.add(target);
		neighborsById.get(target)?.add(source);
	});
	return neighborsById;
}

function placePreviewRing(
	nodes: FocusNode[],
	selectedNode: FocusNode,
	hoveredNode: FocusNode,
) {
	const centerAngle = stableRingAngle(hoveredNode, selectedNode, 0, 1);
	const spread = Math.min(1.25, Math.max(0.5, nodes.length * 0.18));
	const start = centerAngle - spread / 2;

	nodes.forEach((node, index) => {
		const ratio =
			nodes.length <= 1 ? 0.5 : index / Math.max(nodes.length - 1, 1);
		const angle = start + spread * ratio;
		node.focusX = Math.cos(angle) * SECOND_HOP_RADIUS;
		node.focusY = Math.sin(angle) * SECOND_HOP_RADIUS;
	});
}

function applyFocusGraphState(
	selectedId: string | null,
	hoveredId: string | null,
	graphData: GraphData2D<FocusNode, FocusLink>,
) {
	const selectedNode = selectedId
		? graphData.nodes.find((node) => node.id === selectedId)
		: undefined;

	if (!selectedNode) return;

	const focusId = selectedNode.id;
	const nodeById = new Map(graphData.nodes.map((node) => [node.id, node]));
	const neighborsById = getFocusNeighbors(graphData);

	const firstHopIds = new Set(neighborsById.get(focusId) ?? []);
	const previewOwnerById = new Map<string, string>();
	const hoveredNeighborIds = new Set(
		hoveredId ? (neighborsById.get(hoveredId) ?? []) : [],
	);
	const revealedNodeIds = new Set<string>([focusId, ...firstHopIds]);
	if (hoveredId) {
		revealedNodeIds.add(hoveredId);
		for (const nodeId of hoveredNeighborIds) {
			revealedNodeIds.add(nodeId);
		}
	}

	for (const firstHopId of firstHopIds) {
		neighborsById.get(firstHopId)?.forEach((neighborId) => {
			if (neighborId === focusId || firstHopIds.has(neighborId)) return;
			if (!previewOwnerById.has(neighborId)) {
				previewOwnerById.set(neighborId, firstHopId);
			}
		});
	}

	const firstRingNodes = sortByAngle([...firstHopIds], selectedNode, nodeById);

	for (const node of graphData.nodes) {
		node.hop = 2;
		node.focusVisible = true;
		node.focusRevealed = revealedNodeIds.has(node.id);
		node.focusX = node.layoutX - selectedNode.layoutX;
		node.focusY = node.layoutY - selectedNode.layoutY;
		node.fx = undefined;
		node.fy = undefined;
	}

	selectedNode.hop = 0;
	selectedNode.focusVisible = true;
	selectedNode.focusRevealed = true;
	selectedNode.focusX = 0;
	selectedNode.focusY = 0;
	selectedNode.fx = 0;
	selectedNode.fy = 0;

	placeRing(firstRingNodes, selectedNode, FIRST_HOP_RADIUS, 1).forEach(
		(placedNode) => {
			const node = nodeById.get(placedNode.id);
			if (!node) return;
			node.hop = 1;
			node.focusVisible = true;
			node.focusRevealed = true;
			node.focusX = placedNode.focusX;
			node.focusY = placedNode.focusY;
		},
	);

	const previewNodesByOwner = new Map<string, FocusNode[]>();
	for (const [nodeId, ownerId] of previewOwnerById) {
		const node = nodeById.get(nodeId);
		if (!node || !ownerId) continue;
		const nodes = previewNodesByOwner.get(ownerId) ?? [];
		nodes.push(node);
		previewNodesByOwner.set(ownerId, nodes);
		node.hop = 2;
		node.focusVisible = true;
		node.focusRevealed = revealedNodeIds.has(node.id);
	}
	for (const [ownerId, nodes] of previewNodesByOwner) {
		const owner = nodeById.get(ownerId);
		if (!owner) continue;
		placePreviewRing(
			sortByAngle(
				nodes.map((node) => node.id),
				selectedNode,
				nodeById,
			),
			selectedNode,
			owner,
		);
	}

	for (const link of graphData.links) {
		const source = getLinkEndpointId(link.source);
		const target = getLinkEndpointId(link.target);
		const isPrimary = source === focusId || target === focusId;
		const isHoveredNeighbor =
			Boolean(hoveredId) && (source === hoveredId || target === hoveredId);
		link.emphasis = isPrimary ? "primary" : "context";
		link.focusVisible = true;
		link.focusRevealed = isPrimary || isHoveredNeighbor;
	}
}

function sortByAngle<TNode extends GraphNode>(
	ids: string[],
	selectedNode: TNode,
	nodeById: ReadonlyMap<string, TNode>,
) {
	return ids
		.map((id) => nodeById.get(id))
		.filter((node): node is TNode => Boolean(node))
		.sort(
			(left, right) =>
				nodeAngle(left, selectedNode) - nodeAngle(right, selectedNode),
		);
}

function placeRing(
	nodes: GraphNode[],
	selectedNode: GraphNode,
	radius: number,
	hop: 1 | 2,
): FocusNode[] {
	return nodes.map((node, index) => {
		const angle = stableRingAngle(node, selectedNode, index, nodes.length);
		const x = Math.cos(angle) * radius;
		const y = Math.sin(angle) * radius;
		return {
			...node,
			hop,
			focusVisible: true,
			focusRevealed: true,
			x,
			y,
			focusX: x,
			focusY: y,
		};
	});
}

function stableRingAngle(
	node: GraphNode,
	selectedNode: GraphNode,
	index: number,
	total: number,
) {
	const sourceAngle = nodeAngle(node, selectedNode);
	if (Number.isFinite(sourceAngle)) return sourceAngle;
	return (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
}

function nodeAngle(node: GraphNode, selectedNode: GraphNode) {
	const deltaX = node.layoutX - selectedNode.layoutX;
	const deltaY = node.layoutY - selectedNode.layoutY;
	if (deltaX === 0 && deltaY === 0) return Number.NaN;
	return Math.atan2(deltaY, deltaX);
}

function focusNodeRadius(node: RenderNode2D) {
	const baseRadius = nodeRadius(node.visualKind, getConnectionCount(node));
	if (node.hop === 0) return baseRadius + 5;
	if (node.hop === 1) return baseRadius + 2;
	return Math.max(baseRadius - 1, 5);
}

function isFocusPrimaryNode(node: RenderNode2D) {
	return node.hop === 0 || node.hop === 1;
}

function focusLinksTouchingNode(
	node: RenderNode2D,
	links: GraphData2D<FocusNode, FocusLink>["links"],
	nodeId: string | null,
) {
	if (!nodeId || !node.id) return false;
	const currentId = String(node.id);
	return links.some((link) => {
		if (!isLinkConnectedToNode(link, nodeId)) return false;
		return (
			getLinkEndpointId(link.source) === currentId ||
			getLinkEndpointId(link.target) === currentId
		);
	});
}

function nodeOpacityForMode(
	node: RenderNode2D,
	selectedId: string | null,
	hoveredId: string | null,
	links: GraphData2D<FocusNode, FocusLink>["links"],
) {
	const nodeId = node.id ? String(node.id) : null;
	if (!node.focusRevealed) return 0;
	if (nodeId && (nodeId === selectedId || nodeId === hoveredId)) return 1;
	if (hoveredId) {
		if (focusLinksTouchingNode(node, links, hoveredId)) return 0.9;
		if (node.hop === 1) return 0.3;
		return 0;
	}
	if (isFocusPrimaryNode(node)) return 0.92;
	return 0;
}

function focusLinkOpacityForMode(link: RenderLink2D, hoveredId: string | null) {
	if (!link.focusRevealed) return 0;
	if (!hoveredId) return link.emphasis === "primary" ? 0.72 : 0;
	return isLinkConnectedToNode(link, hoveredId) ? 0.84 : 0.08;
}

function focusLinkColor(link: RenderLink2D, hoveredId: string | null) {
	const opacity = focusLinkOpacityForMode(link, hoveredId);
	return hexToRgba(LINK_STYLES[link.visualKind].color, opacity);
}

function focusLinkWidth(link: RenderLink2D, hoveredId: string | null) {
	if (hoveredId && isLinkConnectedToNode(link, hoveredId)) {
		return LINK_STYLES[link.visualKind].width + 0.5;
	}
	if (hoveredId) return 0.85;
	if (link.emphasis === "primary")
		return LINK_STYLES[link.visualKind].width + 0.8;
	return 1.25;
}

function getRenderEndpoint(
	endpoint: unknown,
	nodeById: Map<string, FocusNode>,
) {
	if (typeof endpoint === "object" && endpoint !== null) {
		return endpoint as RenderNode2D;
	}
	const endpointId = getLinkEndpointId(endpoint);
	return endpointId ? (nodeById.get(endpointId) ?? null) : null;
}

function paintFocusLink(
	link: RenderLink2D,
	context: CanvasRenderingContext2D,
	globalScale: number,
	hoveredId: string | null,
	nodeById: Map<string, FocusNode>,
) {
	const opacity = focusLinkOpacityForMode(link, hoveredId);
	if (opacity <= 0.02) return;

	const source = getRenderEndpoint(link.source, nodeById);
	const target = getRenderEndpoint(link.target, nodeById);
	if (!source || !target) return;

	const sourceX = source.x ?? 0;
	const sourceY = source.y ?? 0;
	const targetX = target.x ?? 0;
	const targetY = target.y ?? 0;

	context.save();
	context.globalAlpha = opacity;
	context.beginPath();
	context.moveTo(sourceX, sourceY);
	context.lineTo(targetX, targetY);
	context.lineCap = "round";
	context.lineWidth = focusLinkWidth(link, hoveredId) / globalScale;
	context.strokeStyle = LINK_STYLES[link.visualKind].color;
	context.stroke();
	context.restore();
}

function roundRect(
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number,
) {
	const safeRadius = Math.min(radius, width / 2, height / 2);
	context.beginPath();
	context.moveTo(x + safeRadius, y);
	context.lineTo(x + width - safeRadius, y);
	context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
	context.lineTo(x + width, y + height - safeRadius);
	context.quadraticCurveTo(
		x + width,
		y + height,
		x + width - safeRadius,
		y + height,
	);
	context.lineTo(x + safeRadius, y + height);
	context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
	context.lineTo(x, y + safeRadius);
	context.quadraticCurveTo(x, y, x + safeRadius, y);
	context.closePath();
}

function paintFocusNode(
	node: RenderNode2D,
	context: CanvasRenderingContext2D,
	globalScale: number,
	selectedId: string | null,
	hoveredId: string | null,
	links: GraphData2D<FocusNode, FocusLink>["links"],
) {
	const radius = focusNodeRadius(node);
	const x = node.x ?? 0;
	const y = node.y ?? 0;
	const label = String(node.label ?? node.id ?? "");
	const opacity = nodeOpacityForMode(node, selectedId, hoveredId, links);
	if (opacity <= 0.02) return;
	const fontSize = Math.max(9, 13 / globalScale);
	const labelX = x + radius + chipCanvasTokens.labelGap / globalScale;
	const labelY = y;
	const chipMetrics = getChipCanvasMetrics(fontSize);
	const labelPaddingX = chipCanvasTokens.paddingX / globalScale;

	context.save();
	context.globalAlpha = opacity;
	context.beginPath();
	context.arc(x, y, radius, 0, Math.PI * 2);
	context.fillStyle = node.color;
	context.fill();
	context.lineWidth = node.hop === 0 ? 3 / globalScale : 1.5 / globalScale;
	context.strokeStyle = node.hop === 0 ? "#111827" : "#ffffff";
	context.stroke();
	context.font = `${node.hop === 0 ? 650 : chipCanvasTokens.fontWeight} ${fontSize}px ${chipCanvasTokens.fontFamily}`;
	const textWidth = context.measureText(label).width;
	const boxWidth = textWidth + labelPaddingX * 2;
	const boxHeight = chipMetrics.height / globalScale;
	context.fillStyle =
		node.hop === 2
			? chipCanvasTokens.mutedBackgroundColor
			: chipCanvasTokens.backgroundColor;
	roundRect(
		context,
		labelX - labelPaddingX,
		labelY - boxHeight / 2,
		boxWidth,
		boxHeight,
		chipMetrics.borderRadius / globalScale,
	);
	context.fill();
	context.strokeStyle =
		node.hop === 2
			? chipCanvasTokens.mutedBorderColor
			: chipCanvasTokens.borderColor;
	context.lineWidth = chipCanvasTokens.borderWidth / globalScale;
	context.stroke();
	context.fillStyle =
		node.hop === 2
			? chipCanvasTokens.mutedTextColor
			: chipCanvasTokens.textColor;
	context.textBaseline = "middle";
	context.fillText(label, labelX, labelY);
	context.restore();
}

function paintFocusPointerArea(
	node: RenderNode2D,
	paintColor: string,
	context: CanvasRenderingContext2D,
) {
	if (!node.focusRevealed) return;
	const radius = focusNodeRadius(node) + 12;
	context.fillStyle = paintColor;
	context.beginPath();
	context.arc(node.x ?? 0, node.y ?? 0, radius, 0, Math.PI * 2);
	context.fill();
}

function focusZoomForViewport(width: number, height: number) {
	const usableWidth = Math.max(360, width - 80);
	const usableHeight = Math.max(360, height - 100);
	const graphWidth = SECOND_HOP_RADIUS * 2 + 240;
	const graphHeight = SECOND_HOP_RADIUS * 2 + 180;
	const fitZoom = Math.min(
		usableWidth / graphWidth,
		usableHeight / graphHeight,
	);
	return Math.min(1, Math.max(0.68, fitZoom));
}

function NodeDetailsPanel({
	node,
	open,
	onClose,
}: {
	node: GraphNode | undefined;
	open: boolean;
	onClose: () => void;
}) {
	if (!open || !node) return null;

	return (
		<Card
			display="flex"
			padding="md"
			gap="md"
			shadow="sm"
			className="pointer-events-auto max-h-[min(420px,calc(100svh-220px))] w-full overflow-y-auto bg-white/95 text-slate-900 backdrop-blur max-md:max-h-[38svh]"
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<Text as="h2" variant="bodyStrong" className="break-words">
						{node.detail.title}
					</Text>
					<Text variant="caption" tone="muted">
						{VISUAL_NODE_LABELS[node.visualKind]} / {node.kind} ·{" "}
						{getConnectionCount(node)} links
					</Text>
				</div>
				<Button type="button" size="sm" variant="outline" onClick={onClose}>
					Close
				</Button>
			</div>

			{node.detail.summary ? (
				<Text variant="body" tone="muted">
					{node.detail.summary}
				</Text>
			) : null}

			{node.detail.paths?.length ? (
				<div className="grid gap-1">
					{node.detail.paths.slice(0, 6).map((path) => (
						<code
							key={path}
							className="block max-w-full overflow-hidden text-ellipsis rounded bg-slate-50 px-2 py-1 text-[11px] text-slate-600"
						>
							{path}
						</code>
					))}
				</div>
			) : null}

			{node.detail.tags?.length ? (
				<div className="flex flex-wrap gap-1.5">
					{node.detail.tags.map((tag) => (
						<Chip key={tag} tone="neutral" className="bg-white/70">
							{tag}
						</Chip>
					))}
				</div>
			) : null}
		</Card>
	);
}

function LinkLegendPanel() {
	return (
		<Card
			display="flex"
			padding="sm"
			gap="sm"
			shadow="none"
			className="pointer-events-auto max-w-md bg-white/80 backdrop-blur"
		>
			<Text as="h2" variant="bodyStrong">
				Connection meaning
			</Text>
			<div className="flex flex-wrap gap-x-3 gap-y-2">
				{LINK_STYLE_ENTRIES.map(([kind, style]) => (
					<Chip key={kind} tone="neutral" className="bg-white/70">
						<span
							aria-hidden="true"
							className="h-0.5 w-7 rounded-full"
							style={{ backgroundColor: style.color }}
						/>
						{style.label}
					</Chip>
				))}
			</div>
		</Card>
	);
}

export type GraphMapProps<TViewId extends GraphMapViewId = GraphMapViewId> = {
	graphs: GraphMapView<TViewId>[];
	ariaLabel: string;
	backHref: string;
	backLabel?: string;
	asMain?: boolean;
};

export function GraphMap<TViewId extends GraphMapViewId = GraphMapViewId>({
	graphs,
	ariaLabel,
	backHref,
	backLabel = "Back",
	asMain = true,
}: GraphMapProps<TViewId>) {
	const [activeViewId, setActiveViewId] = useState<TViewId>(
		() => graphs[0]?.id ?? ("" as TViewId),
	);
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
	const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<ViewMode>("3d");
	const [nodeMenuOpen, setNodeMenuOpen] = useState(false);
	const [isGraphFocused, setIsGraphFocused] = useState(false);
	const graphRef = useRef<Graph3DMethods | undefined>(
		undefined,
	) as MutableRefObject<Graph3DMethods | undefined>;
	const focusGraphRef = useRef<Graph2DMethods | undefined>(
		undefined,
	) as MutableRefObject<Graph2DMethods | undefined>;
	const graphControlsRef = useRef<HTMLDivElement | null>(null);
	const nodeDetailsPanelRef = useRef<HTMLDivElement | null>(null);
	const configuredTokenRef = useRef("");
	const configuredFocusTokenRef = useRef("");
	const { ref: graphWrapRef, width, height } = useElementSize<HTMLDivElement>();
	const activeView =
		graphs.find((graph) => graph.id === activeViewId) ?? graphs[0];
	const graphData = useMemo(
		() => getVisibleGraphData(activeView, ""),
		[activeView],
	);
	const graphOptions = graphs.map((graph) => ({
		value: graph.id,
		label: graph.title,
	}));
	const graphNodeById = useMemo(
		() => new Map(graphData.nodes.map((node) => [node.id, node])),
		[graphData.nodes],
	);
	const selectedGraphNodeId =
		selectedNodeId && graphNodeById.has(selectedNodeId) ? selectedNodeId : null;
	const focusSelectedNodeId =
		selectedGraphNodeId ?? graphData.nodes[0]?.id ?? null;
	const selectedNode = selectedGraphNodeId
		? graphNodeById.get(selectedGraphNodeId)
		: undefined;
	const focusSelectedNode = focusSelectedNodeId
		? graphNodeById.get(focusSelectedNodeId)
		: undefined;
	const selectedMenuNode = selectedNode ?? focusSelectedNode;
	const focusGraphData = useMemo(
		() => buildFocusGraphData(graphData, focusSelectedNodeId),
		[focusSelectedNodeId, graphData],
	);
	const focusGraphNodeById = useMemo(
		() => new Map(focusGraphData.nodes.map((node) => [node.id, node])),
		[focusGraphData.nodes],
	);
	const graphToken = `${activeView.id}:${graphData.nodes.length}:${graphData.links.length}`;
	const focusGraphToken = `${activeView.id}:${focusSelectedNodeId ?? "none"}:${focusGraphData.nodes.length}:${focusGraphData.links.length}`;

	const focusGraphStage = useCallback(() => {
		setIsGraphFocused(true);
		window.requestAnimationFrame(() => {
			graphWrapRef.current?.focus({ preventScroll: true });
		});
	}, [graphWrapRef]);

	const releaseGraphStage = useCallback(() => {
		setIsGraphFocused(false);
		setNodeMenuOpen(false);
	}, []);

	const configureForces = useCallback(
		({ force = false }: { force?: boolean } = {}) => {
			const graph = graphRef.current;
			if (!graph) return false;
			if (configuredTokenRef.current === graphToken && !force) return true;

			const charge = graph.d3Force("charge") as
				| D3ForceSetter<(node: GraphNode) => number>
				| undefined;
			charge?.strength?.((node: GraphNode) => {
				const degreePush = Math.min(720, getConnectionCount(node) * 44);
				return -1180 - degreePush;
			});
			const link = graph.d3Force("link") as
				| {
						distance?: (
							value:
								| number
								| ((link: LinkObject3D<GraphNode, GraphLink>) => number),
						) => unknown;
				  }
				| undefined;
			link?.distance?.((linkValue) => linkDistance(linkValue.visualKind));
			graph.d3ReheatSimulation();

			if (configuredTokenRef.current !== graphToken || force) {
				window.setTimeout(() => {
					graph.zoomToFit(900, 120);
				}, 500);
			}

			configuredTokenRef.current = graphToken;
			return true;
		},
		[graphToken],
	);

	const configureFocusForces = useCallback(
		({ force = false }: { force?: boolean } = {}) => {
			const graph = focusGraphRef.current;
			if (!graph) return false;
			applyFocusGraphState(focusSelectedNodeId, hoveredNodeId, focusGraphData);
			if (configuredFocusTokenRef.current === focusGraphToken && !force) {
				return true;
			}

			const charge = graph.d3Force("charge") as
				| D3ForceSetter<(node: FocusNode) => number>
				| undefined;
			charge?.strength?.((node) => focusChargeStrength(node));

			const link = graph.d3Force("link") as
				| D3ForceSetter<(link: FocusLink) => number>
				| undefined;
			link?.distance?.((linkValue) => focusLinkDistance(linkValue));
			link?.strength?.((linkValue) => focusLinkStrength(linkValue));

			graph.d3Force(
				"collision",
				forceCollide<FocusNode>((node) => focusCollisionRadius(node))
					.strength(0.92)
					.iterations(2),
			);
			graph.d3Force(
				"guide-x",
				forceX<FocusNode>((node) => node.focusX).strength((node) =>
					focusGuideStrength(node),
				),
			);
			graph.d3Force(
				"guide-y",
				forceY<FocusNode>((node) => node.focusY).strength((node) =>
					focusGuideStrength(node),
				),
			);
			graph.d3ReheatSimulation();
			configuredFocusTokenRef.current = focusGraphToken;
			return true;
		},
		[focusGraphData, focusGraphToken, focusSelectedNodeId, hoveredNodeId],
	);

	const resetLayout = useCallback(() => {
		if (viewMode === "2d-focus") {
			for (const node of focusGraphData.nodes) {
				node.x = node.focusX;
				node.y = node.focusY;
				node.vx = 0;
				node.vy = 0;
				if (node.hop === 0) {
					node.fx = 0;
					node.fy = 0;
				} else {
					node.fx = undefined;
					node.fy = undefined;
				}
			}
			configureFocusForces({ force: true });
			focusGraphRef.current?.d3ReheatSimulation();
			focusGraphRef.current?.centerAt(0, 0, 350);
			focusGraphRef.current?.zoom(focusZoomForViewport(width, height), 350);
			return;
		}

		for (const node of graphData.nodes) {
			node.x = node.layoutX;
			node.y = node.layoutY;
			node.z = node.layoutZ;
			node.fx = undefined;
			node.fy = undefined;
			node.fz = undefined;
			node.vx = 0;
			node.vy = 0;
			node.vz = 0;
		}
		configureForces({ force: true });
		graphRef.current?.d3ReheatSimulation();
	}, [
		configureFocusForces,
		configureForces,
		focusGraphData.nodes,
		graphData.nodes,
		height,
		viewMode,
		width,
	]);

	const focusNode = useCallback((node: RenderNode3D) => {
		const nodeId = node.id ? String(node.id) : null;
		setSelectedNodeId(nodeId);
		setNodeMenuOpen(Boolean(nodeId));
		if (!nodeId) return;

		const x = node.x ?? 0;
		const y = node.y ?? 0;
		const z = node.z ?? 0;
		const distance = 520;
		const length = Math.hypot(x, y, z) || 1;
		const ratio = 1 + distance / length;
		graphRef.current?.cameraPosition(
			{ x: x * ratio, y: y * ratio, z: z * ratio },
			{ x, y, z },
			520,
		);
	}, []);

	const focusMapNode = useCallback((node: RenderNode2D) => {
		if (!node.id) return;
		setSelectedNodeId(String(node.id));
		setHoveredNodeId(null);
		setNodeMenuOpen(true);
	}, []);

	const hoverFocusMapNode = useCallback((node: RenderNode2D | null) => {
		if (!node?.id || !node.focusRevealed) {
			setHoveredNodeId(null);
			return;
		}
		setHoveredNodeId(String(node.id));
	}, []);

	const open2DFocus = useCallback(() => {
		setSelectedNodeId(focusSelectedNodeId);
		setViewMode("2d-focus");
		setNodeMenuOpen(false);
	}, [focusSelectedNodeId]);

	useEffect(() => {
		if (!activeView.id) return;
		setSelectedNodeId(null);
		setNodeMenuOpen(false);
		configuredTokenRef.current = "";
		configuredFocusTokenRef.current = "";
	}, [activeView.id]);

	useEffect(() => {
		let attempts = 0;
		const interval = window.setInterval(() => {
			attempts += 1;
			if (configureForces()) window.clearInterval(interval);
			if (attempts > 20) window.clearInterval(interval);
		}, 100);
		return () => window.clearInterval(interval);
	}, [configureForces]);

	useEffect(() => {
		if (viewMode !== "2d-focus") return;
		let attempts = 0;
		const interval = window.setInterval(() => {
			attempts += 1;
			if (configureFocusForces()) window.clearInterval(interval);
			if (attempts > 20) window.clearInterval(interval);
		}, 80);
		return () => window.clearInterval(interval);
	}, [configureFocusForces, viewMode]);

	useEffect(() => {
		if (viewMode !== "2d-focus" || !focusSelectedNodeId) return;
		const timer = window.setTimeout(() => {
			focusGraphRef.current?.centerAt(0, 0, 350);
			focusGraphRef.current?.zoom(focusZoomForViewport(width, height), 350);
		}, 80);
		return () => window.clearTimeout(timer);
	}, [focusSelectedNodeId, height, viewMode, width]);

	useEffect(() => {
		if (!nodeMenuOpen) return;

		function handlePointerDown(event: PointerEvent) {
			const target = event.target instanceof Node ? event.target : undefined;
			if (!target) return;
			if (nodeDetailsPanelRef.current?.contains(target)) return;
			setNodeMenuOpen(false);
		}

		document.addEventListener("pointerdown", handlePointerDown, true);
		return () =>
			document.removeEventListener("pointerdown", handlePointerDown, true);
	}, [nodeMenuOpen]);

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape" && isGraphFocused) {
				releaseGraphStage();
				return;
			}

			if (event.code !== "Space" || !focusSelectedNodeId) return;
			const target =
				event.target instanceof HTMLElement ? event.target : undefined;
			const isInsideGraphScope = target
				? Boolean(
						graphWrapRef.current?.contains(target) ||
							graphControlsRef.current?.contains(target),
					)
				: false;

			if (!isGraphFocused && !isInsideGraphScope) return;
			if (event.target instanceof HTMLElement) {
				const interactive = event.target.closest(
					"button,input,textarea,select,a,summary,[role='button'],[role='link'],[contenteditable='true']",
				);
				if (interactive) return;
			}
			event.preventDefault();
			setSelectedNodeId(focusSelectedNodeId);
			setViewMode((current) => (current === "3d" ? "2d-focus" : "3d"));
			setNodeMenuOpen(false);
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [focusSelectedNodeId, graphWrapRef, isGraphFocused, releaseGraphStage]);

	const Root = asMain ? "main" : "div";

	return (
		<Root className="bg-slate-50">
			<Section
				padding="none"
				height="hero"
				maxWidth="wide"
				className="h-[100svh] max-h-none min-h-[100svh] overflow-hidden bg-slate-50 px-[var(--spacing-section-x)] pt-[calc(60px+20px)] !pb-2 lg:pt-[calc(70px+24px)] lg:!pb-3"
				innerClassName="pointer-events-none min-h-full justify-between gap-4"
			>
				<Section.Background interactive>
					<section
						ref={graphWrapRef}
						className="h-full w-full overflow-hidden bg-slate-50 focus:outline-none"
						aria-label={ariaLabel}
						tabIndex={-1}
					>
						<div
							className={`absolute inset-0 transition-opacity duration-150 ${
								viewMode === "3d"
									? isGraphFocused
										? "opacity-100"
										: "pointer-events-none opacity-100"
									: "pointer-events-none opacity-0"
							}`}
							aria-hidden={viewMode !== "3d"}
						>
							<ForceGraph3D
								ref={graphRef}
								graphData={graphData}
								width={width}
								height={height}
								backgroundColor="#f8fafc"
								nodeId="id"
								nodeRelSize={8}
								nodeVal={(node) =>
									nodeSize(node.visualKind, getConnectionCount(node))
								}
								nodeColor={(node) => node.color}
								nodeOpacity={0.96}
								nodeResolution={18}
								nodeThreeObject={createLabeledNode}
								linkColor={(link) => graphLinkColor(link, hoveredNodeId)}
								linkMaterial={(link) => graphLinkMaterial(link, hoveredNodeId)}
								linkWidth={(link) => graphLinkWidth(link, hoveredNodeId)}
								linkOpacity={hoveredNodeId ? 0.5 : 0.56}
								numDimensions={3}
								forceEngine="d3"
								cooldownTicks={280}
								d3AlphaDecay={0.012}
								d3VelocityDecay={0.22}
								enableNodeDrag
								enableNavigationControls
								enablePointerInteraction
								showNavInfo={false}
								onNodeClick={focusNode}
								onNodeHover={(node) =>
									setHoveredNodeId(node?.id ? String(node.id) : null)
								}
								onNodeDragEnd={(node) => {
									node.fx = undefined;
									node.fy = undefined;
									node.fz = undefined;
									configureForces({ force: true });
								}}
								onEngineTick={() => {
									configureForces();
								}}
								onBackgroundClick={() => {
									setSelectedNodeId(null);
									setHoveredNodeId(null);
									setNodeMenuOpen(false);
								}}
								showPointerCursor
							/>
						</div>

						<div
							className={`absolute inset-0 transition-opacity duration-150 ${
								viewMode === "2d-focus"
									? isGraphFocused
										? "opacity-100"
										: "pointer-events-none opacity-100"
									: "pointer-events-none opacity-0"
							}`}
							aria-hidden={viewMode !== "2d-focus"}
						>
							<ForceGraph2D
								ref={focusGraphRef}
								graphData={focusGraphData}
								width={width}
								height={height}
								backgroundColor="#f8fafc"
								nodeId="id"
								nodeCanvasObject={(node, context, globalScale) =>
									paintFocusNode(
										node,
										context,
										globalScale,
										focusSelectedNodeId,
										hoveredNodeId,
										focusGraphData.links,
									)
								}
								nodePointerAreaPaint={paintFocusPointerArea}
								linkColor={(link) => focusLinkColor(link, hoveredNodeId)}
								linkWidth={(link) => focusLinkWidth(link, hoveredNodeId)}
								linkCanvasObject={(link, context, globalScale) =>
									paintFocusLink(
										link,
										context,
										globalScale,
										hoveredNodeId,
										focusGraphNodeById,
									)
								}
								linkCanvasObjectMode={() => "replace"}
								cooldownTicks={180}
								warmupTicks={40}
								autoPauseRedraw={false}
								d3AlphaDecay={0.018}
								d3VelocityDecay={0.28}
								enableNodeDrag
								enablePointerInteraction
								onNodeClick={focusMapNode}
								onNodeHover={hoverFocusMapNode}
								onNodeDragEnd={(node) => {
									if (node.hop === 0) {
										node.fx = 0;
										node.fy = 0;
									} else {
										node.fx = undefined;
										node.fy = undefined;
									}
									configureFocusForces({ force: true });
								}}
								onEngineTick={() => {
									configureFocusForces();
								}}
								onBackgroundClick={() => {
									setNodeMenuOpen(false);
									setHoveredNodeId(null);
								}}
								showPointerCursor
							/>
						</div>

						<InteractionGate
							active={!isGraphFocused}
							title="Interactive graph"
							description="Focus the canvas before panning, zooming, or selecting nodes."
							actionLabel="Click map to interact"
							ariaLabel="Focus graph canvas"
							onActivate={focusGraphStage}
						/>
					</section>
				</Section.Background>

				<div
					ref={graphControlsRef}
					className="pointer-events-none flex w-full flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"
				>
					<Card
						display="flex"
						padding="sm"
						gap="sm"
						shadow="none"
						className="pointer-events-auto max-w-sm bg-white/80 backdrop-blur"
					>
						<Text as="h1" variant="headingSm">
							{activeView.title}
						</Text>
						<Text variant="body" tone="muted">
							{activeView.description}
						</Text>
					</Card>

					<LinkLegendPanel />

					<div className="pointer-events-auto flex flex-wrap items-center gap-2 xl:ml-auto xl:justify-end">
						{isGraphFocused ? (
							<Button
								type="button"
								variant="solid"
								size="sm"
								onClick={releaseGraphStage}
							>
								Esc to exit
							</Button>
						) : null}
						<Button href={backHref} variant="outline" size="sm">
							{backLabel}
						</Button>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={resetLayout}
						>
							Reset
						</Button>
						<SegmentedControl<ViewMode>
							options={GRAPH_VIEW_MODE_OPTIONS}
							value={viewMode}
							onChange={(nextMode) => {
								if (nextMode === "2d-focus") {
									open2DFocus();
									return;
								}
								setViewMode("3d");
								setNodeMenuOpen(false);
							}}
							layout="auto"
							roundedFull
							pillClassName={PRIMARY_SEGMENTED_PILL_CLASS}
							activeTextClassName={PRIMARY_SEGMENTED_ACTIVE_TEXT_CLASS}
							inactiveTextClassName={PRIMARY_SEGMENTED_INACTIVE_TEXT_CLASS}
							ariaLabel="Graph dimension"
							className={`w-fit ${PRIMARY_SEGMENTED_CLASS}`}
						/>
					</div>
				</div>

				{isGraphFocused && nodeMenuOpen ? (
					<div
						ref={nodeDetailsPanelRef}
						className="pointer-events-auto w-full max-w-md self-start"
					>
						<NodeDetailsPanel
							node={selectedMenuNode}
							open={nodeMenuOpen}
							onClose={() => setNodeMenuOpen(false)}
						/>
					</div>
				) : null}

				<nav
					aria-label="Graph modes"
					className="pointer-events-auto mt-auto w-full overflow-x-auto pb-0"
				>
					<SegmentedControl<TViewId>
						options={graphOptions}
						value={activeView.id}
						onChange={(nextView) => {
							setActiveViewId(nextView);
							setViewMode("3d");
							setNodeMenuOpen(false);
						}}
						layout="auto"
						roundedFull
						pillClassName={PRIMARY_SEGMENTED_PILL_CLASS}
						activeTextClassName={PRIMARY_SEGMENTED_ACTIVE_TEXT_CLASS}
						inactiveTextClassName={PRIMARY_SEGMENTED_INACTIVE_TEXT_CLASS}
						ariaLabel="Graph view"
						className={`mx-auto w-fit max-w-full ${PRIMARY_SEGMENTED_CLASS}`}
					/>
				</nav>
			</Section>
		</Root>
	);
}
