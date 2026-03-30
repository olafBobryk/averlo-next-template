// Lightweight module-level singleton that flips once the initial loading screen
// has fully finished its exit transition. Components that should defer their
// first entrance animation subscribe here. Stays true permanently after first
// fire so client-side navigation is never blocked.

let ready = false;
const subscribers = new Set<() => void>();

export function markAppReady(): void {
	if (ready) return;
	ready = true;
	for (const fn of subscribers) fn();
	subscribers.clear();
}

export function isAppReady(): boolean {
	return ready;
}

export function subscribeAppReady(fn: () => void): () => void {
	if (ready) {
		fn();
		return () => {};
	}
	subscribers.add(fn);
	return () => {
		subscribers.delete(fn);
	};
}
