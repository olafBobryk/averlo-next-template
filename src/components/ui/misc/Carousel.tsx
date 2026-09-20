"use client";

import clsx from "clsx";
import {
	animate,
	motion,
	useMotionValue,
	useMotionValueEvent,
} from "motion/react";
import {
	type PointerEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { focusRing } from "@/components/ui/foundations/focus";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import { getSpring } from "@/components/ui/foundations/spring";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

export type CarouselItem = {
	content: ReactNode;
	id: string;
	label: string;
};

export type CarouselWideLayout = {
	columns: 2 | 3 | 4 | 5 | 6;
	from: "lg" | "xl" | "2xl";
};

export type CarouselProps = {
	ariaLabel: string;
	gutter?: "none" | "section";
	initialIndex?: number;
	items: readonly CarouselItem[];
	onIndexChange?: (index: number) => void;
	paginationLabel?: string;
	wideLayout?: CarouselWideLayout;
};

type PointerDrag = {
	dragged: boolean;
	lastTime: number;
	lastX: number;
	pointerId: number;
	startTrackX: number;
	startX: number;
	velocityX: number;
};

function clampIndex(index: number, count: number) {
	return Math.max(0, Math.min(Math.round(index), Math.max(0, count - 1)));
}

const wideLayoutQueries: Record<CarouselWideLayout["from"], string> = {
	lg: "(min-width: 1024px)",
	xl: "(min-width: 1280px)",
	"2xl": "(min-width: 1536px)",
};

const wideViewportClasses: Record<CarouselWideLayout["from"], string> = {
	lg: "lg:ml-0 lg:w-full lg:overflow-visible lg:pb-0 lg:touch-auto",
	xl: "xl:ml-0 xl:w-full xl:overflow-visible xl:pb-0 xl:touch-auto",
	"2xl": "2xl:ml-0 2xl:w-full 2xl:overflow-visible 2xl:pb-0 2xl:touch-auto",
};

const wideTrackClasses: Record<CarouselWideLayout["from"], string> = {
	lg: "lg:!w-full lg:!transform-none",
	xl: "xl:!w-full xl:!transform-none",
	"2xl": "2xl:!w-full 2xl:!transform-none",
};

const wideSequenceClasses: Record<CarouselWideLayout["from"], string> = {
	lg: "lg:!grid lg:cursor-default lg:px-0",
	xl: "xl:!grid xl:cursor-default xl:px-0",
	"2xl": "2xl:!grid 2xl:cursor-default 2xl:px-0",
};

const wideSlideClasses: Record<CarouselWideLayout["from"], string> = {
	lg: "lg:basis-auto",
	xl: "xl:basis-auto",
	"2xl": "2xl:basis-auto",
};

const widePaginationClasses: Record<CarouselWideLayout["from"], string> = {
	lg: "lg:hidden",
	xl: "xl:hidden",
	"2xl": "2xl:hidden",
};

const wideColumnClasses: Record<
	CarouselWideLayout["from"],
	Record<CarouselWideLayout["columns"], string>
> = {
	lg: {
		2: "lg:grid-cols-2",
		3: "lg:grid-cols-3",
		4: "lg:grid-cols-4",
		5: "lg:grid-cols-5",
		6: "lg:grid-cols-6",
	},
	xl: {
		2: "xl:grid-cols-2",
		3: "xl:grid-cols-3",
		4: "xl:grid-cols-4",
		5: "xl:grid-cols-5",
		6: "xl:grid-cols-6",
	},
	"2xl": {
		2: "2xl:grid-cols-2",
		3: "2xl:grid-cols-3",
		4: "2xl:grid-cols-4",
		5: "2xl:grid-cols-5",
		6: "2xl:grid-cols-6",
	},
};

function getInlineAlignedSnapPoint(
	first: { left: number; width: number },
	slide: { left: number; width: number },
	direction: "ltr" | "rtl",
) {
	return direction === "rtl"
		? first.left + first.width - (slide.left + slide.width)
		: first.left - slide.left;
}

function constrainWithElasticity(value: number, points: readonly number[]) {
	const minimum = Math.min(...points);
	const maximum = Math.max(...points);
	if (value < minimum) return minimum + (value - minimum) * 0.14;
	if (value > maximum) return maximum + (value - maximum) * 0.14;
	return value;
}

function useWideLayoutActive(wideLayout: CarouselWideLayout | undefined) {
	const [active, setActive] = useState(false);

	useEffect(() => {
		if (!wideLayout) {
			setActive(false);
			return undefined;
		}
		const media = window.matchMedia(wideLayoutQueries[wideLayout.from]);
		const update = () => setActive(media.matches);
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, [wideLayout]);

	return active;
}

export function Carousel({
	ariaLabel,
	gutter = "section",
	initialIndex = 0,
	items,
	onIndexChange,
	paginationLabel = "Choose a slide",
	wideLayout,
}: CarouselProps) {
	const viewportRef = useRef<HTMLElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const settleAnimationRef = useRef<ReturnType<typeof animate> | null>(null);
	const suppressClickRef = useRef(false);
	const suppressClickTimerRef = useRef<number | null>(null);
	const positionIndexRef = useRef(clampIndex(initialIndex, items.length));
	const directionRef = useRef<"ltr" | "rtl">("ltr");
	const dragRef = useRef<PointerDrag | null>(null);
	const [activeIndex, setActiveIndex] = useState(positionIndexRef.current);
	const [isDragging, setIsDragging] = useState(false);
	const [snapPoints, setSnapPoints] = useState<readonly number[]>([0]);
	const motionAllowed = useMotionAllowed(true);
	const motionDisabled = useMotionDisableOverride();
	const shouldAnimate = motionAllowed && !motionDisabled;
	const trackX = useMotionValue(0);
	const wideLayoutActive = useWideLayoutActive(wideLayout);

	useMotionValueEvent(trackX, "change", (value) => {
		let closestIndex = 0;
		let closestDistance = Number.POSITIVE_INFINITY;
		for (const [index, point] of snapPoints.entries()) {
			const distance = Math.abs(point - value);
			if (distance < closestDistance) {
				closestIndex = index;
				closestDistance = distance;
			}
		}
		positionIndexRef.current = closestIndex;
		setActiveIndex((currentIndex) => {
			if (currentIndex === closestIndex) return currentIndex;
			onIndexChange?.(closestIndex);
			return closestIndex;
		});
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: changing the item count must rebuild the measured snap-point list.
	useLayoutEffect(() => {
		const viewport = viewportRef.current;
		const track = trackRef.current;
		if (!viewport || !track) return undefined;

		const measure = () => {
			if (wideLayoutActive) {
				trackX.jump(0);
				return;
			}
			const slides = Array.from(
				track.querySelectorAll<HTMLElement>("[data-carousel-slide]"),
			);
			const firstSlide = slides[0];
			if (!firstSlide || viewport.offsetWidth === 0) return;
			const direction =
				window.getComputedStyle(viewport).direction === "rtl" ? "rtl" : "ltr";
			directionRef.current = direction;
			const nextSnapPoints = slides.map((slide) =>
				getInlineAlignedSnapPoint(
					{ left: firstSlide.offsetLeft, width: firstSlide.offsetWidth },
					{ left: slide.offsetLeft, width: slide.offsetWidth },
					direction,
				),
			);
			setSnapPoints(nextSnapPoints);
			const nextIndex = clampIndex(positionIndexRef.current, slides.length);
			positionIndexRef.current = nextIndex;
			trackX.jump(nextSnapPoints[nextIndex] ?? 0);
		};

		measure();
		const resizeObserver = new ResizeObserver(measure);
		resizeObserver.observe(viewport);
		resizeObserver.observe(track);
		return () => resizeObserver.disconnect();
	}, [items.length, trackX, wideLayoutActive]);

	useEffect(
		() => () => {
			settleAnimationRef.current?.stop();
			if (suppressClickTimerRef.current !== null) {
				window.clearTimeout(suppressClickTimerRef.current);
			}
		},
		[],
	);

	const scrollToIndex = useCallback(
		(index: number) => {
			if (wideLayoutActive) return;
			const selectedIndex = clampIndex(index, items.length);
			const slides = Array.from(
				trackRef.current?.querySelectorAll<HTMLElement>(
					"[data-carousel-slide]",
				) ?? [],
			);
			const firstSlide = slides[0];
			const selectedSlide = slides[selectedIndex];
			const target =
				firstSlide && selectedSlide
					? getInlineAlignedSnapPoint(
							{ left: firstSlide.offsetLeft, width: firstSlide.offsetWidth },
							{
								left: selectedSlide.offsetLeft,
								width: selectedSlide.offsetWidth,
							},
							directionRef.current,
						)
					: snapPoints[selectedIndex];
			if (target === undefined) return;
			settleAnimationRef.current?.stop();
			if (shouldAnimate) {
				settleAnimationRef.current = animate(
					trackX,
					target,
					getSpring("interaction"),
				);
			} else {
				trackX.jump(target);
			}
			positionIndexRef.current = selectedIndex;
			setActiveIndex(selectedIndex);
			onIndexChange?.(selectedIndex);
		},
		[
			items.length,
			onIndexChange,
			shouldAnimate,
			snapPoints,
			trackX,
			wideLayoutActive,
		],
	);

	const settleDrag = useCallback(
		(velocityX: number) => {
			const slideStep = Math.abs((snapPoints[1] ?? 0) - (snapPoints[0] ?? 0));
			const velocityProjection = Math.max(
				-slideStep * 0.42,
				Math.min(slideStep * 0.42, velocityX * 0.12),
			);
			const projectedX = trackX.get() + velocityProjection;
			let closestIndex = 0;
			let closestDistance = Number.POSITIVE_INFINITY;
			for (const [index, point] of snapPoints.entries()) {
				const distance = Math.abs(point - projectedX);
				if (distance < closestDistance) {
					closestIndex = index;
					closestDistance = distance;
				}
			}

			const target = snapPoints[closestIndex] ?? 0;
			settleAnimationRef.current?.stop();
			if (shouldAnimate) {
				settleAnimationRef.current = animate(trackX, target, {
					...getSpring("interaction", { expressive: 0.35 }),
					velocity: velocityX,
				});
			} else {
				trackX.jump(target);
			}
			positionIndexRef.current = closestIndex;
			setActiveIndex(closestIndex);
			onIndexChange?.(closestIndex);
			setIsDragging(false);
			suppressClickTimerRef.current = window.setTimeout(() => {
				suppressClickRef.current = false;
				suppressClickTimerRef.current = null;
			}, 0);
		},
		[onIndexChange, shouldAnimate, snapPoints, trackX],
	);

	const finishDrag = useCallback(
		(event: PointerEvent<HTMLElement>) => {
			const pointer = dragRef.current;
			if (!pointer || pointer.pointerId !== event.pointerId) return;
			dragRef.current = null;
			if (event.currentTarget.hasPointerCapture(event.pointerId)) {
				event.currentTarget.releasePointerCapture(event.pointerId);
			}
			setIsDragging(false);
			if (!pointer.dragged) return;
			settleDrag(pointer.velocityX);
		},
		[settleDrag],
	);

	const beginPointerDrag = useCallback(
		(event: PointerEvent<HTMLElement>) => {
			if (wideLayoutActive) return;
			if (event.button !== 0) return;
			settleAnimationRef.current?.stop();
			if (suppressClickTimerRef.current !== null) {
				window.clearTimeout(suppressClickTimerRef.current);
				suppressClickTimerRef.current = null;
			}
			suppressClickRef.current = false;
			dragRef.current = {
				dragged: false,
				lastTime: event.timeStamp,
				lastX: event.clientX,
				pointerId: event.pointerId,
				startTrackX: trackX.get(),
				startX: event.clientX,
				velocityX: 0,
			};
		},
		[trackX, wideLayoutActive],
	);

	const updatePointerDrag = useCallback(
		(event: PointerEvent<HTMLElement>) => {
			const pointer = dragRef.current;
			if (!pointer || pointer.pointerId !== event.pointerId) return;
			const distance = event.clientX - pointer.startX;
			if (Math.abs(distance) > 4 && !pointer.dragged) {
				pointer.dragged = true;
				event.currentTarget.setPointerCapture(event.pointerId);
				suppressClickRef.current = true;
				setIsDragging(true);
			}
			if (!pointer.dragged) return;
			const elapsed = Math.max(1, event.timeStamp - pointer.lastTime);
			const instantaneousVelocity =
				((event.clientX - pointer.lastX) / elapsed) * 1000;
			pointer.velocityX =
				pointer.velocityX * 0.55 + instantaneousVelocity * 0.45;
			pointer.lastTime = event.timeStamp;
			pointer.lastX = event.clientX;
			const rawTarget = pointer.startTrackX + distance;
			const elasticTarget = constrainWithElasticity(rawTarget, snapPoints);
			trackX.jump(elasticTarget);
		},
		[snapPoints, trackX],
	);

	if (items.length === 0) return null;

	return (
		<div data-carousel-owner="">
			<section
				ref={viewportRef}
				aria-label={ariaLabel}
				aria-roledescription={wideLayoutActive ? undefined : "carousel"}
				className={clsx(
					focusRing.visibleDefault,
					"overflow-hidden overscroll-x-contain pb-2.5 touch-pan-y",
					gutter === "section" &&
						"-ml-[var(--spacing-section-x)] w-[calc(100%+2*var(--spacing-section-x))]",
					wideLayout && wideViewportClasses[wideLayout.from],
				)}
				data-carousel-dragging={isDragging ? "true" : undefined}
				data-carousel-gutter={gutter}
				data-carousel-presentation={wideLayoutActive ? "grid" : "carousel"}
				onClickCapture={(event) => {
					if (!suppressClickRef.current) return;
					event.preventDefault();
					event.stopPropagation();
					suppressClickRef.current = false;
				}}
				onPointerCancel={finishDrag}
				onPointerDown={beginPointerDrag}
				onPointerMove={updatePointerDrag}
				onPointerUp={finishDrag}
				onKeyDown={(event) => {
					if (wideLayoutActive) return;
					const nextKey =
						directionRef.current === "rtl" ? "ArrowLeft" : "ArrowRight";
					const previousKey =
						directionRef.current === "rtl" ? "ArrowRight" : "ArrowLeft";
					if (event.key !== nextKey && event.key !== previousKey) return;
					event.preventDefault();
					const delta = event.key === nextKey ? 1 : -1;
					scrollToIndex(positionIndexRef.current + delta);
				}}
				tabIndex={wideLayoutActive ? undefined : 0}
			>
				<motion.div
					ref={trackRef}
					className={clsx(
						"w-max will-change-transform",
						wideLayout && wideTrackClasses[wideLayout.from],
					)}
					data-carousel-track=""
					style={{ x: trackX }}
				>
					<div
						className={clsx(
							"flex cursor-grab items-start gap-4 sm:gap-5",
							isDragging && "cursor-grabbing select-none",
							gutter === "section" && "px-[var(--spacing-section-x)]",
							wideLayout && wideSequenceClasses[wideLayout.from],
							wideLayout &&
								wideColumnClasses[wideLayout.from][wideLayout.columns],
						)}
					>
						{items.map((item, index) => (
							<fieldset
								aria-label={`${index + 1} of ${items.length}: ${item.label}`}
								aria-roledescription={wideLayoutActive ? undefined : "slide"}
								className={clsx(
									"m-0 min-w-0 flex-none basis-[min(70vw,27rem)] border-0 p-0 sm:basis-[min(53.2vw,27rem)]",
									wideLayout && wideSlideClasses[wideLayout.from],
								)}
								data-carousel-slide=""
								key={item.id}
							>
								{item.content}
							</fieldset>
						))}
					</div>
				</motion.div>
			</section>
			{items.length > 1 ? (
				<nav
					aria-label={paginationLabel}
					className={clsx(
						"mt-6 flex items-center gap-2",
						wideLayout && widePaginationClasses[wideLayout.from],
					)}
					data-carousel-pagination=""
				>
					{items.map((item, index) => (
						<button
							aria-current={activeIndex === index ? "true" : undefined}
							aria-label={`Show slide ${index + 1}: ${item.label}`}
							className={clsx(
								focusRing.visibleDefault,
								"size-2.5 cursor-pointer rounded-full border-0 bg-foreground/20 transition-[background-color,transform] motion-interactive",
								activeIndex === index && "scale-[1.15] bg-primary",
							)}
							key={item.id}
							onClick={() => scrollToIndex(index)}
							type="button"
						/>
					))}
				</nav>
			) : null}
		</div>
	);
}
