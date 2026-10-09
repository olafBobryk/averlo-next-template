"use client";
// Native specimen adapted from @/components/ui/input/text/PasswordInput.catalog.
import { PasswordInput } from "@/components/ui/input/text/PasswordInput";

function CatalogPreview1() {
	const render = () => (
		<PasswordInput
			autoComplete="new-password"
			label="Create password"
			showStrength
		/>
	);
	return render();
}
export default CatalogPreview1;
