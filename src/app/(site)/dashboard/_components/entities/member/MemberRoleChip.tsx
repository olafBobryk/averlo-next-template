import { Chip } from "@/components/ui/misc/Chip";
import type { DashboardPresentationTone } from "../../../_lib/presentation/contracts";

const chipTone = {
	danger: "danger",
	info: "primary",
	neutral: "neutral",
	primary: "primary",
	success: "success",
	warning: "warning",
} as const satisfies Record<
	DashboardPresentationTone,
	React.ComponentProps<typeof Chip>["tone"]
>;

export function MemberRoleChip({
	label,
	tone,
}: {
	label: string;
	tone: DashboardPresentationTone;
}) {
	return <Chip tone={chipTone[tone]}>{label}</Chip>;
}
