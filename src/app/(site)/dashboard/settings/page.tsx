"use client";

import * as React from "react";
import { DashboardSection } from "../_components/layout/DashboardSection";
import { useDashboardSettingsContext } from "../_components/providers/DashboardSettingsProvider";

export default function DashboardSettingsPage() {
	const { sharedSections, dashboardSections } = useDashboardSettingsContext();
	const sections = [...dashboardSections, ...sharedSections];

	return (
		<DashboardSection
			title="Account settings"
			description="Manage the current profile, appearance, and accessibility preferences."
			contentClassName="flex flex-col gap-6"
		>
			{sections.map((section) => (
				<React.Fragment key={section.id}>{section.content}</React.Fragment>
			))}
		</DashboardSection>
	);
}
