"use client";

import * as React from "react";
import {
	SelectInput,
	type SelectOption,
	SpamProtectionFields,
	TextAreaInput,
	TextInput,
} from "@/components/ui/input";
import { Button } from "@/components/ui/primitives/Button";
import { InlineError } from "@/components/ui/primitives/InlineError";
import { ContentSection } from "@/components/ui/primitives/surfaces";
import { Text } from "@/components/ui/primitives/Text";
import { showToast } from "@/lib/feedback";
import { OrganizationAvatar } from "../../_components/entities/organization/OrganizationAvatar";
import { useDashboardAuth } from "../../_components/providers/DashboardAuthProvider";
import { toOrganizationEntity } from "../../_lib/entities/organization/domain";
import { getOrganizationPresentation } from "../../_lib/entities/organization/presentation";
import { submitSupportRequest } from "../../_lib/platform/api.client";

export function SupportRequestForm() {
	const { membership, organizationChoices, user } = useDashboardAuth();
	const [
		selectedOrganizationMembershipId,
		setSelectedOrganizationMembershipId,
	] = React.useState(membership.id);
	const [subject, setSubject] = React.useState("");
	const [message, setMessage] = React.useState("");
	const [subjectError, setSubjectError] = React.useState<string>();
	const [messageError, setMessageError] = React.useState<string>();
	const [submissionError, setSubmissionError] = React.useState<string>();
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	React.useEffect(() => {
		setSelectedOrganizationMembershipId(membership.id);
	}, [membership.id]);

	if (!user) return null;

	const requesterLabel = user.name.trim() || user.email;
	const organizationOptions: SelectOption<string>[] = organizationChoices.map(
		(choice) => {
			const organization = getOrganizationPresentation(
				toOrganizationEntity(choice.organization, choice.membership.role),
			);
			return {
				icon: (
					<OrganizationAvatar
						alt={organization.avatarAlt}
						className="!size-6 !text-[10px]"
						colorIndex={organization.avatarColorIndex}
						imageUrl={organization.avatarUrl}
						initials={organization.initials}
						size="sm"
					/>
				),
				label: organization.displayLabel,
				searchText: organization.searchText,
				value: choice.membership.id,
			};
		},
	);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (isSubmitting) return;
		const nextSubject = subject.trim();
		const nextMessage = message.trim();
		const nextSubjectError =
			nextSubject.length < 2 || nextSubject.length > 120
				? "Enter a subject between 2 and 120 characters."
				: undefined;
		const nextMessageError =
			nextMessage.length < 10 || nextMessage.length > 4_000
				? "Enter a message between 10 and 4,000 characters."
				: undefined;
		setSubjectError(nextSubjectError);
		setMessageError(nextMessageError);
		if (nextSubjectError || nextMessageError) return;

		const formData = new FormData(event.currentTarget);
		setIsSubmitting(true);
		setSubmissionError(undefined);
		try {
			const result = await submitSupportRequest(formData);
			showToast.success("Support request saved.");
			setSubject("");
			setMessage("");
			showToast.info(result.message, { title: "Demo fixture" });
		} catch {
			setSubmissionError(
				"Unable to save your request. Your message is still here. Try submitting again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<ContentSection as="form" onSubmit={handleSubmit}>
			<ContentSection.Heading
				description="Save a fixture-only request for the platform team to review."
				title="Contact support"
			/>
			<ContentSection.Content className="grid gap-5">
				<SpamProtectionFields />
				<input
					name="membershipId"
					type="hidden"
					value={selectedOrganizationMembershipId}
				/>
				<div className="grid gap-4 sm:grid-cols-2">
					<TextInput
						description="Authenticated account submitting this request."
						disabled
						label="Requester"
						value={requesterLabel}
					/>
					<SelectInput
						description="Choose the organization context for this request."
						disabled={isSubmitting}
						label="Organization"
						onChange={setSelectedOrganizationMembershipId}
						options={organizationOptions}
						placeholder="Select an organization"
						required
						showSelectedIcon
						value={selectedOrganizationMembershipId}
					/>
				</div>
				<TextInput
					disabled={isSubmitting}
					error={subjectError}
					label="Subject"
					name="subject"
					onChange={(value) => {
						setSubject(value);
						if (subjectError) setSubjectError(undefined);
					}}
					placeholder="How can we help?"
					required
					value={subject}
				/>
				<TextAreaInput
					description="Include what you expected, what happened, and the route you were using."
					disabled={isSubmitting}
					error={messageError}
					label="Message"
					name="message"
					onChange={(value) => {
						setMessage(value);
						if (messageError) setMessageError(undefined);
					}}
					placeholder="Describe your question or support request."
					required
					rows={6}
					value={message}
				/>
			</ContentSection.Content>
			<ContentSection.Footer className="justify-between gap-3">
				<Text tone="muted" variant="caption">
					Demo only · no email or external write is performed.
				</Text>
				<InlineError open={!!submissionError}>{submissionError}</InlineError>
				<Button
					disabled={isSubmitting}
					loading={isSubmitting}
					trailingIcon="arrow-right"
					type="submit"
					variant="primary"
				>
					Send request
				</Button>
			</ContentSection.Footer>
		</ContentSection>
	);
}
