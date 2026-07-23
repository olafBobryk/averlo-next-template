"use client";

import clsx from "clsx";
import {
	Children,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { focusRing } from "@/components/ui/foundations/focus";
import { ChoiceIndicatorMulti } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/misc";
import { Button, type ButtonProps } from "@/components/ui/primitives/Button";
import { Text, textVariants } from "@/components/ui/primitives/Text";
import { splitMarkdownUserMentions } from "@/lib/markdown-mentions";
import {
	getMarkdownContentClassName,
	type MarkdownContentDensity,
} from "./markdownContent";

export type MarkdownRendererProps = {
	className?: string;
	density?: MarkdownContentDensity;
	markdown: string;
	resolveUserMention?: (memberId: string) => ReactNode;
	variant?: MarkdownRendererVariant;
};

export type MarkdownRendererVariant = "contained" | "result";

const markdownRendererVariantClassNames: Record<
	MarkdownRendererVariant,
	string
> = {
	contained: "rounded-lg border border-border bg-background p-3",
	result: "",
};

const markdownSkeletonLineKeys = [
	"alpha",
	"bravo",
	"charlie",
	"delta",
	"echo",
	"foxtrot",
];

type MarkdownAstNode = {
	children?: MarkdownAstNode[];
	data?: {
		hName?: string;
		hProperties?: Record<string, unknown>;
	};
	type: string;
	value?: string;
};

const mentionExcludedNodeTypes = new Set([
	"code",
	"html",
	"inlineCode",
	"link",
]);

function transformMarkdownMentions(node: MarkdownAstNode) {
	if (!node.children || mentionExcludedNodeTypes.has(node.type)) return;
	const nextChildren: MarkdownAstNode[] = [];
	for (const child of node.children) {
		if (child.type !== "text" || typeof child.value !== "string") {
			transformMarkdownMentions(child);
			nextChildren.push(child);
			continue;
		}
		const segments = splitMarkdownUserMentions(child.value);
		if (!segments.some((segment) => segment.type === "mention")) {
			nextChildren.push(child);
			continue;
		}
		for (const segment of segments) {
			nextChildren.push(
				segment.type === "text"
					? { type: "text", value: segment.value }
					: {
							data: {
								hName: "span",
								hProperties: { "data-user-mention-id": segment.memberId },
							},
							type: "text",
							value: "@Unknown member",
						},
			);
		}
	}
	node.children = nextChildren;
}

function remarkUserMentions() {
	return (tree: MarkdownAstNode) => transformMarkdownMentions(tree);
}

const underlineOpenTagPattern = /^<u>$/i;
const underlineCloseTagPattern = /^<\/u>$/i;

function isUnderlineHtmlNode(node: MarkdownAstNode, pattern: RegExp): boolean {
	return (
		node.type === "html" &&
		typeof node.value === "string" &&
		pattern.test(node.value.trim())
	);
}

function findUnderlineClose(children: MarkdownAstNode[], startIndex: number) {
	let depth = 1;
	for (let index = startIndex + 1; index < children.length; index += 1) {
		const child = children[index];
		if (!child) continue;
		if (isUnderlineHtmlNode(child, underlineOpenTagPattern)) {
			depth += 1;
			continue;
		}
		if (!isUnderlineHtmlNode(child, underlineCloseTagPattern)) continue;
		depth -= 1;
		if (depth === 0) return index;
	}
	return -1;
}

function transformMarkdownUnderline(node: MarkdownAstNode) {
	if (!node.children) return;
	const nextChildren: MarkdownAstNode[] = [];

	for (let index = 0; index < node.children.length; index += 1) {
		const child = node.children[index];
		if (!child) continue;

		if (isUnderlineHtmlNode(child, underlineOpenTagPattern)) {
			const closeIndex = findUnderlineClose(node.children, index);
			if (closeIndex >= 0) {
				const underlineNode: MarkdownAstNode = {
					children: node.children.slice(index + 1, closeIndex),
					data: { hName: "u" },
					type: "underline",
				};
				transformMarkdownUnderline(underlineNode);
				nextChildren.push(underlineNode);
				index = closeIndex;
				continue;
			}
		}

		transformMarkdownUnderline(child);
		nextChildren.push(child);
	}

	node.children = nextChildren;
}

function remarkSafeUnderline() {
	return (tree: MarkdownAstNode) => transformMarkdownUnderline(tree);
}

function getUserMentionId(node: unknown) {
	if (!node || typeof node !== "object" || !("properties" in node)) return null;
	const properties = node.properties;
	if (!properties || typeof properties !== "object") return null;
	const memberId =
		"dataUserMentionId" in properties
			? properties.dataUserMentionId
			: "data-user-mention-id" in properties
				? properties["data-user-mention-id"]
				: null;
	return typeof memberId === "string" ? memberId : null;
}

type MarkdownSegment =
	| {
			type: "markdown";
			markdown: string;
	  }
	| {
			type: "button";
			button: MarkdownButtonDirective;
	  };

export type MarkdownButtonDirective = {
	href: string;
	label: string;
	size?: MarkdownButtonSize;
	tone?: MarkdownButtonTone;
	variant?: MarkdownButtonVariant;
};

type MarkdownButtonTone = NonNullable<ButtonProps["tone"]>;
type MarkdownButtonVariant = NonNullable<ButtonProps["variant"]>;
type MarkdownButtonSize = Extract<
	NonNullable<ButtonProps["size"]>,
	"lg" | "md" | "sm" | "xl"
>;

const buttonDirectivePattern = /^::button\[([^\]]+)\](?:\{([^}]*)\})?\s*$/;
const directiveOptionPattern =
	/([A-Za-z][A-Za-z0-9_-]*)=(?:"([^"]*)"|'([^']*)'|([^\s}]+))/g;
