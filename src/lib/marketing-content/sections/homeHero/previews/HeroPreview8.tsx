"use client";
import { OrganizationIdentity } from "@/app/(site)/dashboard/_components/entities/organization/OrganizationIdentity";
// Native specimen adapted from @/app/(site)/dashboard/_components/entities/organization/OrganizationIdentity.catalog.
import { getOrganizationPresentation } from "@/app/(site)/dashboard/_lib/entities/organization/presentation";
import heroImage0 from "../../../../../../public/test/placeholder-square.jpg";

const presentation = getOrganizationPresentation({
	id: "organization-story",
	name: "Averlo Studio",
	profilePictureUrl: heroImage0.src,
	role: "owner",
	slug: "averlo-studio",
});
const sizes = ["sm", "md", "lg", "xl"] as const;
const variants = ["default", "actor"] as const;
const visuals = ["profile-picture", "icon"] as const;
function CatalogPreview() {
	const render = () => (
		<div className="grid max-w-4xl gap-10">
			{visuals.map((visual) => (
				<section className="grid gap-6" key={visual}>
					<h2 className="font-semibold capitalize">{visual}</h2>
					{variants.map((variant) => (
						<div className="grid gap-4" key={variant}>
							<h3 className="font-medium capitalize">{variant}</h3>
							{sizes.map((avatarSize) => (
								<div className="grid gap-3 sm:grid-cols-2" key={avatarSize}>
									<OrganizationIdentity
										avatarSize={avatarSize}
										presentation={presentation}
										variant={variant}
										visual={visual}
									/>
									<OrganizationIdentity.Skeleton
										avatarSize={avatarSize}
										variant={variant}
										visual={visual}
									/>
								</div>
							))}
						</div>
					))}
				</section>
			))}
		</div>
	);
	return render();
}
export default CatalogPreview;
