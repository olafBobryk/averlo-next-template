"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icons/Icon";
import { ErrorState } from "@/components/ui/misc/state/ErrorState";
import { Button } from "@/components/ui/primitives/Button";
import {
	Dropdown,
	type DropdownControlEntry,
} from "@/components/ui/primitives/dropdown";
import { InputFrame } from "@/components/ui/primitives/InputFrame";
import {
	type FileViewerSource,
	previewToolbarVisibility,
	safeFileUrl,
} from "./source";
import { useFileAsset } from "./useFileAsset";

export type FileViewerProps = { source: FileViewerSource; onClose: () => void };
const clamp = (n: number, min: number, max: number) =>
	Math.min(max, Math.max(min, n));

/** Caller owns placement; the viewer owns only file loading and viewing controls. */
export function FileViewer({ source, onClose }: FileViewerProps) {
	// A source change resets all viewport state, including interrupted PDF renders.
	return (
		<Viewer
			key={source.name + (source.url ?? "")}
			source={source}
			onClose={onClose}
		/>
	);
}
function Viewer({ source, onClose }: FileViewerProps) {
	const [attempt, setAttempt] = useState(0);
	const asset = useFileAsset(source, attempt);
	const viewport = useRef<HTMLElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });
	const [page, setPage] = useState(1);
	const [pageDraft, setPageDraft] = useState("1");
	useEffect(() => setPageDraft(String(page)), [page]);
	const [zoom, setZoom] = useState(1);
	const [fit, setFit] = useState(true);
	const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
	const [renderError, setRenderError] = useState("");
	const [rendering, setRendering] = useState(false);
	const previousRender = useRef<Promise<unknown>>(Promise.resolve());
	const pan = useRef<{
		x: number;
		y: number;
		left: number;
		top: number;
	} | null>(null);
	// biome-ignore lint/correctness/useExhaustiveDependencies: A changed source or retry resets viewport state.
	useEffect(() => {
		setPage(1);
		setPageDraft("1");
		setZoom(1);
		setFit(true);
		setImageSize({ width: 0, height: 0 });
		setRenderError("");
	}, [source, attempt]);
	useEffect(() => {
		const element = viewport.current;
		if (!element) return;
		const observer = new ResizeObserver(() =>
			setSize({ width: element.clientWidth, height: element.clientHeight }),
		);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);
	useEffect(() => {
		const pdf = asset?.pdf;
		const element = canvas.current;
		if (!pdf || !element || !size.width) return;
		let active = true;
		let task:
			| ReturnType<Awaited<ReturnType<typeof pdf.getPage>>["render"]>
			| undefined;
		setRendering(true);
		setRenderError("");
		const work = (async () => {
			await previousRender.current.catch(() => {});
			if (!active) return;
			const documentPage = await pdf.getPage(page);
			if (!active) return;
			const natural = documentPage.getViewport({ scale: 1 });
			const scale = fit
				? clamp((size.width - 48) / natural.width, 0.1, 5)
				: zoom;
			const view = documentPage.getViewport({ scale });
			const density = Math.min(window.devicePixelRatio || 1, 2);
			element.width = Math.ceil(view.width * density);
			element.height = Math.ceil(view.height * density);
			element.style.width = `${view.width}px`;
			element.style.height = `${view.height}px`;
			if (fit) setZoom(scale);
			task = documentPage.render({
				canvas: element,
				viewport: view,
				transform: [density, 0, 0, density, 0, 0],
			});
			await task.promise;
		})();
		previousRender.current = work;
		void work
			.catch(() => {
				if (active)
					setRenderError(
						"This page could not be displayed. Try opening the file again.",
					);
			})
			.finally(() => {
				if (active) setRendering(false);
			});
		return () => {
			active = false;
			task?.cancel();
		};
	}, [asset?.pdf, page, fit, zoom, size.width]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: Navigation resets scrolling even when the viewport stays mounted.
	useEffect(() => {
		viewport.current?.scrollTo(0, 0);
	}, [source, page]);
	const scale = asset?.pdf
		? zoom
		: fit && imageSize.width
			? clamp(
					Math.min(
						(size.width - 48) / imageSize.width,
						(size.height - 48) / imageSize.height,
						1,
					),
					0.1,
					5,
				)
			: zoom;
	const changeZoom = (factor: number) => {
		setZoom(clamp(scale * factor, 0.1, 5));
		setFit(false);
	};
	const error = asset?.error || renderError;
	const ready = !!asset?.url && !error;
	const pages = asset?.pdf?.numPages ?? 1;
	const visible = previewToolbarVisibility(size.width, !!asset?.pdf);
	let external: string | undefined;
	try {
		external = asset?.url || (source.url ? safeFileUrl(source.url) : undefined);
	} catch {
		/* Unsupported URL protocols never become links. */
	}
	const commitPage = () => {
		const value = Number(pageDraft);
		const next =
			pageDraft.trim() && Number.isFinite(value)
				? clamp(Math.trunc(value), 1, pages)
				: page;
		setPage(next);
		setPageDraft(String(next));
	};
	const pageInput = (small = false) => (
		<InputFrame
			size={small ? "xxs" : "xs"}
			variant={small ? "muted" : "default"}
			className="w-10 shrink-0"
		>
			<input
				aria-label="Page"
				className="h-full w-full min-w-0 [appearance:textfield] bg-transparent px-1 text-center text-sm tabular-nums text-foreground outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
				type="number"
				min={1}
				max={pages}
				value={pageDraft}
				onChange={(event) => setPageDraft(event.currentTarget.value)}
				onBlur={commitPage}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						event.preventDefault();
						commitPage();
					}
					if (event.key === "Escape") {
						event.preventDefault();
						setPageDraft(String(page));
					}
				}}
			/>
		</InputFrame>
	);
	const pageControls = (small = false) => (
		<div className="flex items-center gap-1">
			<Button
				variant="ghost"
				size={small ? "xs" : "compact"}
				shape="square"
				aria-label="Previous page"
				leadingIcon="caret-left"
				disabled={page <= 1}
				onClick={() => setPage(page - 1)}
			/>
			{pageInput(small)}
			<span className="text-xs">/ {pages}</span>
			<Button
				variant="ghost"
				size={small ? "xs" : "compact"}
				shape="square"
				aria-label="Next page"
				leadingIcon="caret-right"
				disabled={page >= pages}
				onClick={() => setPage(page + 1)}
			/>
		</div>
	);
	const zoomControls = (small = false) => (
		<div className="flex items-center gap-1">
			<Button
				variant="ghost"
				size={small ? "xs" : "compact"}
				shape="square"
				aria-label="Zoom out"
				leadingIcon="minus"
				disabled={!ready || scale <= 0.1}
				onClick={() => changeZoom(1 / 1.25)}
			/>
			<span
				className="w-10 text-center text-xs tabular-nums"
				role="status"
				aria-label="Zoom level"
			>
				{Math.round(scale * 100)}%
			</span>
			<Button
				variant="ghost"
				size={small ? "xs" : "compact"}
				shape="square"
				aria-label="Zoom in"
				leadingIcon="plus"
				disabled={!ready || scale >= 5}
				onClick={() => changeZoom(1.25)}
			/>
		</div>
	);
	const overflowOptions: DropdownControlEntry[] = [];
	if (asset?.pdf && !visible.pages)
		overflowOptions.push({
			kind: "control",
			id: "pages",
			ariaLabel: "Page navigation",
			content: (
				<>
					<span>Page</span>
					{pageControls(true)}
				</>
			),
		});
	if (!visible.zoom)
		overflowOptions.push({
			kind: "control",
			id: "zoom",
			ariaLabel: "Zoom controls",
			content: (
				<>
					<span>Zoom</span>
					{zoomControls(true)}
				</>
			),
		});
	if (!visible.fit)
		overflowOptions.push({
			id: "fit",
			label: "Fit to view",
			leadingIcon: <Icon name="expand" size="sm" />,
			disabled: !ready,
			closeOnSelect: false,
			onSelect: () => setFit(true),
			dividerBefore: overflowOptions.length ? "inset" : undefined,
		});
	if (!visible.external && external)
		overflowOptions.push({
			id: "external",
			label: "Open in new tab",
			leadingIcon: <Icon name="external-link" size="sm" />,
			href: external,
			target: "_blank",
			rel: "noopener noreferrer",
			dividerBefore:
				visible.fit && overflowOptions.length ? "inset" : undefined,
		});

	return (
		<section
			aria-label={`File preview: ${source.name}`}
			className="flex h-full min-h-0 min-w-0 flex-col bg-surface text-foreground"
		>
			<header
				className="flex h-12 shrink-0 items-center gap-1 bg-surface px-3"
				data-file-viewer-toolbar
			>
				<span
					className="min-w-[72px] flex-1 truncate text-sm"
					title={source.name}
				>
					{source.name}
				</span>
				{asset?.pdf && visible.pages && pageControls()}
				{visible.zoom && zoomControls()}
				{visible.fit && (
					<Button
						variant="bare"
						size="compact"
						shape="square"
						aria-label="Fit to view"
						leadingIcon="expand"
						disabled={!ready}
						onClick={() => setFit(true)}
					/>
				)}
				{visible.external && external && (
					<Button
						variant="bare"
						size="compact"
						shape="square"
						aria-label="Open in new tab"
						leadingIcon="external-link"
						href={external}
						target="_blank"
						rel="noopener noreferrer"
					/>
				)}
				{overflowOptions.length > 0 && (
					<Dropdown.Menu
						align="end"
						ariaLabel="More preview controls"
						density="compact"
						menuWidth={232}
						pinOnClick
						triggerButtonProps={{ size: "compact", shape: "square" }}
						triggerContent={<Icon name="ellipsis" size="sm" />}
						options={overflowOptions}
					/>
				)}
				<Button
					variant="bare"
					size="compact"
					shape="square"
					aria-label="Close file preview"
					leadingIcon="cross"
					onClick={onClose}
				/>
			</header>
			<section
				ref={viewport}
				// biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users scroll the document region.
				tabIndex={0}
				aria-label="File content"
				aria-busy={!asset || rendering}
				className="min-h-0 flex-1 overflow-auto overscroll-contain bg-background sm:rounded-r-lg lg:rounded-r-xl outline-offset-[-2px]"
				onPointerDown={(event) => {
					if (
						event.button !== 0 ||
						!ready ||
						(event.target as HTMLElement).closest("button,input,a")
					)
						return;
					pan.current = {
						x: event.clientX,
						y: event.clientY,
						left: event.currentTarget.scrollLeft,
						top: event.currentTarget.scrollTop,
					};
					event.currentTarget.setPointerCapture(event.pointerId);
				}}
				onPointerMove={(event) => {
					if (!pan.current) return;
					event.currentTarget.scrollLeft =
						pan.current.left - (event.clientX - pan.current.x);
					event.currentTarget.scrollTop =
						pan.current.top - (event.clientY - pan.current.y);
				}}
				onPointerUp={() => {
					pan.current = null;
				}}
				onPointerCancel={() => {
					pan.current = null;
				}}
			>
				{error ? (
					<div role="alert" className="p-6">
						<ErrorState
							title="Preview unavailable"
							description={error}
							onAction={() => setAttempt((value) => value + 1)}
							actionLabel="Try again"
						/>
					</div>
				) : !asset ? (
					<div role="status" className="p-6 text-sm text-muted-foreground">
						Opening preview…
					</div>
				) : (
					<div
						className="flex min-h-full min-w-full w-max items-center justify-center p-6"
						style={{ cursor: "grab", touchAction: "pan-x pan-y" }}
					>
						{asset.pdf ? (
							<canvas
								ref={canvas}
								role="img"
								aria-label={`${source.name}, page ${page} of ${pages}`}
								className="block shrink-0 bg-white"
							/>
						) : (
							// biome-ignore lint/performance/noImgElement: Original blob pixels are the inspected file, not a remotely optimized image.
							<img
								src={asset.url}
								alt={source.name}
								draggable={false}
								className="block max-w-none shrink-0"
								style={
									imageSize.width
										? {
												width: imageSize.width * scale,
												height: imageSize.height * scale,
											}
										: { maxWidth: "100%" }
								}
								onLoad={(event) =>
									setImageSize({
										width: event.currentTarget.naturalWidth,
										height: event.currentTarget.naturalHeight,
									})
								}
								onError={() =>
									setRenderError(
										"This image could not be displayed. Try opening the file again.",
									)
								}
							/>
						)}
					</div>
				)}
			</section>
		</section>
	);
}
