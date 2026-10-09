"use client";
// Native specimen adapted from @/components/ui/input/text/SpamProtectionFields.catalog.
import { SpamProtectionFields } from "@/components/ui/input/text/SpamProtectionFields";

function CatalogPreview1() {
	const render = () => (
		<form aria-label="Contact">
			<SpamProtectionFields fieldName="contact_website" />
			<button type="submit">Send</button>
		</form>
	);
	return render();
}
export default CatalogPreview1;
