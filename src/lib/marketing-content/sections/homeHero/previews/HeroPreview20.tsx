"use client";
// Native specimen adapted from @/components/domain/assistant/status/Status.catalog.
import * as Assistant from "@/components/domain/assistant";

function CatalogPreview() {
	const render = () => (
		<div className="grid gap-7 py-6">
			<Assistant.Loading />
			<Assistant.Thinking />
		</div>
	);
	return render();
}
export default CatalogPreview;
