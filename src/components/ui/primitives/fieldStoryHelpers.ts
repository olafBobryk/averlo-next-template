import { waitFor } from "storybook/test";

/**
 * Field messages fade in once their box fits them (presence `sequenced`).
 * Stories that run the accessibility scan after showing a message wait for
 * that fade, so the scan measures the settled colour, not a blend.
 */
export async function waitForFieldMessages(root: HTMLElement) {
	await waitFor(
		() => {
			for (const message of root.querySelectorAll<HTMLElement>(
				'[id$="-message"]',
			)) {
				for (
					let node: HTMLElement | null = message;
					node && node !== root;
					node = node.parentElement
				) {
					if (Number(getComputedStyle(node).opacity) < 1) {
						throw new Error("Field message is still fading in.");
					}
				}
			}
		},
		{ timeout: 3000 },
	);
}
