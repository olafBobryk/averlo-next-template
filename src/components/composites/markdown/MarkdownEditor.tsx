"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import * as React from "react";
import { Skeleton } from "@/components/ui/misc/Skeleton";
import { ModalForm } from "@/components/ui/overlays/modal/ModalForm";
import { Button } from "@/components/ui/primitives/Button";
import type { MarkdownContentDensity } from "./markdownContent";

const MarkdownEditorClient = dynamic(
	() =>
		import("./MarkdownEditorClient").then(
			(module) => module.MarkdownEditorClient,
		),
	{ ssr: false },
);

export type MarkdownEditorDensity = MarkdownContentDensity;

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

function MarkdownEditorRoot({
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
				markdown={markdown}
				mentions={mentions}
				onChange={handleChange}
				placeholder={placeholder}
			/>
		</div>
	);
}

function MarkdownEditorSkeleton({
	className,
	density = "default",
}: Pick<MarkdownEditorProps, "className" | "density">) {
	return (
		<div
			aria-hidden
			className={clsx(
				"min-w-0 w-full overflow-hidden rounded-[12px] border border-border bg-card",
				className,
			)}
		>
			<div className="flex min-h-11 items-center gap-2 border-b border-border px-3">
				<Skeleton className="h-7 w-20 rounded-[8px]" />
				<Skeleton className="h-7 w-24 rounded-[8px]" />
				<Skeleton className="h-7 w-16 rounded-[8px]" />
			</div>
			<Skeleton
				className={clsx(
					"m-4 w-[calc(100%-2rem)] rounded-[8px]",
					density === "compact" ? "h-32" : "h-56",
				)}
			/>
		</div>
	);
}

export const MarkdownEditor = Object.assign(MarkdownEditorRoot, {
	Skeleton: MarkdownEditorSkeleton,
});

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
	const [submitting, setSubmitting] = React.useState(false);

	return (
		<ModalForm
			contentClassName="grid gap-3"
			footer={
				<>
					<Button
						disabled={submitting}
						onClick={onCancel}
						type="button"
						variant="ghost"
					>
						{cancelLabel}
					</Button>
					<Button loading={submitting} type="submit" variant="primary">
						{submitLabel}
					</Button>
				</>
			}
			onSubmit={async (event) => {
				event.preventDefault();
				setSubmitting(true);
				try {
					await onSubmitMarkdown(markdown);
				} finally {
					setSubmitting(false);
				}
			}}
		>
			<MarkdownEditor
				{...editorProps}
				defaultMarkdown={defaultMarkdown}
				disabled={editorProps.disabled || submitting}
				onChange={setMarkdown}
			/>
		</ModalForm>
	);
}