const buttonVariants = new Set<MarkdownButtonVariant>([
	"ghost",
	"inverse",
	"primary",
	"secondary",
]);
const buttonTones = new Set<MarkdownButtonTone>(["danger", "default"]);
const buttonSizes = new Set<MarkdownButtonSize>(["lg", "md", "sm", "xl"]);

function isExternalHref(href?: string) {
	return Boolean(href && /^(https?:)?\/\//.test(href));
}

function getOptionValue(match: RegExpExecArray) {
	return match[2] ?? match[3] ?? match[4] ?? "";
}

function parseDirectiveOptions(value?: string) {
	const options = new Map<string, string>();
	if (!value) return options;

	for (const match of value.matchAll(directiveOptionPattern)) {
		options.set(match[1], getOptionValue(match).trim());
	}

	return options;
}

function parseButtonVariant(value?: string) {
	if (!value) return undefined;
	return buttonVariants.has(value as MarkdownButtonVariant)
		? (value as MarkdownButtonVariant)
		: undefined;
}

function parseButtonSize(value?: string) {
	if (!value) return undefined;
	return buttonSizes.has(value as MarkdownButtonSize)
		? (value as MarkdownButtonSize)
		: undefined;
}

function parseButtonTone(value?: string) {
	if (!value) return undefined;
	return buttonTones.has(value as MarkdownButtonTone)
		? (value as MarkdownButtonTone)
		: undefined;
}

function parseButtonDirective(line: string): MarkdownButtonDirective | null {
	const match = line.match(buttonDirectivePattern);
	if (!match) return null;

	const label = match[1]?.trim();
	const options = parseDirectiveOptions(match[2]);
	const href = options.get("href")?.trim();

	if (!label || !href) return null;

	return {
		label,
		href,
		size: parseButtonSize(options.get("size")),
		tone: parseButtonTone(options.get("tone")),
		variant: parseButtonVariant(options.get("variant")),
	};
}

function splitMarkdownByButtonDirectives(markdown: string): MarkdownSegment[] {
	const segments: MarkdownSegment[] = [];
	const markdownLines: string[] = [];

	const flushMarkdown = () => {
		if (markdownLines.length === 0) return;

		segments.push({
			type: "markdown",
			markdown: markdownLines.join("\n"),
		});
		markdownLines.length = 0;
	};

	for (const line of markdown.split(/\r?\n/)) {
		const button = parseButtonDirective(line);

		if (!button) {
			markdownLines.push(line);
			continue;
		}

		flushMarkdown();
		segments.push({ type: "button", button });
	}

	flushMarkdown();

	return segments;
}

const isMarkdownImageElement = (
	child: unknown,
): child is ReactElement<{ src?: unknown }> =>
	isValidElement<{ src?: unknown }>(child) &&
	typeof child.props.src === "string";

function MarkdownButton({ button }: { button: MarkdownButtonDirective }) {
	const external = isExternalHref(button.href);

	return (
		<div className="my-3 flex w-full max-w-full">
			<Button
				data-slot="markdown-button"
				href={button.href}
				size={button.size}
				tone={button.tone}
				variant={button.variant}
				target={external ? "_blank" : undefined}
				rel={external ? "noreferrer" : undefined}
			>
				{button.label}
			</Button>
		</div>
	);
}

function MarkdownImage({ alt, src }: { alt?: string; src?: string }) {
	if (!src) return null;

	return (
		<span className="my-2 block max-w-full overflow-hidden rounded-lg border border-border bg-surface shadow-[0_4px_18px_rgba(2,2,2,0.04)]">
			{/* biome-ignore lint/performance/noImgElement: Markdown image sources are content-owned and may be local fixtures or external URLs outside Next Image config. */}
			<img
				alt={alt ?? ""}
				className="h-auto max-h-[30rem] w-full object-cover"
				loading="lazy"
				src={src}
			/>
		</span>
	);
}

function createMarkdownComponents(
	resolveUserMention?: (memberId: string) => ReactNode,
): Components {
	return {
		a: ({ children, href }) => {
			const external = isExternalHref(href);

			return (
				<a
					className={clsx(
						"font-medium text-primary underline decoration-primary/35 underline-offset-4 transition-colors motion-interactive hover:text-primary-hover hover:decoration-primary/70",
						focusRing.visibleDefault,
					)}
					href={href}
					target={external ? "_blank" : undefined}
					rel={external ? "noreferrer" : undefined}
				>
					{children}
				</a>
			);
		},
		blockquote: ({ children }) => <blockquote>{children}</blockquote>,
		code: ({ children, className }) => (
			<code
				className={clsx(
					className,
					"rounded bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[0.92em] text-foreground [overflow-wrap:anywhere]",
				)}
			>
				{children}
			</code>
		),
		del: ({ children }) => (
			<del className="text-foreground/60 decoration-foreground/45">
				{children}
			</del>
		),
		em: ({ children }) => (
			<em className="italic text-foreground/75">{children}</em>
		),
		h1: ({ children }) => (
			<Text
				as="h1"
				variant="heading2xxl"
				interactive={false}
				className="min-w-0 max-w-full break-words leading-[1.05] [text-wrap:balance]"
			>
				{children}
			</Text>
		),
		h2: ({ children }) => (
			<Text
				as="h2"
				variant="headingXxl"
				interactive={false}
				className="mt-8 min-w-0 max-w-full break-words leading-[1.08] [text-wrap:balance]"
			>
				{children}
			</Text>
		),
		h3: ({ children }) => (
			<Text
				as="h3"
				variant="headingXl"
				interactive={false}
				className="mt-6 min-w-0 max-w-full break-words leading-[1.12] [text-wrap:balance]"
			>
				{children}
			</Text>
		),
		h4: ({ children }) => (
			<Text
				as="h4"
				variant="headingLg"
				interactive={false}
				className="mt-5 min-w-0 max-w-full break-words leading-tight"
			>
				{children}
			</Text>
		),
		h5: ({ children }) => (
			<Text
				as="h5"
				variant="headingMd"
				interactive={false}
				className="mt-4 min-w-0 max-w-full break-words leading-tight"
			>
				{children}
			</Text>
		),
		h6: ({ children }) => (
			<Text
				as="h6"
				variant="headingXs"
				interactive={false}
				className="mt-4 min-w-0 max-w-full break-words leading-tight text-foreground/65 uppercase"
			>
				{children}
			</Text>
		),
		hr: () => <hr className="border-border" />,
		img: ({ alt, src }) => (
			<MarkdownImage
				alt={typeof alt === "string" ? alt : undefined}
				src={typeof src === "string" ? src : undefined}
			/>
		),
		input: ({ checked, type }) => {
			if (type !== "checkbox") return null;

			return (
				<span className="markdown-task-indicator inline-flex shrink-0">
					<input
						aria-label={checked ? "Completed task" : "Incomplete task"}
						checked={Boolean(checked)}
						className="peer sr-only"
						disabled
						readOnly
						type="checkbox"
					/>
					<ChoiceIndicatorMulti
						checked={Boolean(checked)}
						className="pointer-events-none"
						size="compact"
					/>
				</span>
			);
		},
		li: ({ children, className }) => (
			<li
				className={clsx(
					"min-w-0 break-words [overflow-wrap:anywhere]",
					typeof className === "string" &&
						className.includes("task-list-item") &&
						"task-list-item",
					(typeof className !== "string" ||
						!className.includes("task-list-item")) &&
						"pl-1",
				)}
			>
				{children}
			</li>
		),
		ol: ({ children, start }) => (
			<ol
				className={clsx(
					textVariants({
						variant: "body",
						interactive: false,
					}),
					"max-w-full list-decimal pl-5",
				)}
				start={typeof start === "number" ? start : undefined}
			>
				{children}
			</ol>
		),
		p: ({ children }) => {
			const childArray = Children.toArray(children);
			const meaningfulChildren = childArray.filter(
				(child) => typeof child !== "string" || child.trim().length > 0,
			);

			if (
				meaningfulChildren.length > 0 &&
				meaningfulChildren.every(isMarkdownImageElement)
			) {
				return (
					<div
						className={clsx(
							"my-2 grid w-full max-w-full gap-3 [&_img]:my-0",
							meaningfulChildren.length > 1 && "sm:grid-cols-2",
						)}
					>
						{meaningfulChildren}
					</div>
				);
			}

			return (
				<Text
					as="p"
					variant="body"
					interactive={false}
					className="max-w-full break-words [overflow-wrap:anywhere]"
				>
					{children}
				</Text>
			);
		},
		pre: ({ children }) => <pre>{children}</pre>,
		strong: ({ children }) => (
			<strong className="font-semibold text-foreground/90">{children}</strong>
		),
		span: ({ children, node }) => {
			const memberId = getUserMentionId(node);
			if (!memberId) return <span>{children}</span>;
			return (
				resolveUserMention?.(memberId) ?? (
					<span className="font-medium text-muted-foreground">
						@Unknown member
					</span>
				)
			);
		},
		table: ({ children }) => (
			<div
				className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain"
				data-slot="markdown-table-scroll"
			>
				<table className="w-full border-collapse text-left">{children}</table>
			</div>
		),
		tbody: ({ children }) => <tbody>{children}</tbody>,
		td: ({ children, align }) => (
			<td
				className={clsx(
					textVariants({
						variant: "body",
						interactive: false,
					}),
					"border-border/65 border-b px-4 py-3 align-top",
					align === "center" && "text-center",
					align === "right" && "text-right",
				)}
			>
				{children}
			</td>
		),
		th: ({ children, align }) => (
			<th
				className={clsx(
					textVariants({
						variant: "bodyStrong",
						interactive: false,
					}),
					"border-foreground/25 border-b-2 px-4 py-3 text-foreground",
					align === "center" && "text-center",
					align === "right" && "text-right",
				)}
				scope="col"
			>
				{children}
			</th>
		),
		thead: ({ children }) => <thead>{children}</thead>,
		tr: ({ children }) => <tr>{children}</tr>,
		ul: ({ children }) => (
			<ul
				className={clsx(
					textVariants({
						variant: "body",
						interactive: false,
					}),
					"max-w-full list-disc pl-5",
				)}
			>
				{children}
			</ul>
		),
		u: ({ children }) => (
			<u className="decoration-foreground/60 underline-offset-2">{children}</u>
		),
	};
}

function MarkdownRendererRoot({
	className,
	density = "default",
	markdown,
	resolveUserMention,
	variant = "contained",
}: MarkdownRendererProps) {
	const segments = splitMarkdownByButtonDirectives(markdown);
	const markdownComponents = createMarkdownComponents(resolveUserMention);

	return (
		<div
			className={clsx(
				getMarkdownContentClassName(density),
				"w-full min-w-0",
				markdownRendererVariantClassNames[variant],
				className,
			)}
			data-slot="markdown-renderer"
			data-variant={variant}
		>
			{segments.map((segment, index) => {
				if (segment.type === "button") {
					return (
						<MarkdownButton
							// biome-ignore lint/suspicious/noArrayIndexKey: Segment order is derived from static markdown source.
							key={`button-${index}`}
							button={segment.button}
						/>
					);
				}

				if (segment.markdown.trim().length === 0) return null;

				return (
					<ReactMarkdown
						// biome-ignore lint/suspicious/noArrayIndexKey: Segment order is derived from static markdown source.
						key={`markdown-${index}`}
						remarkPlugins={[remarkGfm, remarkSafeUnderline, remarkUserMentions]}
						components={markdownComponents}
					>
						{segment.markdown}
					</ReactMarkdown>
				);
			})}
		</div>
	);
}

function MarkdownRendererSkeleton({
	className,
	density = "default",
	markdown,
	lineCount = 4,
	variant = "contained",
}: Omit<MarkdownRendererProps, "resolveUserMention"> & { lineCount?: number }) {
	return (
		<div className="relative min-w-0" data-slot="markdown-renderer-skeleton">
			<div aria-hidden className="invisible select-none">
				<MarkdownRendererRoot
					className={className}
					density={density}
					markdown={markdown}
					variant={variant}
				/>
			</div>
			<div
				aria-hidden
				className={clsx(
					getMarkdownContentClassName(density),
					"absolute inset-0 grid content-start overflow-hidden",
					markdownRendererVariantClassNames[variant],
					className,
				)}
			>
				{markdownSkeletonLineKeys.slice(0, lineCount).map((lineKey, index) => (
					<Skeleton
						className={clsx(
							"h-4 max-w-full rounded-sm",
							index === lineCount - 1 ? "w-2/3" : "w-full",
						)}
						key={lineKey}
					/>
				))}
			</div>
		</div>
	);
}

export const MarkdownRenderer = Object.assign(MarkdownRendererRoot, {
	Skeleton: MarkdownRendererSkeleton,
});
