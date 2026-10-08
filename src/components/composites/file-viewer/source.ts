export {
	type FileViewerSource,
	loadFile,
	MAX_PREVIEW_BYTES,
	previewMime,
	safeFileUrl,
} from "@/lib/files/preview";

export function previewToolbarVisibility(width: number, hasPages: boolean) {
	const visible = { pages: hasPages, zoom: true, fit: true, external: true };
	const widths = { pages: 140, zoom: 110, fit: 32, external: 32 };
	const used = () =>
		152 +
		Object.entries(visible).reduce(
			(sum, [key, shown]) =>
				sum + (shown ? widths[key as keyof typeof widths] : 0),
			0,
		) +
		(Object.values(visible).some((v) => !v) ? 32 : 0);
	for (const key of ["fit", "external", "zoom", "pages"] as const) {
		if (used() <= width) break;
		visible[key] = false;
	}
	return visible;
}
