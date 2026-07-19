import { NextResponse } from "next/server";
import { toPublicAuthError } from "@/lib/auth/errors";
import { signInWithFixturePassword } from "@/lib/auth/server";

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as {
			email?: unknown;
			password?: unknown;
		};
		const resolution = await signInWithFixturePassword({
			email: typeof body.email === "string" ? body.email : "",
			password: typeof body.password === "string" ? body.password : "",
		});
		if (resolution.status === "anonymous") {
			return NextResponse.json(resolution);
		}
		return NextResponse.json({
			...resolution,
			user: {
				...resolution.user,
				role:
					resolution.status === "resolved"
						? resolution.membership.role
						: "member",
			},
		});
	} catch (error) {
		const publicError = toPublicAuthError(error);
		return NextResponse.json(publicError, { status: publicError.status });
	}
}
