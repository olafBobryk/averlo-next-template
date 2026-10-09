"use client";
import ToastHost from "@/components/ui/overlays/toast/ToastHost";
import { Button } from "@/components/ui/primitives/Button";
// Native specimen adapted from @/components/ui/overlays/toast/Toast.catalog.
import { showToast } from "@/lib/feedback";

function CatalogPreview1() {
	const render = () => (
		<div className="flex gap-2 p-8">
			<ToastHost />
			<Button
				onClick={() =>
					showToast.success("Settings saved.", { title: "Success" })
				}
			>
				Show success
			</Button>
			<Button
				onClick={() => showToast.error("Upload failed.", { title: "Failed" })}
				variant="secondary"
			>
				Show error
			</Button>
		</div>
	);
	return render();
}
export default CatalogPreview1;
