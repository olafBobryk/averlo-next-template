"use client";

import clsx from "clsx";
import * as React from "react";
import { ModalForm } from "@/components/ui/overlays/modal/ModalForm";
import { useModalSubmission } from "@/components/ui/overlays/modal/ModalShell";
import { Button } from "@/components/ui/primitives/Button";
import { MarkdownEditorClient } from "./MarkdownEditorClient";

export type MarkdownEditorDensity = "compact" | "default";

export type MarkdownEditorMentionOption = {
	id: string;
	label: string;
};

export type MarkdownEditorProps = {
	ariaLabel: string;
	className?: string;
	defaultMarkdown?: string;
	density?: MarkdownEditorDensity;
	disabled?: boolean;
	mentions?: MarkdownEditorMentionOption[];
	name?: string;
	onChange?: (markdown: string) => void;
	placeholder?: string;
};

export function MarkdownEditor({
	ariaLabel,
	className,
	defaultMarkdown = "",
	density = "default",
	disabled = false,
	mentions,
	name,
	onChange,
	placeholder,
}: MarkdownEditorProps) {
	const [markdown, setMarkdown] = React.useState(defaultMarkdown);

	React.useEffect(() => {
		setMarkdown(defaultMarkdown);
	}, [defaultMarkdown]);

	function handleChange(nextMarkdown: string) {
		setMarkdown(nextMarkdown);
		onChange?.(nextMarkdown);
	}

	return (
		<div className={clsx("min-w-0 w-full", className)}>
			{name ? <input name={name} type="hidden" value={markdown} /> : null}
			<MarkdownEditorClient
				ariaLabel={ariaLabel}
				density={density}
				disabled={disabled}
				key={defaultMarkdown}
				markdown={markdown}
				mentions={mentions}
				onChange={handleChange}
				placeholder={placeholder}
			/>
		</div>
	);
}

export type MarkdownEditorModalFormProps = MarkdownEditorProps & {
	cancelLabel?: React.ReactNode;
	onCancel: () => void;
	onSubmitMarkdown: (markdown: string) => unknown;
	submitLabel?: React.ReactNode;
};

export function MarkdownEditorModalForm({
	cancelLabel = "Cancel",
	defaultMarkdown = "",
	onCancel,
	onSubmitMarkdown,
	submitLabel = "Save",
	...editorProps
}: MarkdownEditorModalFormProps) {
	const [markdown, setMarkdown] = React.useState(defaultMarkdown);
	const { beginSubmission, endSubmission, isSubmitting } = useModalSubmission();

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!beginSubmission()) return;
		try {
			await onSubmitMarkdown(markdown);
		} finally {
			endSubmission();
		}
	}

	return (
		<ModalForm
			contentClassName="grid gap-3"
			footer={
				<>
					<Button
						disabled={isSubmitting}
						onClick={onCancel}
						type="button"
						variant="ghost"
					>
						{cancelLabel}
					</Button>
					<Button loading={isSubmitting} type="submit" variant="primary">
						{submitLabel}
					</Button>
				</>
			}
			onSubmit={handleSubmit}
		>
			<MarkdownEditor
				{...editorProps}
				defaultMarkdown={defaultMarkdown}
				disabled={editorProps.disabled || isSubmitting}
				onChange={setMarkdown}
			/>
		</ModalForm>
	);
}
