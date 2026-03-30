"use client";

import { useEffect, useState } from "react";
import { isAppReady, subscribeAppReady } from "@/lib/appReadySignal";

/**
 * Returns true once the initial loading screen has fully finished exiting.
 * Immediately returns true on any render after that (module-level singleton).
 */
export function useAppReady(): boolean {
	const [ready, setReady] = useState(isAppReady);
	useEffect(() => subscribeAppReady(() => setReady(true)), []);
	return ready;
}
