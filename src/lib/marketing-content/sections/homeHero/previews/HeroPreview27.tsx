"use client";
// Native specimen adapted from @/components/ui/helpers/ArrowAction.catalog.
import { ArrowAction } from "@/components/ui/helpers/ArrowAction";

function CatalogPreview1() {
	const render = () => (
		<div className="flex items-center gap-3">
			<ArrowAction aria-label="Open project" />
			<ArrowAction aria-label="Open documentation" href="/dashboard" />
		</div>
	);
	return render();
}
export default CatalogPreview1;
