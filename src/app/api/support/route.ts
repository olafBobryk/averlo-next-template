import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
	getPlatformActorSnapshot,
	requireResolvedDashboardSession,
} from "@/app/(site)/dashboard/_lib/platform/access.server";
import { createSupportRequest } from "@/app/(site)/dashboard/_lib/platform/fixtures.server";
import { applicationAdapters } from "@/lib/auth/server";
import {
	buildCooldownCookie,
	validateSubmissionGuards,
} from "@/lib/forms/guard";

const supportFormPolicy = {
	cooldown: {
		cookieName: "averlo-support-request-cooldown",
		windowSeconds: 30,
	},
	honeypot: { fieldName: "website" },
} as const;

function readText(formData: FormData, name: string) {
	const value = formData.get(name);
	return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
	let resolution: Awaited<ReturnType<typeof requireResolvedDashboardSession>>;
	try {
		resolution = await requireResolvedDashboardSession();
	} catch {
		return NextResponse.json(
			{ message: "Sign in to contact support." },
			{ status: 401 },
		);
	}

	const formData = await request.formData();
	const cookieStore = await cookies();
	const guard = validateSubmissionGuards({
		cookieStore,
		formData,
		policy: supportFormPolicy,
	});
	if (guard.kind === "honeypot") {
		return NextResponse.json({ message: "Support request received." });
	}
	if (guard.kind === "cooldown") {
		return NextResponse.json(
			{
				message: `Please wait ${guard.retryAfterSeconds} seconds before submitting another request.`,
			},
			{ status: 429 },
		);
	}

	try {
		const requestedMembershipId = readText(formData, "membershipId");
		const membership = requestedMembershipId
			? resolution.memberships.find(
					(candidate) =>
						candidate.id === requestedMembershipId &&
						candidate.status === "active",
				)
			: resolution.membership;
		if (!membership) {
			throw new Error("Select an available organization.");
		}
		const organization =
			membership.organizationId === resolution.organization.id
				? resolution.organization
				: await applicationAdapters.organizations.getOrganization(
						membership.organizationId,
					);
		if (!organization) {
			throw new Error("The selected organization is no longer available.");
		}
		const supportRequest = createSupportRequest({
			actor: getPlatformActorSnapshot({
				membership,
				organization,
				user: resolution.user,
			}),
			message: readText(formData, "message"),
			subject: readText(formData, "subject"),
		});
		const response = NextResponse.json({
			message: "Support request saved to the demo Platform Inbox.",
			request: supportRequest,
		});
		response.cookies.set(buildCooldownCookie(supportFormPolicy.cooldown));
		return response;
	} catch (error) {
		return NextResponse.json(
			{
				message:
					error instanceof Error
						? error.message
						: "Unable to save the support request.",
			},
			{ status: 400 },
		);
	}
}
