import { PasswordInput } from "@/components/ui/input/PasswordInput";
import { Button } from "@/components/ui/primitives/Button";
import { getSafeContinuationPath } from "@/lib/auth/continuation";
import { AuthScreen } from "../_components/AuthScreen";
import { requestUnavailableAuthMethodAction } from "../actions";

export default async function SetPasswordPage({
	searchParams,
}: {
	searchParams: Promise<{ message?: string; next?: string }>;
}) {
	const query = await searchParams;
	const next = getSafeContinuationPath(query.next);
	return (
		<AuthScreen
			description="Invitation and provider adapters may establish a verified account setup session before enabling this form."
			message={query.message}
			title="Finish account setup"
		>
			<form action={requestUnavailableAuthMethodAction} className="grid gap-4">
				<input name="method" type="hidden" value="password-update" />
				<input name="next" type="hidden" value={next} />
				<input name="returnTo" type="hidden" value="/set-password" />
				<PasswordInput
					autoComplete="new-password"
					label="Password"
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
					Set password
				</Button>
			</form>
		</AuthScreen>
	);
}
