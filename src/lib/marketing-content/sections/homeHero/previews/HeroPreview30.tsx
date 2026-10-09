"use client";
// Native specimen adapted from @/components/ui/icons/Icon.catalog.
import { Icon } from "@/components/ui/icons/Icon";

function CatalogPreview1() {
	const render = () => (
		<div className="flex items-center gap-4">
			<Icon data-testid="small-icon" name="check" size="sm" />
			<Icon data-testid="medium-icon" frame="default" name="plus" size="md" />
			<Icon data-testid="large-icon" name="arrow-right" size="lg" mirrorInRtl />
			<Icon.Skeleton size="md" />
		</div>
	);
	return render();
}
export default CatalogPreview1;
