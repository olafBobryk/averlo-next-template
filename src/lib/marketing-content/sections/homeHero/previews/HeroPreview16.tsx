"use client";
// Native specimen adapted from @/components/composites/file-viewer/FileViewer.catalog.
import { FileViewer } from "@/components/composites/file-viewer/FileViewer";

const samplePdf = {
	name: "Project brief.pdf",
	type: "application/pdf",
	url: "/test/file-viewer.pdf",
};
function Preview() {
	return (
		<div className="h-[560px]">
			<FileViewer source={samplePdf} onClose={() => {}} />
		</div>
	);
}
export default Preview;
