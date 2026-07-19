import { Icon } from "@/components/ui/icons/Icon";
import { Accordion } from "@/components/ui/misc/Accordion";
import { Card } from "@/components/ui/primitives/Card";
import { Text } from "@/components/ui/primitives/Text";
import { DashboardTablePanel } from "../../_components/data/DashboardTablePanel";
import { DashboardDetailField } from "../../_components/detail/DashboardDetailField";
import { DashboardEntityState } from "../../_components/entities/DashboardEntityState";
import { MemberAvatarList } from "../../_components/entities/member/MemberAvatarList";
import { MemberIdentity } from "../../_components/entities/member/MemberIdentity";
import { MemberMention } from "../../_components/entities/member/MemberMention";
import { MemberRoleChip } from "../../_components/entities/member/MemberRoleChip";
import { MemberSelectorDemo } from "../../_components/entities/member/MemberSelectorDemo";
import { RecordStatusChip } from "../../_components/entities/record/RecordStatusChip";
import { DashboardSection } from "../../_components/layout/DashboardSection";
import {
	getMemberPresentation,
	memberPresentationDefinition,
} from "../../_lib/entities/member/presentation";
import {
	getRecordPresentation,
	recordColumnDefinitions,
} from "../../_lib/entities/record/presentation";
import { listReferenceMembers } from "../../_lib/fixtures/reference-members.server";
import { listReferenceRecords } from "../../_lib/fixtures/reference-records.server";
import { requireDashboardCapability } from "../../_registry/access.server";

export default async function DashboardEntityReferencePage() {
	const { context } = await requireDashboardCapability("debug.use");
	const members = listReferenceMembers(context.organization.id).map(
		getMemberPresentation,
	);
	const records = listReferenceRecords(context.organization.id).slice(0, 2);
	const exampleMember = members[0];
	return (
		<DashboardSection
			description="Dashboard-owned entity contracts, fetch-free renderers, and live-versus-skeleton parity."
			title="Entity presentation reference"
		>
			<div className="grid gap-5 xl:grid-cols-2">
				<Card>
					<Card.Header className="border-b">
						<Card.Title>Member presentation · live</Card.Title>
						<Card.Description>
							Profile, compact, actor, avatar list, mention, and role all
							consume one resolved view model.
						</Card.Description>
					</Card.Header>
					<Card.Content className="grid gap-5">
						{exampleMember ? (
							<>
								<MemberIdentity
									presentation={exampleMember}
									variant="profile"
								/>
								<MemberIdentity
									href
									presentation={exampleMember}
									variant="compact"
								/>
								<div className="flex flex-wrap items-center gap-4">
									<MemberIdentity
										href
										presentation={exampleMember}
										variant="actor"
									/>
									<MemberAvatarList members={members} />
									<MemberMention presentation={exampleMember} />
									<MemberRoleChip
										label={exampleMember.role.shortLabel}
										tone={exampleMember.role.tone}
									/>
								</div>
								<MemberSelectorDemo members={members} />
							</>
						) : (
							<DashboardEntityState
								description={
									memberPresentationDefinition.emptyState.description
								}
								iconName={memberPresentationDefinition.emptyState.icon}
								title={memberPresentationDefinition.emptyState.title}
							/>
						)}
					</Card.Content>
				</Card>

				<Card>
					<Card.Header className="border-b">
						<Card.Title>Member presentation · skeleton</Card.Title>
						<Card.Description>
							The owning components reserve the same avatar, text, border, and
							gap geometry.
						</Card.Description>
					</Card.Header>
					<Card.Content className="grid gap-5">
						<MemberIdentity.Skeleton variant="profile" />
						<MemberIdentity.Skeleton variant="compact" />
						<MemberIdentity.Skeleton variant="actor" />
						<DashboardDetailField.Skeleton
							label="Member detail"
							value="Example member"
						/>
					</Card.Content>
				</Card>
			</div>

			<div className="grid gap-5 xl:grid-cols-2">
				<DashboardTablePanel
					columns={[
						{
							header: recordColumnDefinitions[0].label,
							id: recordColumnDefinitions[0].id,
							render: (record) => getRecordPresentation(record).title,
						},
						{
							header: recordColumnDefinitions[1].label,
							id: recordColumnDefinitions[1].id,
							render: (record) => {
								const status = getRecordPresentation(record).status;
								return (
									<RecordStatusChip
										label={status.shortLabel}
										tone={status.tone}
									/>
								);
							},
							rowLink: false,
						},
						{
							header: recordColumnDefinitions[2].label,
							id: recordColumnDefinitions[2].id,
							render: (record) => getRecordPresentation(record).updatedAtLabel,
						},
					]}
					description="The same record presentation columns used by the product route."
					getRowHref={(record) => getRecordPresentation(record).href}
					getRowKey={(record) => record.id}
					minWidth="520px"
					rows={records}
					title="Record table · live"
				/>
				<DashboardTablePanel.Skeleton
					columns={recordColumnDefinitions.map((column) => ({
						id: column.id,
						label: column.label,
					}))}
					description="The table namespace owns loading geometry."
					title="Record table · skeleton"
				/>
			</div>

			<div className="grid gap-5 xl:grid-cols-2">
				<Card>
					<Card.Header className="border-b">
						<Card.Title>Disclosure · live</Card.Title>
					</Card.Header>
					<Card.Content>
						<Accordion title="Presentation boundary" defaultOpen>
							<Text tone="muted" variant="support">
								Routes resolve organization data; presentation components
								receive ready view models and never fetch.
							</Text>
						</Accordion>
					</Card.Content>
				</Card>
				<Card>
					<Card.Header className="border-b">
						<Card.Title>Disclosure · skeleton</Card.Title>
					</Card.Header>
					<Card.Content>
						<Accordion.Skeleton />
					</Card.Content>
				</Card>
			</div>

			<Card>
				<Card.Header className="border-b">
					<Card.Title className="inline-flex items-center gap-2">
						<Icon name="cards" size="sm" />
						Copyable ownership pattern
					</Card.Title>
					<Card.Description>
						Import the owning factory and renderer directly; do not create a
						global presentation registry.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-xs">
						<code>{`const presentation = getMemberPresentation(member);\n<MemberIdentity presentation={presentation} variant="compact" />`}</code>
					</pre>
				</Card.Content>
			</Card>
		</DashboardSection>
	);
}
