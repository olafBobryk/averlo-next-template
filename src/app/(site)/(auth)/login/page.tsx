import { redirect } from "next/navigation";
import { EmailInput } from "@/components/ui/input/EmailInput";
import { PasswordInput } from "@/components/ui/input/PasswordInput";
import { Button } from "@/components/ui/primitives/Button";
import Divider from "@/components/ui/primitives/Divider";
import { StatusMessage } from "@/components/ui/primitives/StatusMessage";
import { Text } from "@/components/ui/primitives/Text";
import {
	getSafeContinuationPath,
	withSafeContinuation,
} from "@/lib/auth/continuation";
import { resolveCurrentSession } from "@/lib/auth/server";
import { AuthScreen } from "../_components/AuthScreen";
import { enterDemoAction, signInAction } from "../actions";

type LoginPageProps = {
	searchParams: Promise<{ message?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const query = await searchParams;
	const next = getSafeContinuationPath(query.next);
	const resolution = await resolveCurrentSession();
	if (resolution.status === "resolved") redirect(next);
	if (resolution.status === "organization-selection-required") {
		redirect(withSafeContinuation("/select-organization", next));
	}

	return (
		<AuthScreen
			description="Use the provider-neutral fixture adapter now; replace it with your production auth adapter without changing these application routes."
			message={query.message}
			title="Sign in"
		>
			<form action={signInAction} className="grid gap-4">
				<input name="next" type="hidden" value={next} />
				<EmailInput
					defaultValue="operator@averlo.local"
					label="Email"
					name="email"
					required
				/>
				<PasswordInput
					autoComplete="current-password"
					defaultValue="demo-password"
					label="Password"
					name="password"
					required
				/>
				<Button className="w-full" type="submit" variant="primary">
					Sign in
				</Button>
			</form>
			<div className="flex items-center justify-between gap-3 text-sm">
				<Button
					href={withSafeContinuation("/sign-in-options", next)}
					size="sm"
					variant="ghost"
				>
					Other sign-in methods
				</Button>
				<Button
					href={withSafeContinuation("/forgot-password", next)}
					size="sm"
					variant="ghost"
				>
					Forgot password?
				</Button>
			</div>
			<Divider>or use the default demo</Divider>
			<form action={enterDemoAction}>
				<input name="next" type="hidden" value={next} />
				<Button className="w-full" type="submit" variant="secondary">
					Enter demo organization
				</Button>
			</form>
			<StatusMessage tone="info">
				<Text as="span" variant="support">
					Fixture sessions live only in server memory and reset when the process
					restarts. The browser receives only an opaque HttpOnly cookie.
				</Text>
			</StatusMessage>
		</AuthScreen>
	);
}
