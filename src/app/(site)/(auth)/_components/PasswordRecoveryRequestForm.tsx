"use client";

import * as React from "react";
import { EmailInput } from "@/components/ui/input";
import { Button } from "@/components/ui/primitives/Button";
import { StatusMessage } from "@/components/ui/primitives/StatusMessage";
import { requestPasswordRecovery } from "@/lib/api/auth";

function PasswordRecoveryRequestFormRoot() {
	const [email, setEmail] = React.useState("");
	const [error, setError] = React.useState<string>();
	const [pending, setPending] = React.useState(false);
	const [previewUrl, setPreviewUrl] = React.useState<string>();
	const [success, setSuccess] = React.useState<string>();

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (pending) return;
		if (!email.trim()) {
			setError("Enter your email.");
			return;
		}
		setPending(true);
		setError(undefined);
		setPreviewUrl(undefined);
		try {
			const result = await requestPasswordRecovery(email);
			setSuccess(result.message);
			setPreviewUrl(result.previewUrl);
		} catch (nextError) {
			setError(
				nextError instanceof Error
					? nextError.message
					: "Unable to request a password reset.",
			);
		} finally {
			setPending(false);
		}
	}

	return (
		<form className="grid gap-4" noValidate onSubmit={handleSubmit}>
			<EmailInput
				disabled={pending}
				error={error}
				label="Email"
				name="email"
				onChange={(value) => {
					setEmail(value);
					setError(undefined);
				}}
				required
				value={email}
			/>
			{success ? <StatusMessage tone="success">{success}</StatusMessage> : null}
			{previewUrl ? (
				<StatusMessage tone="info">
					Fixture-only delivery: <a href={previewUrl}>open the reset link</a>.
				</StatusMessage>
			) : null}
			<Button
				className="w-full"
				loading={pending}
				type="submit"
				variant="primary"
			>
				Send recovery link
			</Button>
		</form>
	);
}

function PasswordRecoveryRequestFormSkeleton() {
	return (
		<div className="grid gap-4">
			<EmailInput.Skeleton label="Email" required />
			<Button.Skeleton className="w-full" variant="primary">
				Send recovery link
			</Button.Skeleton>
		</div>
	);
}

export const PasswordRecoveryRequestForm = Object.assign(
	PasswordRecoveryRequestFormRoot,
	{ Skeleton: PasswordRecoveryRequestFormSkeleton },
);
