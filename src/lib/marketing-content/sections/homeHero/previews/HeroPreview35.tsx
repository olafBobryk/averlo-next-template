"use client";
// Native specimen adapted from @/components/ui/input/choice/RadioInput.catalog.
import { RadioInput } from "@/components/ui/input/choice/RadioInput";

const onChange = () => undefined;
const options = [
	{ value: "weekly", label: "Weekly", description: "A weekly summary." },
	{ value: "monthly", label: "Monthly" },
];
function CatalogPreview1() {
	const render = () => (
		<RadioInput
			description="Choose a cadence."
			label="Digest"
			name="digest"
			onChange={onChange}
			options={options}
		/>
	);
	return render();
}
export default CatalogPreview1;
