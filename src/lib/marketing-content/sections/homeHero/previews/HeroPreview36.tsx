"use client";
// Native specimen adapted from @/components/ui/input/choice/ToggleInput.catalog.
import { ToggleInput } from "@/components/ui/input/choice/ToggleInput";

const onChange = () => undefined;
const options = [
	{
		value: "marketing",
		label: "Marketing email",
		description: "Occasional product news.",
	},
];
function CatalogPreview1() {
	const render = () => (
		<ToggleInput
			label="Preferences"
			name="preferences"
			onChange={onChange}
			options={options}
		/>
	);
	return render();
}
export default CatalogPreview1;
