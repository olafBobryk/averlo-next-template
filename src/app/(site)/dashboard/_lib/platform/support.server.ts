import "server-only";

export function getSupportEmail() {
	return process.env.SUPPORT_EMAIL?.trim() || "support@example.com";
}

export function getSupportMailto() {
	const email = getSupportEmail();
	return `mailto:${email}?subject=${encodeURIComponent("Averlo dashboard support")}`;
}
