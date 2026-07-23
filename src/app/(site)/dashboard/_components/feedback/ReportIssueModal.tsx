"use client";

import * as React from "react";
import { Icon } from "@/components/ui/icons/Icon";
import {
	SelectInput,
	type SelectOption,
} from "@/components/ui/input/SelectInput";
import { TextAreaInput } from "@/components/ui/input/TextAreaInput";
import { ModalForm } from "@/components/ui/overlays/modal/ModalForm";
import {
	ModalDescription,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/overlays/modal/ModalShell";
import { Button } from "@/components/ui/primitives/Button";
import { showToast } from "@/lib/feedback";
import { submitProductReport } from "../../_lib/platform/api.client";
import type {
	FeedbackCategory,
	FeedbackSeverity,
} from "../../_lib/platform/contracts";

type ReportIssueModalProps = {
	currentRoute: string;
	initialCategory?: FeedbackCategory;
	initialDescription?: string;
	initialSeverity?: FeedbackSeverity;
	onClose: () => void;
	onCloseDisabledChange: (disabled: boolean) => void;
};

const CATEGORY_OPTIONS: SelectOption<FeedbackCategory>[] = [
	{ value: "bug", label: "Bug" },
	{ value: "ux_issue", label: "UX issue" },
	{ value: "data_problem", label: "Data problem" },
	{ value: "feature_request", label: "Feature request" },
	{ value: "workflow_complaint", label: "Workflow complaint" },
];

const SEVERITY_OPTIONS: SelectOption<FeedbackSeverity>[] = [
	{ value: "normal", label: "Normal" },
	{ value: "low", label: "Low" },
	{ value: "high", label: "High" },
	{ value: "blocker", label: "Blocker" },
];

function getBrowserMetadata() {
	return {
		language: window.navigator.language,
		platform: window.navigator.platform,
		screenHeight: window.screen.height,
		screenWidth: window.screen.width,
		timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		userAgent: window.navigator.userAgent,
	};
}

export function ReportIssueModal({
	currentRoute,
	initialCategory = "ux_issue",
	initialDescription = "",
	initialSeverity = "normal",
	onClose,
	onCloseDisabledChange,
}: ReportIssueModalProps) {
	const [category, setCategory] =
		React.useState<FeedbackCategory>(initialCategory);
	const [severity, setSeverity] =
		React.useState<FeedbackSeverity>(initialSeverity);
	const [description, setDescription] = React.useState(initialDescription);
	const [descriptionError, setDescriptionError] = React.useState<string>();
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	React.useEffect(() => {
		onCloseDisabledChange(isSubmitting);
		return () => onCloseDisabledChange(false);
	}, [isSubmitting, onCloseDisabledChange]);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (isSubmitting) return;
		const nextDescription = description.trim();
		if (nextDescription.length < 10 || nextDescription.length > 5_000) {
			setDescriptionError(
				"Enter a description between 10 and 5,000 characters.",
			);
			return;
		}

		setDescriptionError(undefined);
		setIsSubmitting(true);
		try {
			await showToast.promise(
				submitProductReport({
					browserMetadata: getBrowserMetadata(),
					category,
					currentRoute,
					description: nextDescription,
					severity,
					viewportHeight: window.innerHeight,
					viewportWidth: window.innerWidth,
				}),
				{
					loading: "Submitting report...",
					success: "Report submitted.",
					error: "Unable to submit report.",
				},
			);
			onCloseDisabledChange(false);
			onClose();
		} catch {
			// The shared promise toast reports the failed mutation.
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<ModalHeader
				closeDisabled={isSubmitting}
				closeLabel="Close issue report"
				leadingIcon={<Icon name="flag" size="sm" />}
			>
				<ModalTitle>Report issue</ModalTitle>
				<ModalDescription>
					Send product feedback with the current dashboard context attached.
				</ModalDescription>
			</ModalHeader>
			<ModalForm
				contentClassName="grid gap-4"
				footer={
					<>
						<Button
							disabled={isSubmitting}
							onClick={onClose}
							type="button"
							variant="ghost"
						>
							Cancel
						</Button>
						<Button
							disabled={isSubmitting}
							loading={isSubmitting}
							trailingIcon="flag"
							type="submit"
							variant="primary"
						>
							Submit report
						</Button>
					</>
				}
				onSubmit={handleSubmit}
			>
				<div className="grid gap-4 sm:grid-cols-2">
					<SelectInput
						disabled={isSubmitting}
						dropdownPositionStrategy="fixed"
						label="Category"
						onChange={setCategory}
						options={CATEGORY_OPTIONS}
						value={category}
					/>
					<SelectInput
						disabled={isSubmitting}
						dropdownPositionStrategy="fixed"
						label="Severity"
						onChange={setSeverity}
						options={SEVERITY_OPTIONS}
						value={severity}
					/>
				</div>
				<TextAreaInput
					description={`Current route: ${currentRoute}`}
					disabled={isSubmitting}
					error={descriptionError}
					label="Description"
					onChange={(value) => {
						setDescription(value);
						if (descriptionError) setDescriptionError(undefined);
					}}
					placeholder="What felt broken, confusing, or missing?"
					required
					rows={6}
					value={description}
				/>
			</ModalForm>
		</>
	);
}
