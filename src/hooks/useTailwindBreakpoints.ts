"use client";

import { useEffect, useState } from "react";

function useBreakpointQuery(query: string) {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia(query);
		const updateMatches = () => setMatches(mediaQuery.matches);

		updateMatches();
		mediaQuery.addEventListener("change", updateMatches);

		return () => {
			mediaQuery.removeEventListener("change", updateMatches);
		};
	}, [query]);

	return matches;
}

/**
 * Tailwind default breakpoints:
 * sm: 640px
 * md: 768px
 * lg: 1024px
 * xl: 1280px
 * 2xl: 1536px
 *
 * Note: These booleans are computed on the client.
 * Import and call this hook inside client components.
 */
export function useTailwindBreakpoints() {
	// "Only" ranges (non-overlapping)
	const isXs = useBreakpointQuery("(max-width: 639.98px)"); // < 640
	const isSm = useBreakpointQuery(
		"(min-width: 640px) and (max-width: 767.98px)",
	);
	const isMd = useBreakpointQuery(
		"(min-width: 768px) and (max-width: 1023.98px)",
	);
	const isLg = useBreakpointQuery(
		"(min-width: 1024px) and (max-width: 1279.98px)",
	);
	const isXl = useBreakpointQuery(
		"(min-width: 1280px) and (max-width: 1535.98px)",
	);
	const is2xl = useBreakpointQuery("(min-width: 1536px)");

	// "Up" helpers (inclusive)
	const isSmUp = useBreakpointQuery("(min-width: 640px)");
	const isMdUp = useBreakpointQuery("(min-width: 768px)");
	const isLgUp = useBreakpointQuery("(min-width: 1024px)");
	const isXlUp = useBreakpointQuery("(min-width: 1280px)");
	const is2xlUp = useBreakpointQuery("(min-width: 1536px)");

	// "Down" helpers (inclusive)
	const isSmDown = useBreakpointQuery("(max-width: 639.98px)");
	const isMdDown = useBreakpointQuery("(max-width: 767.98px)");
	const isLgDown = useBreakpointQuery("(max-width: 1023.98px)");
	const isXlDown = useBreakpointQuery("(max-width: 1279.98px)");
	const is2xlDown = useBreakpointQuery("(max-width: 1535.98px)");

	return {
		// only
		isXs,
		isSm,
		isMd,
		isLg,
		isXl,
		is2xl,

		// up
		isSmUp,
		isMdUp,
		isLgUp,
		isXlUp,
		is2xlUp,

		// down
		isSmDown,
		isMdDown,
		isLgDown,
		isXlDown,
		is2xlDown,
	};
}

/**
 * Convenience single-breakpoint hooks if you prefer importing just one.
 * Example:
 *   const isMd = useIsMd();
 */
export const useIsXs = () => useTailwindBreakpoints().isXs;
export const useIsSm = () => useTailwindBreakpoints().isSm;
export const useIsMd = () => useTailwindBreakpoints().isMd;
export const useIsLg = () => useTailwindBreakpoints().isLg;
export const useIsXl = () => useTailwindBreakpoints().isXl;
export const useIs2xl = () => useTailwindBreakpoints().is2xl;

// Up variants
export const useIsSmUp = () => useTailwindBreakpoints().isSmUp;
export const useIsMdUp = () => useTailwindBreakpoints().isMdUp;
export const useIsLgUp = () => useTailwindBreakpoints().isLgUp;
export const useIsXlUp = () => useTailwindBreakpoints().isXlUp;
export const useIs2xlUp = () => useTailwindBreakpoints().is2xlUp;

// Down variants
export const useIsSmDown = () => useTailwindBreakpoints().isSmDown;
export const useIsMdDown = () => useTailwindBreakpoints().isMdDown;
export const useIsLgDown = () => useTailwindBreakpoints().isLgDown;
export const useIsXlDown = () => useTailwindBreakpoints().isXlDown;
export const useIs2xlDown = () => useTailwindBreakpoints().is2xlDown;
