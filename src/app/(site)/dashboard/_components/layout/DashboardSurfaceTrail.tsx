"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icons/Icon";
import {
	getDashboardCapabilities,
	getDashboardSurfaceTrail,
} from "../../_registry/surfaceRegistry";
import { useDashboardAuth } from "../providers/DashboardAuthProvider";

export function DashboardSurfaceTrail() {
	const pathname = usePathname();
	const { membership, user } = useDashboardAuth();
	const trail = getDashboardSurfaceTrail(
		pathname,
		getDashboardCapabilities(membership.role, user?.platformRole ?? null),
	);
	if (trail.length === 0) return null;

	return (
		<nav aria-label="Breadcrumb" className="min-w-0">
			<ol className="flex min-w-0 items-center gap-1 text-sm">
				{trail.map((item, index) => (
					<li className="flex min-w-0 items-center gap-1" key={item.href}>
						{index > 0 ? (
							<Icon
								className="shrink-0 text-muted-foreground"
								name="caret-right"
								size="sm"
							/>
						) : null}
						<Link
							className="truncate text-muted-foreground transition-colors motion-interactive hover:text-foreground"
							href={item.href}
						>
							{item.label}
						</Link>
					</li>
				))}
			</ol>
		</nav>
	);
}
