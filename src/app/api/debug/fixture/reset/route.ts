import { NextResponse } from "next/server";
// prune:dashboard.reference-entities:start
import { resetReferenceRecordFixtureState } from "@/app/(site)/dashboard/_lib/fixtures/reference-records.server";
// prune:dashboard.reference-entities:end
import { dashboardDebugEnabled } from "@/app/(site)/dashboard/_registry/debug";
import { resetFixtureAuthState } from "@/lib/auth/fixture-adapter";
import { clearSessionId } from "@/lib/auth/server";

export async function POST() {
	if (!dashboardDebugEnabled) {
		return NextResponse.json({ message: "Not found." }, { status: 404 });
	}
	resetFixtureAuthState();
	// prune:dashboard.reference-entities:start
	resetReferenceRecordFixtureState();
	// prune:dashboard.reference-entities:end
	await clearSessionId();
	return NextResponse.json({ message: "Fixture state reset." });
}
