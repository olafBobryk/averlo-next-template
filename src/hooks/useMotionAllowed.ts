// hooks/useMotionAllowed.ts
"use client";

import { useEffect, useState } from "react";

export function useMotionAllowed(disableWhenReduced: boolean) {
	// Start as allowed to avoid skipping animations before the first effect runs.
	const [allowed, setAllowed] = useState(true);

	useEffect(() => {
		if (!disableWhenReduced) {
			setAllowed(true);
			return;
		}

		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const connection = (navigator as any)?.connection;

		const compute = () => {
			const prefersReduce = media.matches;
			const saveData = Boolean(connection?.saveData);
			setAllowed(!(prefersReduce || saveData));
		};

		compute();
		media.addEventListener("change", compute);
		connection?.addEventListener?.("change", compute);

		return () => {
			media.removeEventListener("change", compute);
			connection?.removeEventListener?.("change", compute);
		};
	}, [disableWhenReduced]);

	return allowed;
}
