"use client";

import * as React from "react";
import type { MemberPresentation } from "../../../_lib/entities/member/presentation";
import { MemberSelector } from "./MemberSelector";

function MemberSelectorDemoRoot({
	members,
}: {
	members: readonly MemberPresentation[];
}) {
	const [value, setValue] = React.useState<string | null>(
		members[0]?.id ?? null,
	);
	return <MemberSelector members={members} onChange={setValue} value={value} />;
}

export const MemberSelectorDemo = Object.assign(MemberSelectorDemoRoot, {
	Skeleton: MemberSelector.Skeleton,
});
