"use client";

import clsx from "clsx";
import Image from "next/image";
import * as React from "react";
import { Skeleton } from "@/components/ui/misc/Skeleton";

export type MemberAvatarSize = "lg" | "md" | "sm" | "xl";

const sizeClasses = {
	lg: "size-14 text-base",
	md: "size-10 text-sm",
	sm: "size-8 text-xs",
	xl: "size-20 text-xl",
} satisfies Record<MemberAvatarSize, string>;

const fallbackClasses = [
	"bg-primary/12 text-primary",
	"bg-app-violet/12 text-app-violet",
	"bg-app-purple/12 text-app-purple",
	"bg-app-berry/12 text-app-berry",
	"bg-app-rose/12 text-app-rose",
	"bg-app-orange/12 text-app-orange",
	"bg-success/12 text-success",
	"bg-muted text-muted-foreground",
] as const;

export function MemberAvatarRoot({
	alt,
	className,
	colorIndex,
	imageUrl,
	initials,
	size = "md",
}: {
	alt: string;
	className?: string;
	colorIndex: number;
	imageUrl?: string | null;
	initials: string;
	size?: MemberAvatarSize;
}) {
	const [failedUrl, setFailedUrl] = React.useState<string | null>(null);
	const visibleUrl = imageUrl && imageUrl !== failedUrl ? imageUrl : null;
	return (
		<span
			className={clsx(
				"relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full border border-border font-semibold shadow-sm shadow-foreground/10",
				sizeClasses[size],
				fallbackClasses[Math.abs(colorIndex) % fallbackClasses.length],
				className,
			)}
		>
			{visibleUrl ? (
				<Image
					alt={alt}
					className="h-full w-full object-cover"
					fill
					onError={() => setFailedUrl(visibleUrl)}
					referrerPolicy="no-referrer"
					sizes="80px"
					src={visibleUrl}
					unoptimized
				/>
			) : (
				<span aria-label={alt} role="img">
					{initials}
				</span>
			)}
		</span>
	);
}

export function MemberAvatarSkeleton({
	className,
	size = "md",
}: {
	className?: string;
	size?: MemberAvatarSize;
}) {
	return (
		<Skeleton
			className={clsx(
				"inline-block shrink-0 !rounded-full border border-transparent",
				sizeClasses[size],
				className,
			)}
		/>
	);
}

export const MemberAvatar = Object.assign(MemberAvatarRoot, {
	Skeleton: MemberAvatarSkeleton,
});
