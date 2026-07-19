import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
	dashboardDebugStates,
	isDashboardDebugState,
} from "../src/app/(site)/dashboard/_registry/debug";
import {
	getDashboardBreadcrumbs,
	getDashboardCapabilities,
	getDashboardNavigationCommands,
	getDashboardSidebarGroups,
	getDashboardSurface,
} from "../src/app/(site)/dashboard/_registry/surfaceRegistry";

const root = process.cwd();
const memberCapabilities = getDashboardCapabilities("member");
const adminCapabilities = getDashboardCapabilities("admin");

assert.equal(
	getDashboardSurface("/dashboard/records/north-star")?.id,
	"dashboard.record",
);
assert.equal(getDashboardSurface("/dashboard/pages"), null);

const memberSidebarIds = getDashboardSidebarGroups(memberCapabilities)
	.flatMap((group) => group.surfaces)
	.map((surface) => surface.id);
assert.ok(memberSidebarIds.includes("dashboard.records"));
assert.ok(!memberSidebarIds.includes("dashboard.organization.settings"));

const adminSidebarIds = getDashboardSidebarGroups(adminCapabilities)
	.flatMap((group) => group.surfaces)
	.map((surface) => surface.id);
assert.ok(adminSidebarIds.includes("dashboard.organization.settings"));

const memberCommandIds = getDashboardNavigationCommands(memberCapabilities).map(
	(command) => command.id,
);
const adminCommandIds = getDashboardNavigationCommands(adminCapabilities).map(
	(command) => command.id,
);
assert.ok(!memberCommandIds.includes("records.create"));
assert.ok(adminCommandIds.includes("records.create"));

assert.deepEqual(
	getDashboardBreadcrumbs(
		"/dashboard/records/north-star",
		memberCapabilities,
		"North star",
	).map((crumb) => crumb.label),
	["Overview", "Records", "North star"],
);

for (const routeFile of [
	"src/app/(site)/dashboard/page.tsx",
	"src/app/(site)/dashboard/records/page.tsx",
	"src/app/(site)/dashboard/records/[recordId]/page.tsx",
	"src/app/(site)/dashboard/settings/page.tsx",
	"src/app/(site)/dashboard/organization/page.tsx",
	"src/app/(site)/dashboard/organization/members/page.tsx",
	"src/app/(site)/dashboard/organization/settings/page.tsx",
]) {
	assert.ok(existsSync(resolve(root, routeFile)), `Missing ${routeFile}`);
}
assert.ok(
	!existsSync(resolve(root, "src/app/(site)/dashboard/pages/page.tsx")),
);

const globalRoutes = readFileSync(
	resolve(root, "src/config/routes.ts"),
	"utf8",
);
assert.ok(!globalRoutes.includes('dashboard: "/dashboard"'));

const commandProvider = readFileSync(
	resolve(
		root,
		"src/app/(site)/dashboard/_components/commands/DashboardCommandProvider.tsx",
	),
	"utf8",
);
assert.ok(commandProvider.includes("return context.register"));
assert.ok(commandProvider.includes("next.delete(token)"));

assert.deepEqual(dashboardDebugStates, [
	"loading",
	"empty",
	"error",
	"unavailable",
	"not-found",
]);
assert.equal(isDashboardDebugState("loading"), true);
assert.equal(isDashboardDebugState("unknown"), false);

console.log("Dashboard surface registry verification passed.");
