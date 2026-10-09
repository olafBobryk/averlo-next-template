"use client";
// Native specimen adapted from @/components/ui/primitives/Text.catalog.
import { Text } from "@/components/ui/primitives/Text";

function CatalogPreview1() {
	const render = () => (
		<div className="grid gap-3">
			<Text as="h1" variant="headingHero">
				Hero heading
			</Text>
			<Text as="h2" variant="headingPage">
				Page heading
			</Text>
			<Text as="h3" variant="headingLg">
				Section heading
			</Text>
			<Text variant="bodyStrong">Strong body</Text>
			<Text variant="body">Body copy</Text>
			<Text variant="caption">Caption</Text>
		</div>
	);
	return render();
}
export default CatalogPreview1;
