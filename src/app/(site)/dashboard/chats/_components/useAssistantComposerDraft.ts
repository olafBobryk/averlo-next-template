"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useDashboardAuth } from "../../_components/providers/DashboardAuthProvider";

// Session-local, account-scoped drafts survive the route's loading boundary.
const drafts = new Map<string, string>();
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
function write(key: string, value: string) {
	if (value) drafts.set(key, value);
	else drafts.delete(key);
	for (const listener of listeners) listener();
}

export function useAssistantComposerDraft(threadId: string) {
	const { organization, user } = useDashboardAuth();
	const scope = `${organization.id}:${user?.id ?? "signed-out"}:`;
	const key = `${scope}${threadId}`;
	const getSnapshot = useCallback(() => drafts.get(key) ?? "", [key]);
	const text = useSyncExternalStore(subscribe, getSnapshot, () => "");
	const setText = useCallback((value: string) => write(key, value), [key]);
	const transferTo = useCallback(
		(id: string) => {
			write(`${scope}${id}`, drafts.get(key) ?? "");
			write(key, "");
		},
		[key, scope],
	);
	return { text, setText, transferTo };
}
