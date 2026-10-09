"use client";
// Native specimen adapted from @/components/ui/input/numeric/SliderInput.catalog.
import { useState } from "react";
import { SliderInput } from "@/components/ui/input/numeric/SliderInput";

function SliderExample() {
	const [value, setValue] = useState<number | null>(40);
	return (
		<SliderInput
			label="Volume"
			max={100}
			min={0}
			onChange={setValue}
			unit="%"
			value={value}
		/>
	);
}
function CatalogPreview1() {
	const render = () => <SliderExample />;
	return render();
}
export default CatalogPreview1;
