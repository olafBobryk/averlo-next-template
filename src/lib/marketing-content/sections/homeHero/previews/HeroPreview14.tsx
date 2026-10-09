"use client";
// Native specimen adapted from @/app/(site)/dashboard/_components/layout/DashboardWorkspaceToolbar.catalog.
import { DashboardWorkspaceToolbar } from "@/app/(site)/dashboard/_components/layout/DashboardWorkspaceToolbar";

const HeroSpecimenRender = () => (
	<DashboardWorkspaceToolbar title="Organization settings" />
);
export default function HeroPreview14() {
	const HeroRender =
		HeroSpecimenRender as unknown as import("react").ComponentType<{
			coordinate: Record<string, unknown>;
		}>;
	return <HeroRender coordinate={{}} />;
}
