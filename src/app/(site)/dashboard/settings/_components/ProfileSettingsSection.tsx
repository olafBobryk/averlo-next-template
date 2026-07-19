"use client";

import * as React from "react";
import { EmailInput } from "@/components/ui/input/EmailInput";
import { TextInput } from "@/components/ui/input/TextInput";
import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import { Text } from "@/components/ui/primitives/Text";
import { showToast } from "@/lib/feedback";
import { ProfilePictureInput } from "../../_components/entities/users/ProfilePictureInput";
import { useDashboardAuth } from "../../_components/providers/DashboardAuthProvider";

function readFileAsDataUrl(file: File) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") {
				resolve(reader.result);
				return;
			}
			reject(new Error("Unable to read profile picture."));
		};
		reader.onerror = () => reject(new Error("Unable to read profile picture."));
		reader.readAsDataURL(file);
	});
}

export function ProfileSettingsSection() {
	const formId = React.useId();
	const { updateUser, user } = useDashboardAuth();
	const [editing, setEditing] = React.useState(false);
	const [submitting, setSubmitting] = React.useState(false);
	const [name, setName] = React.useState(user?.name ?? "");
	const [pendingPictureFile, setPendingPictureFile] =
		React.useState<File | null>(null);
	const [pictureRemoved, setPictureRemoved] = React.useState(false);
	const [nameError, setNameError] = React.useState<string | null>(null);

	React.useEffect(() => {
		setName(user?.name ?? "");
		setPendingPictureFile(null);
		setPictureRemoved(false);
		setNameError(null);
		setEditing(false);
	}, [user?.name]);

	function handlePictureChange(file: File | null) {
		if (file) {
			setPendingPictureFile(file);
			setPictureRemoved(false);
			return;
		}

		setPendingPictureFile(null);
		setPictureRemoved(Boolean(user?.profilePictureUrl));
	}

	function handleCancel() {
		setName(user?.name ?? "");
		setPendingPictureFile(null);
		setPictureRemoved(false);
		setNameError(null);
		setEditing(false);
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!editing || submitting) return;

		const nextName = name.trim();
		if (!nextName) {
			setNameError("Name is required.");
			return;
		}

		setSubmitting(true);
		try {
			let profilePictureUrl = user?.profilePictureUrl;
			if (pendingPictureFile) {
				profilePictureUrl = await readFileAsDataUrl(pendingPictureFile);
			} else if (pictureRemoved) {
				profilePictureUrl = undefined;
			}

			await showToast.promise(
				Promise.resolve().then(() => {
					updateUser({
						name: nextName,
						profilePictureUrl,
					});
				}),
				{
					loading: "Saving profile...",
					success: "Profile updated.",
					error: "Unable to update profile.",
				},
			);

			setPendingPictureFile(null);
			setPictureRemoved(false);
			setEditing(false);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<Card display="flex" padding="md" gap="md">
			<div className="flex flex-col gap-2">
				<div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
					<div className="min-w-0">
						<Text as="h2" variant="headingSm">
							Profile
						</Text>
						<Text variant="body" tone="muted">
							Update the local dashboard profile shown in the sidebar.
						</Text>
					</div>
					<div className="flex shrink-0 gap-2">
						{editing ? (
							<>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleCancel}
									disabled={submitting}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									form={formId}
									variant="primary"
									size="sm"
									loading={submitting}
									disabled={submitting}
								>
									Save profile
								</Button>
							</>
						) : (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setEditing(true)}
							>
								Edit
							</Button>
						)}
					</div>
				</div>
			</div>

			<form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-5">
				<ProfilePictureInput
					currentUrl={user?.profilePictureUrl}
					name={name}
					disabled={!editing || submitting}
					onChange={handlePictureChange}
				/>
				<div className="grid gap-4 md:grid-cols-2">
					<TextInput
						label="Name"
						name="profileName"
						value={name}
						onChange={(value) => {
							setName(value);
							if (nameError) setNameError(null);
						}}
						error={editing ? (nameError ?? undefined) : undefined}
						required={editing}
						disabled={!editing || submitting}
					/>
					<EmailInput
						label="Email"
						name="profileEmail"
						value={user?.email ?? ""}
						disabled
					/>
				</div>
			</form>
		</Card>
	);
}
