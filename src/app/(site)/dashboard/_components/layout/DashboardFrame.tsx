"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import Logo from "@/components/branding/Logo";
import { focusRing } from "@/components/ui/foundations/focus";
import { Button } from "@/components/ui/primitives/Button";
import { hrefFor } from "@/lib/routes";
import { useDashboardSettingsContext } from "../providers/DashboardSettingsProvider";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardFrame({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const { dashboardAppearance } = useDashboardSettingsContext();

	useEffect(() => {
		const { body } = document;
		const hadDarkClass = body.classList.contains("dark");
		const previousColorScheme = body.style.colorScheme;

		body.classList.toggle("dark", dashboardAppearance === "dark");
		body.style.colorScheme = dashboardAppearance;

		return () => {
			body.classList.toggle("dark", hadDarkClass);
			body.style.colorScheme = previousColorScheme;
		};
	}, [dashboardAppearance]);

	return (
		<div
			className={clsx(
				"min-h-screen bg-background text-foreground transition-colors",
			)}
		>
			<div className="mx-auto flex min-h-screen max-w-section-max gap-8 p-4 lg:p-6">
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
							"flex min-h-[calc(100svh-2rem-32px)] min-w-0 flex-1 flex-col pt-8",
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
