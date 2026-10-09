"use client";
import { AccountIdentity } from "@/app/(site)/dashboard/_components/entities/account/AccountIdentity";
// Native specimen adapted from @/app/(site)/dashboard/_components/entities/account/AccountIdentity.catalog.
import { getAccountPresentation } from "@/app/(site)/dashboard/_lib/entities/account/presentation";
import heroImage0 from "../../../../../../public/test/placeholder-portrait.jpg";

const presentation = getAccountPresentation({
	membership: {
		createdAt: "2026-01-12T08:00:00.000Z",
		id: "membership-story-account",
		organizationId: "organization-story",
		role: "owner",
		status: "active",
		userId: "user-story-account",
	},
	organization: {
		id: "organization-story",
		mode: "multi",
		name: "Averlo Studio",
		slug: "averlo-studio",
	},
	user: {
		email: "taylor@averlo.local",
		id: "user-story-account",
		name: "Taylor Morgan",
		profilePictureUrl: heroImage0.src,
	},
});
const sizes = ["sm", "md", "lg", "xl"] as const;
const variants = ["default", "actor"] as const;
function CatalogPreview() {
	const render = () => (
		<div className="grid max-w-4xl gap-8">
			{variants.map((variant) => (
				<section className="grid gap-4" key={variant}>
					<h2 className="font-semibold capitalize">{variant}</h2>
					{sizes.map((avatarSize) => (
						<div className="grid gap-3 sm:grid-cols-2" key={avatarSize}>
							<AccountIdentity
								avatarSize={avatarSize}
								presentation={presentation}
								variant={variant}
							/>
							<AccountIdentity.Skeleton
								avatarSize={avatarSize}
								variant={variant}
							/>
						</div>
					))}
				</section>
			))}
		</div>
	);
	return render();
}
export default CatalogPreview;
