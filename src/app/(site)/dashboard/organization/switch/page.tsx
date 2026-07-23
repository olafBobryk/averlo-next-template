import { redirect } from "next/navigation";
import { OrganizationSelectionCard } from "@/app/(site)/_components/organization/OrganizationSelectionCard";
import { getSafeContinuationPath } from "@/lib/auth/continuation";
import { applicationAdapters } from "@/lib/auth/server";
import { requireDashboardCapability } from "../../_registry/access.server";
import { dashboardFeatureConfig } from "../../_registry/surfaceRegistry";

export default async function DashboardOrganizationSwitchPage({
	searchParams,
}: {
	searchParams: Promise<{ message?: string; next?: string }>;
}) {
	const query = await searchParams;
	const next = getSafeContinuationPath(query.next, "/dashboard");
	const { context } = await requireDashboardCapability("organization.read");
	if (
		!dashboardFeatureConfig.organizationSwitcher ||
		context.memberships.length <= 1
	) {
		redirect("/dashboard/organization");
	}
	const choices = (
		await Promise.all(
			context.memberships.map(async (membership) => ({
				membership,
				organization: await applicationAdapters.organizations.getOrganization(
					membership.organizationId,
				),
			})),
		)
	).flatMap(({ membership, organization }) =>
		organization ? [{ membership, organization }] : [],
	);

	return (
		<section className="flex min-h-[calc(100svh-10rem)] items-center justify-center py-6 sm:py-10">
			<OrganizationSelectionCard
				choices={choices}
				currentOrganizationId={context.organization.id}
				next={next}
			/>
		</section>
	);
}
