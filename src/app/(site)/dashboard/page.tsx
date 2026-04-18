import { Panel } from "@/components/ui/primitives/Panel";
import { Text } from "@/components/ui/primitives/Text";
import { DashboardSection } from "./_components/layout/DashboardSection";

export default function DashboardPage() {
	return (
		<DashboardSection
			title="Dashboard"
			description="A minimal dashboard shell with route-scoped auth, sidebar navigation, and responsive layout scaffolding."
		>
			<div className="grid gap-4 lg:grid-cols-2">
				<Panel display="flex" padding="md" gap="sm" shadow="none">
					<Text as="h2" variant="headingSm">
						Shell ready
					</Text>
					<Text variant="body" tone="muted">
						The template now has a dedicated dashboard frame, route-scoped auth
						guard, and responsive sidebar structure.
					</Text>
				</Panel>
				<Panel display="flex" padding="md" gap="sm" shadow="none">
					<Text as="h2" variant="headingSm">
						Next step
					</Text>
					<Text variant="body" tone="muted">
						Add dashboard pages here and wrap each page in dashboard-specific
						content blocks rather than marketing sections.
					</Text>
				</Panel>
			</div>
		</DashboardSection>
	);
}
