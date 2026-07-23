"use client";

import clsx from "clsx";
import * as React from "react";
import { Icon } from "@/components/ui/icons/Icon";
import {
	ProfilePicture,
	type ProfilePictureSize,
} from "@/components/ui/misc/ProfilePicture";
import { Button } from "@/components/ui/primitives/Button";
import { Field } from "@/components/ui/primitives/Field";
import { Text } from "@/components/ui/primitives/Text";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPT_ATTR = ".jpg,.jpeg,.png,.webp";

export type ProfilePictureInputProps = {
	label?: string;
	description?: string;
	currentUrl?: string | null;
	id?: string;
	inputName?: string;
	name?: string;
	disabled?: boolean;
	onChange: (file: File | null) => void;
	acceptedMimeTypes?: readonly string[];
	maxSizeBytes?: number;
	onValidationError?: (message: string | null) => void;
	layout?: "overlay" | "file-row";
	renderPreview?: (input: {
		className?: string;
		name?: string;
		size: ProfilePictureSize;
		src?: string;
	}) => React.ReactNode;
};

function ProfilePictureInputRoot({
	label = "Profile picture",
	description,
	currentUrl,
	id,
	inputName = "profilePicture",
	name,
	disabled = false,
	onChange,
	acceptedMimeTypes = ACCEPTED_TYPES,
	maxSizeBytes = MAX_FILE_SIZE_BYTES,
	onValidationError,
	layout = "overlay",
	renderPreview,
}: ProfilePictureInputProps) {
	const generatedId = React.useId();
	const inputId = id ?? generatedId;
	const inputRef = React.useRef<HTMLInputElement>(null);
	const previewUrlRef = React.useRef<string | null>(null);
	const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
	const [removed, setRemoved] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [selectedFileName, setSelectedFileName] = React.useState<string | null>(
		null,
	);
	const displayUrl = removed ? undefined : (previewUrl ?? currentUrl);
	function renderPicture(size: ProfilePictureSize, className?: string) {
		return renderPreview ? (
			renderPreview({ className, name, size, src: displayUrl ?? undefined })
		) : (
			<ProfilePicture
				className={className}
				name={name}
				size={size}
				src={displayUrl}
			/>
		);
	}

	const revokePreview = React.useCallback(() => {
		if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
		previewUrlRef.current = null;
	}, []);

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.currentTarget.files?.[0];

		if (!file) return;

		if (!acceptedMimeTypes.includes(file.type)) {
			const message = "Only JPG, PNG, and WebP images are accepted.";
			setError(message);
			setSelectedFileName(file.name);
			onValidationError?.(message);
			event.currentTarget.value = "";
			return;
		}

		if (file.size > maxSizeBytes) {
			const message = `Image must be smaller than ${Math.round(maxSizeBytes / 1024 / 1024)} MB.`;
			setError(message);
			setSelectedFileName(file.name);
			onValidationError?.(message);
			event.currentTarget.value = "";
			return;
		}

		revokePreview();
		setError(null);
		onValidationError?.(null);
		setRemoved(false);
		setSelectedFileName(file.name);
		const nextPreviewUrl = URL.createObjectURL(file);
		previewUrlRef.current = nextPreviewUrl;
		setPreviewUrl(nextPreviewUrl);
		onChange(file);
	}

	function handleRemove() {
		revokePreview();
		setPreviewUrl(null);
		setRemoved(true);
		setError(null);
		setSelectedFileName(null);
		onValidationError?.(null);
		if (inputRef.current) inputRef.current.value = "";
		onChange(null);
	}

	React.useEffect(() => {
		return revokePreview;
	}, [revokePreview]);

	React.useEffect(() => {
		const form = inputRef.current?.form;
		if (!form) return;
		const handleReset = () => {
			revokePreview();
			setPreviewUrl(null);
			setRemoved(false);
			setError(null);
			setSelectedFileName(null);
			onValidationError?.(null);
		};
		form.addEventListener("reset", handleReset);
		return () => form.removeEventListener("reset", handleReset);
	}, [onValidationError, revokePreview]);

	return (
		<Field
			label={label}
			description={description}
			message={error ?? undefined}
			tone={error ? "error" : "default"}
			inputId={inputId}
		>
			<div className="flex min-w-0 items-center gap-4">
				{layout === "file-row" ? (
					renderPicture("xl", "shrink-0")
				) : (
					<Button
						type="button"
						variant="ghost"
						size="none"
						className={clsx(
							"relative h-24 w-24 shrink-0 overflow-hidden rounded-full! border border-border bg-surface [--ui-surface-color:var(--color-surface)] group",
							disabled ? "cursor-not-allowed" : "cursor-pointer",
						)}
						contentClassName="h-full w-full"
						onClick={() => inputRef.current?.click()}
						aria-label="Choose profile picture"
						disabled={disabled}
					>
						{renderPicture("2xl", "h-full w-full rounded-full border-0")}
						<span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-colors motion-interactive group-hover:bg-black/30 group-data-[disabled=true]:hidden">
							<Icon
								name="camera"
								size="md"
								className="text-white opacity-0 transition-opacity motion-interactive group-hover:opacity-100"
							/>
						</span>
					</Button>
				)}

				<input
					ref={inputRef}
					id={inputId}
					name={inputName}
					type="file"
					accept={ACCEPT_ATTR}
					hidden
					disabled={disabled}
					onChange={handleFileChange}
				/>

				{layout === "file-row" ? (
					<div className="flex min-w-0 flex-1 items-center gap-2">
						<Button
							disabled={disabled}
							onClick={() => inputRef.current?.click()}
							type="button"
							variant="secondary"
						>
							Choose file
						</Button>
						<span
							aria-live="polite"
							className="min-w-0 flex-1 truncate text-sm text-muted-foreground"
						>
							{selectedFileName ?? "No file selected"}
						</span>
					</div>
				) : displayUrl && !disabled ? (
					<Button variant="ghost" size="sm" onClick={handleRemove}>
						Remove
					</Button>
				) : null}
			</div>
		</Field>
	);
}

function ProfilePictureInputSkeleton({
	className,
	description,
	label = "Profile picture",
	layout = "overlay",
}: Pick<ProfilePictureInputProps, "description" | "label" | "layout"> & {
	className?: string;
}) {
	return (
		<Field
			className={className}
			description={description}
			disableMessage
			label={label}
		>
			<div className="flex min-w-0 items-center gap-4">
				<ProfilePicture.Skeleton size={layout === "file-row" ? "xl" : "2xl"} />
				{layout === "file-row" ? (
					<div className="flex min-w-0 flex-1 items-center gap-2">
						<Button.Skeleton variant="secondary">Choose file</Button.Skeleton>
						<Text.Skeleton
							as="span"
							className="w-fit max-w-full text-sm"
							variant={null}
						>
							No file selected
						</Text.Skeleton>
					</div>
				) : null}
			</div>
		</Field>
	);
}

export const ProfilePictureInput = Object.assign(ProfilePictureInputRoot, {
	Skeleton: ProfilePictureInputSkeleton,
});
