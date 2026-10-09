"use client";
// Native specimen adapted from @/components/ui/input/color/ColorSwatchInput.catalog.
import {
	ColorSwatchInput,
	SEMANTIC_COLOR_SWATCH_PRESETS,
} from "@/components/ui/input/color/ColorSwatchInput";

const onChange = () => undefined;
function CatalogPreview1() {
	const render = () => (
		<ColorSwatchInput
			defaultValue="neutral"
			label="Status color"
			name="statusColor"
			onChange={onChange}
			presets={SEMANTIC_COLOR_SWATCH_PRESETS}
		/>
	);
	return render();
}
export default CatalogPreview1;
