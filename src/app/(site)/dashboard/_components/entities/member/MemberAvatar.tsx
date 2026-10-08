"use client";

import { ProfilePicture, type ProfilePictureSize } from "@/components/ui/misc";

export type MemberAvatarSize = Exclude<ProfilePictureSize, "2xl">;

function MemberAvatarRoot({
	alt,
	className,
	colorIndex,
	imageUrl,
	initials,
	name,
	size = "md",
}: {
	alt: string;
	className?: string;
	colorIndex: number;
	imageUrl?: string | null;
	initials: string;
	name?: string;
	size?: MemberAvatarSize;
}) {
	return (
		<ProfilePicture
			alt={alt}
			className={className}
			fallback={initials}
			helperIndex={colorIndex}
			name={name}
			size={size}
			src={imageUrl}
		/>
	);
}

export function MemberAvatarSkeleton({
	className,
	size = "md",
}: {
	className?: string;
	size?: MemberAvatarSize;
}) {
	return <ProfilePicture className={className} loading size={size} />;
}

export const MemberAvatar = Object.assign(MemberAvatarRoot, {
	Skeleton: MemberAvatarSkeleton,
});
