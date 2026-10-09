"use client";
// Native specimen adapted from @/components/ui/input/selection/ComboboxTextInput.catalog.
import { ComboboxTextInput } from "@/components/ui/input/selection/ComboboxTextInput";

const onChange = () => undefined;
const onSelect = () => undefined;
const options = [
	{ id: "apple", label: "Apple" },
	{ id: "banana", label: "Banana" },
	{ id: "pear", label: "Pear" },
];
function CatalogPreview1() {
	const render = () => (
		<div className="w-80">
			<ComboboxTextInput
				label="Fruit"
				onChange={onChange}
				onSelect={onSelect}
				options={options}
				placeholder="Type a fruit"
			/>
		</div>
	);
	return render();
}
export default CatalogPreview1;
