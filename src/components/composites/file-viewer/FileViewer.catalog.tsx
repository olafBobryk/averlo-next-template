"use client";
import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { FileViewer } from "./FileViewer";
export const samplePdf = {
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
export const catalogContract = defineCatalogOwnerContract({
	id: "composites-file-viewer",
	name: "FileViewer",
	family: "Composites",
	group: "Files",
	role: "Read-only PDF and image inspection with responsive viewing controls.",
	importStatement:
		'import { FileViewer, FileViewerLayout } from "@/components/composites/file-viewer";',
	chooseWhen: [
		"Inspect a PDF or raster image beside usable dashboard content.",
		"Use FileViewerLayout to delegate descendant FileInput previews into one resizable panel or full-screen modal.",
	],
	chooseInstead: [
		"Use FileInput for file selection; keep uploads, authorization and persistence with caller adapters.",
		"Use Markdown for authored or editable documents.",
	],
	compounds: [],
	exclusions: [
		"Document editing, storage, filesystem access, arbitrary server URL proxying, SVG and Office document rendering.",
	],
	guarantees: [
		{
			label: "PDF navigation, zoom and fit",
			storyId: "composites-file-viewer--pdf",
		},
		{
			label: "Responsive host and keyboard resizing",
			storyId: "composites-file-viewer--dashboard-panel",
		},
	],
	previewTargets: [
		{
			id: "pdf",
			name: "PDF inspection",
			baseline: {},
			axes: [],
			stage: "wide",
			Render: Preview,
		},
	],
});
