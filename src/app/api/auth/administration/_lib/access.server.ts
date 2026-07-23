import "server-only";

import { getDashboardCapabilities } from "@/app/(site)/dashboard/_registry/surfaceRegistry";
import { AuthDomainError } from "@/lib/auth/errors";
import { resolveCurrentSession } from "@/lib/auth/server";

export async function requireAdministrationContext() {
	const resolution = await resolveCurrentSession();
	if (resolution.status !== "resolved") {
		throw new AuthDomainError("session-required");
	}
	const capabilities = getDashboardCapabilities(
		resolution.membership.role,
		resolution.user.platformRole,
	);
	if (!capabilities.has("organization.manage")) {
		throw new AuthDomainError("membership-role-forbidden");
	}
	return resolution;
}
