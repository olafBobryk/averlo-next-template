"use client";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { focusRing } from "../foundations/focus";
import { instantTransition, motionTiming } from "../foundations/motionTiming";
import { Button } from "../primitives/Button";

type ScrollBordersProps = {
	children?: React.ReactNode;
	as?: React.ElementType;
	axis?: "horizontal" | "vertical";
	className?: string;
	borderClassName?: string;
	topBorderClassName?: string;
	bottomBorderClassName?: string;
	leftBorderClassName?: string;
	rightBorderClassName?: string;
	deps?: React.DependencyList;
	disabled?: boolean;
	showBackToTop?: boolean;
} & Omit<
	React.ComponentPropsWithoutRef<"div">,
	"children" | "className" | "onScroll"
> & {
		onScroll?: React.UIEventHandler<HTMLDivElement>;
	};

type ScrollBordersSkeletonProps = {
	children?: React.ReactNode;
	as?: React.ElementType;
	axis?: "horizontal" | "vertical";
	className?: string;
	borderClassName?: string;
	bottomBorderClassName?: string;
	rightBorderClassName?: string;
	deps?: React.DependencyList;
	disabled?: boolean;
} & Omit<React.ComponentPropsWithoutRef<"div">, "children" | "className">;

type ScrollBordersComponent = React.ForwardRefExoticComponent<
	ScrollBordersProps & React.RefAttributes<HTMLDivElement>
> & {
	Skeleton: (props: ScrollBordersSkeletonProps) => React.ReactElement;
};

const ScrollBordersRoot = React.forwardRef<HTMLDivElement, ScrollBordersProps>(
	(
		{
			children,
			as,
			axis = "vertical",
			className,
			borderClassName = "border-border!",
			topBorderClassName = "border-t!",
			bottomBorderClassName = "border-b!",
			leftBorderClassName = "border-l!",
			rightBorderClassName = "border-r!",
			deps = [],
			disabled = false,
			showBackToTop = true,
			onScroll,
			onMouseEnter,
			onMouseLeave,
			...rest
		},
		forwardedRef,
	) => {
		const ref = React.useRef<HTMLDivElement | null>(null);
		const motionAllowed = useMotionAllowed(true);
		React.useImperativeHandle(
			forwardedRef,
			() => ref.current as HTMLDivElement,
		);
		const [showStartBorder, setShowStartBorder] = React.useState(false);
		const [showEndBorder, setShowEndBorder] = React.useState(false);
		const [isHovered, setIsHovered] = React.useState(false);
		const [hasOverflow, setHasOverflow] = React.useState(false);

		const updateOverflow = () => {
			if (disabled) {
				setShowStartBorder(false);
				setShowEndBorder(false);
				setHasOverflow(false);
				return;
			}
			const element = ref.current;
			if (!element) return;
			const scrollSize =
				axis === "horizontal" ? element.scrollWidth : element.scrollHeight;
			const clientSize =
				axis === "horizontal" ? element.clientWidth : element.clientHeight;
			const scrollPosition =
				axis === "horizontal" ? element.scrollLeft : element.scrollTop;
			const canScroll = scrollSize - clientSize > 1;
			const maximumScroll = scrollSize - clientSize;
			const isRightToLeft =
				axis === "horizontal" && getComputedStyle(element).direction === "rtl";
			const atStart = isRightToLeft
				? scrollPosition <= -maximumScroll + 1
				: scrollPosition <= 1;
			const atEnd = isRightToLeft
				? scrollPosition >= -1
				: scrollPosition + clientSize >= scrollSize - 1;
			setShowStartBorder(canScroll && !atStart);
			setShowEndBorder(canScroll && !atEnd);
			setHasOverflow(canScroll);
		};

		// biome-ignore lint/correctness/useExhaustiveDependencies: caller-controlled deps are intentionally spread here.
		React.useEffect(() => {
			updateOverflow();
		}, [axis, disabled, ...deps]);

		// biome-ignore lint/correctness/useExhaustiveDependencies: resize observation only needs the disabled gate here.
		React.useEffect(() => {
			const element = ref.current;
			if (disabled || !element || typeof ResizeObserver === "undefined") {
				return;
			}
			const observer = new ResizeObserver(() => updateOverflow());
			observer.observe(element);
			return () => observer.disconnect();
		}, [axis, disabled]);

		const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
			updateOverflow();
			onScroll?.(event);
		};

		const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
			setIsHovered(true);
			onMouseEnter?.(event);
		};

		const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
			setIsHovered(false);
			onMouseLeave?.(event);
		};

		const handleScrollToTop = () => {
			if (!ref.current) return;
			ref.current.scrollTo({ top: 0, behavior: "smooth" });
		};

		const Tag = as ?? "div";

		return (
			<Tag
				ref={ref}
				onScroll={handleScroll}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				className={clsx(
					"relative group",
					focusRing.visibleInner,
					className,
					showStartBorder &&
						(axis === "horizontal" ? leftBorderClassName : topBorderClassName),
					showEndBorder &&
						(axis === "horizontal"
							? rightBorderClassName
							: bottomBorderClassName),
					(showStartBorder || showEndBorder) && borderClassName,
				)}
				data-scroll-border-start={showStartBorder ? "true" : undefined}
				data-scroll-border-end={showEndBorder ? "true" : undefined}
				{...rest}
			>
				{children}
				<span className="relative block h-0 max-h-0 w-full">
					<AnimatePresence initial={false}>
						{axis === "vertical" &&
						isHovered &&
						!showEndBorder &&
						hasOverflow &&
						showBackToTop ? (
							<motion.div
								className="absolute! bottom-0 left-1/2 -translate-x-1/2"
								initial={{ opacity: 0, y: 0 }}
								animate={{
									opacity: 1,
									y: -25,
								}}
								exit={{ opacity: 0, y: 0 }}
								transition={
									motionAllowed ? motionTiming.scroll : instantTransition
								}
							>
								<Button
									aria-label="Back to top"
									hitArea="touch"
									leadingIcon="arrow-up"
									onClick={handleScrollToTop}
									size="icon-sm"
									title="Back to top"
									variant="primary"
								/>
							</motion.div>
						) : null}
					</AnimatePresence>
				</span>
			</Tag>
		);
	},
);

