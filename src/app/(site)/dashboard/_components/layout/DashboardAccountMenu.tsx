"use client";

import { usePathname, useRouter } from "next/navigation";
import { MoreMenuDropdown } from "@/components/ui/misc/MoreMenuDropdown";
import { Button } from "@/components/ui/primitives/Button";
import { withSafeContinuation } from "@/lib/auth/continuation";
import { dashboardFeatureConfig } from "../../_registry/surfaceRegistry";
import { ProfilePicture } from "../entities/users/ProfilePicture";
import { useDashboardAuth } from "../providers/DashboardAuthProvider";

export function DashboardAccountMenu() {
	const pathname = usePathname();
	const router = useRouter();
	const { loading, logout, memberships, organization, user } =
		useDashboardAuth();
	if (!user) return null;
	const switchHref = `${withSafeContinuation(
		"/select-organization",
		pathname,
	)}&switch=1`;

	async function handleSignOut() {
		await logout();
		router.replace("/login?message=signed-out");
		router.refresh();
	}

	return (
		<MoreMenuDropdown
			align="end"
			ariaLabel="Open account menu"
			menuWidth={290}
			openOnHover={false}
			pinOnClick
			positionStrategy="fixed"
			options={[
				{
					disabled: true,
					id: "account",
					label: `${user.name} · ${organization.name}`,
				},
				{
					href: "/dashboard/settings",
					id: "account-settings",
					label: "Account settings",
					leadingIcon: "gear",
				},
				{
					href: "/dashboard/organization",
					id: "organization",
					label: "Organization",
					leadingIcon: "building",
				},
				...(dashboardFeatureConfig.organizationSwitcher &&
				memberships.length > 1
					? [
							{
								href: switchHref,
								id: "switch-organization",
								label: "Switch organization",
								leadingIcon: "users" as const,
							},
						]
					: []),
				{
					id: "sign-out",
					label: loading ? "Signing out…" : "Sign out",
					leadingIcon: "log-out",
					onSelect: () => void handleSignOut(),
					separatorBefore: true,
					tone: "danger",
				},
			]}
			renderTrigger={(trigger) => (
				<Button
					aria-expanded={trigger.isOpen}
					aria-haspopup="menu"
					aria-label="Open account menu"
					className="!size-10 !rounded-full !p-0"
					onClick={trigger.onRightClick}
					onMouseEnter={trigger.onRootMouseEnter}
					onMouseLeave={trigger.onRootMouseLeave}
					ref={trigger.ref}
					size="icon-sm"
					variant="ghost"
				>
					<ProfilePicture
						className="!size-8"
						name={user.name}
						size="sm"
						src={user.profilePictureUrl}
					/>
				</Button>
			)}
		/>
	);
}
