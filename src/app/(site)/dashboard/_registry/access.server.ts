import "server-only";

import { notFound } from "next/navigation";
import { resolveCurrentSession } from "@/lib/auth/server";
import {
	type DashboardCapability,
	getDashboardCapabilities,
} from "./surfaceRegistry";

export async function requireDashboardCapability(
	capability: DashboardCapability,
) {
	const resolution = await resolveCurrentSession();
	if (resolution.status !== "resolved") notFound();
	const capabilities = getDashboardCapabilities(
		resolution.membership.role,
		resolution.user.platformRole,
	);
	if (!capabilities.has(capability)) notFound();
	return { capabilities, context: resolution };
}
