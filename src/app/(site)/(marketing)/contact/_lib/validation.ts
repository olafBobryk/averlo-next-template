export function getContactFieldErrors(email: string, message: string) {
	return {
		email:
			email.trim().length <= 254 &&
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
				? undefined
				: "Enter a valid email.",
		message:
			message.trim().length >= 10 && message.trim().length <= 4_000
				? undefined
				: "Enter a message between 10 and 4,000 characters.",
	};
}
