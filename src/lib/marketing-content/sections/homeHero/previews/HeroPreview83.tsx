"use client";
import { ModalHost } from "@/components/ui/overlays/modal/ModalHost";
import { useImageInspectModal } from "@/components/ui/overlays/modal/useImageInspectModal";
// Native specimen adapted from @/components/ui/overlays/modal/ImageInspectModal.catalog.
import { Button } from "@/components/ui/primitives/Button";
import heroImage0 from "../../../../../../public/test/placeholder-portrait.jpg";

function ImageInspectHarness() {
	const { openImageInspect } = useImageInspectModal();
	return (
		<>
			<div id="modal-root" />
			<ModalHost />
			<Button
				onClick={() =>
					openImageInspect({
						src: heroImage0.src,
						alt: "Abstract blue portrait composition",
					})
				}
			>
				Inspect image
			</Button>
		</>
	);
}
function CatalogPreview1() {
	const render = () => (
		<div className="p-8">
			<ImageInspectHarness />
		</div>
	);
	return render();
}
export default CatalogPreview1;
