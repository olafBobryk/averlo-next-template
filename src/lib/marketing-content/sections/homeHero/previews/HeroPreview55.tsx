"use client";
// Native specimen adapted from @/components/ui/input/text/TextAreaInput.catalog.
import { TextAreaInput } from "@/components/ui/input/text/TextAreaInput";

const onChange = () => undefined;
function CatalogPreview1() {
	const render = () => (
		<div className="w-96">
			<TextAreaInput
				description="At least ten characters."
				label="Summary"
				onChange={onChange}
				validate={(value) => (value.length >= 10 ? null : "Add more detail.")}
			/>
		</div>
	);
	return render();
}
export default CatalogPreview1;
