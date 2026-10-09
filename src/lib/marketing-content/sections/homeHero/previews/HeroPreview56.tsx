"use client";
// Native specimen adapted from @/components/ui/input/text/TextInput.catalog.
import { TextInput } from "@/components/ui/input/text/TextInput";

const onChange = () => undefined;
function CatalogPreview1() {
	const render = () => (
		<TextInput
			description="Use at least three characters."
			label="Project name"
			onChange={onChange}
			required
			validate={(value) =>
				value.length >= 3 ? null : "Enter at least three characters."
			}
		/>
	);
	return render();
}
export default CatalogPreview1;
