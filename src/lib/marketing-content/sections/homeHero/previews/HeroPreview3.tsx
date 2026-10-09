"use client";
import { MemberAvatarList } from "@/app/(site)/dashboard/_components/entities/member/MemberAvatarList";
// Native specimen adapted from @/app/(site)/dashboard/_components/entities/member/MemberAvatarList.catalog.
import { getMemberPresentation } from "@/app/(site)/dashboard/_lib/entities/member/presentation";
import heroImage0 from "../../../../../../public/test/placeholder-portrait.jpg";

const members = ["Taylor Morgan", "Avery Chen", "Sam Rivera", "Robin Park"].map(
	(name, index) =>
		getMemberPresentation({
			createdAt: "2026-01-12T08:00:00.000Z",
			id: `membership-avatar-${index}`,
			organizationId: "organization-story",
			role: "member",
			user: {
				email: `${name.toLowerCase().replace(" ", ".")}@averlo.local`,
				id: `user-avatar-${index}`,
				name,
				profilePictureUrl: heroImage0.src,
			},
		}),
);
function CatalogPreview() {
	const render = () => (
		<div className="grid gap-6">
			<MemberAvatarList members={members} />
			<MemberAvatarList.Skeleton count={3} />
		</div>
	);
	return render();
}
export default CatalogPreview;
