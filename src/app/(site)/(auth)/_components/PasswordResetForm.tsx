"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { PasswordInput } from "@/components/ui/input";
import { Button } from "@/components/ui/primitives/Button";
import { StatusMessage } from "@/components/ui/primitives/StatusMessage";
import { resetPassword } from "@/lib/api/auth";

function PasswordResetFormRoot({ token }: { token?: string }) {
	const router = useRouter();
	const [password, setPassword] = React.useState("");
	const [passwordConfirm, setPasswordConfirm] = React.useState("");
	const [error, setError] = React.useState<string>();
	const [pending, setPending] = React.useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (pending) return;
		if (!token) {
			setError("This password reset link is not valid.");
			return;
		}
		if (password.length < 8) {
			setError("Use at least 8 characters.");
			return;
		}
		if (password !== passwordConfirm) {
			setError("The passwords do not match.");
			return;
		}
		setPending(true);
		setError(undefined);
		try {
			await resetPassword({ password, token });
			router.replace("/login?message=password-reset");
		} catch (nextError) {
			setError(
				nextError instanceof Error
					? nextError.message
					: "Unable to reset your password.",
			);
		} finally {
			setPending(false);
		}
	}

	return (
		<form className="grid gap-4" noValidate onSubmit={handleSubmit}>
			{error ? <StatusMessage tone="danger">{error}</StatusMessage> : null}
			<PasswordInput
				autoComplete="new-password"
				disabled={pending}
				label="New password"
				name="password"
				onChange={(value) => {
					setPassword(value);
					setError(undefined);
				}}
				required
				showStrength
				value={password}
			/>
			<PasswordInput
				autoComplete="new-password"
				disabled={pending}
				label="Confirm password"
				name="passwordConfirm"
				onChange={(value) => {
					setPasswordConfirm(value);
					setError(undefined);
				}}
				required
				value={passwordConfirm}
			/>
			<Button
				className="w-full"
				loading={pending}
				type="submit"
				variant="primary"
			>
				Update password
			</Button>
		</form>
	);
}

function PasswordResetFormSkeleton() {
	return (
		<div className="grid gap-4">
			<PasswordInput.Skeleton
				label="New password"
				required
				showStrength
				value="a-secure-password"
			/>
			<PasswordInput.Skeleton
				label="Confirm password"
				required
				value="a-secure-password"
			/>
			<Button.Skeleton className="w-full" variant="primary">
				Update password
			</Button.Skeleton>
		</div>
	);
}

export const PasswordResetForm = Object.assign(PasswordResetFormRoot, {
	Skeleton: PasswordResetFormSkeleton,
});
