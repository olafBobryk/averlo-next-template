const markdownUserMentionPattern =
	/@\[user:([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})\]/g;

export type MarkdownUserMentionSegment =
	| { type: "text"; value: string }
	| { memberId: string; type: "mention" };

export function createMarkdownUserMention(memberId: string) {
	return `@[user:${memberId}]`;
}

export function extractMarkdownUserMentionIds(markdown: string) {
	return [...markdown.matchAll(markdownUserMentionPattern)].map((match) =>
		match[1].toLowerCase(),
	);
}

export function splitMarkdownUserMentions(
	value: string,
): MarkdownUserMentionSegment[] {
	const segments: MarkdownUserMentionSegment[] = [];
	let cursor = 0;

	for (const match of value.matchAll(markdownUserMentionPattern)) {
		const index = match.index;
		const memberId = match[1];
		if (index > cursor) {
			segments.push({ type: "text", value: value.slice(cursor, index) });
		}
		segments.push({ memberId: memberId.toLowerCase(), type: "mention" });
		cursor = index + match[0].length;
	}

	if (cursor < value.length) {
		segments.push({ type: "text", value: value.slice(cursor) });
	}

	return segments;
}
