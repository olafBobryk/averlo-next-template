"use client";
// Native specimen adapted from @/components/ui/primitives/Button.catalog.
import { Button } from "@/components/ui/primitives/Button";

function CatalogPreview1() {
	const render = () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button variant="primary">Publish</Button>
			<Button variant="secondary">Save draft</Button>
			<Button variant="ghost">Cancel</Button>
			<Button variant="bare">Dismiss</Button>
			<Button variant="link" href="/dashboard">
				View details
			</Button>
		</div>
	);
	return render();
}
export default CatalogPreview1;
