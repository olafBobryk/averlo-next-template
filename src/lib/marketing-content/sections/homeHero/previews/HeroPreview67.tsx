"use client";
// Native specimen adapted from @/components/ui/misc/ScrollArea.catalog.
import { ScrollArea } from "@/components/ui/misc/ScrollArea";

const rows = Array.from({ length: 12 }, (_, index) => `Result ${index + 1}`);
function CatalogPreview1() {
	return (
		<div className="w-72 overflow-hidden rounded-xl border border-border bg-card">
			<ScrollArea className="h-40" edge={8} tabIndex={0}>
				{rows.map((row) => (
					<div className="px-3 py-2 text-sm" key={row}>
						{row}
					</div>
				))}
			</ScrollArea>
		</div>
	);
}
export default CatalogPreview1;
