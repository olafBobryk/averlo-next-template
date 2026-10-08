"use client";

import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icons/Icon";
import { useModal } from "@/components/ui/overlays/modal/useModal";
import { Dropdown } from "@/components/ui/primitives/dropdown";
import { selectOrganization } from "@/lib/api/auth";
import { showToast } from "@/lib/feedback/toast";
import { hrefFor } from "@/lib/routes";
import { getAccountPresentation } from "../../_lib/entities/account/presentation";
import { getDashboardCapabilities } from "../../_registry/surfaceRegistry";
import { AccountIdentity } from "../entities/account/AccountIdentity";
import { ReportIssueModal } from "../feedback/ReportIssueModal";
import { useDashboardAuth } from "../providers/DashboardAuthProvider";

export function DashboardAccountMenu({
	collapsed = false,
	mobileExpanded = false,
}: {
	collapsed?: boolean;
	mobileExpanded?: boolean;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const { openModal } = useModal();
	const openReportIssue = () =>
		openModal(
			({ close, setCloseDisabled }) => (
				<ReportIssueModal
					currentRoute={pathname}
					onClose={close}
					onCloseDisabledChange={setCloseDisabled}
				/>
			),
			{
				ariaLabel: "Report issue",
				cardProps: { maxWidth: "xl" },
				id: "dashboard-report-issue",
			},
		);
	const {
		loading,
		logout,
		membership,
		organization,
		organizationChoices,
		refresh,
		user,
	} = useDashboardAuth();
	if (!user) return null;
	const accountPresentation = getAccountPresentation({
		membership,
		organization,
		user,
	});

	const canManageOrganization = getDashboardCapabilities(
		membership.role,
		user.platformRole,
	).has("organization.manage");
	async function handleOrganizationSelect(id: string) {
		if (id === organization.id) return;
		try {
			await showToast.promise(selectOrganization(id), {
				loading: "Switching organization…",
				success: "Organization switched.",
				error: "The organization could not be switched.",
			});
			await refresh({ silent: true });
			router.refresh();
		} catch {
			/* The shared toast reports switch failures. */
		}
	}

	async function handleSignOut() {
		await logout();
		router.replace(hrefFor("auth.login"));
		router.refresh();
	}

	return (
		<Dropdown.Menu
			align="start"
			ariaLabel="Open account menu"
			menuWidth={290}
			openOnHover={false}
			pinOnClick
			positionStrategy="fixed"
			options={[
				{
					id: "account",
					href: accountPresentation.profileHref,
					label: <AccountIdentity presentation={accountPresentation} />,
					dividerAfter: "full",
					layout: "presentation",
				},
				{
					href: hrefFor("dashboard.settings"),
					id: "account-settings",
					label: "Account settings",
					leadingIcon: <Icon name="gear" size="sm" />,
				},
				{
					id: "organization",
					label: "Organization",
					leadingIcon: <Icon name="building" size="sm" />,
					children: [
						{
							id: "organization-overview",
							label: "Organization overview",
							href: hrefFor("dashboard.organization"),
						},
						...(canManageOrganization
							? [
									{
										id: "organization-settings",
										label: "Organization settings",
										href: hrefFor("dashboard.organization.settings"),
									},
									{
										id: "organization-administration",
										label: "People and invitations",
										href: hrefFor("dashboard.administration"),
									},
								]
							: []),
						{
							id: "switch-organization",
							label: "Switch organization",
							dividerBefore: "inset",
							children: organizationChoices.map((choice) => ({
								id: choice.organization.id,
								label: choice.organization.name,
								active: choice.organization.id === organization.id,
								onSelect: () =>
									void handleOrganizationSelect(choice.organization.id),
							})),
						},
					],
				},
				{
					id: "support",
					href: hrefFor("dashboard.support"),
					label: "Support",
					leadingIcon: <Icon name="question" size="sm" />,
					dividerBefore: "inset",
				},
				{
					id: "report",
					label: "Report issue",
					leadingIcon: <Icon name="flag" size="sm" />,
					onSelect: openReportIssue,
				},
				...(user.platformRole === "admin"
					? [
							{
								id: "platform",
								href: hrefFor("dashboard.platform"),
								label: "Manage platform",
								leadingIcon: <Icon name="shield" size="sm" />,
							},
						]
					: []),
				{
					id: "sign-out",
					label: loading ? "Signing out…" : "Sign out",
					leadingIcon: <Icon name="log-out" size="sm" />,
					onSelect: () => void handleSignOut(),
					tone: "danger",
				},
			]}
			triggerButtonProps={{
				className: "w-full !h-12 !px-0",
				align: "left",
				contentClassName: "w-full justify-start gap-2",
				size: "none",
				variant: "bare",
			}}
			triggerContent={
				<AccountIdentity
					presentation={accountPresentation}
					variant="actor"
					avatarSize="md"
					secondaryLabel={accountPresentation.organizationLabel}
					className="w-full !gap-2"
					textClassName={
						mobileExpanded
							? undefined
							: collapsed
								? "!hidden"
								: "!hidden lg:!grid"
					}
				/>
			}
		/>
	);
}
