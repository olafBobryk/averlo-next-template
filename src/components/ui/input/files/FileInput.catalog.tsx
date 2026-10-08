"use client";

import { useState } from "react";
import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { FileInput, type FileInputItem } from "./FileInput";

const onFilesRejected = () => undefined;
function FileInputExample() {
	const [items, setItems] = useState<FileInputItem[]>([]);
	return (
		<div className="w-[560px] max-w-full">
			<FileInput
				accept="image/*"
				items={items}
				label="Assets"
				onFilesRejected={onFilesRejected}
				onItemsChange={setItems}
			/>
		</div>
	);
}
function _solidPreview(color: "black" | "white") {
	return `data:image/svg+xml,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="${color}"/></svg>`,
	)}`;
}
function CatalogPreview1() {
	const render = () => <FileInputExample />;
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}
function CatalogPreview2() {
	const render = () => (
		<div className="w-[560px] max-w-full">
			<FileInput
				items={[
					{
						key: "portrait",
						name: "portrait.jpg",
						status: "uploaded",
						type: "image/jpeg",
						url: "/test/placeholder-portrait.jpg",
					},
					{
						key: "shapes",
						name: "shapes.jpg",
						status: "uploaded",
						type: "image/jpeg",
						url: "/test/placeholder-square.jpg",
					},
				]}
				label={null}
				onItemsChange={() => {}}
				showAddControl={false}
			/>
		</div>
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}

export const catalogContract = defineCatalogOwnerContract({
	id: "ui-input-file-input",
	name: "FileInput",
	role: "Controlled generic-file field for selection, preview, inspection, editable or read-only presentation, and inline rejection feedback. onPreview delegates inspection; a FilePreviewProvider supplies the default handler for a subtree. An explicit callback wins. Without either, existing inspection remains available. Uploaded items may resolve fresh URLs through resolveUrl(signal). Preview tiles use Card surfaces. PDFs render a first-page canvas with a filename and readable loading/failure fallback, never a browser PDF plug-in.",
	importStatement: 'import { FileInput } from "@/components/ui/input";',
	chooseWhen: [
		"A form owns pending and uploaded files as one controlled list.",
	],
	chooseInstead: [
		"Use ProfilePictureInput for a single avatar image workflow.",
	],
	compounds: ["FileInput.Skeleton"],
	exclusions: [
		"FilePreview, FileInspectModal, upload transport, persistence, and server-side validation.",
	],
	guarantees: [
		{
			label: "Bounded attachment tiles and adaptive ghost removal",
			storyId: "ui-input-file-input--compact-chat-attachments",
		},
		{
			label: "PDF first-page card preview",
			storyId: "ui-input-file-input--pdf-card-preview",
		},
		{
			label: "Controlled accepted/rejected file selection",
			storyId: "ui-input-file-input--selection-contract",
		},
		{
			label: "Externally owned add control",
			storyId: "ui-input-file-input--external-add-control-presentation",
		},
	],

	family: "UI",
	group: "Input / Files",
	previewTargets: [
		{
			id: "selection-contract",
			name: "Controlled accepted/rejected file selection",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview1,
		},
		{
			id: "external-add-control-presentation",
			name: "Externally owned add control",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview2,
		},
	],
});
