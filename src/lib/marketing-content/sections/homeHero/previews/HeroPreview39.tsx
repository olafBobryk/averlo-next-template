"use client";
// Native specimen adapted from @/components/ui/input/date/DateInput.catalog.
import { DateInput } from "@/components/ui/input/date/DateInput";

const onChange = () => undefined;
function CatalogPreview1() {
	const render = () => (
		<DateInput
			defaultValue="2026-08-01"
			description="Stored as a UTC calendar date."
			label="Launch date"
			name="launchDate"
			onChange={onChange}
		/>
	);
	return render();
}
export default CatalogPreview1;
