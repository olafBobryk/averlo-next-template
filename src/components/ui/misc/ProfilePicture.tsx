"use client";

import clsx from "clsx";
import Image from "next/image";
import * as React from "react";
import { Text } from "../primitives/Text";
import { Pill } from "./Pill";
import { Skeleton } from "./Skeleton";

const sizeMap = {
	sm: { px: 40, className: "h-10 w-10 text-sm" },
	md: { px: 40, className: "h-10 w-10 text-sm" },
	lg: { px: 96, className: "h-24 w-24 text-2xl" },
} as const;

const HELPER_PALETTE_SIZE = 8;

function getAvatarHelperIndex(initial: string) {
	return initial.charCodeAt(0) % HELPER_PALETTE_SIZE;
}

export type ProfilePictureProps = {
	src?: string;
	name?: string | null;
	size?: keyof typeof sizeMap;
	loading?: boolean;
	className?: string;
};

export function ProfilePicture({
	src,
	name,
	size = "md",
	loading = false,
	className,
}: ProfilePictureProps) {
	const [imgError, setImgError] = React.useState(false);
	const { px, className: sizeClass } = sizeMap[size];
	const initial = name?.trim().charAt(0).toUpperCase() || "D";
	const showImage = src && !imgError;
	const helperIndex = getAvatarHelperIndex(initial);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset error when src changes
	React.useEffect(() => {
		setImgError(false);
	}, [src]);

	const baseClass = clsx(
		"shrink-0 overflow-hidden flex items-center justify-center font-semibold",
		sizeClass,
		className,
	);

	if (loading) {
		return <Skeleton className={clsx("rounded-full", sizeClass, className)} />;
	}

	if (showImage) {
		return (
			<Pill tone="plain" className={baseClass}>
				<Image
					src={src}
					alt={name ?? "Profile picture"}
					width={px}
					height={px}
					className="h-full w-full object-cover"
					onError={() => setImgError(true)}
				/>
			</Pill>
		);
	}

	return (
		<Pill tone="helper" helperIndex={helperIndex} className={baseClass}>
			<span className="w-full h-full flex items-center justify-center">
				<Text variant="bodyStrong" theme="inherit" tone="inherit">
					{name ? (name.startsWith("Unknown") ? "?" : initial) : "?"}
				</Text>
			</span>
		</Pill>
	);
}
