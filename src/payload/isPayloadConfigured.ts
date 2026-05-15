export function isPayloadConfigured() {
	return Boolean(process.env.DATABASE_URL && process.env.PAYLOAD_SECRET);
}
