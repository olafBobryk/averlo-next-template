"use client";

import * as React from "react";
import { MarkdownRenderer } from "@/components/composites/markdown/MarkdownRenderer";
import { Icon } from "@/components/ui/icons/Icon";
import { moreMenuOptions } from "@/components/ui/misc/MoreMenuDropdown";
import { Card } from "@/components/ui/primitives/Card";
import { Text } from "@/components/ui/primitives/Text";
import { showToast } from "@/lib/feedback/toast";
import type { MemberPresentation } from "../../../_lib/entities/member/presentation";
import type {
	ReferenceRecord,
	ReferenceRecordProperty,
} from "../../../_lib/entities/record/domain";
import {
	getRecordPresentation,
	recordFieldDefinitions,
} from "../../../_lib/entities/record/presentation";
import { updateReferenceRecordAction } from "../../../records/_actions";
import { DashboardDetailField } from "../../detail/DashboardDetailField";
import { DashboardMarkdownEditorModalButton } from "../../detail/DashboardMarkdownEditorModalButton";
import { DashboardPropertyList } from "../../detail/DashboardPropertyList";
import { MemberIdentity } from "../member/MemberIdentity";
import { MemberMention } from "../member/MemberMention";
import { RecordStatusChip } from "./RecordStatusChip";

const availableProperties = [
	{ id: "audience", label: "Audience", value: "Product team" },
	{ id: "cadence", label: "Review cadence", value: "Monthly" },
	{ id: "priority", label: "Priority", value: "Normal" },
] as const;

export function RecordDetailContent({
	canWrite,
	members,
	record: initialRecord,
	simulateFailure,
}: {
	canWrite: boolean;
	members: readonly MemberPresentation[];
	record: ReferenceRecord;
	simulateFailure: boolean;
}) {
	const [record, setRecord] = React.useState(initialRecord);
	React.useEffect(() => setRecord(initialRecord), [initialRecord]);
	const presentation = getRecordPresentation(record);
	const memberById = new Map(members.map((member) => [member.id, member]));
	const owner = record.ownerMemberId
		? memberById.get(record.ownerMemberId)
		: null;
	async function saveProperties(
		properties: readonly ReferenceRecordProperty[],
	) {
		const previous = record;
		setRecord({ ...record, properties });
		const result = await updateReferenceRecordAction(
			record.id,
			{ properties },
			simulateFailure,
		);
		if (!result.ok) {
			setRecord(previous);
			showToast.error(result.message, { title: "Property update failed" });
			return;
		}
		setRecord(result.record);
		showToast.success(result.message);
	}
	return (
		<div className="grid gap-5">
			<Card>
				<Card.Header className="border-b">
					<Card.Title>Record details</Card.Title>
					<Card.Description>
						Field metadata comes from the record-owned presentation definition.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
						<DashboardDetailField
							copyValue={record.slug}
							icon={
								<Icon
									name={recordFieldDefinitions[1].icon ?? "link"}
									size="sm"
								/>
							}
							label={recordFieldDefinitions[1].label}
							value={presentation.slugLabel}
						/>
						<DashboardDetailField
							icon={
								<Icon
									name={recordFieldDefinitions[2].icon ?? "flag"}
									size="sm"
								/>
							}
							label={recordFieldDefinitions[2].label}
							truncateValue={false}
							value={
								<RecordStatusChip
									label={presentation.status.shortLabel}
									tone={presentation.status.tone}
								/>
							}
						/>
						<DashboardDetailField
							icon={<Icon name="user" size="sm" />}
							label="Owner"
							truncateValue={false}
							value={
								owner ? (
									<MemberIdentity
										avatarSize="sm"
										href
										presentation={owner}
										variant="actor"
									/>
								) : (
									"Unassigned"
								)
							}
						/>
						<DashboardDetailField
							icon={
								<Icon
									name={recordFieldDefinitions[3].icon ?? "calendar"}
									size="sm"
								/>
							}
							label={recordFieldDefinitions[3].label}
							value={presentation.updatedAtLabel}
						/>
					</dl>
				</Card.Content>
			</Card>

			<Card>
				<Card.Header className="border-b">
					<Card.Title>Description</Card.Title>
					<Card.Description>
						Rendered with the shared Markdown renderer and edited in a focused
						dashboard modal.
					</Card.Description>
					{canWrite ? (
						<Card.Action>
							<DashboardMarkdownEditorModalButton
								description="Markdown supports organization-member mentions."
								initialMarkdown={record.descriptionMarkdown}
								mentions={members.map((member) => ({
									id: member.id,
									label: member.displayLabel,
								}))}
								modalId={`record-markdown-${record.id}`}
								onSave={async (descriptionMarkdown) => {
									const result = await updateReferenceRecordAction(
										record.id,
										{ descriptionMarkdown },
										simulateFailure,
									);
									if (!result.ok) {
										return {
											error: result.message,
											message: result.message,
											ok: false,
										};
									}
									setRecord(result.record);
									return { message: result.message, ok: true };
								}}
								title={`Edit ${presentation.title} description`}
							/>
						</Card.Action>
					) : null}
				</Card.Header>
				<Card.Content className="prose prose-sm max-w-none dark:prose-invert">
					{record.descriptionMarkdown ? (
						<MarkdownRenderer markdown={record.descriptionMarkdown} />
					) : (
						<Text tone="muted">No description yet.</Text>
					)}
					{owner ? (
						<Text className="mt-4" tone="muted" variant="caption">
							Mention example: <MemberMention presentation={owner} />
						</Text>
					) : null}
				</Card.Content>
			</Card>

			<DashboardPropertyList>
				<DashboardPropertyList.Header
					onAdd={
						canWrite
							? (id) => {
									const definition = availableProperties.find(
										(item) => item.id === id,
									);
									if (
										!definition ||
										record.properties.some((property) => property.id === id)
									)
										return;
									void saveProperties([...record.properties, definition]);
								}
							: undefined
					}
					options={availableProperties.filter(
						(option) =>
							!record.properties.some((property) => property.id === option.id),
					)}
				/>
				<DashboardPropertyList.Rows>
					{record.properties.map((property) => (
						<DashboardPropertyList.Row
							icon={<Icon name="link" size="sm" />}
							key={property.id}
							label={property.label}
							menuOptions={
								canWrite
									? [
											moreMenuOptions.delete({
												label: "Remove property",
												onSelect: () =>
													void saveProperties(
														record.properties.filter(
															(item) => item.id !== property.id,
														),
													),
											}),
										]
									: undefined
							}
						>
							{property.value}
						</DashboardPropertyList.Row>
					))}
				</DashboardPropertyList.Rows>
			</DashboardPropertyList>
		</div>
	);
}
