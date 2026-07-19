import { EmailInput } from "@/components/ui/input/EmailInput";
import { Button } from "@/components/ui/primitives/Button";
import {
	getSafeContinuationPath,
	withSafeContinuation,
} from "@/lib/auth/continuation";
import { AuthScreen } from "../_components/AuthScreen";
import { requestUnavailableAuthMethodAction } from "../actions";

export default async function ForgotPasswordPage({
	searchParams,
}: {
	searchParams: Promise<{ message?: string; next?: string }>;
}) {
	const query = await searchParams;
	const next = getSafeContinuationPath(query.next);
	return (
		<AuthScreen
			description="Production adapters may send a recovery link. The fixture adapter deliberately does not send email."
			message={query.message}
			title="Reset your password"
		>
			<form action={requestUnavailableAuthMethodAction} className="grid gap-4">
				<input name="method" type="hidden" value="password-recovery" />
				<input name="next" type="hidden" value={next} />
				<input name="returnTo" type="hidden" value="/forgot-password" />
				<EmailInput label="Account email" name="email" required />
				<Button className="w-full" type="submit" variant="primary">
					Send recovery link
				</Button>
			</form>
			<Button
				className="w-full"
				href={withSafeContinuation("/login", next)}
				variant="ghost"
			>
				Return to sign in
			</Button>
		</AuthScreen>
	);
}
