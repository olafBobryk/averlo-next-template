import clsx from "clsx";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { Text } from "../Text";

type ContentSectionProps<T extends ElementType> = {
	as?: T;
	children?: ReactNode;
	className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/** A page-level content group. Its heading and body share the page canvas. */
function ContentSectionRoot<T extends ElementType = "section">({
	as,
	className,
	...props
}: ContentSectionProps<T>) {
	const Tag = (as ?? "section") as ElementType;
	return (
		<Tag
			className={clsx("grid min-w-0 gap-4", className)}
			data-slot="content-section"
			{...props}
		/>
	);
}

type HeadingProps = Omit<ComponentPropsWithoutRef<"header">, "title"> & {
	title: ReactNode;
	description?: ReactNode;
	action?: ReactNode;
	titleAs?: "h2" | "h3" | "h4" | "div";
	actionLayout?: "inline" | "responsive";
};

function Heading({
	title,
	description,
	action,
	titleAs: Title = "h2",
	actionLayout = "inline",
	className,
	...props
}: HeadingProps) {
	return (
		<header
			className={clsx(
				"flex min-w-0 flex-wrap items-start justify-between gap-x-6 gap-y-3",
				actionLayout === "responsive" && "flex-col sm:flex-row",
				className,
			)}
			data-slot="content-section-heading"
			{...props}
		>
			<div className="grid min-w-0 flex-1 gap-1">
				<Title className="text-base font-semibold leading-snug">{title}</Title>
				{description ? (
					<Text as="div" tone="muted" variant="support">
						{description}
					</Text>
				) : null}
			</div>
			{action ? <div className="ml-auto shrink-0 self-end sm:self-start">{action}</div> : null}
		</header>
	);
}

function Content({ className, ...props }: ComponentPropsWithoutRef<"div">) {
	return (
		<div
			className={clsx("min-w-0", className)}
			data-slot="content-section-content"
			{...props}
		/>
	);
}

function Footer({ className, ...props }: ComponentPropsWithoutRef<"div">) {
	return (
		<div
			className={clsx("flex flex-wrap items-center gap-3", className)}
			data-slot="content-section-footer"
			{...props}
		/>
	);
}

function Header({ className, ...props }: ComponentPropsWithoutRef<"header">) {
	return (
		<header
			className={clsx("grid min-w-0 gap-2", className)}
			data-slot="content-section-heading"
			{...props}
		/>
	);
}
function Title({ className, ...props }: ComponentPropsWithoutRef<"h2">) {
	return (
		<h2
			className={clsx("text-base font-semibold leading-snug", className)}
			{...props}
		/>
	);
}
function Description({ className, ...props }: ComponentPropsWithoutRef<"div">) {
	return (
		<Text
			as="div"
			tone="muted"
			variant="support"
			className={className}
			{...props}
		/>
	);
}
function Action({ className, ...props }: ComponentPropsWithoutRef<"div">) {
	return (
		<div
			className={clsx(
				"col-start-2 row-start-1 row-span-2 self-start justify-self-end",
				className,
			)}
			{...props}
		/>
	);
}
export const ContentSection = Object.assign(ContentSectionRoot, {
	Heading,
	Header,
	Title,
	Description,
	Action,
	Content,
	Footer,
});
