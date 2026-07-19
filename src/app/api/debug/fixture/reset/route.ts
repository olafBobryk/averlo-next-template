import { NextResponse } from "next/server";
import { dashboardDebugEnabled } from "@/app/(site)/dashboard/_registry/debug";
import { resetFixtureAuthState } from "@/lib/auth/fixture-adapter";
import { clearSessionId } from "@/lib/auth/server";

export async function POST() {
	if (!dashboardDebugEnabled) {
		return NextResponse.json({ message: "Not found." }, { status: 404 });
	}
	resetFixtureAuthState();
	await clearSessionId();
	return NextResponse.json({ message: "Fixture state reset." });
}
