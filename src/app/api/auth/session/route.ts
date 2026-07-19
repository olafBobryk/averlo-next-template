import { NextResponse } from "next/server";
import { toPublicAuthError } from "@/lib/auth/errors";
import { applicationAdapters, resolveCurrentSession } from "@/lib/auth/server";

function serializeResolution(
	resolution: Awaited<ReturnType<typeof resolveCurrentSession>>,
) {
	if (resolution.status === "anonymous") return resolution;
	if (resolution.status !== "resolved") {
		return {
			...resolution,
			user: { ...resolution.user, role: "member" as const },
		};
	}
	return {
		...resolution,
		user: {
			...resolution.user,
			role: resolution.membership.role,
		},
	};
}

export async function GET() {
	try {
		return NextResponse.json(
			serializeResolution(await resolveCurrentSession()),
		);
	} catch (error) {
		const publicError = toPublicAuthError(error);
		return NextResponse.json(publicError, { status: publicError.status });
	}
}

export async function PATCH(request: Request) {
	try {
		const resolution = await resolveCurrentSession();
		if (resolution.status !== "resolved") {
			return NextResponse.json(
				{ message: "Sign in to update this profile." },
				{ status: 401 },
			);
		}
		const body = (await request.json()) as {
			name?: unknown;
			profilePictureUrl?: unknown;
		};
		const patch: { name?: string; profilePictureUrl?: string } = {};
		if (typeof body.name === "string") patch.name = body.name;
		if (typeof body.profilePictureUrl === "string") {
			patch.profilePictureUrl = body.profilePictureUrl;
		} else if (body.profilePictureUrl === null) {
			patch.profilePictureUrl = undefined;
		}
		const user = await applicationAdapters.auth.updateUser(
			resolution.user.id,
			patch,
		);
		return NextResponse.json({
			user: { ...user, role: resolution.membership.role },
		});
	} catch (error) {
		const publicError = toPublicAuthError(error);
		return NextResponse.json(publicError, { status: publicError.status });
	}
}
