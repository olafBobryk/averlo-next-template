"use client";

import * as React from "react";
import { Button } from "@/components/ui/primitives/Button";
import { Field } from "@/components/ui/primitives/Field";
import { InputFrame } from "@/components/ui/primitives/InputFrame";
import { Text } from "@/components/ui/primitives/Text";

export type FileUploadInputProps = {
	files: File[];
	onFilesChange: (files: File[]) => void;
	id?: string;
	name?: string;
	accept?: string;
	capture?: "environment" | "user";
	multiple?: boolean;
	disabled?: boolean;
	label?: React.ReactNode;
	description?: React.ReactNode;
	error?: React.ReactNode;
	required?: boolean;
	chooseLabel?: React.ReactNode;
	cameraLabel?: React.ReactNode;
	showCamera?: boolean;
	dropTitle?: React.ReactNode;
	dropDescription?: React.ReactNode;
	pendingFilesLabel?: (count: number) => React.ReactNode;
	showClear?: boolean;
	className?: string;
	/** Bump to clear native inputs and controlled pending files. */
	resetSignal?: number;
};

export function FileUploadInput({
	files,
	onFilesChange,
	id,
	name,
	accept = "image/*,application/pdf",
	capture = "environment",
	multiple = true,
	disabled = false,
	label = "Upload files",
	description = "Drag and drop files here or choose from this device.",
	error,
	required = false,
	chooseLabel = "Choose files",
	cameraLabel = "Take photo",
	showCamera = true,
	dropTitle = "Drop files here",
	dropDescription = "Selected files appear in the gallery before they are saved.",
	pendingFilesLabel = (count) =>
		`${count} pending ${count === 1 ? "file" : "files"}`,
	showClear = true,
	className,
	resetSignal,
}: FileUploadInputProps) {
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const cameraInputRef = React.useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = React.useState(false);
	const fallbackId = React.useId();
	const inputId = id ?? name ?? fallbackId;
	const cameraInputId = `${inputId}-camera`;
	const descriptionId = description ? `${inputId}-description` : undefined;
	const messageId = error ? `${inputId}-message` : undefined;
	const describedBy =
		[descriptionId, messageId].filter(Boolean).join(" ") || undefined;
	const tone = error ? "error" : "default";
	const previousResetSignalRef = React.useRef(resetSignal);

	const resetSelection = React.useCallback(() => {
		if (fileInputRef.current) fileInputRef.current.value = "";
		if (cameraInputRef.current) cameraInputRef.current.value = "";
		setIsDragging(false);
		onFilesChange([]);
	}, [onFilesChange]);

	React.useEffect(() => {
		if (resetSignal === undefined) return;
		if (previousResetSignalRef.current === resetSignal) return;
		previousResetSignalRef.current = resetSignal;
		resetSelection();
	}, [resetSignal, resetSelection]);

	React.useEffect(() => {
		const form = fileInputRef.current?.form;
		if (!form) return;
		form.addEventListener("reset", resetSelection);
		return () => form.removeEventListener("reset", resetSelection);
	}, [resetSelection]);

	function addFiles(nextFiles: FileList | File[]) {
		if (disabled) return;
		const incoming = Array.from(nextFiles);
		if (incoming.length === 0) return;
		onFilesChange(multiple ? [...files, ...incoming] : incoming.slice(0, 1));
	}

	const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (
		event,
	) => {
		if (event.target.files) addFiles(event.target.files);
		event.target.value = "";
	};

	const handleDragEnter: React.DragEventHandler<HTMLDivElement> = (event) => {
		event.preventDefault();
		event.stopPropagation();
		if (!disabled) setIsDragging(true);
	};

	const handleDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
		event.preventDefault();
		event.stopPropagation();
		if (!disabled) setIsDragging(true);
	};

	const handleDragLeave: React.DragEventHandler<HTMLDivElement> = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);
		if (event.dataTransfer.files) addFiles(event.dataTransfer.files);
	};

	return (
		<Field
			label={label}
			description={description}
			message={error}
			tone={tone}
			required={required}
			inputId={inputId}
			descriptionId={descriptionId}
			messageId={messageId}
			className={className}
		>
			<input
				ref={fileInputRef}
				id={inputId}
				name={name}
				type="file"
				hidden
				multiple={multiple}
				accept={accept}
				onChange={handleFileChange}
				disabled={disabled}
				required={required}
				aria-invalid={Boolean(error)}
				aria-describedby={describedBy}
			/>
			<input
				ref={cameraInputRef}
				id={cameraInputId}
				type="file"
				hidden
				multiple={multiple}
				accept="image/*"
				capture={capture}
				onChange={handleFileChange}
				disabled={disabled}
				aria-invalid={Boolean(error)}
				aria-describedby={describedBy}
			/>

			<InputFrame
				tone={tone}
				disabled={disabled}
				fullWidth
				onDragEnter={handleDragEnter}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={[
					"border-dashed",
					isDragging ? "border-foreground/40 bg-background-hover" : "",
				]
					.filter(Boolean)
					.join(" ")}
				contentClassName="flex flex-col gap-4 p-4"
			>
				<div className="flex flex-col gap-1">
					<Text variant="bodyStrong">
						{files.length > 0 ? pendingFilesLabel(files.length) : dropTitle}
					</Text>
					<Text variant="body" tone="muted">
						{dropDescription}
					</Text>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<Button
						variant="outline"
						onClick={() => fileInputRef.current?.click()}
						disabled={disabled}
					>
						{chooseLabel}
					</Button>
					{showCamera ? (
						<Button
							variant="primaryDark"
							trailingIcon="camera"
							onClick={() => cameraInputRef.current?.click()}
							disabled={disabled}
						>
							{cameraLabel}
						</Button>
					) : null}
					{showClear && files.length > 0 ? (
						<Button
							variant="ghost"
							onClick={resetSelection}
							disabled={disabled}
						>
							Clear pending
						</Button>
					) : null}
				</div>
			</InputFrame>
		</Field>
	);
}
