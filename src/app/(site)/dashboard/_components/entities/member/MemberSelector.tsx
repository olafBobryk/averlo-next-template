"use client";

import { SelectInput } from "@/components/ui/input/SelectInput";
import type { MemberPresentation } from "../../../_lib/entities/member/presentation";
import { MemberAvatar } from "./MemberAvatar";

export function MemberSelector({
	description,
	disabled,
	label = "Owner",
	members,
	name,
	onChange,
	value,
}: {
	description?: string;
	disabled?: boolean;
	label?: string;
	members: readonly MemberPresentation[];
	name?: string;
	onChange: (memberId: string) => void;
	value: string | null;
}) {
	const options = members.map((member) => ({
		icon: (
			<MemberAvatar
				alt=""
				colorIndex={member.avatarColorIndex}
				imageUrl={member.avatarUrl}
				initials={member.initials}
				size="sm"
			/>
		),
		label: member.displayLabel,
		searchText: member.searchText,
		value: member.id,
	}));
	return (
		<SelectInput
			description={description}
			disabled={disabled}
			label={label}
			name={name}
			onChange={onChange}
			options={options}
			placeholder="Select a member"
			value={value}
		/>
	);
}
