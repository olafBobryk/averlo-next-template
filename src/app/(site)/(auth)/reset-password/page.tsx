import { PasswordInput } from "@/components/ui/input/PasswordInput";
import { Button } from "@/components/ui/primitives/Button";
import { getSafeContinuationPath } from "@/lib/auth/continuation";
import { AuthScreen } from "../_components/AuthScreen";
import { requestUnavailableAuthMethodAction } from "../actions";

export default async function ResetPasswordPage({
	searchParams,
}: {
	searchParams: Promise<{ message?: string; next?: string }>;
}) {
	const query = await searchParams;
	const next = getSafeContinuationPath(query.next);
	return (
		<AuthScreen
			description="A production adapter should validate its recovery session before this form is enabled."
			message={query.message}
			title="Choose a new password"
		>
			<form action={requestUnavailableAuthMethodAction} className="grid gap-4">
				<input name="method" type="hidden" value="password-update" />
				<input name="next" type="hidden" value={next} />
				<input name="returnTo" type="hidden" value="/reset-password" />
				<PasswordInput
					autoComplete="new-password"
					label="New password"
					name="password"
					required
					showStrength
				/>
				<PasswordInput
					autoComplete="new-password"
					label="Confirm password"
					name="passwordConfirm"
					required
				/>
				<Button className="w-full" type="submit" variant="primary">
					Update password
				</Button>
			</form>
		</AuthScreen>
	);
}
