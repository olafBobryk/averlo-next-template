"use client";

import { OrganizationSelectionCard } from "@/app/(site)/_components/organization/OrganizationSelectionCard";
import { Icon } from "@/components/ui/icons/Icon";
import { Chip } from "@/components/ui/misc";
import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import { Text } from "@/components/ui/primitives/Text";
// prune:dashboard.reference-entities:start
import { memberFieldDefinitions } from "../../_lib/entities/member/presentation";
// prune:dashboard.reference-entities:end
import { toOrganizationEntity } from "../../_lib/entities/organization/domain";
import { getOrganizationPresentation } from "../../_lib/entities/organization/presentation";
import { getDashboardCapabilities } from "../../_registry/surfaceRegistry";
import DashboardAdministrationLoading from "../../administration/loading";
import { OrganizationSettingsSection } from "../../organization/settings/_components/OrganizationSettingsSection";
import {
	PlatformCollectionLoading,
	PlatformDetailLoading,
	PlatformOverviewLoading,
} from "../../platform/_components/PlatformRouteLoading";
import DashboardProfileLoading from "../../profile/loading";
// prune:dashboard.reference-entities:start
import { DashboardEntityReferenceLoadingComposition } from "../../reference/entities/EntitySkeletonReference";
// prune:dashboard.reference-entities:end
import { DashboardSettingsLoadingView } from "../../settings/_components/DashboardSettingsLoadingView";
import { DashboardDetailField } from "../detail/DashboardDetailField";
import { MemberIdentity } from "../entities/member/MemberIdentity";
import { MemberRoleChip } from "../entities/member/MemberRoleChip";
import { OrganizationIdentity } from "../entities/organization/OrganizationIdentity";
// prune:dashboard.reference-entities:start
import { RecordCollectionClient } from "../entities/record/RecordCollectionClient";
import { RecordDetailActions } from "../entities/record/RecordDetailActions";
import { RecordDetailContent } from "../entities/record/RecordDetailContent";
// prune:dashboard.reference-entities:end
import { DashboardSection } from "../layout/DashboardSection";
import { useDashboardAuth } from "../providers/DashboardAuthProvider";

function LoadingStatus({
	children,
	label,
}: {
	children: React.ReactNode;
	label: string;
}) {
	return (
		<div aria-busy="true" aria-label={label} role="status">
			{children}
		</div>
	);
}

export function DashboardOverviewLoadingView() {
	return (
		<LoadingStatus label="Loading dashboard overview">
			<DashboardSection
				contentClassName="grid gap-4"
				description="Quick access to your organization, records, and account settings."
				title="Overview"
			>
				<DashboardOverviewCard
					description="Review members, roles, and organization administration."
					href="/dashboard/organization"
					icon="building"
					label="Open organization"
					title="Organization"
				/>
				{/* prune:dashboard.reference-entities:start */}
				<DashboardOverviewCard
					description="Browse and manage records for the active organization."
					href="/dashboard/records"
					icon="database"
					label="Open records"
					title="Records"
				/>
				{/* prune:dashboard.reference-entities:end */}
				<DashboardOverviewCard
					description="Manage your profile, security, and accessibility preferences."
					href="/dashboard/settings"
					icon="gear"
					label="Open account settings"
					title="Account"
				/>
			</DashboardSection>
		</LoadingStatus>
	);
}

function DashboardOverviewCard({
	description,
	href,
	icon,
	label,
	title,
}: {
	description: string;
	href: string;
	icon: React.ComponentProps<typeof Icon>["name"];
	label: string;
	title: string;
}) {
	return (
		<Card>
			<Card.Header className="border-b">
				<Card.Title className="inline-flex items-center gap-2">
					<Icon name={icon} size="sm" />
					{title}
				</Card.Title>
				<Card.Description>{description}</Card.Description>
			</Card.Header>
			<Card.Content>
				<Button href={href} size="sm" variant="secondary">
					{label}
				</Button>
			</Card.Content>
		</Card>
	);
}

