"use client";
// Native specimen adapted from @/components/ui/input/text/PhoneInput.catalog.
import { PhoneInput } from "@/components/ui/input/text/PhoneInput";

const onChange = () => undefined;
function CatalogPreview1() {
	const render = () => (
		<div className="w-80">
			<PhoneInput
				defaultCountry="US"
				e164Name="phoneE164"
				label="Phone"
				onChange={onChange}
			/>
		</div>
	);
	return render();
}
export default CatalogPreview1;
