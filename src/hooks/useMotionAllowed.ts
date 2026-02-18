// hooks/useMotionAllowed.ts
"use client";

import { useEffect, useState } from "react";
import { useSettingsContext } from "@/components/ui/foundations/settingsContext";

export function useMotionAllowed(disableWhenReduced: boolean) {
	const settings = useSettingsContext();
	const forcedDisabled = settings?.motionDisabled === true;

	// Start as allowed to avoid skipping animations before the first effect runs.
	const [allowed, setAllowed] = useState(true);

	useEffect(() => {
		if (forcedDisabled) {
			setAllowed(false);
			return;
		}

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
	}, [disableWhenReduced, forcedDisabled]);

	return forcedDisabled ? false : allowed;
}
