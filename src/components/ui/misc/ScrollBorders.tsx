"use client";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { focusRing } from "../foundations/focus";
import { motionTiming } from "../foundations/motionTiming";
import { Button } from "../primitives/Button";

type ScrollBordersProps = {
	children?: React.ReactNode;
	as?: React.ElementType;
	className?: string;
	borderClassName?: string;
	topBorderClassName?: string;
	bottomBorderClassName?: string;
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
	className?: string;
	borderClassName?: string;
	bottomBorderClassName?: string;
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
			className,
			borderClassName = "border-border!",
			topBorderClassName = "border-t!",
			bottomBorderClassName = "border-b!",
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
		const [showTopBorder, setShowTopBorder] = React.useState(false);
		const [showBottomBorder, setShowBottomBorder] = React.useState(false);
		const [isHovered, setIsHovered] = React.useState(false);
		const [hasOverflow, setHasOverflow] = React.useState(false);

		const updateOverflow = () => {
			if (disabled) {
				setShowTopBorder(false);
				setShowBottomBorder(false);
				setHasOverflow(false);
				return;
			}
			const element = ref.current;
			if (!element) return;
			const canScroll = element.scrollHeight - element.clientHeight > 1;
			const atTop = element.scrollTop <= 1;
			const atBottom =
				element.scrollTop + element.clientHeight >= element.scrollHeight - 1;
			setShowTopBorder(canScroll && !atTop);
			setShowBottomBorder(canScroll && !atBottom);
			setHasOverflow(canScroll);
		};

		// biome-ignore lint/correctness/useExhaustiveDependencies: caller-controlled deps are intentionally spread here.
		React.useEffect(() => {
			updateOverflow();
		}, [disabled, ...deps]);

		// biome-ignore lint/correctness/useExhaustiveDependencies: resize observation only needs the disabled gate here.
		React.useEffect(() => {
			const element = ref.current;
			if (disabled || !element || typeof ResizeObserver === "undefined") {
				return;
			}
			const observer = new ResizeObserver(() => updateOverflow());
			observer.observe(element);
			return () => observer.disconnect();
		}, [disabled]);

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
					showTopBorder && topBorderClassName,
					showBottomBorder && bottomBorderClassName,
					(showTopBorder || showBottomBorder) && borderClassName,
				)}
				{...rest}
			>
				{children}
				<span className="max-h-0 h-0 relative w-full">
					<AnimatePresence initial={false}>
						{isHovered && !showBottomBorder && hasOverflow && showBackToTop ? (
							<motion.div
								className="absolute! bottom-0 left-1/2 -translate-x-1/2"
								initial={{ opacity: 0, y: 0 }}
								animate={{
									opacity: 1,
									y: -25,
								}}
								exit={{ opacity: 0, y: 0 }}
								transition={
									motionAllowed ? motionTiming.component : { duration: 0 }
								}
							>
								<Button
									size="sm"
									variant="ghost"
									leadingIcon="arrow-up"
									onClick={handleScrollToTop}
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
	className,
	borderClassName = "border-border!",
	bottomBorderClassName = "border-b!",
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
		const canScroll = element.scrollHeight - element.clientHeight > 1;
		setShowBottomBorder(canScroll);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: caller-controlled deps are intentionally spread here.
	React.useEffect(() => {
		updateOverflow();
	}, [disabled, ...deps]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: resize observation only needs the disabled gate here.
	React.useEffect(() => {
		const element = ref.current;
		if (disabled || !element || typeof ResizeObserver === "undefined") {
			return;
		}
		const observer = new ResizeObserver(() => updateOverflow());
		observer.observe(element);
		return () => observer.disconnect();
	}, [disabled]);

	const Tag = as ?? "div";

	return (
		<Tag
			ref={ref}
			className={clsx(
				"overflow-hidden relative",
				className,
				showBottomBorder && bottomBorderClassName,
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
