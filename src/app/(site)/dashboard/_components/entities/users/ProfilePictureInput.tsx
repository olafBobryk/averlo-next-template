"use client";

import clsx from "clsx";
import * as React from "react";
import { Icon } from "@/components/ui/icons/Icon";
import { Button } from "@/components/ui/primitives/Button";
import { Field } from "@/components/ui/primitives/Field";
import { ProfilePicture } from "./ProfilePicture";

const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPT_ATTR = ".jpg,.jpeg,.png,.webp";

type ProfilePictureInputProps = {
	label?: string;
	description?: string;
	currentUrl?: string;
	name?: string;
	disabled?: boolean;
	onChange: (file: File | null) => void;
};

export function ProfilePictureInput({
	label = "Profile picture",
	description,
	currentUrl,
	name,
	disabled = false,
	onChange,
}: ProfilePictureInputProps) {
	const inputId = React.useId();
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
	const [removed, setRemoved] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const displayUrl = removed ? undefined : (previewUrl ?? currentUrl);

	function revokePreview() {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
	}

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		event.target.value = "";

		if (!file) return;

		if (!ACCEPTED_TYPES.includes(file.type)) {
			setError("Only JPG, PNG, and WebP images are accepted.");
			return;
		}

		if (file.size > MAX_FILE_SIZE_BYTES) {
			setError("Image must be smaller than 3 MB for local template storage.");
			return;
		}

		revokePreview();
		setError(null);
		setRemoved(false);
		setPreviewUrl(URL.createObjectURL(file));
		onChange(file);
	}

	function handleRemove() {
		revokePreview();
		setPreviewUrl(null);
		setRemoved(true);
		setError(null);
		onChange(null);
	}

	React.useEffect(() => {
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		};
	}, [previewUrl]);

	return (
		<Field
			label={label}
			description={description}
			message={error ?? undefined}
			tone={error ? "error" : "default"}
			inputId={inputId}
		>
			<div className="flex items-center gap-4">
				<Button
					type="button"
					variant="ghost"
					className={clsx(
						"relative h-24 w-24 shrink-0 cursor-pointer rounded-full! overflow-hidden border border-border bg-surface p-0! group",
						disabled && "pointer-events-none opacity-60",
					)}
					contentClassName="h-full w-full"
					onClick={() => !disabled && inputRef.current?.click()}
					aria-label="Choose profile picture"
					disabled={disabled}
				>
					<ProfilePicture
						src={displayUrl}
						name={name}
						size="lg"
						className="h-full w-full rounded-full border-0"
					/>
					<span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-colors group-hover:bg-black/30">
						<Icon
							name="camera"
							size="md"
							className="opacity-0 text-white transition-opacity group-hover:opacity-100"
						/>
					</span>
				</Button>

				<input
					ref={inputRef}
					id={inputId}
					type="file"
					accept={ACCEPT_ATTR}
					hidden
					disabled={disabled}
					onChange={handleFileChange}
				/>

				{displayUrl && !disabled ? (
					<Button variant="ghost" size="sm" onClick={handleRemove}>
						Remove
					</Button>
				) : null}
			</div>
		</Field>
	);
}
