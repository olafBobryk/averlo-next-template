import { PlatformCollectionLoading } from "../_components/PlatformRouteLoading";

export default function PlatformInboxLoading() {
	return (
		<PlatformCollectionLoading
			columns={[
				{ id: "requester", label: "Requester" },
				{ id: "subject", label: "Subject" },
				{ id: "organization", label: "Organization" },
				{ id: "status", label: "Status" },
				{ id: "created", label: "Created" },
				{ id: "actions", kind: "action", label: "Actions" },
			]}
			description="Review fixture-only support requests submitted from authenticated dashboards."
			label="Loading Platform Inbox"
			title="Inbox"
		/>
	);
}
