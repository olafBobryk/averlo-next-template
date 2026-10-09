"use client";
// Native specimen adapted from @/components/ui/misc/Skeleton.catalog.
import { Skeleton } from "@/components/ui/misc/Skeleton";

function CatalogPreview1() {
	const render = () => (
		<Skeleton data-testid="placeholder" className="w-64 p-3">
			Final content width
		</Skeleton>
	);
	return render();
}
export default CatalogPreview1;
