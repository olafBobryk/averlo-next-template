import { toPublicAuthError } from "@/lib/auth/errors";
import { validatePasswordRecoveryToken } from "@/lib/auth/server";
import { AuthScreen } from "../_components/AuthScreen";
import { PasswordResetForm } from "../_components/PasswordResetForm";

export default async function ResetPasswordPage({
	searchParams,
}: {
	searchParams: Promise<{ message?: string; token?: string }>;
}) {
	const query = await searchParams;
	let recoveryError: string | undefined;
	if (!query.token) {
		recoveryError = "password-recovery-invalid";
	} else {
		try {
			await validatePasswordRecoveryToken({ token: query.token });
		} catch (error) {
			recoveryError = toPublicAuthError(error).code;
		}
	}

	return (
		<AuthScreen
			description="Choose a new password for your account."
			icon="lock"
			message={recoveryError ?? query.message}
			title="Choose a new password"
		>
			{recoveryError ? null : <PasswordResetForm token={query.token} />}
		</AuthScreen>
	);
}
