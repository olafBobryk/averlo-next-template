"use client";

import type { ComponentProps, ReactNode } from "react";
import { Text } from "@/components/ui/primitives/Text";
import { ProfilePicture } from "./ProfilePicture";

export type DashboardUserPresentation = {
	id: string;
	name: string;
	email: string;
	role?: string;
	profilePictureUrl?: string;
};

type UserProfilePresentationOptions = {
	showText?: boolean;
	loading?: boolean;
	avatarSize?: ComponentProps<typeof ProfilePicture>["size"];
	className?: string;
	textClassName?: string;
	description?: ReactNode;
	emailLink?: boolean;
};

function compareText(left: string, right: string) {
	return left.localeCompare(right, undefined, { sensitivity: "base" });
}

function compareUserIdentity(
	left: DashboardUserPresentation,
	right: DashboardUserPresentation,
) {
	return (
		compareText(left.name, right.name) || compareText(left.email, right.email)
	);
}

export const userPresentation = {
	name: {
		compare: compareUserIdentity,
		render: (user: DashboardUserPresentation) => (
			<span className="min-w-0 block">
				<Text as="span" variant="bodyStrong" className="block truncate">
					{user.name}
				</Text>
				<Text
					as="span"
					variant="caption"
					tone="muted"
					className="block truncate"
				>
					{user.email}
				</Text>
			</span>
		),
	},
	profile: {
		compare: compareUserIdentity,
		render: (
			user: DashboardUserPresentation,
			options?: UserProfilePresentationOptions,
		) => {
			const showText = options?.showText ?? true;
			const avatarLabel = user.name.trim() || user.email || "Dashboard user";

			return (
				<span
					className={[
						"min-w-0 flex items-center gap-3",
						options?.className ?? "",
					].join(" ")}
				>
					<ProfilePicture
						src={user.profilePictureUrl}
						name={avatarLabel}
						loading={options?.loading}
						size={options?.avatarSize ?? "sm"}
					/>
					{showText ? (
						<span
							className={["min-w-0 flex-1", options?.textClassName ?? ""].join(
								" ",
							)}
						>
							<Text as="span" variant="bodyStrong" className="block truncate">
								{user.name}
							</Text>
							{options?.emailLink ? (
								<a
									href={`mailto:${user.email}`}
									onClick={(event) => event.stopPropagation()}
									className="block w-fit max-w-full truncate text-xs font-medium text-muted underline-offset-2 transition-colors motion-interactive hover:text-foreground hover:underline"
								>
									{user.email}
								</a>
							) : (
								<Text
									as="span"
									variant="caption"
									tone="muted"
									className="block truncate"
								>
									{user.email}
								</Text>
							)}
							{options?.description ? (
								<Text
									as="span"
									variant="caption"
									tone="muted"
									className="block truncate"
								>
									{options.description}
								</Text>
							) : null}
						</span>
					) : null}
				</span>
			);
		},
		skeleton: (
			<span className="min-w-0 flex items-center gap-3">
				<ProfilePicture loading size="sm" />
				<span className="min-w-0 flex-1">
					<Text.Skeleton as="span" variant="bodyStrong" className="block">
						Member name
					</Text.Skeleton>
					<Text.Skeleton
						as="span"
						variant="caption"
						tone="muted"
						className="block"
					>
						member@example.com
					</Text.Skeleton>
				</span>
			</span>
		),
	},
};
