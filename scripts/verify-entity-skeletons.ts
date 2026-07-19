import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
for (const relativePath of [
	"src/app/(site)/dashboard/_components/entities/member/MemberAvatar.tsx",
	"src/app/(site)/dashboard/_components/entities/member/MemberIdentity.tsx",
	"src/app/(site)/dashboard/_components/data/DashboardTablePanel.tsx",
	"src/app/(site)/dashboard/_components/detail/DashboardDetailField.tsx",
	"src/app/(site)/dashboard/_components/layout/DashboardPageHeader.tsx",
]) {
	const source = readFileSync(resolve(root, relativePath), "utf8");
	assert.ok(
		source.includes("Object.assign") && source.includes("Skeleton:"),
		`${relativePath} must own its Skeleton namespace.`,
	);
}

const reference = readFileSync(
	resolve(root, "src/app/(site)/dashboard/reference/entities/page.tsx"),
	"utf8",
);
const memberAvatar = readFileSync(
	resolve(
		root,
		"src/app/(site)/dashboard/_components/entities/member/MemberAvatar.tsx",
	),
	"utf8",
);
assert.ok(
	memberAvatar.includes("export function MemberAvatarSkeleton"),
	"Server-owned skeleton compositions need a named client-boundary export.",
);
for (const usage of [
	"MemberIdentity.Skeleton",
	"DashboardTablePanel.Skeleton",
	"DashboardDetailField.Skeleton",
	"Accordion.Skeleton",
]) {
	assert.ok(reference.includes(usage), `Reference route must show ${usage}.`);
}
console.log("Entity skeleton ownership and parity verification passed.");
