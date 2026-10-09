"use client";
import { ModalForm } from "@/components/ui/overlays/modal/ModalForm";
// Native specimen adapted from @/components/ui/overlays/modal/ModalForm.catalog.
import { Button } from "@/components/ui/primitives/Button";

function CatalogPreview1() {
	const render = () => (
		<div className="max-w-lg rounded-md border">
			<ModalForm
				aria-label="Profile form"
				footer={<Button type="submit">Save</Button>}
				onSubmit={(event) => event.preventDefault()}
			>
				<label className="grid gap-1 p-2">
					Name
					<input name="name" />
				</label>
			</ModalForm>
		</div>
	);
	return render();
}
export default CatalogPreview1;
