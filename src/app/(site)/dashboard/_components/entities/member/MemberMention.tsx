import clsx from "clsx";
import Link from "next/link";
import { focusRing } from "@/components/ui/foundations/focus";
import { Text } from "@/components/ui/primitives/Text";
import type { MemberPresentation } from "../../../_lib/entities/member/presentation";

function MemberMentionRoot({
	className,
	presentation,
}: {
	className?: string;
	presentation: MemberPresentation;
}) {
	return (
		<Link
			className={clsx(
				"inline rounded-sm font-medium text-primary no-underline transition-opacity hover:opacity-75",
				focusRing.visibleDefault,
				className,
			)}
			href={presentation.href}
			title={`Open ${presentation.displayLabel}'s member profile`}
		>
			{presentation.mentionLabel}
		</Link>
	);
}

function MemberMentionSkeleton({
	className,
	label = "@Example member",
}: {
	className?: string;
	label?: string;
}) {
	return (
		<Text.Skeleton
			as="span"
			className={clsx("inline font-medium text-primary", className)}
			tone={null}
			variant={null}
		>
			{label}
		</Text.Skeleton>
	);
}

export const MemberMention = Object.assign(MemberMentionRoot, {
	Skeleton: MemberMentionSkeleton,
});
