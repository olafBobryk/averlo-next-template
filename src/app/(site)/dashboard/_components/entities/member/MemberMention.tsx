import clsx from "clsx";
import Link from "next/link";
import { focusRing } from "@/components/ui/foundations/focus";
import type { MemberPresentation } from "../../../_lib/entities/member/presentation";

export function MemberMention({
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
