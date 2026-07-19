"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { focusRing } from "@/components/ui/foundations/focus";
import { Icon } from "@/components/ui/icons/Icon";
import {
	getDashboardCapabilities,
	getDashboardSidebarGroups,
	getDashboardSurface,
} from "../../_registry/surfaceRegistry";
import { useDashboardAuth } from "../providers/DashboardAuthProvider";

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
	const { membership } = useDashboardAuth();
	const capabilities = getDashboardCapabilities(membership.role);
	const groups = getDashboardSidebarGroups(capabilities);
	const activeSurface = getDashboardSurface(pathname);

	return (
		<nav aria-label="Dashboard navigation" className="grid gap-3">
			{groups.map((group, groupIndex) => (
				<div
					className={clsx(
						"grid gap-1",
						groupIndex > 0 && "border-t border-sidebar-border/65 pt-3",
					)}
					data-sidebar-tier={group.tier}
					key={group.id}
				>
					{group.surfaces.map((surface) => {
						const active =
							activeSurface?.id === surface.id ||
							(surface.id === "dashboard.records" &&
								pathname.startsWith("/dashboard/records/"));
						return (
							<Link
								aria-current={active ? "page" : undefined}
								aria-label={surface.label}
								className={clsx(
									"relative flex h-9 min-w-0 items-center gap-2 rounded-md text-sm font-medium transition-all motion-interactive",
									mobileExpanded
										? "max-lg:justify-start max-lg:px-3"
										: "max-lg:justify-center max-lg:px-2",
									collapsed
										? "lg:justify-center lg:px-2"
										: "lg:justify-start lg:px-3",
									focusRing.visibleDefault,
									active
										? "bg-primary/10 text-primary"
										: "text-muted-foreground hover:translate-x-0.5 hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground",
								)}
								href={surface.href}
								key={surface.id}
								onClick={onNavigate}
								title={surface.label}
							>
								<Icon className="shrink-0" name={surface.icon} size="lg" />
								<span
									className={clsx(
										"min-w-0 flex-1 truncate whitespace-nowrap",
										mobileExpanded ? "max-lg:not-sr-only" : "max-lg:sr-only",
										collapsed ? "lg:sr-only" : "lg:not-sr-only",
									)}
								>
									{surface.label}
								</span>
							</Link>
						);
					})}
				</div>
			))}
		</nav>
	);
}
