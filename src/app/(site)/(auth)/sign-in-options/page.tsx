import { EmailInput } from "@/components/ui/input/EmailInput";
import { Button } from "@/components/ui/primitives/Button";
import {
	getSafeContinuationPath,
	withSafeContinuation,
} from "@/lib/auth/continuation";
import { AuthScreen } from "../_components/AuthScreen";
import { requestUnavailableAuthMethodAction } from "../actions";

export default async function SignInOptionsPage({
	searchParams,
}: {
	searchParams: Promise<{ message?: string; next?: string }>;
}) {
	const query = await searchParams;
	const next = getSafeContinuationPath(query.next);
	return (
		<AuthScreen
			description="Additional methods stay fail-closed until the active auth adapter explicitly implements them."
			message={query.message}
			title="Sign-in options"
		>
			<form action={requestUnavailableAuthMethodAction} className="grid gap-4">
				<input name="method" type="hidden" value="magic-link-sign-in" />
				<input name="next" type="hidden" value={next} />
				<input name="returnTo" type="hidden" value="/sign-in-options" />
				<EmailInput label="Email for magic link" name="email" required />
				<Button className="w-full" type="submit" variant="secondary">
					Request magic link
				</Button>
			</form>
			<Button
				className="w-full"
				href={withSafeContinuation("/login", next)}
				variant="ghost"
			>
				Use password sign in
			</Button>
		</AuthScreen>
	);
}
