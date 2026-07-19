import clsx from "clsx";
import type { MemberPresentation } from "../../../_lib/entities/member/presentation";
import { MemberAvatar } from "./MemberAvatar";

export function MemberAvatarList({
	className,
	members,
	maxVisible = 3,
}: {
	className?: string;
	members: readonly MemberPresentation[];
	maxVisible?: number;
}) {
	if (members.length === 0) return null;
	const visible = members.slice(0, maxVisible);
	const remaining = members.length - visible.length;
	return (
		<span
			aria-label={`Assigned to ${members.map((member) => member.displayLabel).join(", ")}`}
			className={clsx("inline-flex items-center", className)}
			role="img"
		>
			{visible.map((member, index) => (
				<span
					className={clsx("relative", index > 0 && "-ml-2")}
					key={member.id}
					style={{ zIndex: visible.length - index }}
					title={member.displayLabel}
				>
					<MemberAvatar
						alt={member.avatarAlt}
						className="ring-2 ring-background"
						colorIndex={member.avatarColorIndex}
						imageUrl={member.avatarUrl}
						initials={member.initials}
						size="sm"
					/>
				</span>
			))}
			{remaining > 0 ? (
				<span className="relative z-0 -ml-2 inline-grid size-8 place-items-center rounded-full border border-border bg-muted text-xs font-medium text-muted-foreground ring-2 ring-background">
					+{remaining}
				</span>
			) : null}
		</span>
	);
}
