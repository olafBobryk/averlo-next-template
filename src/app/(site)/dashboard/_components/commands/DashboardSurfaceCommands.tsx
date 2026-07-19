"use client";

import {
	type DashboardContextualCommand,
	useDashboardCommands,
} from "./DashboardCommandProvider";

export function DashboardSurfaceCommands({
	commands,
	ownerId,
}: {
	commands: readonly DashboardContextualCommand[];
	ownerId: string;
}) {
	useDashboardCommands(ownerId, commands);
	return null;
}
