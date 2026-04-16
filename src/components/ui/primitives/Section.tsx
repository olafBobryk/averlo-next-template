// components/ui/primitives/Section.tsx
import { cva, type VariantProps } from "class-variance-authority";
import {
	Children,
	type ComponentPropsWithoutRef,
	type ElementType,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";

const outerStyles = cva("w-full", {
	variants: {
		padding: {
			none: "",
			soft: "px-[calc(var(--spacing-section-x)/2)] py-[calc(var(--spacing-section-y)/2)]",
			default: "px-[var(--spacing-section-x)] py-[var(--spacing-section-y)]",
			"flush-x": "py-[var(--spacing-section-y)]",
			hero: "px-[var(--spacing-section-x)] pb-[var(--spacing-section-y)]  pt-[calc(var(--spacing-section-y)*1.5)]",
		},
		background: {
			none: "",
			surface: "bg-surface",
			background: "bg-background",
			foreground: "bg-foreground",
		},
		height: {
			auto: "h-auto",
			hero: "sm:h-svh max-h-[1000px] min-h-fit",
		},
	},
	defaultVariants: {
		padding: "default",
		background: "none",
	},
});

const innerStyles = cva("w-full flex flex-col", {
	variants: {
		maxWidth: {
			default: "max-w-section-max mx-auto",
			wide: "max-w-none",
			narrow: "max-w-4xl mx-auto",
			none: "",
		},
		align: {
			start: "items-start text-left",
			center: "items-center text-center",
			end: "items-end text-right",
		},
		size: {
			seamless: "min-h-full h-fit",
		},
	},
	defaultVariants: {
		maxWidth: "default",
		align: "start",
		size: "seamless",
	},
});

export type SectionBackgroundProps = {
	children: ReactNode;
	className?: string;
	interactive?: boolean;
};

type SectionProps<T extends ElementType> = {
	as?: T;
	children: ReactNode;
	className?: string;
	innerClassName?: string;
} & VariantProps<typeof outerStyles> &
	VariantProps<typeof innerStyles> &
	Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

function SectionBackground({ children }: SectionBackgroundProps) {
	return <>{children}</>;
}

SectionBackground.displayName = "Section.Background";

function isSectionBackgroundElement(
	child: ReactNode,
): child is ReactElement<SectionBackgroundProps, typeof SectionBackground> {
	return isValidElement(child) && child.type === SectionBackground;
}

function SectionRoot<T extends ElementType = "section">({
	as,
	children,
	className,
	innerClassName,
	padding,
	background,
	height,
	maxWidth,
	align,
	...rest
}: SectionProps<T>) {
	const Tag = (as ?? "section") as ElementType;
	const backgroundChildren: ReactElement<
		SectionBackgroundProps,
		typeof SectionBackground
	>[] = [];
	const foregroundChildren: ReactNode[] = [];

	Children.forEach(children, (child) => {
		if (isSectionBackgroundElement(child)) {
			backgroundChildren.push(child);
			return;
		}

		foregroundChildren.push(child);
	});

	const hasBackground = backgroundChildren.length > 0;

	const outerClass = [
		outerStyles({ padding, background, height }),
		hasBackground ? "relative isolate overflow-hidden" : undefined,
		className,
	]
		.filter(Boolean)
		.join(" ");
	const innerClass = [
		innerStyles({ maxWidth, align }),
		hasBackground ? "relative z-10" : undefined,
		innerClassName,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<Tag
			className={outerClass}
			{...(rest as ComponentPropsWithoutRef<ElementType>)}
		>
			{hasBackground ? (
				<div className="absolute inset-0 z-0">
					{backgroundChildren.map((child, index) => (
						<div
							key={child.key ?? `section-background-${index}`}
							className={[
								"absolute inset-0 h-full w-full",
								child.props.interactive ? undefined : "pointer-events-none",
							]
								.filter(Boolean)
								.join(" ")}
							aria-hidden={child.props.interactive ? undefined : true}
						>
							<div
								className={["relative h-full w-full", child.props.className]
									.filter(Boolean)
									.join(" ")}
							>
								{child.props.children}
							</div>
						</div>
					))}
				</div>
			) : null}
			<div className={innerClass}>{foregroundChildren}</div>
		</Tag>
	);
}

type SectionComponent = typeof SectionRoot & {
	Background: typeof SectionBackground;
};

export const Section = Object.assign(SectionRoot, {
	Background: SectionBackground,
}) as SectionComponent;
