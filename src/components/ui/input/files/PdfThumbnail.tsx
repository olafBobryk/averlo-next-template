"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFileAsset } from "@/hooks/useFileAsset";
import type { FilePreviewItem } from "./FilePreview";

/** Private first-page thumbnail; never delegates rendering to a browser PDF plug-in. */
export function PdfThumbnail({
	item,
	name,
	onPreviewLoad,
}: {
	item: FilePreviewItem;
	name: string;
	onPreviewLoad: (canvas: HTMLCanvasElement) => void;
}) {
	const file = "file" in item ? item.file : undefined;
	const resolveUrl = "resolveUrl" in item ? item.resolveUrl : undefined;
	const source = useMemo(
		() => ({ name, type: "application/pdf", url: item.url, file, resolveUrl }),
		[name, item.url, file, resolveUrl],
	);
	const asset = useFileAsset(source, 0);
	const canvas = useRef<HTMLCanvasElement>(null);
	const [rendered, setRendered] = useState(false);
	const [failed, setFailed] = useState(false);
	const previous = useRef<Promise<unknown>>(Promise.resolve());
	useEffect(() => {
		setRendered(false);
		setFailed(false);
		const pdf = asset?.pdf;
		const element = canvas.current;
		if (!pdf || !element) return;
		let active = true;
		let task:
			| ReturnType<Awaited<ReturnType<typeof pdf.getPage>>["render"]>
			| undefined;
		const work = (async () => {
			await previous.current.catch(() => {});
			if (!active) return;
			const page = await pdf.getPage(1);
			if (!active) return;
			const natural = page.getViewport({ scale: 1 });
			const view = page.getViewport({ scale: 360 / natural.width });
			element.width = Math.ceil(view.width);
			element.height = Math.ceil(view.height);
			task = page.render({ canvas: element, viewport: view });
			await task.promise;
			if (active) {
				setRendered(true);
				onPreviewLoad(element);
			}
		})();
		previous.current = work;
		void work.catch(() => {
			if (active) setFailed(true);
		});
		return () => {
			active = false;
			task?.cancel();
		};
	}, [asset?.pdf, onPreviewLoad]);
	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="relative min-h-0 flex-1 overflow-hidden px-2 pt-2">
				<canvas
					ref={canvas}
					role="img"
					aria-label={`${name}, first page`}
					className={`block h-auto w-full bg-white ${rendered ? "" : "invisible"}`}
				/>
				{!rendered && (
					<span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
						{asset?.error || failed
							? "PDF · Preview unavailable"
							: "Loading preview…"}
					</span>
				)}
			</div>
			<span
				className="block shrink-0 truncate px-2 py-1 text-xs text-card-foreground"
				title={name}
			>
				{name}
			</span>
		</div>
	);
}
