export type AuthErrorCode =
	| "adapter-method-unavailable"
	| "identity-last-viable"
	| "invalid-credentials"
	| "invitation-accepted"
	| "invitation-expired"
	| "invitation-invalid"
	| "invitation-member-conflict"
	| "invitation-pending-conflict"
	| "invitation-role-forbidden"
	| "invitation-recipient-mismatch"
	| "invitation-revoked"
	| "membership-required"
	| "membership-role-forbidden"
	| "membership-self-removal"
	| "membership-owner-protected"
	| "organization-invalid"
	| "organization-selection-required"
	| "organization-slug-conflict"
	| "organization-update-forbidden"
	| "password-recovery-expired"
	| "password-recovery-invalid"
	| "password-recovery-unavailable"
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
	"invitation-member-conflict": {
		status: 409,
		message: "This account already has access to the organization.",
	},
	"invitation-pending-conflict": {
		status: 409,
		message: "A pending invitation already exists for this email address.",
	},
	"invitation-role-forbidden": {
		status: 403,
		message: "Only the organization owner can assign administrator access.",
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
	"membership-role-forbidden": {
		status: 403,
		message: "You do not have permission to change this membership.",
	},
	"membership-self-removal": {
		status: 409,
		message: "Use a dedicated leave-organization flow to remove yourself.",
	},
	"membership-owner-protected": {
		status: 409,
		message: "Transfer ownership before changing or removing the owner.",
	},
	"organization-invalid": {
		status: 400,
		message: "Enter a valid organization name and slug.",
	},
	"organization-selection-required": {
		status: 409,
		message: "Choose an organization before continuing.",
	},
	"organization-slug-conflict": {
		status: 409,
		message: "That organization slug is already in use.",
	},
	"organization-update-forbidden": {
		status: 403,
		message: "You do not have permission to update this organization.",
	},
	"password-recovery-expired": {
		status: 410,
		message: "This password reset link has expired.",
	},
	"password-recovery-invalid": {
		status: 400,
		message: "This password reset link is not valid.",
	},
	"password-recovery-unavailable": {
		status: 503,
		message: "Password recovery is not available for this application.",
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
