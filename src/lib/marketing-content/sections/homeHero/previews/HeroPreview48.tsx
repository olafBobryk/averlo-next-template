"use client";
// Native specimen adapted from @/components/ui/input/selection/ComboboxMultiSelectInput.catalog.
import { useState } from "react";
import { ComboboxMultiSelectInput } from "@/components/ui/input/selection/ComboboxMultiSelectInput";

const options = [
	{ value: "amsterdam", label: "Amsterdam" },
	{ value: "berlin", label: "Berlin" },
	{ value: "copenhagen", label: "Copenhagen" },
];
function ComboboxExample() {
	const [value, setValue] = useState<string[]>(["amsterdam"]);
	return (
		<div className="w-96">
			<ComboboxMultiSelectInput
				label="Offices"
				onChange={setValue}
				options={options}
				placeholder="Search offices"
				value={value}
			/>
		</div>
	);
}
function CatalogPreview1() {
	const render = () => <ComboboxExample />;
	return render();
}
export default CatalogPreview1;
