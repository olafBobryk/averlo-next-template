"use client";

import * as React from "react";
import { EmailInput, PasswordInput } from "@/components/ui/input";
import { Button } from "@/components/ui/primitives/Button";
import Divider from "@/components/ui/primitives/Divider";
import { InlineError } from "@/components/ui/primitives/InlineError";
import { getLoginFieldErrors, type LoginResult } from "../_lib/login";
import { enterDemoAction, signInAction } from "../actions";

const initialResult: LoginResult = {};

export function LoginForm({
	next,
	recoveryHref,
	signInOptionsHref,
}: {
	next: string;
	recoveryHref: string;
	signInOptionsHref: string;
}) {
	const [email, setEmail] = React.useState("operator@averlo.local");
	const [password, setPassword] = React.useState("demo-password");
	const [errors, setErrors] = React.useState<LoginResult["fieldErrors"]>({});
	const [message, setMessage] = React.useState<string>();
	const submissionRef = React.useRef(false);
	const [result, action, pending] = React.useActionState(
		async (previous: LoginResult, formData: FormData): Promise<LoginResult> => {
			try {
				return await signInAction(previous, formData);
			} catch (error) {
				if ((error as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT"))
					throw error;
				return {
					message: "Unable to sign in. Your email is still here. Try again.",
				};
			}
		},
		initialResult,
	);

	React.useEffect(() => {
		if (result === initialResult) return;
		setErrors(result.fieldErrors ?? {});
		setMessage(result.message);
		setPassword("");
		submissionRef.current = false;
	}, [result]);

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		if (submissionRef.current) {
			event.preventDefault();
			return;
		}
		const fieldErrors = getLoginFieldErrors(email, password);
		setErrors(fieldErrors);
		setMessage(undefined);
		if (fieldErrors.email || fieldErrors.password) {
			event.preventDefault();
			return;
		}
		submissionRef.current = true;
	}

	return (
		<>
			<form
				action={action}
				aria-label="Sign in"
				className="grid gap-4"
				noValidate
				onSubmit={handleSubmit}
			>
				<input name="next" type="hidden" value={next} />
				<EmailInput
					disabled={pending}
					error={errors?.email}
					label="Email"
					name="email"
					onChange={(value) => {
						setEmail(value);
						setErrors((current) => ({ ...current, email: undefined }));
					}}
					required
					value={email}
				/>
				<PasswordInput
					autoComplete="current-password"
					disabled={pending}
					error={errors?.password}
					label="Password"
					labelAction={
						<Button
							disabled={pending}
							href={recoveryHref}
							size="none"
							textVariant="caption"
							variant="bare"
							className="text-muted-foreground"
						>
							Forgot password?
						</Button>
					}
					name="password"
					onChange={(value) => {
						setPassword(value);
						setErrors((current) => ({ ...current, password: undefined }));
					}}
					required
					value={password}
				/>
				<InlineError open={!!message}>{message}</InlineError>
				<Button
					aria-label="Sign in"
					className="w-full"
					loading={pending}
					type="submit"
					variant="primary"
				>
					Sign in
				</Button>
			</form>
			<Divider>or</Divider>
			<form action={enterDemoAction}>
				<input name="next" type="hidden" value={next} />
				<Button
					className="w-full"
					disabled={pending}
					type="submit"
					variant="secondary"
				>
					Enter demo organization
				</Button>
			</form>
			<Button
				className="w-full"
				disabled={pending}
				href={signInOptionsHref}
				size="none"
				variant="bare"
			>
				Use magic link
			</Button>
		</>
	);
}
