"use client";
// Native specimen adapted from @/components/ui/primitives/surfaces/Surfaces.catalog.
import { Card, ContentSection } from "@/components/ui/primitives/surfaces";

function ContentHierarchyPreview() {
	return (
		<ContentSection>
			<ContentSection.Heading
				title="Organization identity"
				description="Keep the heading outside one card containing the related properties."
			/>
			<ContentSection.Content>
				<Card>
					<Card.Content>
						<dl className="grid gap-4 sm:grid-cols-2">
							<div>
								<dt>Name</dt>
								<dd>Demo organization</dd>
							</div>
							<div>
								<dt>Slug</dt>
								<dd>demo</dd>
							</div>
						</dl>
					</Card.Content>
				</Card>
			</ContentSection.Content>
		</ContentSection>
	);
}
export default ContentHierarchyPreview;
