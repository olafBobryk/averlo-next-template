"use client";
import { MemberMention } from "@/app/(site)/dashboard/_components/entities/member/MemberMention";
// Native specimen adapted from @/app/(site)/dashboard/_components/entities/member/MemberMention.catalog.
import { getMemberPresentation } from "@/app/(site)/dashboard/_lib/entities/member/presentation";
import heroImage0 from "../../../../../../public/test/placeholder-portrait.jpg";

const presentation = getMemberPresentation({
	createdAt: "2026-01-12T08:00:00.000Z",
	id: "membership-mention",
	organizationId: "organization-story",
	role: "member",
	user: {
		email: "avery@averlo.local",
		id: "user-mention",
		name: "Avery Chen",
		profilePictureUrl: heroImage0.src,
	},
});
function CatalogPreview() {
	const render = () => (
		<p>
			Assigned to <MemberMention presentation={presentation} /> ·{" "}
			<MemberMention.Skeleton />
		</p>
	);
	return render();
}
export default CatalogPreview;
