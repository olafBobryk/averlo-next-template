"use client";

import * as React from "react";

function getIsTouchScreen() {
	if (typeof window === "undefined") return false;

	return (
		window.matchMedia("(hover: none), (pointer: coarse)").matches ||
		navigator.maxTouchPoints > 0
	);
}

export function useTouchScreen() {
	const [isTouchScreen, setIsTouchScreen] = React.useState(getIsTouchScreen);

	React.useEffect(() => {
		const media = window.matchMedia("(hover: none), (pointer: coarse)");
		const update = () => setIsTouchScreen(getIsTouchScreen());

		update();
		media.addEventListener("change", update);

		return () => media.removeEventListener("change", update);
	}, []);

	return isTouchScreen;
}
