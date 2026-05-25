"use client";

import * as React from "react";

export function hasMotionDisabledSearchParam() {
	if (typeof window === "undefined") return false;

	const params = new URLSearchParams(window.location.search);
	const motion = params.get("motion")?.toLowerCase();
	const reveal = params.get("reveal")?.toLowerCase();

	return (
		motion === "off" ||
		motion === "false" ||
		reveal === "off" ||
		reveal === "false"
	);
}

export function useMotionDisableOverride() {
	const [disabled, setDisabled] = React.useState(false);

	React.useEffect(() => {
		const update = () => setDisabled(hasMotionDisabledSearchParam());
		update();
		window.addEventListener("popstate", update);
		return () => window.removeEventListener("popstate", update);
	}, []);

	return disabled;
}
