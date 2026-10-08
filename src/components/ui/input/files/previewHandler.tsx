"use client";

import { createContext, type ReactNode, useContext } from "react";

/** Preview delegation only; file selection never owns transport or a viewer host. */
export type FilePreviewRequest = {
	name: string;
	type?: string;
	url: string;
	file?: Blob;
	/** Resolve fresh access on every open/retry. */
	resolveUrl?: (signal: AbortSignal) => Promise<string>;
};
export type FilePreviewHandler = (file: FilePreviewRequest) => void;
const PreviewHandler = createContext<FilePreviewHandler | undefined>(undefined);
export function FilePreviewProvider({
	onPreview,
	children,
}: {
	onPreview: FilePreviewHandler;
	children: ReactNode;
}) {
	return (
		<PreviewHandler.Provider value={onPreview}>
			{children}
		</PreviewHandler.Provider>
	);
}
export function useFilePreviewHandler() {
	return useContext(PreviewHandler);
}
