"use client";
// Native specimen adapted from @/components/ui/input/numeric/NumberInput.catalog.
import { NumberInput } from "@/components/ui/input/numeric/NumberInput";

const onChange = () => undefined;
function CatalogPreview1() {
	const render = () => (
		<NumberInput
			description="Whole numbers from one to ten."
			label="Seats"
			max={10}
			min={1}
			onChange={onChange}
			validate={(value) =>
				value !== null && value > 10 ? "Maximum is 10." : null
			}
		/>
	);
	return render();
}
export default CatalogPreview1;
