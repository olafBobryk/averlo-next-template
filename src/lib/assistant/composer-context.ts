import type {
	AssistantContextItem,
	AssistantContextReference,
} from "./contracts";

/** Only the word at the caret opens the picker, never an embedded URL/email. */
export function composerTrigger(text: string, cursor: number) {
	const match = /(?:^|\s)([@/])([^\s]*)$/.exec(text.slice(0, cursor));
	return match
		? {
				kind: match[1] === "/" ? ("command" as const) : ("context" as const),
				query: match[2],
				start: cursor - match[2].length - 1,
				end: cursor,
			}
		: null;
}

export const composerCommands = [
	{
		id: "help",
		label: "/help",
		description: "Show composer help and shortcuts",
	},
	{ id: "new", label: "/new", description: "Start a new conversation" },
] as const;
export type ComposerCommand = (typeof composerCommands)[number]["id"];
export function completeCommand(text: string): ComposerCommand | null {
	return (
		composerCommands.find((command) => command.label === text.trim())?.id ??
		null
	);
}

// Source-style subsequence ranking: consecutive letters and word boundaries win.
export function fuzzyScore(query: string, value: string) {
	const pattern = query.toLowerCase();
	const text = value.toLowerCase();
	let cursor = 0;
	let score = 0;
	let consecutive = 0;
	for (let i = 0; i < text.length && cursor < pattern.length; i++) {
		if (text[i] === pattern[cursor]) {
			cursor++;
			consecutive++;
			score += consecutive * 3;
			if (i === 0 || /[\s/_.-]/.test(text[i - 1])) score += 10;
		} else consecutive = 0;
	}
	return cursor === pattern.length ? score : -1;
}
export function rankContextItems<
	T extends { label: string; description: string },
>(items: T[], query: string): T[] {
	return items
		.map((item) => ({
			item,
			score: Math.max(
				fuzzyScore(query, item.label),
				fuzzyScore(query, item.description),
			),
		}))
		.filter(({ score }) => score >= 0)
		.sort(
			(a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label),
		)
		.map(({ item }) => item);
}

/** Shift ranges around one edit; any edit inside a selected label unbinds it. */
export function reconcileReferences(
	before: string,
	after: string,
	references: AssistantContextReference[],
): AssistantContextReference[] {
	if (before === after) return references;
	let start = 0;
	while (
		start < before.length &&
		start < after.length &&
		before[start] === after[start]
	)
		start++;
	let oldEnd = before.length;
	let newEnd = after.length;
	while (
		oldEnd > start &&
		newEnd > start &&
		before[oldEnd - 1] === after[newEnd - 1]
	) {
		oldEnd--;
		newEnd--;
	}
	const delta = newEnd - oldEnd;
	return references
		.flatMap((ref) => {
			if (ref.end <= start) return [ref];
			if (ref.start >= oldEnd)
				return [{ ...ref, start: ref.start + delta, end: ref.end + delta }];
			return [];
		})
		.filter((ref) => after.slice(ref.start, ref.end) === ref.text);
}
export function insertContext(
	text: string,
	start: number,
	end: number,
	item: AssistantContextItem,
	references: AssistantContextReference[],
) {
	const label = `@${item.label}`;
	const next = text.slice(0, start) + label + " " + text.slice(end);
	return {
		text: next,
		cursor: start + label.length + 1,
		references: [
			...reconcileReferences(text, next, references),
			{
				kind: item.kind,
				id: item.id,
				text: label,
				start,
				end: start + label.length,
			},
		].sort((a, b) => a.start - b.start),
	};
}
export function validateReferences(
	value: unknown,
	text: string,
): AssistantContextReference[] {
	if (value === undefined) return [];
	if (!Array.isArray(value) || value.length > 20)
		throw new Error("Select up to 20 context references.");
	let previousEnd = 0;
	return value.map((ref) => {
		if (
			!ref ||
			!["record", "connection", "file"].includes(ref.kind) ||
			typeof ref.id !== "string" ||
			!ref.id ||
			ref.id.length > 200 ||
			typeof ref.text !== "string" ||
			!Number.isInteger(ref.start) ||
			!Number.isInteger(ref.end) ||
			ref.start < previousEnd ||
			ref.end <= ref.start ||
			ref.end > text.length ||
			text.slice(ref.start, ref.end) !== ref.text
		)
			throw new Error(
				"Context reference changed. Remove it and select it again.",
			);
		previousEnd = ref.end;
		return {
			kind: ref.kind,
			id: ref.id,
			text: ref.text,
			start: ref.start,
			end: ref.end,
		};
	});
}
