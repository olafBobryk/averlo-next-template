import { DashboardEntityCommands } from "../_components/commands/DashboardEntityCommands";
import { RecordCollectionClient } from "../_components/entities/record/RecordCollectionClient";
import { DashboardSection } from "../_components/layout/DashboardSection";
import {
	getMemberCommand,
	getMemberPresentation,
} from "../_lib/entities/member/presentation";
import {
	getRecordCommand,
	getRecordPresentation,
} from "../_lib/entities/record/presentation";
import { listReferenceMembers } from "../_lib/fixtures/reference-members.server";
import { listReferenceRecords } from "../_lib/fixtures/reference-records.server";
import { requireDashboardCapability } from "../_registry/access.server";

export default async function DashboardRecordsPage() {
	const { capabilities, context } =
		await requireDashboardCapability("records.read");
	const records = listReferenceRecords(context.organization.id);
	const members = listReferenceMembers(context.organization.id).map(
		getMemberPresentation,
	);
	return (
		<DashboardSection
			description={`Organization-scoped reference entities for ${context.organization.name}.`}
			title="Records"
		>
			<DashboardEntityCommands
				commands={[
					...records.map(getRecordPresentation).map(getRecordCommand),
					...members.map(getMemberCommand),
				]}
				ownerId="dashboard.records.entities"
			/>
			<RecordCollectionClient
				canWrite={capabilities.has("records.write")}
				initialRecords={records}
				members={members}
				organizationName={context.organization.name}
			/>
		</DashboardSection>
	);
}
