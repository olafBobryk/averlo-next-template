"use client";
// Native specimen adapted from @/components/ui/input/date/DateRangeInput.catalog.
import { DateRangeInput } from "@/components/ui/input/date/DateRangeInput";

const onChange = () => undefined;
function CatalogPreview1() {
	const render = () => (
		<DateRangeInput
			defaultValue={{ start: "2026-08-01", end: "2026-08-07" }}
			endName="endDate"
			label="Reporting period"
			onChange={onChange}
			presets={["last_7_days"]}
			startName="startDate"
		/>
	);
	return render();
}
export default CatalogPreview1;
