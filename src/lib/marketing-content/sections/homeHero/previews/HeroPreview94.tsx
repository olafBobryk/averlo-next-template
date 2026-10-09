"use client";
// Native specimen adapted from @/components/ui/primitives/Section.catalog.
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";

function CatalogPreview1() {
	const render = () => (
		<Section
			align="center"
			background="surface"
			maxWidth="narrow"
			padding="soft"
		>
			<Text as="h2" variant="headingPage">
				Narrow centered section
			</Text>
			<Text tone="muted">
				Outer spacing and inner width are separate decisions.
			</Text>
		</Section>
	);
	return render();
}
export default CatalogPreview1;
