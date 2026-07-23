import { NextResponse } from "next/server";
import { toPublicAuthError } from "@/lib/auth/errors";
import { resetPasswordWithRecovery } from "@/lib/auth/server";

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as {
			password?: unknown;
			token?: unknown;
		};
		const password = typeof body.password === "string" ? body.password : "";
		const token = typeof body.token === "string" ? body.token : "";
		if (password.length < 8) {
			return NextResponse.json(
				{ message: "Use at least 8 characters." },
				{ status: 400 },
			);
		}
		await resetPasswordWithRecovery({ password, token });
		return NextResponse.json({
			message: "Password reset. Sign in with your new password.",
		});
	} catch (error) {
		const publicError = toPublicAuthError(error);
		return NextResponse.json(publicError, { status: publicError.status });
	}
}
