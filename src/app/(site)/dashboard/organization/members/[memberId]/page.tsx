import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/icons/Icon";
import { Card } from "@/components/ui/primitives/Card";
import { DashboardEntityCommands } from "../../../_components/commands/DashboardEntityCommands";
import { DashboardDetailField } from "../../../_components/detail/DashboardDetailField";
import { MemberIdentity } from "../../../_components/entities/member/MemberIdentity";
import { MemberMention } from "../../../_components/entities/member/MemberMention";
import { MemberRoleChip } from "../../../_components/entities/member/MemberRoleChip";
import { DashboardSection } from "../../../_components/layout/DashboardSection";
import {
	getMemberCommand,
	getMemberPresentation,
	memberFieldDefinitions,
} from "../../../_lib/entities/member/presentation";
import { getReferenceMember } from "../../../_lib/fixtures/reference-members.server";
import { requireDashboardCapability } from "../../../_registry/access.server";

export default async function DashboardMemberDetailPage({
	params,
}: {
	params: Promise<{ memberId: string }>;
}) {
	const { memberId } = await params;
	const { context } = await requireDashboardCapability("organization.read");
	const member = getReferenceMember(context.organization.id, memberId);
	if (!member) notFound();
	const presentation = getMemberPresentation(member);
	return (
		<DashboardSection
			breadcrumbLabel={presentation.displayLabel}
			description={`Organization membership in ${context.organization.name}.`}
			title={presentation.displayLabel}
		>
			<DashboardEntityCommands
				commands={[getMemberCommand(presentation)]}
				ownerId={`dashboard.member.${member.id}`}
			/>
			<Card>
				<Card.Header className="border-b">
					<MemberIdentity presentation={presentation} variant="profile" />
					<Card.Action>
						<MemberRoleChip
							label={presentation.role.shortLabel}
							tone={presentation.role.tone}
						/>
					</Card.Action>
				</Card.Header>
				<Card.Content>
					<dl className="grid gap-5 sm:grid-cols-2">
						<DashboardDetailField
							copyValue={presentation.emailLabel}
							icon={
								<Icon
									name={memberFieldDefinitions[1].icon ?? "mail"}
									size="sm"
								/>
							}
							label={memberFieldDefinitions[1].label}
							value={presentation.emailLabel}
						/>
						<DashboardDetailField
							icon={
								<Icon
									name={memberFieldDefinitions[2].icon ?? "shield"}
									size="sm"
								/>
							}
							label={memberFieldDefinitions[2].label}
							value={presentation.role.label}
						/>
						<DashboardDetailField
							icon={
								<Icon
									name={memberFieldDefinitions[3].icon ?? "calendar"}
									size="sm"
								/>
							}
							label={memberFieldDefinitions[3].label}
							value={presentation.joinedAtLabel}
						/>
						<DashboardDetailField
							icon={<Icon name="link" size="sm" />}
							label="Markdown mention"
							truncateValue={false}
							value={<MemberMention presentation={presentation} />}
						/>
					</dl>
				</Card.Content>
			</Card>
		</DashboardSection>
	);
}
