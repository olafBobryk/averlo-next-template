"use client";
// Native specimen adapted from @/components/ui/input/color/ColorInput.catalog.
import { ColorInput } from "@/components/ui/input/color/ColorInput";

const onChange = () => undefined;
function CatalogPreview1() {
	const render = () => (
		<ColorInput
			defaultValue="#3567EA"
			description="Choose a brand accent."
			label="Accent color"
			name="accent"
			onChange={onChange}
		/>
	);
	return render();
}
export default CatalogPreview1;
