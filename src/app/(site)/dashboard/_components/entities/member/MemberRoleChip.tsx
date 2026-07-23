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

function MemberRoleChipRoot({
	label,
	tone,
}: {
	label: string;
	tone: DashboardPresentationTone;
}) {
	return <Chip tone={chipTone[tone]}>{label}</Chip>;
}

function MemberRoleChipSkeleton({ label = "Member" }: { label?: string }) {
	return <Chip.Skeleton>{label}</Chip.Skeleton>;
}

export const MemberRoleChip = Object.assign(MemberRoleChipRoot, {
	Skeleton: MemberRoleChipSkeleton,
});
