"use client";

import clsx from "clsx";
import { useState } from "react";
import Logo from "@/components/branding/Logo";
import { focusRing } from "@/components/ui/foundations/focus";
import { Button } from "@/components/ui/primitives/Button";
import { hrefFor } from "@/lib/routes";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardFrame({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<div className="min-h-screen bg-surface">
			<div className="mx-auto flex min-h-screen max-w-section-max gap-4 p-4 lg:p-6">
				<DashboardSidebar
					mobileOpen={mobileOpen}
					onMobileOpenChange={setMobileOpen}
				/>
				<div className="flex min-w-0 flex-1 flex-col gap-4">
					<div className="flex items-center justify-between lg:hidden">
						<Logo size="sm" href={hrefFor("dashboard")} />
						<Button
							variant="outline"
							size="sm"
							leadingIcon={mobileOpen ? "minus" : "plus"}
							onClick={() => setMobileOpen((value) => !value)}
							aria-expanded={mobileOpen}
							aria-controls="dashboard-sidebar"
						>
							Menu
						</Button>
					</div>
					<main
						id="dashboard-main"
						tabIndex={-1}
						className={clsx(
							"flex min-h-[calc(100svh-2rem)] min-w-0 flex-1 flex-col rounded-xl border border-border/15 bg-background p-4 shadow-sm lg:min-h-[calc(100svh-3rem)] lg:p-6",
							focusRing.visibleDefault,
						)}
					>
						{children}
					</main>
				</div>
			</div>
		</div>
	);
}
