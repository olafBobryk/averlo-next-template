"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icons/Icon";
import { Button } from "@/components/ui/primitives/Button";
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
		<nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2">
			<ol className="flex min-w-0 items-center gap-1 text-sm font-medium">
				{trail.map((item, index) => (
					<li className="flex min-w-0 items-center gap-1" key={item.href}>
						{index > 0 ? (
							<Icon
								className="shrink-0 text-muted-foreground"
								name="caret-right"
								size="sm"
							/>
						) : null}
						<Button
							variant="bare"
							size="none"
							className="min-w-0 truncate text-sm font-medium text-muted-foreground"
							href={item.href}
						>
							{item.label}
						</Button>
					</li>
				))}
			</ol>
			<span aria-hidden="true" className="text-muted-foreground">
				/
			</span>
		</nav>
	);
}
