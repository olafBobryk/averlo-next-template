import { NextResponse } from "next/server";
import { getDashboardCapabilities } from "@/app/(site)/dashboard/_registry/surfaceRegistry";
import { AuthDomainError, toPublicAuthError } from "@/lib/auth/errors";
import {
	applicationAdapters,
	resolveCurrentSession,
	selectCurrentOrganization,
} from "@/lib/auth/server";

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as { organizationId?: unknown };
		const organizationId =
			typeof body.organizationId === "string" ? body.organizationId : "";
		const context = await selectCurrentOrganization(organizationId);
		return NextResponse.json(context);
	} catch (error) {
		const publicError = toPublicAuthError(error);
		return NextResponse.json(publicError, { status: publicError.status });
	}
}

export async function PATCH(request: Request) {
	try {
		const resolution = await resolveCurrentSession();
		if (resolution.status !== "resolved") {
			throw new AuthDomainError("session-required");
		}
		if (
			!getDashboardCapabilities(resolution.membership.role).has(
				"organization.manage",
			)
		) {
			throw new AuthDomainError("organization-update-forbidden");
		}

		const body = (await request.json()) as {
			name?: unknown;
			profilePictureUrl?: unknown;
			slug?: unknown;
		};
		if (
			(Object.hasOwn(body, "name") && typeof body.name !== "string") ||
			(Object.hasOwn(body, "slug") && typeof body.slug !== "string")
		) {
			throw new AuthDomainError("organization-invalid");
		}

		const patch: {
			name?: string;
			profilePictureUrl?: string;
			slug?: string;
		} = {};
		if (typeof body.name === "string") patch.name = body.name;
		if (typeof body.slug === "string") patch.slug = body.slug;
		if (Object.hasOwn(body, "profilePictureUrl")) {
			if (body.profilePictureUrl === null) {
				patch.profilePictureUrl = undefined;
			} else if (typeof body.profilePictureUrl === "string") {
				patch.profilePictureUrl = body.profilePictureUrl;
			} else {
				throw new AuthDomainError("organization-invalid");
			}
		}

		const organization =
			await applicationAdapters.organizations.updateOrganization({
				organizationId: resolution.organization.id,
				patch,
			});
		return NextResponse.json({ organization });
	} catch (error) {
		const publicError = toPublicAuthError(error);
		return NextResponse.json(publicError, { status: publicError.status });
	}
}
