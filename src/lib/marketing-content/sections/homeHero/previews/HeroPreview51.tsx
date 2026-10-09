"use client";
// Native specimen adapted from @/components/ui/input/text/EmailInput.catalog.
import { EmailInput } from "@/components/ui/input/text/EmailInput";

const onChange = () => undefined;
function CatalogPreview1() {
	const render = () => (
		<EmailInput
			label="Work email"
			onChange={onChange}
			validate={(value) =>
				value.includes("@") ? null : "Enter a valid email."
			}
		/>
	);
	return render();
}
export default CatalogPreview1;
