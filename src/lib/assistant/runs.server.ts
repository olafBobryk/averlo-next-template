import "server-only";

import { type AssistantActor, assistantLimits } from "./contracts";

type RunControl = {
	threadId: string;
	controller: AbortController;
	done: Promise<void>;
	resolve: () => void;
};
type RunState = {
	active: Set<string>;
	starts: Map<string, number[]>;
	controls?: Map<string, RunControl>;
};
declare global {
	var __averloAssistantRunState: RunState | undefined;
}

function state() {
	globalThis.__averloAssistantRunState ??= {
		active: new Set(),
		starts: new Map(),
	};
	return globalThis.__averloAssistantRunState;
}

function key(actor: AssistantActor) {
	return `${actor.organizationId}:${actor.userId}`;
}

export function startAssistantRun(
	actor: AssistantActor,
	options?: { threadId: string; controller: AbortController },
) {
	const runState = state();
	const actorKey = key(actor);
	if (runState.active.has(actorKey)) {
		throw new Error("Another Assistant response is already running.");
	}
	const now = Date.now();
	const starts = (runState.starts.get(actorKey) ?? []).filter(
		(startedAt) => now - startedAt < 86_400_000,
	);
	if (
		starts.filter((startedAt) => now - startedAt < 60_000).length >=
		assistantLimits.runsPerMinute
	) {
		throw new Error("Assistant minute limit reached. Try again shortly.");
	}
	if (starts.length >= assistantLimits.runsPerDay) {
		throw new Error("Assistant daily limit reached.");
	}
	starts.push(now);
	runState.starts.set(actorKey, starts);
	runState.active.add(actorKey);
	let control: RunControl | undefined;
	if (options) {
		let resolve!: () => void;
		const done = new Promise<void>((complete) => {
			resolve = complete;
		});
		control = { ...options, done, resolve };
		runState.controls ??= new Map();
		runState.controls.set(actorKey, control);
	}
	return () => {
		runState.active.delete(actorKey);
		if (control && runState.controls?.get(actorKey) === control) {
			runState.controls.delete(actorKey);
			control.resolve();
		}
	};
}

export async function cancelAssistantRun(
	actor: AssistantActor,
	threadId: string,
) {
	const control = state().controls?.get(key(actor));
	if (!control || control.threadId !== threadId) return;
	control.controller.abort();
	await control.done;
}
export function hasAssistantRun(actor: AssistantActor) {
	return state().active.has(key(actor));
}
