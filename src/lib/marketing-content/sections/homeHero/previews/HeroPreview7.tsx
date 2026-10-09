"use client";
// Native specimen adapted from @/app/(site)/dashboard/_components/entities/member/MemberSelector.catalog.
import { useState } from "react";
import { MemberSelector } from "@/app/(site)/dashboard/_components/entities/member/MemberSelector";
import { getMemberPresentation } from "@/app/(site)/dashboard/_lib/entities/member/presentation";
import heroImage0 from "../../../../../../public/test/placeholder-portrait.jpg";

const members = [
	["Taylor Morgan", "taylor@averlo.local", "owner"],
	["Avery Chen", "avery@averlo.local", "admin"],
	["Sam Rivera", "sam@averlo.local", "member"],
].map(([name, email, role], index) =>
	getMemberPresentation({
		createdAt: "2026-01-12T08:00:00.000Z",
		id: `membership-story-${index}`,
		organizationId: "organization-story",
		role: role as "admin" | "member" | "owner",
		user: {
			email,
			id: `user-story-${index}`,
			name,
			profilePictureUrl: heroImage0.src,
		},
	}),
);
function ControlledMemberSelector() {
	const [value, setValue] = useState<string | null>(members[0].id);
	return (
		<div className="w-80">
			<MemberSelector members={members} onChange={setValue} value={value} />
		</div>
	);
}
function CatalogPreview() {
	const render = () => <ControlledMemberSelector />;
	return render();
}
export default CatalogPreview;
