import { notFound } from "next/navigation";
import { DashboardEntityCommands } from "../../_components/commands/DashboardEntityCommands";
import { RecordDetailActions } from "../../_components/entities/record/RecordDetailActions";
import { RecordDetailContent } from "../../_components/entities/record/RecordDetailContent";
import { DashboardSection } from "../../_components/layout/DashboardSection";
import {
	getMemberCommand,
	getMemberPresentation,
} from "../../_lib/entities/member/presentation";
import {
	getRecordCommand,
	getRecordPresentation,
} from "../../_lib/entities/record/presentation";
import { listReferenceMembers } from "../../_lib/fixtures/reference-members.server";
import { getReferenceRecord } from "../../_lib/fixtures/reference-records.server";
import { requireDashboardCapability } from "../../_registry/access.server";

export default async function DashboardRecordPage({
	params,
	searchParams,
}: {
	params: Promise<{ recordId: string }>;
	searchParams: Promise<{ "debug-mutation"?: string }>;
}) {
	const { recordId } = await params;
	const query = await searchParams;
	const { capabilities, context } =
		await requireDashboardCapability("records.read");
	const record = getReferenceRecord(context.organization.id, recordId);
	if (!record) notFound();
	const members = listReferenceMembers(context.organization.id).map(
		getMemberPresentation,
	);
	const presentation = getRecordPresentation(record);
	return (
		<DashboardSection
			actions={
				<RecordDetailActions
					canWrite={capabilities.has("records.write")}
					members={members}
					record={record}
				/>
			}
			description={`Reference detail in ${context.organization.name}.`}
			title={presentation.title}
		>
			<DashboardEntityCommands
				commands={[
					getRecordCommand(presentation),
					...members.map(getMemberCommand),
				]}
				ownerId={`dashboard.record.entities.${record.id}`}
			/>
			<RecordDetailContent
				canWrite={capabilities.has("records.write")}
				members={members}
				record={record}
				simulateFailure={query["debug-mutation"] === "fail"}
			/>
		</DashboardSection>
	);
}
