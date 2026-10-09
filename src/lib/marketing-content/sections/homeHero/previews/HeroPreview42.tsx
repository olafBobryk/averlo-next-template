"use client";
// Native specimen adapted from @/components/ui/input/files/FileInput.catalog.
import { useState } from "react";
import {
	FileInput,
	type FileInputItem,
} from "@/components/ui/input/files/FileInput";

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
function CatalogPreview1() {
	const render = () => <FileInputExample />;
	return render();
}
export default CatalogPreview1;
