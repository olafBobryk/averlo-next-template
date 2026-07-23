"use client";

import * as React from "react";
import { MarkdownEditor } from "@/components/composites/markdown/MarkdownEditor";
import { Icon } from "@/components/ui/icons/Icon";
import { ModalForm } from "@/components/ui/overlays/modal/ModalForm";
import {
	ModalDescription,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/overlays/modal/ModalShell";
import { useModal } from "@/components/ui/overlays/modal/useModal";
import { Button } from "@/components/ui/primitives/Button";
import { StatusMessage } from "@/components/ui/primitives/StatusMessage";
import { showToast } from "@/lib/feedback/toast";

export type DashboardMarkdownSaveResult = { error?: string; ok: boolean };

function DashboardMarkdownEditorModalButtonRoot({
	description,
	disabled = false,
	initialMarkdown = "",
	mentions,
	modalId,
	onSave,
	successMessage = "Saved.",
	title,
}: {
	description?: string;
	disabled?: boolean;
	initialMarkdown?: string;
	mentions?: readonly { id: string; label: string }[];
	modalId: string;
	onSave: (markdown: string) => Promise<DashboardMarkdownSaveResult>;
	successMessage?: string;
	title: string;
}) {
	const { openModal } = useModal();
	return (
		<Button
			disabled={disabled}
			onClick={() => {
				if (disabled) return;
				openModal(
					({ close, setCloseDisabled }) => (
						<DashboardMarkdownEditorModalForm
							description={description}
							initialMarkdown={initialMarkdown}
							mentions={mentions}
							onCancel={close}
							onCloseDisabledChange={setCloseDisabled}
							onSave={onSave}
							onSaved={() => {
								showToast.success(successMessage);
								close();
							}}
							title={title}
						/>
					),
					{
						ariaLabel: title,
						cardProps: { maxWidth: "4xl" },
						id: modalId,
					},
				);
			}}
			type="button"
			variant="ghost"
		>
			Edit
		</Button>
	);
}

function DashboardMarkdownEditorModalButtonSkeleton() {
	return <Button.Skeleton variant="ghost">Edit</Button.Skeleton>;
}

export const DashboardMarkdownEditorModalButton = Object.assign(
	DashboardMarkdownEditorModalButtonRoot,
	{ Skeleton: DashboardMarkdownEditorModalButtonSkeleton },
);

function DashboardMarkdownEditorModalForm({
	description,
	initialMarkdown,
	mentions,
	onCancel,
	onCloseDisabledChange,
	onSave,
	onSaved,
	title,
}: {
	description?: string;
	initialMarkdown: string;
	mentions?: readonly { id: string; label: string }[];
	onCancel: () => void;
	onCloseDisabledChange: (disabled: boolean) => void;
	onSave: (markdown: string) => Promise<DashboardMarkdownSaveResult>;
	onSaved: () => void;
	title: string;
}) {
	const [markdown, setMarkdown] = React.useState(initialMarkdown);
	const [error, setError] = React.useState<string>();
	const [saving, setSaving] = React.useState(false);
	React.useEffect(() => {
		onCloseDisabledChange(saving);
		return () => onCloseDisabledChange(false);
	}, [onCloseDisabledChange, saving]);
	return (
		<>
			<ModalHeader leadingIcon={<Icon name="pencil" size="sm" />}>
				<ModalTitle>{title}</ModalTitle>
				{description ? (
					<ModalDescription>{description}</ModalDescription>
				) : null}
			</ModalHeader>
			<ModalForm
				contentClassName="grid gap-3"
				footer={
					<>
						<Button
							disabled={saving}
							onClick={onCancel}
							type="button"
							variant="ghost"
						>
							Cancel
						</Button>
						<Button loading={saving} type="submit">
							Save
						</Button>
					</>
				}
				onSubmit={async (event) => {
					event.preventDefault();
					setError(undefined);
					setSaving(true);
					try {
						const result = await onSave(markdown);
						if (!result.ok) {
							setError(result.error ?? "Could not save changes.");
							return;
						}
						onSaved();
					} catch {
						setError("Could not save changes.");
					} finally {
						setSaving(false);
					}
				}}
			>
				<MarkdownEditor
					ariaLabel={title}
					defaultMarkdown={initialMarkdown}
					density="compact"
					disabled={saving}
					mentions={mentions ? [...mentions] : undefined}
					onChange={setMarkdown}
					placeholder="Write a description"
				/>
				{error ? (
					<StatusMessage role="alert" tone="danger">
						{error}
					</StatusMessage>
				) : null}
			</ModalForm>
		</>
	);
}
