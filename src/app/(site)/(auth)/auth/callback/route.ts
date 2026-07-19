import { NextResponse } from "next/server";
import {
	getSafeContinuationPath,
	withSafeContinuation,
} from "@/lib/auth/continuation";
import { resolveCurrentSession } from "@/lib/auth/server";

export async function GET(request: Request) {
	const requestUrl = new URL(request.url);
	const next = getSafeContinuationPath(requestUrl.searchParams.get("next"));
	const resolution = await resolveCurrentSession();
	if (resolution.status === "resolved") {
		return NextResponse.redirect(new URL(next, requestUrl));
	}
	if (resolution.status === "organization-selection-required") {
		return NextResponse.redirect(
			new URL(withSafeContinuation("/select-organization", next), requestUrl),
		);
	}
	return NextResponse.redirect(
		new URL(
			`${withSafeContinuation("/login", next)}&message=session-required`,
			requestUrl,
		),
	);
}