export function DashboardOrganizationLoadingView() {
	const { membership, user } = useDashboardAuth();
	const canManage = Boolean(
		user &&
			getDashboardCapabilities(membership.role, user.platformRole).has(
				"organization.manage",
			),
	);
	return (
		<LoadingStatus label="Loading organization">
			<DashboardSection
				actions={
					canManage ? (
						<Button.Skeleton size="sm" variant="primary">
							Organization settings
						</Button.Skeleton>
					) : null
				}
				contentClassName="grid gap-5"
				title="Organization"
			>
				<Card>
					<Card.Header className="border-b">
						<Card.Title className="inline-flex items-center gap-2">
							<Icon
								className="text-muted-foreground"
								name="building"
								size="sm"
							/>
							Organization identity
						</Card.Title>
						<Card.Description>
							The active organization for this dashboard session.
						</Card.Description>
					</Card.Header>
					<Card.Content className="grid gap-5">
						<OrganizationIdentity.Skeleton avatarSize="xl" />
						<dl className="grid gap-4 border-t border-border/70 pt-5 sm:grid-cols-2">
							<DashboardDetailField.Skeleton
								icon={<Icon name="building" size="sm" />}
								label="Name"
								value="Demo organization"
							/>
							<DashboardDetailField.Skeleton
								copyable
								icon={<Icon name="at" size="sm" />}
								label="Slug"
								value="demo"
							/>
							<DashboardDetailField.Skeleton
								icon={<Icon name="shield" size="sm" />}
								label="Your role"
								truncateValue={false}
							>
								<Chip.Skeleton>Owner</Chip.Skeleton>
							</DashboardDetailField.Skeleton>
							<DashboardDetailField.Skeleton
								icon={<Icon name="users" size="sm" />}
								label="Organization mode"
								value="Multi-organization"
							/>
						</dl>
					</Card.Content>
				</Card>
				<Text as="p" className="w-full text-sm leading-6" tone="muted">
					Looking for something specific and cannot find it?{" "}
					<Button
						className="inline-flex align-baseline font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
						href="/dashboard/support"
						size="none"
						variant="ghost"
					>
						Contact support
					</Button>
					. Looking for the account settings page?{" "}
					<Button
						className="inline-flex align-baseline font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
						href="/dashboard/settings"
						size="none"
						variant="ghost"
					>
						Open account settings
					</Button>
					.
				</Text>
			</DashboardSection>
		</LoadingStatus>
	);
}

