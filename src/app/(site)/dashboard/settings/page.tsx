"use client";

import * as React from "react";
import {
	DashboardFooterNote,
	DashboardFooterNoteLink,
} from "../_components/layout/DashboardFooterNote";
import { DashboardSection } from "../_components/layout/DashboardSection";
import { useDashboardAuth } from "../_components/providers/DashboardAuthProvider";
import { useDashboardSettingsContext } from "../_components/providers/DashboardSettingsProvider";
import { getDashboardCapabilities } from "../_registry/surfaceRegistry";
import { DashboardSettingsHeaderActions } from "./_components/AccountSettingsSections";

export default function DashboardSettingsPage() {
	const { sharedSections, dashboardSections } = useDashboardSettingsContext();
	const { membership, user } = useDashboardAuth();
	const canManage = Boolean(
		user &&
			getDashboardCapabilities(membership.role, user.platformRole).has(
				"organization.manage",
			),
	);
	const sections = [...dashboardSections, ...sharedSections];

	return (
		<DashboardSection
			actions={<DashboardSettingsHeaderActions />}
			title="Account settings"
			contentClassName="flex flex-col gap-5"
		>
			{sections.map((section) => (
				<React.Fragment key={section.id}>{section.content}</React.Fragment>
			))}
			{canManage ? (
				<DashboardFooterNote>
					Looking for administration?{" "}
					<DashboardFooterNoteLink href="/dashboard/administration">
						Open organization administration
					</DashboardFooterNoteLink>
					.
				</DashboardFooterNote>
			) : null}
		</DashboardSection>
	);
}
