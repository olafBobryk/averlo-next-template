"use client";

import * as React from "react";

const darkSchemeQuery = "(prefers-color-scheme: dark)";

export function AuthAppearance() {
	React.useEffect(() => {
		const media = window.matchMedia(darkSchemeQuery);
		const { body } = document;
		const hadDarkClass = body.classList.contains("dark");
		const previousColorScheme = body.style.colorScheme;
		const apply = () => {
			body.classList.toggle("dark", media.matches);
			body.style.colorScheme = media.matches ? "dark" : "light";
		};
		apply();
		media.addEventListener("change", apply);
		return () => {
			media.removeEventListener("change", apply);
			body.classList.toggle("dark", hadDarkClass);
			body.style.colorScheme = previousColorScheme;
		};
	}, []);

	return null;
}
