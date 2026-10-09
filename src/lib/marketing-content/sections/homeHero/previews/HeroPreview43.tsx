"use client";
// Native specimen adapted from @/components/ui/input/files/ProfilePictureInput.catalog.
import { ProfilePictureInput } from "@/components/ui/input/files/ProfilePictureInput";
import heroImage0 from "../../../../../../public/test/placeholder-portrait.jpg";

const onChange = () => undefined;
const onValidationError = () => undefined;
function CatalogPreview1() {
	const render = () => (
		<ProfilePictureInput
			acceptedMimeTypes={["image/png"]}
			currentUrl={heroImage0.src}
			layout="file-row"
			name="Averlo user"
			onChange={onChange}
			onValidationError={onValidationError}
		/>
	);
	return render();
}
export default CatalogPreview1;
