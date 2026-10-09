"use client";
// Native specimen adapted from @/components/ui/input/selection/SelectInput.catalog.
import { useState } from "react";
import { SelectInput } from "@/components/ui/input/selection/SelectInput";

const options = [
	{ value: "draft", label: "Draft" },
	{ value: "published", label: "Published" },
	{ value: "archived", label: "Archived", disabled: true },
];
function SelectExample() {
	const [value, setValue] = useState<string | null>(null);
	return (
		<div className="w-80">
			<SelectInput
				description="Choose the public state."
				label="Status"
				onChange={setValue}
				options={options}
				value={value}
			/>
		</div>
	);
}
function CatalogPreview1() {
	const render = () => <SelectExample />;
	return render();
}
export default CatalogPreview1;
