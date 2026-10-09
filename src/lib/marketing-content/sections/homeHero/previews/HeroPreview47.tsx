"use client";
// Native specimen adapted from @/components/ui/input/selection/ButtonMultiSelectInput.catalog.
import { ButtonMultiSelectInput } from "@/components/ui/input/selection/ButtonMultiSelectInput";

const onChange = () => undefined;
const options = [
	{ value: "design", label: "Design" },
	{ value: "engineering", label: "Engineering" },
	{ value: "research", label: "Research" },
];
function CatalogPreview1() {
	const render = () => (
		<ButtonMultiSelectInput
			defaultValue={["design"]}
			label="Teams"
			name="teams"
			onChange={onChange}
			options={options}
		/>
	);
	return render();
}
export default CatalogPreview1;
