"use client";

import type { DashboardCommandPresentation } from "../../_lib/presentation/contracts";
import { useDashboardCommands } from "./DashboardCommandProvider";

export function DashboardEntityCommands({
	commands,
	ownerId,
}: {
	commands: readonly DashboardCommandPresentation[];
	ownerId: string;
}) {
	useDashboardCommands(ownerId, commands);
	return null;
}
