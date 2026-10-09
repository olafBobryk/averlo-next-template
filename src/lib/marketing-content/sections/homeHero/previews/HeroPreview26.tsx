"use client";
// Native specimen adapted from @/components/ui/foundations/SurfaceTint.catalog.
import { createSurfaceTint } from "@/components/ui/foundations/surfaceTint";

function CatalogPreview1() {
	const render = () => {
		const tint = createSurfaceTint({
			surface: "var(--surface)",
			space: "oklab",
			tint: "var(--primary)",
			tintPercentage: 12,
		});
		return (
			<div
				className="grid gap-3 rounded-md border p-4"
				style={{ background: tint }}
			>
				<strong>Tinted surface</strong>
				<code data-testid="tint-recipe">{tint}</code>
			</div>
		);
	};
	return render();
}
export default CatalogPreview1;
