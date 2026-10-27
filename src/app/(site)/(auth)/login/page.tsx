import { redirect } from "next/navigation";
import {
	getSafeContinuationPath,
	withSafeContinuation,
} from "@/lib/auth/continuation";
import { resolveCurrentSession } from "@/lib/auth/server";
import { hrefFor } from "@/lib/routes";
import { AuthScreen } from "../_components/AuthScreen";
import { LoginForm } from "../_components/LoginForm";

type LoginPageProps = {
	searchParams: Promise<{ message?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const query = await searchParams;
	const next = getSafeContinuationPath(query.next);
	const resolution = await resolveCurrentSession();
	if (resolution.status === "resolved") redirect(next);
	if (resolution.status === "organization-selection-required") {
		redirect(withSafeContinuation(hrefFor("auth.select-organization"), next));
	}

	return (
		<AuthScreen
			description="Sign in to continue to your dashboard."
			icon="lock"
			message={query.message}
			title="Sign in"
		>
			<LoginForm
				next={next}
				recoveryHref={withSafeContinuation(
					hrefFor("auth.forgot-password"),
					next,
				)}
				signInOptionsHref={withSafeContinuation(
					hrefFor("auth.sign-in-options"),
					next,
				)}
			/>
		</AuthScreen>
	);
}
