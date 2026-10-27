export type LoginResult = {
	fieldErrors?: { email?: string; password?: string };
	message?: string;
};

export function getLoginFieldErrors(email: string, password: string) {
	return {
		email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
			? undefined
			: "Enter a valid email.",
		password: password.length > 0 ? undefined : "Enter your password.",
	};
}
