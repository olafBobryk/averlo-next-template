import "server-only";

import { AuthDomainError } from "./errors";
import { isPasswordRecoveryDeliveryConfigured } from "./passwordRecoveryCapability";
import { deliverPasswordRecoveryEmail } from "./passwordRecoveryDelivery";

type PasswordRecoveryEmail = {
	recoveryUrl: string;
	to: string;
};

function getResendConfiguration() {
	const apiKey = process.env.RESEND_API_KEY;
	const from = process.env.PASSWORD_RESET_FROM;
	if (!apiKey || !from) return null;
	return { apiKey, from };
}

export async function sendPasswordRecoveryEmail(input: PasswordRecoveryEmail) {
	if (process.env.NODE_ENV !== "production") return false;
	const configuration = getResendConfiguration();
	if (!configuration || !isPasswordRecoveryDeliveryConfigured()) {
		throw new AuthDomainError("password-recovery-unavailable");
	}

	await deliverPasswordRecoveryEmail({ ...configuration, ...input });
	return true;
}
