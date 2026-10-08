export type FileViewerSource = {
	name: string;
	type?: string;
	file?: Blob;
	url?: string;
	resolveUrl?: (signal: AbortSignal) => Promise<string>;
};
export const MAX_PREVIEW_BYTES = 100 * 1024 * 1024;
export function previewMime(source: FileViewerSource) {
	const type = source.type?.split(";")[0] || source.file?.type;
	if (type && type !== "application/octet-stream") return type;
	const ext = source.name.split(".").pop()?.toLowerCase();
	return (
		(
			{
				pdf: "application/pdf",
				png: "image/png",
				jpg: "image/jpeg",
				jpeg: "image/jpeg",
				webp: "image/webp",
				gif: "image/gif",
				avif: "image/avif",
				bmp: "image/bmp",
			} as Record<string, string>
		)[ext ?? ""] ?? ""
	);
}
export function safeFileUrl(url: string) {
	const parsed = new URL(url, window.location.href);
	if (!["https:", "http:", "blob:"].includes(parsed.protocol))
		throw new Error("This file address cannot be opened.");
	return parsed.href;
}
export async function loadFile(source: FileViewerSource, signal: AbortSignal) {
	const mime = previewMime(source);
	if (!/^(application\/pdf|image\/(png|jpeg|webp|gif|avif|bmp))$/.test(mime))
		throw new Error(
			"Preview is available for PDFs and PNG, JPEG, WebP, GIF, AVIF or BMP images.",
		);
	if (source.file) {
		if (source.file.size > MAX_PREVIEW_BYTES)
			throw new Error("This file exceeds the 100 MB preview limit.");
		return { blob: source.file, mime };
	}
	const url = safeFileUrl(
		source.resolveUrl ? await source.resolveUrl(signal) : (source.url ?? ""),
	);
	signal.throwIfAborted();
	const response = await fetch(url, { signal, credentials: "same-origin" });
	if (!response.ok)
		throw new Error(
			"This file is unavailable. Check your access and try again.",
		);
	if (Number(response.headers.get("content-length")) > MAX_PREVIEW_BYTES)
		throw new Error("This file exceeds the 100 MB preview limit.");
	const reader = response.body?.getReader();
	if (!reader) throw new Error("This file could not be read.");
	const chunks: Uint8Array<ArrayBuffer>[] = [];
	let size = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			size += value.byteLength;
			if (size > MAX_PREVIEW_BYTES)
				throw new Error("This file exceeds the 100 MB preview limit.");
			chunks.push(value);
		}
	} catch (error) {
		await reader.cancel();
		throw error;
	} finally {
		reader.releaseLock();
	}
	return { blob: new Blob(chunks, { type: mime }), mime };
}
