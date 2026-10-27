"use client";

import * as React from "react";
import {
	EmailInput,
	SpamProtectionFields,
	TextAreaInput,
} from "@/components/ui/input";
import { Button } from "@/components/ui/primitives/Button";
import { InlineError } from "@/components/ui/primitives/InlineError";
import { Text } from "@/components/ui/primitives/Text";
import { showToast } from "@/lib/feedback";
import { getContactFieldErrors } from "../_lib/validation";

export function ContactForm() {
	const [email, setEmail] = React.useState("");
	const [message, setMessage] = React.useState("");
	const [errors, setErrors] = React.useState<
		ReturnType<typeof getContactFieldErrors>
	>({ email: undefined, message: undefined });
	const [error, setError] = React.useState<string>();
	const [pending, setPending] = React.useState(false);
	const submissionRef = React.useRef(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (submissionRef.current) return;
		const fieldErrors = getContactFieldErrors(email, message);
		setErrors(fieldErrors);
		setError(undefined);
		if (fieldErrors.email || fieldErrors.message) return;
		const formData = new FormData(event.currentTarget);
		submissionRef.current = true;
		setPending(true);
		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				body: formData,
			});
			const result = (await response.json()) as {
				message: string;
				fieldErrors?: ReturnType<typeof getContactFieldErrors>;
			};
			if (result.fieldErrors) {
				setErrors(result.fieldErrors);
				return;
			}
			if (!response.ok) throw new Error("Contact demo unavailable.");
			showToast.success(result.message);
		} catch {
			setError(
				"Unable to run the demo. Your message is still here. Try again.",
			);
		} finally {
			submissionRef.current = false;
			setPending(false);
		}
	}

	return (
		<form
			aria-label="Contact demo"
			className="grid gap-5"
			noValidate
			onSubmit={handleSubmit}
		>
			<Text as="p" tone="muted" variant="support">
				Demo only · no email is sent and no submission is stored.
			</Text>
			<SpamProtectionFields />
			<EmailInput
				disabled={pending}
				error={errors.email}
				label="Email"
				name="email"
				onChange={(value) => {
					setEmail(value);
					setErrors((current) => ({ ...current, email: undefined }));
				}}
				required
				value={email}
			/>
			<TextAreaInput
				disabled={pending}
				error={errors.message}
				label="Message"
				name="message"
				onChange={(value) => {
					setMessage(value);
					setErrors((current) => ({ ...current, message: undefined }));
				}}
				required
				rows={5}
				value={message}
				description="Between 10 and 4,000 characters. Use sample details to try the form."
			/>
			<InlineError open={!!error}>{error}</InlineError>
			<Button
				aria-label="Try contact demo"
				className="justify-self-start"
				loading={pending}
				type="submit"
				variant="primary"
			>
				Try contact demo
			</Button>
		</form>
	);
}
