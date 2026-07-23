import { ProfilePictureStack } from "@/components/ui/misc/ProfilePicture";
import type { MemberPresentation } from "../../../_lib/entities/member/presentation";

function MemberAvatarListRoot({
	className,
	members,
	maxVisible = 3,
}: {
	className?: string;
	members: readonly MemberPresentation[];
	maxVisible?: number;
}) {
	if (members.length === 0) return null;
	return (
		<ProfilePictureStack
			ariaLabel={`Assigned to ${members.map((member) => member.displayLabel).join(", ")}`}
			className={className}
			items={members.map((member) => ({
				alt: member.avatarAlt,
				fallback: member.initials,
				helperIndex: member.avatarColorIndex,
				id: member.id,
				name: member.displayLabel,
				src: member.avatarUrl,
			}))}
			maxVisible={maxVisible}
			size="sm"
		/>
	);
}

function MemberAvatarListSkeleton({
	className,
	count = 3,
}: {
	className?: string;
	count?: number;
}) {
	return (
		<ProfilePictureStack.Skeleton
			className={className}
			count={count}
			size="sm"
		/>
	);
}

export const MemberAvatarList = Object.assign(MemberAvatarListRoot, {
	Skeleton: MemberAvatarListSkeleton,
});
