"use client";
// Native specimen adapted from @/components/ui/input/editable/EditableTextField.catalog.
import { EditableTextField } from "@/components/ui/input/editable/EditableTextField";

const onSave = async () => {};
function CatalogPreview1() {
	const render = () => (
		<div className="w-80">
			<EditableTextField
				label="Project name"
				onSave={onSave}
				required
				value="Averlo"
			/>
		</div>
	);
	return render();
}
export default CatalogPreview1;
