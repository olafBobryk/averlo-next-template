"use client";

import { useEffect, useState } from "react";

const indexKey = "__averloHistoryIndex";

/** Track browser traversal while preserving Next's router history state. */
export function useDashboardHistory() {
	const [availability, setAvailability] = useState({
		back: false,
		forward: false,
	});
	useEffect(() => {
		const history = window.history;
		const originalPush = history.pushState;
		const originalReplace = history.replaceState;
		let index = history.state?.[indexKey] ?? history.length - 1;
		let lastIndex = index;
		const publish = () =>
			setAvailability({ back: index > 0, forward: index < lastIndex });
		originalReplace.call(history, { ...history.state, [indexKey]: index }, "");
		const push: History["pushState"] = (state, unused, url) => {
			originalPush.call(
				history,
				{ ...state, [indexKey]: index + 1 },
				unused,
				url,
			);
			index += 1;
			lastIndex = index;
			publish();
		};
		const replace: History["replaceState"] = (state, unused, url) => {
			originalReplace.call(
				history,
				{ ...state, [indexKey]: index },
				unused,
				url,
			);
		};
		const onPop = (event: PopStateEvent) => {
			index = event.state?.[indexKey] ?? Math.max(0, index - 1);
			publish();
		};
		history.pushState = push;
		history.replaceState = replace;
		window.addEventListener("popstate", onPop);
		publish();
		return () => {
			if (history.pushState === push) history.pushState = originalPush;
			if (history.replaceState === replace)
				history.replaceState = originalReplace;
			window.removeEventListener("popstate", onPop);
		};
	}, []);
	return availability;
}
