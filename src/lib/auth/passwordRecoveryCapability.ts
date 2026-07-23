export function isPasswordRecoveryDeliveryConfigured() {
	return Boolean(
		process.env.APP_ORIGIN &&
			process.env.PASSWORD_RESET_FROM &&
			process.env.RESEND_API_KEY,
	);
}

export function isPasswordRecoveryAvailable() {
	return (
		process.env.NODE_ENV !== "production" ||
		isPasswordRecoveryDeliveryConfigured()
	);
}
