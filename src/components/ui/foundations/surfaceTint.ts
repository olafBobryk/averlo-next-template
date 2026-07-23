export type SurfaceTintSpace = "oklab" | "oklch" | "srgb";

export type SurfaceTintOptions = {
	surface: string;
	space: SurfaceTintSpace;
	tint: string;
	tintPercentage: number;
};

export function createSurfaceTint({
	surface,
	space,
	tint,
	tintPercentage,
}: SurfaceTintOptions) {
	return `color-mix(in ${space},${tint} ${tintPercentage}%,${surface})`;
}