ScrollBordersRoot.displayName = "ScrollBorders";

function ScrollBordersSkeleton({
	children,
	as,
	axis = "vertical",
	className,
	borderClassName = "border-border!",
	bottomBorderClassName = "border-b!",
	rightBorderClassName = "border-r!",
	deps = [],
	disabled = false,
	...rest
}: ScrollBordersSkeletonProps) {
	const ref = React.useRef<HTMLDivElement | null>(null);
	const [showBottomBorder, setShowBottomBorder] = React.useState(false);

	const updateOverflow = () => {
		if (disabled) {
			setShowBottomBorder(false);
			return;
		}
		const element = ref.current;
		if (!element) return;
		const scrollSize =
			axis === "horizontal" ? element.scrollWidth : element.scrollHeight;
		const clientSize =
			axis === "horizontal" ? element.clientWidth : element.clientHeight;
		const canScroll = scrollSize - clientSize > 1;
		setShowBottomBorder(canScroll);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: caller-controlled deps are intentionally spread here.
	React.useEffect(() => {
		updateOverflow();
	}, [axis, disabled, ...deps]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: resize observation only needs the disabled gate here.
	React.useEffect(() => {
		const element = ref.current;
		if (disabled || !element || typeof ResizeObserver === "undefined") {
			return;
		}
		const observer = new ResizeObserver(() => updateOverflow());
		observer.observe(element);
		return () => observer.disconnect();
	}, [axis, disabled]);

	const Tag = as ?? "div";

	return (
		<Tag
			ref={ref}
			className={clsx(
				"overflow-hidden relative",
				className,
				showBottomBorder &&
					(axis === "horizontal"
						? rightBorderClassName
						: bottomBorderClassName),
				showBottomBorder && borderClassName,
			)}
			{...rest}
		>
			<div className={clsx("absolute overflow-visible! inset-0", className)}>
				{children}
			</div>
		</Tag>
	);
}

export const ScrollBorders = Object.assign(ScrollBordersRoot, {
	Skeleton: ScrollBordersSkeleton,
}) as ScrollBordersComponent;
