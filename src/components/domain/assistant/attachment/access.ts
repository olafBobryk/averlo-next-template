/** A new access URL is requested for every preview open and retry. */
export function attachmentPreviewUrl(id: string) {
	return async (signal: AbortSignal) => {
		const response = await fetch(
			`/api/assistant/files/${encodeURIComponent(id)}/access`,
			{ method: "POST", signal },
		);
		if (!response.ok)
			throw new Error(
				"This file is unavailable. Check your access and try again.",
			);
		const result = (await response.json()) as { url?: string };
		if (!result.url) throw new Error("This file is unavailable.");
		return result.url;
	};
}
