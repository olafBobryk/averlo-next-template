"use client";

import {
	Component,
	type ReactNode,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { PortalScope } from "@/components/ui/overlays/Portal";
import type { HomeHeroServiceItem } from "../../types";
import { HomeHeroChoices } from "./HomeHeroChoices";
import { heroSpecimens } from "./heroSpecimens";
import { packCenterOut } from "./pack.mjs";

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

type Measurement = {
	id: string;
	width: number;
	height: number;
	scale: number;
	left: number;
	top: number;
	priority: number;
};

export default function HomeHeroLibrary({
	services,
}: {
	services: HomeHeroServiceItem[];
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
						width: (right - left + 64) * scale,
						height: (bottom - top + 64) * scale,
						scale,
						left: left - 32,
						top: top - 32,
					});
				}
				const packed = packCenterOut(measurements, {
					gap: 40,
					centerIds: ["hero-skills", "hero-installation"],
					aspect: root.clientWidth / root.clientHeight,
				});
				const scale = Math.min(
					(root.clientWidth - 24) / packed.width,
					(root.clientHeight - 24) / packed.height,
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
	}, [mounted]);
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
							priority: 2,
							Render: () => (
								<HomeHeroChoices services={services} kind="skills" />
							),
						},
						{
							id: "hero-installation",
							name: "Starting point",
							width: 420,
							priority: 1,
							Render: () => (
								<HomeHeroChoices services={services} kind="installation" />
							),
						},
						...heroSpecimens.map((specimen) => ({ ...specimen, priority: 0 })),
					]
						.sort((a, b) => a.name.localeCompare(b.name))
						.map(({ id, width, priority, Render }) => (
							<div
								key={id}
								data-hero-specimen={id}
								data-pack-priority={priority}
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
										<SpecimenBoundary>
											<Render />
										</SpecimenBoundary>
									</PortalScope>
								</div>
							</div>
						))}
				</div>
			)}
		</div>
	);
}
