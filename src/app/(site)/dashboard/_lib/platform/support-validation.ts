export function getSupportFieldErrors(subject: string, message: string) {
	return {
		subject:
			subject.trim().length < 2 || subject.trim().length > 120
				? "Enter a subject between 2 and 120 characters."
				: undefined,
		message:
			message.trim().length < 10 || message.trim().length > 4_000
				? "Enter a message between 10 and 4,000 characters."
				: undefined,
	};
}
