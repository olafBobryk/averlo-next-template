"use client";
// Native specimen adapted from @/app/(site)/dashboard/_components/entities/organization/OrganizationSelector.catalog.
import { useState } from "react";
import type { OrganizationIdentityVisual } from "@/app/(site)/dashboard/_components/entities/organization/OrganizationAvatar";
import { OrganizationSelector } from "@/app/(site)/dashboard/_components/entities/organization/OrganizationSelector";
import { getOrganizationPresentation } from "@/app/(site)/dashboard/_lib/entities/organization/presentation";
import heroImage0 from "../../../../../../public/test/placeholder-square.jpg";

const organizations = [
	["Averlo Studio", "averlo-studio", "owner"],
	["Northstar Lab", "northstar-lab", "admin"],
	["Field Notes", "field-notes", "member"],
].map(([name, slug, role], index) =>
	getOrganizationPresentation({
		id: `organization-story-${index}`,
		name,
		profilePictureUrl: heroImage0.src,
		role: role as "admin" | "member" | "owner",
		slug,
	}),
);
function ControlledOrganizationSelector({
	visual,
}: {
	visual?: OrganizationIdentityVisual;
}) {
	const [value, setValue] = useState<string | null>(organizations[0].id);
	return (
		<div className="w-80">
			<OrganizationSelector
				onChange={setValue}
				organizations={organizations}
				value={value}
				visual={visual}
			/>
		</div>
	);
}
function CatalogPreview() {
	const render = () => <ControlledOrganizationSelector />;
	return render();
}
export default CatalogPreview;
