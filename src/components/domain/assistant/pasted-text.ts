/** Preserve clipboard text verbatim; count Unicode code points, not UTF-16 halves. */
export const PASTED_TEXT_ATTACHMENT_THRESHOLD = 2000;
export function shouldAttachPastedText(text: string) {
	return Array.from(text).length >= PASTED_TEXT_ATTACHMENT_THRESHOLD;
}
export function pastedTextFile(text: string) {
	return new File(
		[text],
		`Pasted text ${crypto.randomUUID().slice(0, 8)}.txt`,
		{ type: "text/plain;charset=utf-8" },
	);
}
