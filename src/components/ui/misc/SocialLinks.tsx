"use client";

import clsx from "clsx";
import type * as React from "react";
import type { IconName } from "@/components/ui/icons/Icon";
import { Button } from "@/components/ui/primitives/Button";

export type SocialIconName =
	| "discord"
	| "instagram"
	| "linkedin"
	| "linked-in"
	| "meta"
	| "tiktok"
	| "twitter"
	| "x"
	| "youtube"
	| (string & {});

export type SocialLink = {
	disabled?: boolean;
	external?: boolean;
	href: string;
	icon?: SocialIconName;
	label: string;
};

type SocialLinksProps = {
	buttonClassName?: string;
	className?: string;
	excludeIcons?: SocialIconName[];
	iconSize?: number;
	links: SocialLink[];
	showLabels?: boolean;
	size?: React.ComponentProps<typeof Button>["size"];
	variant?: React.ComponentProps<typeof Button>["variant"];
};

const socialIconAliases: Record<string, IconName> = {
	discord: "discord",
	instagram: "instagram",
	linkedIn: "linked-in",
	linkedin: "linked-in",
	meta: "meta",
	tiktok: "tiktok",
	twitter: "x",
	x: "x",
	youtube: "youtube",
};

function normalizeSocialToken(value: string) {
	return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getSocialIconName(link: SocialLink): IconName | null {
	const explicitIcon = link.icon
		? socialIconAliases[normalizeSocialToken(link.icon)]
		: undefined;
	if (explicitIcon) return explicitIcon;

	const labelIcon = socialIconAliases[normalizeSocialToken(link.label)];
	if (labelIcon) return labelIcon;

	try {
		const hostname = new URL(link.href).hostname.replace(/^www\./, "");
		const hostIcon = socialIconAliases[normalizeSocialToken(hostname)];
		if (hostIcon) return hostIcon;
		if (hostname.includes("instagram")) return "instagram";
		if (hostname.includes("tiktok")) return "tiktok";
		if (hostname.includes("twitter") || hostname === "x.com") return "x";
		if (hostname.includes("linkedin")) return "linked-in";
		if (hostname.includes("youtube") || hostname.includes("youtu.be")) {
			return "youtube";
		}
		if (hostname.includes("discord")) return "discord";
		if (hostname.includes("facebook") || hostname.includes("meta"))
			return "meta";
	} catch {
		// Relative URLs or non-URL schemes can still render as labeled links.
	}

	return null;
}

function isExternalHref(href: string) {
	return /^(https?:)?\/\//.test(href);
}

function SocialLinksRoot({
	buttonClassName,
	className,
	excludeIcons = [],
	iconSize = 18,
	links,
	showLabels = false,
	size,
	variant = "secondary",
}: SocialLinksProps) {
	const excludedIcons = new Set(
		excludeIcons.map((icon) => socialIconAliases[normalizeSocialToken(icon)]),
	);
	const resolvedSize = size ?? (showLabels ? "sm" : "icon");
	const visibleLinks = links
		.map((link) => ({ ...link, resolvedIcon: getSocialIconName(link) }))
		.filter((link) => {
			if (link.resolvedIcon && excludedIcons.has(link.resolvedIcon)) {
				return false;
			}
			return showLabels || Boolean(link.resolvedIcon);
		});

	return (
		<div className={clsx("flex flex-wrap items-center gap-2", className)}>
			{visibleLinks.map((link) => {
				const external = link.external ?? isExternalHref(link.href);
				const isIconOnly = !showLabels;

				return (
					<Button
						key={`${link.label}-${link.href}`}
						href={link.href}
						variant={variant}
						size={resolvedSize}
						aria-label={isIconOnly ? link.label : undefined}
						disabled={link.disabled}
						target={external ? "_blank" : undefined}
						rel={external ? "noreferrer" : undefined}
						leadingIcon={link.resolvedIcon ?? undefined}
						iconSize={iconSize}
						className={buttonClassName}
					>
						{showLabels ? link.label : null}
					</Button>
				);
			})}
		</div>
	);
}

function SocialLinksSkeleton({
	className,
	count = 4,
	showLabels = false,
	size,
}: Pick<SocialLinksProps, "className" | "showLabels" | "size"> & {
	count?: number;
}) {
	const resolvedSize = size ?? (showLabels ? "sm" : "icon");
	return (
		<div className={clsx("flex flex-wrap items-center gap-2", className)}>
			{Array.from({ length: count }, (_, index) => `social-${index + 1}`).map(
				(key) => (
					<Button.Skeleton key={key} size={resolvedSize} variant="secondary">
						{showLabels ? "Social link" : undefined}
					</Button.Skeleton>
				),
			)}
		</div>
	);
}

export const SocialLinks = Object.assign(SocialLinksRoot, {
	Skeleton: SocialLinksSkeleton,
});
