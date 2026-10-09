"use client";
// Native specimen adapted from @/components/ui/overlays/Portal.catalog.
import Portal from "@/components/ui/overlays/Portal";

function CatalogPreview1() {
	const render = () => (
		<div className="grid gap-2">
			<p>Source location</p>
			<div
				className="rounded-md border border-dashed p-3"
				id="catalog-portal-target"
			/>
			<Portal target="catalog-portal-target">
				<p>Portaled into the configured target</p>
			</Portal>
		</div>
	);
	return render();
}
export default CatalogPreview1;
