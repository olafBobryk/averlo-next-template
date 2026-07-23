export type MarkdownContentDensity = "compact" | "default";

export function getMarkdownContentClassName(density: MarkdownContentDensity) {
	return `markdown-content markdown-content--${density}`;
}
