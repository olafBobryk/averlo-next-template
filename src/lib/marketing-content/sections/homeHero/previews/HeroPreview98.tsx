"use client";
// Native specimen adapted from @/components/ui/time/DateAgo.catalog.
import { DateAgo } from "@/components/ui/time/DateAgo";

function CatalogPreview1() {
	const render = () => (
		<div className="grid gap-2">
			<DateAgo
				date={new Date(Date.now() - 5 * 60_000)}
				updateIntervalMs={60_000}
			/>
			<DateAgo
				date={new Date(Date.now() + 2 * 60 * 60_000)}
				updateIntervalMs={60_000}
			/>
		</div>
	);
	return render();
}
export default CatalogPreview1;
