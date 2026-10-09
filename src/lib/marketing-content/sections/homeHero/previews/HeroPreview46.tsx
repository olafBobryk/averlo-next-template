"use client";
// Native specimen adapted from @/components/ui/input/numeric/UnitNumberInput.catalog.
import { UnitNumberInput } from "@/components/ui/input/numeric/UnitNumberInput";

const onChange = () => undefined;
function CatalogPreview1() {
	const render = () => (
		<UnitNumberInput label="Distance" onChange={onChange} unit="km" />
	);
	return render();
}
export default CatalogPreview1;
