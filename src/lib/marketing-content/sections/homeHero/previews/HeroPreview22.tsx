"use client";
// Native specimen adapted from @/components/ui/foundations/Focus.catalog.
import { focusRing } from "@/components/ui/foundations/focus";

function CatalogPreview1() {
	const render = () => (
		<div className="grid gap-4">
			<button
				className={`rounded-md border px-3 py-2 ${focusRing.visibleDefault}`}
				type="button"
			>
				Direct control
			</button>
			<label className={`rounded-md border p-2 ${focusRing.fieldDefault}`}>
				<span className="sr-only">Field shell</span>
				<input className="outline-none" placeholder="Focus the field" />
			</label>
		</div>
	);
	return render();
}
export default CatalogPreview1;
