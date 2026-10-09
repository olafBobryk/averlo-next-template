"use client";
// Native specimen adapted from @/components/ui/misc/Loader.catalog.
import { Loader } from "@/components/ui/misc/Loader";

function CatalogPreview1() {
	const render = () => (
		<div role="status" className="flex items-center gap-2">
			<Loader data-testid="loader" size="md" />
			<span>Refreshing results</span>
		</div>
	);
	return render();
}
export default CatalogPreview1;
