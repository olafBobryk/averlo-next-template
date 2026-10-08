"use client";

import type { PDFDocumentProxy } from "pdfjs-dist";
import { useEffect, useState } from "react";
import { type FileViewerSource, loadFile } from "@/lib/files/preview";

export function useFileAsset(source: FileViewerSource, attempt: number) {
	const [state, setState] = useState<{
		source: FileViewerSource;
		attempt: number;
		url?: string;
		pdf?: PDFDocumentProxy;
		error?: string;
	}>();
	useEffect(() => {
		const abort = new AbortController();
		let objectUrl: string | undefined;
		let task: ReturnType<typeof import("pdfjs-dist").getDocument> | undefined;
		void (async () => {
			const { blob, mime } = await loadFile(source, abort.signal);
			abort.signal.throwIfAborted();
			objectUrl = URL.createObjectURL(blob);
			if (mime !== "application/pdf") {
				setState({ source, attempt, url: objectUrl });
				return;
			}
			const { getDocument, GlobalWorkerOptions, version } = await import(
				"pdfjs-dist"
			);
			abort.signal.throwIfAborted();
			const base = `/file-viewer/pdfjs/${version}/`;
			GlobalWorkerOptions.workerSrc = `${base}pdf.worker.min.mjs`;
			const data = new Uint8Array(await blob.arrayBuffer());
			abort.signal.throwIfAborted();
			task = getDocument({
				data,
				cMapUrl: `${base}cmaps/`,
				cMapPacked: true,
				standardFontDataUrl: `${base}standard_fonts/`,
				useWasm: false,
			});
			const pdf = await task.promise;
			if (!abort.signal.aborted)
				setState({ source, attempt, url: objectUrl, pdf });
		})().catch((error: unknown) => {
			if (abort.signal.aborted) return;
			const message = error instanceof Error ? error.message : "";
			setState({
				source,
				attempt,
				error: /password/i.test(message)
					? "This PDF is password protected. Open it in your PDF application."
					: /100 MB|available for|unavailable|address/.test(message)
						? message
						: "This file couldn’t be previewed. Check that it is still available and try again.",
			});
		});
		return () => {
			abort.abort();
			if (objectUrl) URL.revokeObjectURL(objectUrl);
			if (task) void task.destroy().catch(() => {});
		};
	}, [source, attempt]);
	return state?.source === source && state.attempt === attempt
		? state
		: undefined;
}
