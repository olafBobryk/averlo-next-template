import { Button } from "@/components/ui/primitives/Button";
import { ContentSection } from "@/components/ui/primitives/surfaces";
import { hrefFor } from "@/lib/routes";
import { getDashboardSurfaceById } from "../_registry/surfaceRegistry";
import { DashboardSection } from "./layout/DashboardSection";
import { DashboardLoadingStatus } from "./loading/DashboardLoadingStatus";

const referenceSurface = getDashboardSurfaceById("dashboard.reference");

function OverviewContent({ showReference }: { showReference: boolean }) {
	return (
		<DashboardSection
			contentClassName="grid gap-4"
			title="Overview"
		>
			<OverviewCard
				description="Review members, roles, and organization administration."
				href={hrefFor("dashboard.organization")}
				label="Open organization"
				title="Organization"
			/>
			<OverviewCard
				description="Browse and manage records for the active organization."
				href={hrefFor("dashboard.records")}
				label="Open records"
				title="Records"
			/>
			<OverviewCard
				description="Manage your profile, security, and accessibility preferences."
				href={hrefFor("dashboard.settings")}
				label="Open account settings"
				title="Account"
			/>
			{showReference && referenceSurface ? (
				<OverviewCard
					description={referenceSurface.description}
					href={referenceSurface.href}
					label="Open reference"
					title={referenceSurface.label}
				/>
			) : null}
		</DashboardSection>
	);
}

function OverviewCard({
	description,
	href,
	label,
	title,
}: {
	description: string;
	href: string;
	label: string;
	title: string;
}) {
	return (
		<ContentSection>
			<ContentSection.Heading description={description} title={title} />
			<ContentSection.Content>
				<Button href={href} size="sm" variant="secondary">
					{label}
				</Button>
			</ContentSection.Content>
		</ContentSection>
	);
}

export function OverviewSurface({
	showReference = false,
}: {
	showReference?: boolean;
}) {
	return <OverviewContent showReference={showReference} />;
}

export function OverviewSurfaceSkeleton({
	showReference = process.env.NODE_ENV !== "production",
}: {
	showReference?: boolean;
}) {
	return (
		<DashboardLoadingStatus label="Loading dashboard overview">
			<OverviewContent showReference={showReference} />
		</DashboardLoadingStatus>
	);
}
