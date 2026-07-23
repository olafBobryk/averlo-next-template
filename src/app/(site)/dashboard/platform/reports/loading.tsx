import { PlatformCollectionLoading } from "../_components/PlatformRouteLoading";

export default function PlatformReportsLoading() {
	return (
		<PlatformCollectionLoading
			columns={[
				{ id: "reporter", label: "Reporter" },
				{ id: "organization", label: "Organization" },
				{ id: "route", label: "Route" },
				{ id: "severity", label: "Severity" },
				{ id: "status", label: "Status" },
				{ id: "created", label: "Created" },
				{ id: "actions", kind: "action", label: "Actions" },
			]}
			description="Triage structured product feedback with its captured dashboard context."
			label="Loading Platform Reports"
			title="Reports"
		/>
	);
}