// prune:dashboard.reference-entities:start
export function DashboardMemberDetailLoadingView() {
	return (
		<LoadingStatus label="Loading member details">
			<DashboardSection
				actions={
					<Button.Skeleton size="sm" variant="primary">
						Settings
					</Button.Skeleton>
				}
				contentClassName="grid gap-5"
				title={
					<Text.Skeleton as="span" variant="headingPage">
						Example member
					</Text.Skeleton>
				}
			>
				<Card>
					<Card.Header className="border-b">
						<Card.Title className="flex items-center gap-2">
							<Icon className="text-muted-foreground" name="user" size="sm" />
							Member details
						</Card.Title>
						<Card.Description>
							Access information visible to organization members.
						</Card.Description>
					</Card.Header>
					<Card.Content className="grid gap-5">
						<MemberIdentity.Skeleton variant="profile" />
						<dl className="grid gap-4 border-t border-border/70 pt-5 sm:grid-cols-2">
							<DashboardDetailField.Skeleton
								copyable
								icon={
									<Icon
										name={memberFieldDefinitions[1].icon ?? "mail"}
										size="sm"
									/>
								}
								label={memberFieldDefinitions[1].label}
								value="member@example.com"
							/>
							<DashboardDetailField.Skeleton
								icon={
									<Icon
										name={memberFieldDefinitions[3].icon ?? "calendar"}
										size="sm"
									/>
								}
								label={memberFieldDefinitions[3].label}
								value="20 Jul 2026"
							/>
						</dl>
					</Card.Content>
				</Card>
				<Card>
					<Card.Header className="border-b">
						<Card.Title className="flex items-center gap-2">
							<Icon className="text-muted-foreground" name="shield" size="sm" />
							Role and permissions
						</Card.Title>
						<Card.Description>
							Organization access assigned to this member.
						</Card.Description>
					</Card.Header>
					<Card.Content className="grid gap-5">
						<dl className="grid gap-4 sm:grid-cols-2">
							<DashboardDetailField.Skeleton
								icon={<Icon name="shield" size="sm" />}
								label="Organization role"
								truncateValue={false}
							>
								<MemberRoleChip.Skeleton />
							</DashboardDetailField.Skeleton>
							<DashboardDetailField.Skeleton
								icon={<Icon name="check" size="sm" />}
								label="Permissions"
								truncateValue={false}
							>
								<span className="flex flex-wrap gap-2">
									<Chip.Skeleton>Profiles</Chip.Skeleton>
									<Chip.Skeleton>Invites</Chip.Skeleton>
									<Chip.Skeleton>Access</Chip.Skeleton>
									<Chip.Skeleton>Ownership</Chip.Skeleton>
								</span>
							</DashboardDetailField.Skeleton>
						</dl>
					</Card.Content>
				</Card>
				<Text as="p" className="w-full text-sm leading-6" tone="muted">
					Looking for something specific and cannot find it?{" "}
					<Button
						className="inline-flex align-baseline font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
						href="/dashboard/support"
						size="none"
						variant="ghost"
					>
						Contact support
					</Button>
					. Looking for settings?{" "}
					<Button
						className="inline-flex align-baseline font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
						href="/dashboard/settings"
						size="none"
						variant="ghost"
					>
						Settings
					</Button>
					.
				</Text>
			</DashboardSection>
		</LoadingStatus>
	);
}

export function DashboardRecordsLoadingView() {
	const { membership, organization } = useDashboardAuth();
	const capabilities = getDashboardCapabilities(membership.role);
	return (
		<LoadingStatus label="Loading records">
			<DashboardSection
				description={`Organization-scoped reference entities for ${organization.name}.`}
				title="Records"
			>
				<RecordCollectionClient.Skeleton
					canWrite={capabilities.has("records.write")}
					organizationName={organization.name}
				/>
			</DashboardSection>
		</LoadingStatus>
	);
}

export function DashboardRecordDetailLoadingView() {
	const { membership, organization } = useDashboardAuth();
	const canWrite = getDashboardCapabilities(membership.role).has(
		"records.write",
	);
	return (
		<LoadingStatus label="Loading record details">
			<DashboardSection
				actions={<RecordDetailActions.Skeleton canWrite={canWrite} />}
				description={`Reference detail in ${organization.name}.`}
				title={
					<Text.Skeleton as="span" variant="headingPage">
						North star
					</Text.Skeleton>
				}
			>
				<RecordDetailContent.Skeleton canWrite={canWrite} />
			</DashboardSection>
		</LoadingStatus>
	);
}
// prune:dashboard.reference-entities:end

export function DashboardOrganizationSettingsLoadingView() {
	return (
		<LoadingStatus label="Loading organization settings">
			<DashboardSection
				contentClassName="grid gap-5"
				title="Organization settings"
			>
				<OrganizationSettingsSection.Skeleton />
			</DashboardSection>
		</LoadingStatus>
	);
}

export function DashboardOrganizationSwitchLoadingView() {
	const { organization, organizationChoices } = useDashboardAuth();
	const choices = organizationChoices.map(
		({ membership, organization: choice }) => {
			const presentation = getOrganizationPresentation(
				toOrganizationEntity(choice, membership.role),
			);
			return {
				current: choice.id === organization.id,
				displayLabel: presentation.displayLabel,
				key: membership.id,
				secondaryLabel: presentation.secondaryLabel,
			};
		},
	);
	return (
		<section
			aria-busy="true"
			aria-label="Loading organization switcher"
			className="flex min-h-[calc(100svh-10rem)] items-center justify-center py-6 sm:py-10"
			role="status"
		>
			<OrganizationSelectionCard.Skeleton choices={choices} />
		</section>
	);
}

