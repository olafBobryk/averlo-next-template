"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MoreMenuDropdown } from "@/components/ui/misc/MoreMenuDropdown";
import { Button } from "@/components/ui/primitives/Button";
import { showToast } from "@/lib/feedback";
import {
	type DashboardDebugState,
	dashboardDebugEnabled,
} from "../../_registry/debug";
import type { DashboardCapability } from "../../_registry/surfaceRegistry";
import { useDashboardAuth } from "../providers/DashboardAuthProvider";

async function signInFixture(email: string) {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ email, password: "demo-password" }),
	});
	if (!response.ok) throw new Error("Unable to enter the fixture session.");
}

export function DashboardDebugMenu({
	capabilities,
	forceLoading,
	onForceLoadingChange,
}: {
	capabilities: ReadonlySet<DashboardCapability>;
	forceLoading: boolean;
	onForceLoadingChange: (value: boolean) => void;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { memberships, organization } = useDashboardAuth();
	if (!dashboardDebugEnabled || !capabilities.has("debug.use")) return null;

	function setDebugState(state: DashboardDebugState | null) {
		const params = new URLSearchParams(searchParams.toString());
		if (state) params.set("debug-state", state);
		else params.delete("debug-state");
		router.replace(`${pathname}${params.size > 0 ? `?${params}` : ""}`);
	}

	// prune:dashboard.reference-entities:start
	function toggleMutationFailure() {
		const params = new URLSearchParams(searchParams.toString());
		if (params.get("debug-mutation") === "fail") {
			params.delete("debug-mutation");
		} else {
			params.set("debug-mutation", "fail");
		}
		router.replace(`${pathname}${params.size > 0 ? `?${params}` : ""}`);
	}
	// prune:dashboard.reference-entities:end

	async function enterFixture(email: string, destination: string) {
		await showToast.promise(signInFixture(email), {
			loading: "Changing fixture session…",
			success: "Fixture session ready.",
			error: "Unable to change fixture session.",
		});
		window.location.assign(destination);
	}

	async function resetFixtures() {
		await showToast.promise(
			fetch("/api/debug/fixture/reset", { method: "POST" }).then((response) => {
				if (!response.ok) throw new Error("Fixture reset failed.");
			}),
			{
				loading: "Resetting fixtures…",
				success: "Fixtures reset.",
				error: "Unable to reset fixtures.",
			},
		);
		await signInFixture("operator@averlo.local");
		window.location.assign("/dashboard?motion=off&reveal=off");
	}

	const capabilityLabel = [...capabilities].sort().join(", ");
	return (
		<div className="fixed bottom-4 right-4 z-50">
			<MoreMenuDropdown
				align="end"
				ariaLabel="Open dashboard debug menu"
				menuWidth={310}
				openOnHover={false}
				pinOnClick
				positionStrategy="fixed"
				side="top"
				options={[
					// prune:dashboard.reference-entities:start
					{
						href: "/dashboard/reference/entities?motion=off&reveal=off",
						id: "entity-reference",
						label: "Open entity reference",
						leadingIcon: "cards",
					},
					{
						id: "mutation-failure",
						label:
							searchParams.get("debug-mutation") === "fail"
								? "Disable mutation failures"
								: "Force mutation failures",
						leadingIcon: "warning",
						onSelect: toggleMutationFailure,
					},
					// prune:dashboard.reference-entities:end
					{
						disabled: true,
						id: "debug-context",
						label: `${organization.name} · ${memberships.length} membership${memberships.length === 1 ? "" : "s"}`,
					},
					{
						id: "force-loading",
						label: forceLoading ? "Disable forced loading" : "Force loading",
						leadingIcon: "spinner",
						onSelect: () => onForceLoadingChange(!forceLoading),
					},
					...(
						["loading", "empty", "error", "unavailable", "not-found"] as const
					).map((state) => ({
						id: `debug-${state}`,
						label: `Debug state: ${state}`,
						onSelect: () => setDebugState(state),
					})),
					{
						id: "debug-clear",
						label: "Clear debug state",
						onSelect: () => setDebugState(null),
					},
					{
						id: "fixture-demo",
						label: "Enter singleton demo",
						leadingIcon: "home",
						onSelect: () =>
							void enterFixture(
								"operator@averlo.local",
								"/dashboard?motion=off&reveal=off",
							),
						separatorBefore: true,
					},
					{
						id: "fixture-multi",
						label: "Enter multi-org review",
						leadingIcon: "users",
						onSelect: () =>
							void enterFixture(
								"multi@averlo.local",
								"/select-organization?switch=1&next=%2Fdashboard&motion=off&reveal=off",
							),
					},
					{
						disabled: true,
						id: "capabilities",
						label: `Capabilities: ${capabilityLabel}`,
						separatorBefore: true,
					},
					{
						id: "fixture-reset",
						label: "Reset fixture state",
						leadingIcon: "trash",
						onSelect: () => void resetFixtures(),
						tone: "danger",
					},
				]}
				renderTrigger={(trigger) => (
					<Button
						aria-expanded={trigger.isOpen}
						aria-haspopup="menu"
						aria-label="Open dashboard debug menu"
						className="shadow-lg"
						onClick={trigger.onRightClick}
						onMouseEnter={trigger.onRootMouseEnter}
						onMouseLeave={trigger.onRootMouseLeave}
						ref={trigger.ref}
						size="sm"
						variant="primaryDark"
					>
						Debug
					</Button>
				)}
			/>
		</div>
	);
}
