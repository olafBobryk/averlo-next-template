/** Keep ordinary page input smooth; leave owned gestures and browser zoom alone. */
export function shouldHandlePageScroll(event: {
	defaultPrevented: boolean;
	ctrlKey?: boolean;
	metaKey?: boolean;
}) {
	return !event.defaultPrevented && !event.ctrlKey && !event.metaKey;
}
