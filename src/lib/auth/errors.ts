export type AuthErrorCode =
	| "adapter-method-unavailable"
	| "identity-last-viable"
	| "invalid-credentials"
	| "invitation-accepted"
	| "invitation-expired"
	| "invitation-invalid"
	| "invitation-recipient-mismatch"
	| "invitation-revoked"
	| "membership-required"
	| "organization-selection-required"
	| "session-required";

export class AuthDomainError extends Error {
	readonly code: AuthErrorCode;

	constructor(code: AuthErrorCode, message?: string) {
		super(message ?? code);
		this.name = "AuthDomainError";
		this.code = code;
	}
}

const publicErrors = {
	"adapter-method-unavailable": {
		status: 501,
		message: "This sign-in method is not available for this application.",
	},
	"identity-last-viable": {
		status: 409,
		message: "Keep at least one usable sign-in method on the account.",
	},
	"invalid-credentials": {
		status: 401,
		message: "The email or password is not valid.",
	},
	"invitation-accepted": {
		status: 409,
		message: "This invitation has already been used.",
	},
	"invitation-expired": {
		status: 410,
		message: "This invitation has expired.",
	},
	"invitation-invalid": {
		status: 404,
		message: "This invitation is not valid.",
	},
	"invitation-recipient-mismatch": {
		status: 403,
		message: "Sign in with the email address that received this invitation.",
	},
	"invitation-revoked": {
		status: 410,
		message: "This invitation is no longer active.",
	},
	"membership-required": {
		status: 403,
		message: "An active organization membership is required.",
	},
	"organization-selection-required": {
		status: 409,
		message: "Choose an organization before continuing.",
	},
	"session-required": {
		status: 401,
		message: "Sign in to continue.",
	},
} as const satisfies Record<AuthErrorCode, { status: number; message: string }>;

export function toPublicAuthError(error: unknown) {
	if (
		error instanceof AuthDomainError &&
		Object.hasOwn(publicErrors, error.code)
	) {
		return { code: error.code, ...publicErrors[error.code] };
	}

	return {
		code: "invitation-invalid" as const,
		status: 400,
		message: "The request could not be completed.",
	};
}
