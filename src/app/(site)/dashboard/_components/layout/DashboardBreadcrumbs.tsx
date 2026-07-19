"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icons/Icon";
import {
	getDashboardBreadcrumbs,
	getDashboardCapabilities,
} from "../../_registry/surfaceRegistry";
import { useDashboardAuth } from "../providers/DashboardAuthProvider";

export function DashboardBreadcrumbs({ lastLabel }: { lastLabel?: string }) {
	const pathname = usePathname();
	const { membership } = useDashboardAuth();
	const breadcrumbs = getDashboardBreadcrumbs(
		pathname,
		getDashboardCapabilities(membership.role),
		lastLabel,
	);
	if (breadcrumbs.length <= 1) return null;

	return (
		<nav aria-label="Breadcrumb" className="min-w-0">
			<ol className="flex min-w-0 items-center gap-1 text-sm">
				{breadcrumbs.map((crumb, index) => {
					const last = index === breadcrumbs.length - 1;
					return (
						<li
							className="flex min-w-0 items-center gap-1"
							key={`${crumb.href ?? "current"}:${crumb.label}`}
						>
							{index > 0 ? (
								<Icon
									className="shrink-0 text-muted-foreground"
									name="caret-right"
									size="sm"
								/>
							) : null}
							{crumb.href && !last ? (
								<Link
									className="truncate text-muted-foreground transition-colors motion-interactive hover:text-foreground"
									href={crumb.href}
								>
									{crumb.label}
								</Link>
							) : (
								<span
									aria-current={last ? "page" : undefined}
									className="truncate font-medium text-foreground"
								>
									{crumb.label}
								</span>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
