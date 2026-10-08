"use client";

import {
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	FilePreviewProvider,
	type FilePreviewRequest,
} from "@/components/ui/input/files/previewHandler";
import { ModalCard } from "@/components/ui/overlays/modal/ModalCard";
import { ModalShell } from "@/components/ui/overlays/modal/ModalShell";
import { FileViewer } from "./FileViewer";

export function FileViewerLayout({
	children,
	resetKey,
}: {
	children: ReactNode;
	resetKey?: string;
}) {
	const root = useRef<HTMLDivElement>(null);
	const opener = useRef<HTMLElement | null>(null);
	const [entry, setEntry] = useState<{
		file: FilePreviewRequest;
		id: number;
	} | null>(null);
	const sequence = useRef(0);
	const [available, setAvailable] = useState(0);
	const [width, setWidth] = useState(440);
	const close = useCallback(() => {
		setEntry(null);
		if (opener.current?.isConnected) opener.current.focus();
	}, []);
	const open = useCallback((file: FilePreviewRequest) => {
		opener.current =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;
		setEntry({ file, id: ++sequence.current });
	}, []);
	useEffect(() => {
		const element = root.current;
		if (!element) return;
		const observer = new ResizeObserver(() =>
			setAvailable(element.clientWidth),
		);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);
	// biome-ignore lint/correctness/useExhaustiveDependencies: Route and actor identity invalidate the active file.
	useEffect(() => {
		setEntry(null);
	}, [resetKey]);
	const narrow = available < 768;
	const max = Math.max(240, available - 300);
	const actualWidth = Math.max(240, Math.min(width, max));
	const resize = (value: number) =>
		setWidth(Math.max(240, Math.min(value, max)));
	const viewer = entry ? (
		<FileViewer key={entry.id} source={entry.file} onClose={close} />
	) : null;
	return (
		<FilePreviewProvider onPreview={open}>
			<div
				ref={root}
				className="flex h-full min-h-0 min-w-0 flex-1 overflow-hidden"
				data-file-viewer-layout
			>
				<div
					className={`min-h-0 min-w-0 flex-1 ${entry && !narrow ? "[&_[data-dashboard-workspace]]:rounded-r-none!" : ""}`}
				>
					{children}
				</div>
				{entry && !narrow && (
					<div
						className="relative h-full min-h-0 shrink-0"
						style={{ width: actualWidth }}
					>
						{/* biome-ignore lint/a11y/useSemanticElements: A focusable adjustable separator is not a static rule. */}
						<div
							role="separator"
							aria-label="Resize file preview"
							aria-orientation="vertical"
							aria-valuenow={Math.round(actualWidth)}
							aria-valuemin={240}
							aria-valuemax={Math.round(max)}
							tabIndex={0}
							className="absolute inset-y-0 left-0 z-10 w-2 touch-none cursor-col-resize border-l border-border focus-visible:border-ring focus-visible:outline-none"
							onKeyDown={(event) => {
								if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
									event.preventDefault();
									resize(actualWidth + (event.key === "ArrowLeft" ? 24 : -24));
								}
							}}
							onPointerDown={(event) => {
								event.currentTarget.focus();
								event.preventDefault();
								event.currentTarget.setPointerCapture(event.pointerId);
							}}
							onPointerMove={(event) => {
								if (
									event.currentTarget.hasPointerCapture(event.pointerId) &&
									root.current
								)
									resize(
										root.current.getBoundingClientRect().right - event.clientX,
									);
							}}
							onPointerUp={(event) =>
								event.currentTarget.releasePointerCapture(event.pointerId)
							}
						/>
						{viewer}
					</div>
				)}
				{entry && narrow && (
					<ModalShell
						placement="fullscreen"
						ariaLabel={`File preview: ${entry.file.name}`}
						onClose={close}
					>
						<ModalCard className="h-full! max-h-none! max-w-none! rounded-none!">
							{viewer}
						</ModalCard>
					</ModalShell>
				)}
			</div>
		</FilePreviewProvider>
	);
}
