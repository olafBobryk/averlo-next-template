"use client";

import { usePathname } from "next/navigation";
import * as React from "react";
import {
	getDashboardCapabilities,
	getDashboardSidebarGroups,
	getDashboardSurface,
	getDashboardSurfaceTrail,
} from "../../_registry/surfaceRegistry";
import { useDashboardAuth } from "../providers/DashboardAuthProvider";
import { DashboardSidebarItem } from "./DashboardSidebarBranch";
import { DashboardSidebarSection } from "./DashboardSidebarSection";
import { DashboardSidebarSupplement } from "./DashboardSidebarSupplement";

export function DashboardSidebarNav({
	collapsed,
	mobileExpanded,
	onNavigate,
}: {
	collapsed: boolean;
	mobileExpanded: boolean;
	onNavigate: () => void;
}) {
	const pathname = usePathname();
	const { membership, user } = useDashboardAuth();
	const capabilities = getDashboardCapabilities(
		membership.role,
		user?.platformRole ?? null,
	);
	const groups = getDashboardSidebarGroups(capabilities);
	const activeSurface = getDashboardSurface(pathname);
	const activeTrail = getDashboardSurfaceTrail(pathname, capabilities);

	return (
		<nav aria-label="Dashboard navigation" className="grid gap-2 lg:gap-3">
			{groups.map((group) => {
				const assistantSurfaces = group.surfaces.filter(
					(surface) => surface.sidebarSupplementEndpoint,
				);
				const regularSurfaces = group.surfaces;
				return (
					<React.Fragment key={group.id}>
						<DashboardSidebarSection
							label={group.label}
							count={regularSurfaces.length}
							storageId={group.id}
							collapsed={collapsed}
							mobileExpanded={mobileExpanded}
						>
							{regularSurfaces.map((surface) => {
								const exactActive = activeSurface?.id === surface.id;
								const active =
									exactActive ||
									(!surface.sidebarSupplementEndpoint &&
										activeTrail.some(
											(ancestor) => ancestor.href === surface.href,
										));
								return (
									<DashboardSidebarItem
										active={active}
										collapsed={collapsed}
										href={surface.href}
										icon={
											surface.sidebarSupplementEndpoint
												? "compose"
												: surface.icon
										}
										key={surface.id}
										label={
											surface.sidebarSupplementEndpoint
												? "New chat"
												: surface.label
										}
										mobileExpanded={mobileExpanded}
										onNavigate={onNavigate}
									/>
								);
							})}
						</DashboardSidebarSection>
						{assistantSurfaces.length > 0 ? (
							<div className="grid gap-1 pt-1" data-sidebar-tier="assistant">
								{assistantSurfaces.map((surface) => {
									const endpoint = surface.sidebarSupplementEndpoint;
									if (!endpoint) return null;
									const exactActive = activeSurface?.id === surface.id;

									return (
										<DashboardSidebarSupplement
											active={exactActive}
											collapsed={collapsed}
											endpoint={endpoint}
											href={surface.href}
											icon={
												surface.sidebarSupplementEndpoint
													? "compose"
													: surface.icon
											}
											key={surface.id}
											label={surface.label}
											mobileExpanded={mobileExpanded}
											onNavigate={onNavigate}
											pathname={pathname}
											storageId={surface.id}
										/>
									);
								})}
							</div>
						) : null}
					</React.Fragment>
				);
			})}
		</nav>
	);
}
