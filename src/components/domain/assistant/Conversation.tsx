"use client";

import * as React from "react";

export function Conversation({
	children,
	header,
}: {
	children: React.ReactNode;
	header?: React.ReactNode;
}) {
	const viewportRef = React.useRef<HTMLDivElement>(null);
	const [awayFromBottom, setAwayFromBottom] = React.useState(false);
	const scrollToBottom = React.useCallback(
		(behavior: ScrollBehavior = "smooth") => {
			viewportRef.current?.scrollTo({
				behavior:
					window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
					document.documentElement.dataset.motion === "off" ||
					new URLSearchParams(window.location.search).get("motion") === "off"
						? "auto"
						: behavior,
				top: viewportRef.current.scrollHeight,
			});
		},
		[],
	);
	React.useEffect(() => {
		const viewport = viewportRef.current;
		if (!viewport) return;
		if (!awayFromBottom) scrollToBottom("auto");
		const observer = new MutationObserver(() => {
			if (!awayFromBottom) scrollToBottom("auto");
		});
		observer.observe(viewport, {
			characterData: true,
			childList: true,
			subtree: true,
		});
		const resize = new ResizeObserver(() => {
			if (!awayFromBottom) scrollToBottom("auto");
		});
		resize.observe(viewport);
		if (viewport.firstElementChild) resize.observe(viewport.firstElementChild);
		return () => {
			observer.disconnect();
			resize.disconnect();
		};
	}, [awayFromBottom, scrollToBottom]);
	return (
		<div className="relative flex min-h-0 flex-1 flex-col">
			{header ? <div className="z-10 shrink-0">{header}</div> : null}
			<div
				className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-6"
				onScroll={(event) => {
					const node = event.currentTarget;
					setAwayFromBottom(
						node.scrollHeight - node.scrollTop - node.clientHeight > 120,
					);
				}}
				ref={viewportRef}
			>
				<div className="grid gap-7 pb-[57px]">{children}</div>
			</div>
		</div>
	);
}
