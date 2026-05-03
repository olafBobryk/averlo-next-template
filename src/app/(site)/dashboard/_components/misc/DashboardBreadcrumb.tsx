"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icons/Icon";
import { Button } from "@/components/ui/primitives/Button";
import { getDashboardPageByPath } from "../entities/pages/presentation";

const SEGMENT_LABELS: Record<string, string> = {
	dashboard: "Dashboard",
	pages: "All pages",
	settings: "Settings",
};

function getFallbackLabel(segment: string): string {
	return (
		SEGMENT_LABELS[segment] ??
		segment.charAt(0).toUpperCase() + segment.slice(1)
	);
}

type Crumb = { label: string; href: string };

function buildCrumbs(
	pathname: string,
	lastSegmentLabel?: string,
	labelOverrides: Record<string, string> = {},
): Crumb[] {
	const parts = pathname.split("/").filter(Boolean);
	return parts.map((segment, i) => {
		const isLast = i === parts.length - 1;
		const href = `/${parts.slice(0, i + 1).join("/")}`;
		const registryPage = getDashboardPageByPath(href);

		return {
			label:
				labelOverrides[href] ??
				(isLast && lastSegmentLabel
					? lastSegmentLabel
					: (registryPage?.label ?? getFallbackLabel(segment))),
			href,
		};
	});
}

type DashboardBreadcrumbProps = {
	lastSegmentLabel?: string;
	labelOverrides?: Record<string, string>;
};

export function DashboardBreadcrumb({
	lastSegmentLabel,
	labelOverrides,
}: DashboardBreadcrumbProps) {
	const pathname = usePathname();
	const crumbs = buildCrumbs(pathname, lastSegmentLabel, labelOverrides);

	if (crumbs.length <= 1) return null;

	return (
		<nav aria-label="Breadcrumb" className="flex items-center gap-2">
			{crumbs.map((crumb, i) => {
				const isLast = i === crumbs.length - 1;
				const isDashboardRoot = crumb.href === "/dashboard";

				if (isDashboardRoot) {
					return (
						<Button
							key={crumb.href}
							variant="ghost"
							href={isLast ? undefined : crumb.href}
							aria-label="Dashboard"
						>
							<Icon name="home" className="opacity-50" weight="fill" />
						</Button>
					);
				}

				return (
					<span key={crumb.href} className="flex items-center gap-2">
						{i > 0 ? (
							<Icon name="caret-right" size="sm" className="opacity-50" />
						) : null}
						<Button
							variant="ghost"
							href={isLast ? undefined : crumb.href}
							textClassName={isLast ? undefined : "text-foreground/60"}
						>
							{crumb.label}
						</Button>
					</span>
				);
			})}
		</nav>
	);
}
