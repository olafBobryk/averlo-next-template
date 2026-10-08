"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { DashboardDetailField } from "@/app/(site)/dashboard/_components/detail/DashboardDetailField";
import { MemberIdentity } from "@/app/(site)/dashboard/_components/entities/member/MemberIdentity";
import { OrganizationIdentity } from "@/app/(site)/dashboard/_components/entities/organization/OrganizationIdentity";
import { DashboardSection } from "@/app/(site)/dashboard/_components/layout/DashboardSection";
import { updateProductReport } from "@/app/(site)/dashboard/_lib/platform/api.client";
import {
	FEEDBACK_STATUSES,
	type FeedbackStatus,
	type ProductReport,
} from "@/app/(site)/dashboard/_lib/platform/contracts";
import {
	getPlatformMemberPresentation,
	getPlatformOrganizationPresentation,
} from "@/app/(site)/dashboard/_lib/platform/entities";
import {
	feedbackCategoryPresentation,
	feedbackStatusPresentation,
	formatPlatformDate,
} from "@/app/(site)/dashboard/_lib/platform/presentation";
import {
	SelectInput,
	type SelectOption,
	TextAreaInput,
} from "@/components/ui/input";
import { Button } from "@/components/ui/primitives/Button";
import { ContentSection } from "@/components/ui/primitives/surfaces";
import { Text } from "@/components/ui/primitives/Text";
import { showToast } from "@/lib/feedback";
import { hrefFor } from "@/lib/routes";
import {
	FeedbackSeverityChip,
	FeedbackStatusChip,
} from "../../../_components/PlatformStatusChip";

const statusOptions: SelectOption<FeedbackStatus>[] = FEEDBACK_STATUSES.map(
	(value) => ({ label: feedbackStatusPresentation[value].label, value }),
);

export function PlatformReportDetailContent({
	initialReport,
}: {
	initialReport: ProductReport;
}) {
	const router = useRouter();
	const [report, setReport] = React.useState(initialReport);
	const [status, setStatus] = React.useState(initialReport.status);
	const [triageNote, setTriageNote] = React.useState(
		initialReport.triageNote ?? "",
	);
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const member = getPlatformMemberPresentation(report);
	const organization = getPlatformOrganizationPresentation(report);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const result = await showToast.promise(
				updateProductReport({ id: report.id, status, triageNote }),
				{
					loading: "Updating report...",
					success: "Report updated.",
					error: "Unable to update report.",
				},
			);
			setReport(result.report);
			setStatus(result.report.status);
			setTriageNote(result.report.triageNote ?? "");
			router.refresh();
		} catch {
			// The shared promise toast reports the failed mutation.
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<DashboardSection
			actions={
				<div className="flex flex-wrap gap-2">
					<Button
						href={hrefFor("dashboard.platform.reports")}
						variant="secondary"
					>
						All reports
					</Button>
					<Button
						href={report.currentRoute}
						leadingIcon="external-link"
						variant="secondary"
					>
						Open original route
					</Button>
					<Button href={`mailto:${report.email}`} leadingIcon="mail">
						Email reporter
					</Button>
				</div>
			}
			contentClassName="grid min-w-0 gap-5"
			description={report.id}
			title="Product report"
		>
			<div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
				<div className="grid min-w-0 gap-5">
					<ContentSection>
						<ContentSection.Header>
							<ContentSection.Title>Feedback</ContentSection.Title>
							<ContentSection.Description>
								{feedbackCategoryPresentation[report.category]} from{" "}
								{report.currentRoute}
							</ContentSection.Description>
							<ContentSection.Action className="flex flex-wrap gap-2">
								<FeedbackSeverityChip severity={report.severity} />
								<FeedbackStatusChip status={report.status} />
							</ContentSection.Action>
						</ContentSection.Header>
						<ContentSection.Content className="grid gap-5">
							<Text className="whitespace-pre-wrap break-words" variant="body">
								{report.description}
							</Text>
							<dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
								<DashboardDetailField
									label="Route"
									value={report.currentRoute}
								/>
								<DashboardDetailField
									label="Viewport"
									value={
										report.viewportWidth && report.viewportHeight
											? `${report.viewportWidth} × ${report.viewportHeight}`
											: "Unavailable"
									}
								/>
								<DashboardDetailField
									label="Created"
									value={formatPlatformDate(report.createdAt)}
								/>
								<DashboardDetailField
									label="Updated"
									value={formatPlatformDate(report.updatedAt)}
								/>
							</dl>
						</ContentSection.Content>
					</ContentSection>
					<ContentSection>
						<ContentSection.Heading
							description="Identity and organization facts are resolved server-side."
							title="Reporter context"
						/>
						<ContentSection.Content>
							<dl className="grid gap-5 sm:grid-cols-2">
								<DashboardDetailField
									label="Reporter"
									truncateValue={false}
									value={
										<MemberIdentity presentation={member} variant="default" />
									}
								/>
								<DashboardDetailField
									label="Organization"
									truncateValue={false}
									value={<OrganizationIdentity presentation={organization} />}
								/>
								<DashboardDetailField
									className="sm:col-span-2"
									label="Browser metadata"
									truncateValue={false}
									value={
										<code className="block max-w-full whitespace-pre-wrap break-words font-mono text-xs font-normal leading-5 text-foreground">
											{JSON.stringify(report.browserMetadata, null, 2)}
										</code>
									}
								/>
							</dl>
						</ContentSection.Content>
					</ContentSection>
				</div>
				<ContentSection
					as="form"
					className="self-start"
					onSubmit={handleSubmit}
				>
					<ContentSection.Heading
						description="Adding a note to a new report automatically marks it Triaged."
						title="Report triage"
					/>
					<ContentSection.Content className="grid gap-4">
						<SelectInput
							disabled={isSubmitting}
							label="Status"
							onChange={setStatus}
							options={statusOptions}
							value={status}
						/>
						<TextAreaInput
							disabled={isSubmitting}
							label="Triage note"
							onChange={setTriageNote}
							placeholder="Record reproduction details or the planned next step."
							rows={7}
							value={triageNote}
						/>
					</ContentSection.Content>
					<ContentSection.Footer className="justify-end">
						<Button
							disabled={isSubmitting}
							loading={isSubmitting}
							type="submit"
						>
							Save triage
						</Button>
					</ContentSection.Footer>
				</ContentSection>
			</div>
		</DashboardSection>
	);
}
