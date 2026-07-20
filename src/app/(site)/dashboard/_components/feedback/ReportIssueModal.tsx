"use client";

import * as React from "react";
import { FileUploadInput } from "@/components/ui/input/files/FileUploadInput";
import {
	SelectInput,
	type SelectOption,
} from "@/components/ui/input/SelectInput";
import { TextAreaInput } from "@/components/ui/input/TextAreaInput";
import { FileGallery } from "@/components/ui/misc/FileGallery";
import { Button } from "@/components/ui/primitives/Button";
import Divider from "@/components/ui/primitives/Divider";
import { Text } from "@/components/ui/primitives/Text";
import { showToast } from "@/lib/feedback";

type ReportIssueModalProps = {
	onClose: () => void;
	currentRoute: string;
};

type FeedbackCategory =
	| "bug"
	| "ux_issue"
	| "data_problem"
	| "feature_request"
	| "workflow_complaint";

type FeedbackSeverity = "blocker" | "high" | "normal" | "low";

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

export function ReportIssueModal({
	onClose,
	currentRoute,
}: ReportIssueModalProps) {
	const [category, setCategory] = React.useState<FeedbackCategory>("ux_issue");
	const [severity, setSeverity] = React.useState<FeedbackSeverity>("normal");
	const [description, setDescription] = React.useState("");
	const [files, setFiles] = React.useState<File[]>([]);
	const [descriptionError, setDescriptionError] = React.useState<string | null>(
		null,
	);
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (isSubmitting) return;

		if (!description.trim()) {
			setDescriptionError("Describe what happened.");
			return;
		}

		setDescriptionError(null);
		setIsSubmitting(true);
		try {
			await showToast.promise(Promise.resolve(), {
				loading: "Submitting report...",
				success: "Report stub submitted. No data was saved.",
				error: "Unable to submit report.",
			});
			onClose();
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-5">
			<div className="flex flex-col gap-1 text-center">
				<Text as="h2" variant="headingMd">
					Report issue
				</Text>
				<Text variant="body" tone="muted">
					Send product feedback with the current dashboard context attached.
				</Text>
			</div>
			<Divider />
			<div className="grid gap-4 sm:grid-cols-2">
				<SelectInput
					label="Category"
					value={category}
					onChange={setCategory}
					options={CATEGORY_OPTIONS}
					disabled={isSubmitting}
				/>
				<SelectInput
					label="Severity"
					value={severity}
					onChange={setSeverity}
					options={SEVERITY_OPTIONS}
					disabled={isSubmitting}
				/>
			</div>
			<TextAreaInput
				label="Description"
				description={`Current route: ${currentRoute}`}
				placeholder="What felt broken, confusing, or missing?"
				value={description}
				onChange={(value) => {
					setDescription(value);
					if (descriptionError) setDescriptionError(null);
				}}
				error={descriptionError ?? undefined}
				required
				rows={5}
				disabled={isSubmitting}
			/>
			<FileUploadInput
				files={files}
				onFilesChange={setFiles}
				label="Attachments"
				description="Add screenshots, PDFs, or photos if they help explain the report."
				chooseLabel="Choose files"
				cameraLabel="Take photo"
				disabled={isSubmitting}
			/>
			<FileGallery
				pendingFiles={files}
				onRemovePending={(file) =>
					setFiles((current) => current.filter((item) => item !== file))
				}
				emptyTitle="No attachments"
				emptyDescription="Selected files will appear here before submit."
			/>
			<Divider />
			<div className="flex flex-wrap justify-between gap-3">
				<Button
					type="button"
					variant="secondary"
					onClick={onClose}
					disabled={isSubmitting}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					variant="primary"
					loading={isSubmitting}
					disabled={isSubmitting}
					trailingIcon="flag"
				>
					Submit report
				</Button>
			</div>
		</form>
	);
}
