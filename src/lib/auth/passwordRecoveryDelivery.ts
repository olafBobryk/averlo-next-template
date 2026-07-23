export type PasswordRecoveryEmailDelivery = {
	apiKey: string;
	from: string;
	recoveryUrl: string;
	to: string;
};

export async function deliverPasswordRecoveryEmail(
	input: PasswordRecoveryEmailDelivery,
	fetchImplementation: typeof fetch = fetch,
) {
	const response = await fetchImplementation("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			authorization: `Bearer ${input.apiKey}`,
			"content-type": "application/json",
		},
		body: JSON.stringify({
			from: input.from,
			html: `<p>Use the link below to reset your password.</p><p><a href="${input.recoveryUrl}">Reset password</a></p>`,
			subject: "Reset your password",
			to: input.to,
		}),
	});

	if (!response.ok) {
		throw new Error("Password recovery email delivery failed.");
	}
}
