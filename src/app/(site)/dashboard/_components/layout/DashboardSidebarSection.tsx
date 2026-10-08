"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icons/Icon";
import { Accordion } from "@/components/ui/misc";
import { Button } from "@/components/ui/primitives/Button";
import { usePersistentSidebarDisclosure } from "./sidebarDisclosure";

/** Sections share one quiet heading; only long sections gain a disclosure. */
export function DashboardSidebarSection({
	label,
	count,
	storageId,
	collapsed,
	mobileExpanded,
	children,
}: {
	label: string;
	count: number;
	storageId: string;
	collapsed: boolean;
	mobileExpanded: boolean;
	children: ReactNode;
}) {
	const [open, setOpen] = usePersistentSidebarDisclosure(
		`section.${storageId}`,
		true,
	);
	const headingClass = clsx(
		"flex h-7 w-full items-center px-3 text-xs font-medium text-muted-foreground",
		!mobileExpanded && "max-lg:!hidden",
		collapsed && !mobileExpanded && "lg:!hidden",
	);
	const expandedClass = clsx(
		!mobileExpanded && "max-lg:hidden",
		collapsed && !mobileExpanded && "lg:hidden",
	);
	const railClass = clsx(
		mobileExpanded
			? "hidden"
			: collapsed
				? "hidden max-lg:block lg:block"
				: "hidden max-lg:block",
	);
	if (count <= 3)
		return (
			<section className="grid gap-1 pt-2" aria-label={label}>
				<div className={headingClass}>{label}</div>
				{children}
			</section>
		);
	return (
		<section className="pt-2" aria-label={label}>
			<Accordion
				className={expandedClass}
				contentClassName="!p-0"
				open={open}
				onOpenChange={setOpen}
				title={label}
				renderTrigger={(props) => (
					<Button
						{...props}
						aria-label={`${open ? "Collapse" : "Expand"} ${label} section`}
						align="between"
						size="none"
						variant="ghost"
						className={headingClass}
						contentClassName="w-full justify-between"
					>
						<span>{label}</span>
						<Icon
							name="chevron-down"
							size="sm"
							className={clsx(
								"transition-transform motion-micro",
								open && "rotate-180",
							)}
						/>
					</Button>
				)}
			>
				<div className="grid gap-1">{children}</div>
			</Accordion>
			<div className={railClass}>{children}</div>
		</section>
	);
}
