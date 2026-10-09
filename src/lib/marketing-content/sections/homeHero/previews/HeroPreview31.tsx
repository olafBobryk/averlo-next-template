"use client";
// Native specimen adapted from @/components/ui/input/SignatureInput.catalog.
import { SignatureInput } from "@/components/ui/input/SignatureInput";

const onClear = () => undefined;
function CatalogPreview1() {
	const render = () => (
		<div className="w-[480px]">
			<SignatureInput
				description="Sign inside the field."
				label="Approval signature"
				onClear={onClear}
			/>
		</div>
	);
	return render();
}
export default CatalogPreview1;