// prune:dashboard.reference-entities:start
export function DashboardEntityReferenceLoadingView() {
	return (
		<LoadingStatus label="Loading entity presentation reference">
			<DashboardEntityReferenceLoadingComposition />
		</LoadingStatus>
	);
}
// prune:dashboard.reference-entities:end

export function DashboardForcedLoadingView({ pathname }: { pathname: string }) {
	if (pathname === "/dashboard/profile") return <DashboardProfileLoading />;
	if (pathname === "/dashboard/administration") {
		return <DashboardAdministrationLoading />;
	}
	if (pathname === "/dashboard/platform") {
		return <PlatformOverviewLoading />;
	}
	if (/^\/dashboard\/platform\/inbox\/[^/]+$/.test(pathname)) {
		return (
			<PlatformDetailLoading
				description="Loading support request context"
				label="Loading support request"
				title="Support request"
			/>
		);
	}
	if (pathname === "/dashboard/platform/inbox") {
		return (
			<PlatformCollectionLoading
				columns={[
					{ id: "requester", label: "Requester" },
					{ id: "subject", label: "Subject" },
					{ id: "organization", label: "Organization" },
					{ id: "status", label: "Status" },
					{ id: "created", label: "Created" },
					{ id: "actions", kind: "action", label: "Actions" },
				]}
				description="Review fixture-only support requests submitted from authenticated dashboards."
				label="Loading Platform Inbox"
				title="Inbox"
			/>
		);
	}
	if (/^\/dashboard\/platform\/reports\/[^/]+$/.test(pathname)) {
		return (
			<PlatformDetailLoading
				description="Loading captured route and browser context"
				label="Loading product report"
				title="Product report"
			/>
		);
	}
	if (pathname === "/dashboard/platform/reports") {
		return (
			<PlatformCollectionLoading
				columns={[
					{ id: "reporter", label: "Reporter" },
					{ id: "organization", label: "Organization" },
					{ id: "route", label: "Route" },
					{ id: "severity", label: "Severity" },
					{ id: "status", label: "Status" },
					{ id: "created", label: "Created" },
					{ id: "actions", kind: "action", label: "Actions" },
				]}
				description="Triage structured product feedback with its captured dashboard context."
				label="Loading Platform Reports"
				title="Reports"
			/>
		);
	}
	if (pathname === "/dashboard/settings")
		return <DashboardSettingsLoadingView />;
	if (pathname === "/dashboard/organization/settings") {
		return <DashboardOrganizationSettingsLoadingView />;
	}
	if (pathname === "/dashboard/organization/switch") {
		return <DashboardOrganizationSwitchLoadingView />;
	}
	if (pathname === "/dashboard/organization") {
		return <DashboardOrganizationLoadingView />;
	}
	// prune:dashboard.reference-entities:start
	if (/^\/dashboard\/organization\/members\/[^/]+$/.test(pathname)) {
		return <DashboardMemberDetailLoadingView />;
	}
	if (pathname === "/dashboard/organization/members") {
		return <DashboardAdministrationLoading />;
	}
	if (/^\/dashboard\/records\/[^/]+$/.test(pathname)) {
		return <DashboardRecordDetailLoadingView />;
	}
	if (pathname === "/dashboard/records") return <DashboardRecordsLoadingView />;
	if (
		pathname === "/dashboard/reference/entities" ||
		pathname === "/dashboard/reference/skeletons"
	) {
		return <DashboardEntityReferenceLoadingView />;
	}
	// prune:dashboard.reference-entities:end
	return <DashboardOverviewLoadingView />;
}
