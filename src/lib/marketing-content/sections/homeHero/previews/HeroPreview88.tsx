"use client";
// Native specimen adapted from @/components/ui/primitives/Divider.catalog.
import Divider from "@/components/ui/primitives/Divider";
import { Text } from "@/components/ui/primitives/Text";

function CatalogPreview1() {
	const render = () => (
		<div className="grid gap-4">
			<Text>First content group</Text>
			<Divider />
			<Text>Second content group</Text>
		</div>
	);
	return render();
}
export default CatalogPreview1;
