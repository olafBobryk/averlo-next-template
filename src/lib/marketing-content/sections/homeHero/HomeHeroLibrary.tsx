"use client";

import {
	Component,
	createElement,
	type ReactNode,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { PortalScope } from "@/components/ui/overlays/Portal";
import type { HomeHeroServiceItem } from "../../types";
import { HomeHeroChoices } from "./HomeHeroChoices";
import { HomeHeroStackLogo } from "./HomeHeroStackLogo";
import { heroSpecimens } from "./heroSpecimens";
import { packCenterOut } from "./pack.mjs";
import { stackLogos } from "./stackLogos";

// One specimen failing must not remove the rest of the decorative collection.
class SpecimenBoundary extends Component<
	{ children: ReactNode },
	{ failed: boolean }
> {
	state = { failed: false };
	static getDerivedStateFromError() {
		return { failed: true };
	}
	render() {
		return this.state.failed ? (
			<div data-specimen-unavailable="" />
		) : (
			this.props.children
		);
	}
}

// How far past the section edges the packed content is scaled, so the uneven
// outermost specimens crop instead of leaving empty margins.
const COVER_OVERSCAN = 1.08;
// Extra clearance (section pixels) kept between the repository cards and the
// hero text region while packing.
const TEXT_MARGIN = 32;

type Measurement = {
	id: string;
	width: number;
	height: number;
	scale: number;
	left: number;
	top: number;
	priority: number;
	keepClear: boolean;
};

export type HeroTextRegion = {
	x: number;
	y: number;
	width: number;
	height: number;
};

const overlaps = (
	a: { x: number; y: number; width: number; height: number },
	b: { x: number; y: number; width: number; height: number },
) =>
	a.x < b.x + b.width &&
	a.x + a.width > b.x &&
	a.y < b.y + b.height &&
	a.y + a.height > b.y;

// Pack, then cover the section: the packed content fills it edge to edge and
// the ragged outer specimens bleed past the edges. With a hero text region
// (section pixels), the repository cards and stack logos (keepClear) are
// packed outside it;
// the region is mapped into packing coordinates from the previous pass until
// the covered result keeps every card clear of it.
function layout(
	measurements: Measurement[],
	width: number,
	height: number,
	avoid: HeroTextRegion | undefined,
) {
	const aspect = width / height;
	const cover = (packed: ReturnType<typeof packCenterOut>) =>
		COVER_OVERSCAN * Math.max(width / packed.width, height / packed.height);
	let packed = packCenterOut(measurements, { gap: 40, aspect });
	let scale = cover(packed);
	if (!avoid) return { packed, scale };
	// Start the cards in the largest free band beside or below the text.
	const bands = [
		{
			x: avoid.x + avoid.width,
			y: 0,
			width: width - avoid.x - avoid.width,
			height,
		},
		{
			x: 0,
			y: avoid.y + avoid.height,
			width,
			height: height - avoid.y - avoid.height,
		},
		{ x: 0, y: 0, width: avoid.x, height },
		{ x: 0, y: 0, width, height: avoid.y },
	];
	const band = bands.reduce((a, b) =>
		b.width * b.height > a.width * a.height ? b : a,
	);
	const screen = (item: {
		x: number;
		y: number;
		width: number;
		height: number;
	}) => ({
		x: width / 2 + item.x * scale,
		y: height / 2 + item.y * scale,
		width: item.width * scale,
		height: item.height * scale,
	});
	for (let pass = 0; pass < 8; pass += 1) {
		const toPacking = (x: number, y: number) => ({
			x: (x - width / 2) / scale + packed.offset.x,
			y: (y - height / 2) / scale + packed.offset.y,
		});
		const topLeft = toPacking(avoid.x - TEXT_MARGIN, avoid.y - TEXT_MARGIN);
		const bottomRight = toPacking(
			avoid.x + avoid.width + TEXT_MARGIN,
			avoid.y + avoid.height + TEXT_MARGIN,
		);
		packed = packCenterOut(measurements, {
			gap: 40,
			aspect,
			avoid: {
				left: topLeft.x,
				top: topLeft.y,
				right: bottomRight.x,
				bottom: bottomRight.y,
			},
			start: toPacking(band.x + band.width / 2, band.y + band.height / 2),
		});
		scale = cover(packed);
		if (
			packed.items.every(
				(item) => !item.keepClear || !overlaps(screen(item), avoid),
			)
		)
			break;
	}
	return { packed, scale };
}

export default function HomeHeroLibrary({
	services,
	avoid,
}: {
	services: HomeHeroServiceItem[];
	/** Hero text region in section pixels; the repository cards stay clear of it. */
	avoid?: HeroTextRegion;
}) {
	const rootRef = useRef<HTMLDivElement>(null);
	const [mounted, setMounted] = useState(false);
	useLayoutEffect(() => {
		setMounted(true);
	}, []);
	useLayoutEffect(() => {
		const root = rootRef.current;
		if (!root || !mounted) return;
		let frame = 0;
		let disposed = false;
		const measure = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				if (disposed) return;
				const measurements: Measurement[] = [];
				for (const specimen of root.querySelectorAll<HTMLElement>(
					"[data-hero-specimen]",
				)) {
					const native = specimen.querySelector<HTMLElement>(
						"[data-specimen-native]",
					);
					if (!native) continue;
					const width = Number(native.dataset.nativeWidth);
					const base = native.getBoundingClientRect();
					const factor = base.width / width || 1;
					let left = 0,
						top = 0,
						right = width,
						bottom = native.scrollHeight;
					const include = (rect: DOMRect) => {
						if (rect.width <= 0 || rect.height <= 0) return;
						left = Math.min(left, (rect.left - base.left) / factor);
						top = Math.min(top, (rect.top - base.top) / factor);
						right = Math.max(right, (rect.right - base.left) / factor);
						bottom = Math.max(bottom, (rect.bottom - base.top) / factor);
					};
					for (const element of native.querySelectorAll<HTMLElement>("*")) {
						const style = getComputedStyle(element);
						if (
							style.display === "none" ||
							style.visibility === "hidden" ||
							style.opacity === "0"
						)
							continue;
						if (
							style.backgroundColor !== "rgba(0, 0, 0, 0)" ||
							style.backgroundImage !== "none" ||
							parseFloat(style.borderTopWidth) > 0 ||
							element.matches(
								"input,button,textarea,select,img,svg,canvas,video",
							)
						)
							include(element.getBoundingClientRect());
						for (const child of element.childNodes) {
							if (
								child.nodeType !== Node.TEXT_NODE ||
								!child.textContent?.trim()
							)
								continue;
							const range = document.createRange();
							range.selectNodeContents(child);
							for (const rect of range.getClientRects()) include(rect);
						}
					}
					const priority = Number(specimen.dataset.packPriority ?? 0);
					const scale =
						priority > 0
							? 2.2
							: Math.min(
									1,
									500 / (right - left),
									500 / Math.max(16, bottom - top),
								);
					measurements.push({
						id: specimen.dataset.heroSpecimen ?? "",
						priority,
						keepClear: specimen.dataset.keepClear === "true",
						width: (right - left + 64) * scale,
						height: (bottom - top + 64) * scale,
						scale,
						left: left - 32,
						top: top - 32,
					});
				}
				const { packed, scale } = layout(
					measurements,
					root.clientWidth,
					root.clientHeight,
					avoid,
				);
				const cluster = root.querySelector<HTMLElement>("[data-hero-cluster]");
				if (!cluster || !Number.isFinite(scale)) return;
				cluster.style.transform = `scale(${scale})`;
				for (const placement of packed.items) {
					const specimen = root.querySelector<HTMLElement>(
						`[data-hero-specimen="${placement.id}"]`,
					);
					const native = specimen?.querySelector<HTMLElement>(
						"[data-specimen-native]",
					);
					const size = measurements.find((item) => item.id === placement.id);
					if (!specimen || !native || !size) continue;
					Object.assign(specimen.style, {
						left: `${placement.x}px`,
						top: `${placement.y}px`,
						width: `${size.width}px`,
						height: `${size.height}px`,
					});
					native.style.transform = `scale(${size.scale}) translate(${-size.left}px, ${-size.top}px)`;
				}
				root.dataset.packingReady = String(measurements.length);
				cluster.style.opacity = "1";
			});
		};
		const observer = new ResizeObserver(measure);
		observer.observe(root);
		for (const native of root.querySelectorAll<HTMLElement>(
			"[data-specimen-native]",
		))
			observer.observe(native);
		// Observe content, never positioning styles written by the packer itself.
		const mutations = new MutationObserver(measure);
		mutations.observe(root, {
			subtree: true,
			childList: true,
			characterData: true,
		});
		measure();
		void document.fonts.ready.then(measure);
		return () => {
			disposed = true;
			cancelAnimationFrame(frame);
			observer.disconnect();
			mutations.disconnect();
		};
	}, [mounted, avoid]);
	return (
		<div
			ref={rootRef}
			className="pointer-events-none relative h-full w-full overflow-hidden"
			aria-hidden="true"
			inert
			data-hero-library=""
		>
			{mounted && (
				<div
					data-hero-cluster=""
					className="absolute left-1/2 top-1/2 origin-top-left opacity-0"
				>
					{[
						{
							id: "hero-skills",
							name: "Skills pack",
							width: 420,
							priority: 4,
							content: <HomeHeroChoices services={services} kind="skills" />,
						},
						{
							id: "hero-installation",
							name: "Starting point",
							width: 420,
							priority: 2,
							content: (
								<HomeHeroChoices services={services} kind="installation" />
							),
						},
						{
							id: "hero-workflows",
							name: "Workflows",
							width: 420,
							priority: 1,
							content: <HomeHeroChoices services={services} kind="workflows" />,
						},
						...stackLogos.map((logo) => ({
							id: `hero-stack-${logo.name}`,
							name: logo.name,
							width: 200,
							priority: 0,
							keepClear: true,
							content: <HomeHeroStackLogo logo={logo} />,
						})),
						...heroSpecimens.map((specimen) => ({
							...specimen,
							priority: 0,
							content: createElement(specimen.Render),
						})),
					]
						.filter(
							(specimen) =>
								!["hero-skills", "hero-installation"].includes(specimen.id) ||
								services.some((service) =>
									service.surfaceIds.some((id) =>
										specimen.id === "hero-skills"
											? id === "skillsPack"
											: ["assembly", "thinStart", "fullStart"].includes(id),
									),
								),
						)
						.sort((a, b) => a.name.localeCompare(b.name))
						.map(({ id, width, priority, content, ...specimen }) => (
							<div
								key={id}
								data-hero-specimen={id}
								data-pack-priority={priority}
								data-keep-clear={
									priority > 0 ||
									("keepClear" in specimen && specimen.keepClear)
								}
								className="absolute"
							>
								<div
									data-specimen-native=""
									data-native-width={width}
									className="origin-top-left"
									style={{ width }}
								>
									<PortalScope
										className="relative isolate"
										style={{ transform: "translateZ(0)" }}
									>
										<SpecimenBoundary>{content}</SpecimenBoundary>
									</PortalScope>
								</div>
							</div>
						))}
				</div>
			)}
		</div>
	);
}
