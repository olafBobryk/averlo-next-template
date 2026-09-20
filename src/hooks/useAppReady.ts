"use client";

import { useEffect, useState } from "react";
import {
	isAppReady,
	isAppVisible,
	subscribeAppReady,
	subscribeAppVisible,
} from "@/lib/appReadySignal";

/**
 * Returns true when the initial loading screen begins exiting, so deferred
 * entrances can establish their initial state before it becomes translucent.
 * Immediately returns true on any render after that (module-level singleton).
 */
export function useAppReady(): boolean {
	const [ready, setReady] = useState(isAppReady);
	useEffect(() => subscribeAppReady(() => setReady(true)), []);
	return ready;
}

/**
 * Returns true only once the loading screen is fully gone. Expensive,
 * top-of-page motion can wait for this without delaying ordinary entrances
 * that intentionally begin beneath the exiting overlay.
 */
export function useAppVisible(): boolean {
	const [visible, setVisible] = useState(isAppVisible);
	useEffect(() => subscribeAppVisible(() => setVisible(true)), []);
	return visible;
}
