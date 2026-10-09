"use client";
// Native specimen adapted from @/components/ui/misc/Chip.catalog.
import { Chip } from "@/components/ui/misc/Chip";

function CatalogPreview1() {
	const render = () => {
		const onClick = () => undefined;
		return (
			<div className="flex gap-3">
				<Chip>Static</Chip>
				<Chip href="/docs">Documentation</Chip>
				<Chip onClick={onClick} data-testid="chip-action">
					Remove filter
				</Chip>
			</div>
		);
	};
	return render();
}
export default CatalogPreview1;
