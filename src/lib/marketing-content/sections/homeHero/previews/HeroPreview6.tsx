"use client";
import { MemberRoleChip } from "@/app/(site)/dashboard/_components/entities/member/MemberRoleChip";
// Native specimen adapted from @/app/(site)/dashboard/_components/entities/member/MemberRoleChip.catalog.
import { memberRolePresentation } from "@/app/(site)/dashboard/_lib/entities/member/presentation";

const roles = ["owner", "admin", "member"] as const;
function CatalogPreview() {
	const render = () => (
		<div className="flex flex-wrap items-center gap-3">
			{roles.map((role) => (
				<MemberRoleChip
					key={role}
					label={memberRolePresentation[role].shortLabel}
					tone={memberRolePresentation[role].tone}
				/>
			))}
			<MemberRoleChip.Skeleton />
		</div>
	);
	return render();
}
export default CatalogPreview;
