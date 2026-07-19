"use client";

import { CopyField } from "@/components/ui/misc/CopyField";
import { Card } from "@/components/ui/primitives/Card";
import { Text } from "@/components/ui/primitives/Text";

export type RelatedInfo = { uses: string[]; usedIn: string[] };

function formatRelated(items: string[]) {
	if (!items.length) return "none";
	if (items.length <= 4) return items.join(", ");
	return `${items.slice(0, 4).join(", ")} +${items.length - 4} more`;
}

function RelatedItems({ uses, usedIn }: RelatedInfo) {
	return (
		<div className="flex flex-col gap-1 text-xs text-muted-foreground">
			<div>
				<Text variant="caption" tone="muted" className="text-xs">
					Uses: {formatRelated(uses)}
				</Text>
			</div>
			<div>
				<Text variant="caption" tone="muted" className="text-xs">
					Used by: {formatRelated(usedIn)}
				</Text>
			</div>
		</div>
	);
}

export type ComponentCardProps = {
	name: string;
	label: string;
	children: React.ReactNode;
	className?: string;
	related?: RelatedInfo;
};

export function ComponentCard({
	name,
	label,
	children,
	className,
	related,
}: ComponentCardProps) {
	return (
		<Card
			display="flex"
			gap="sm"
			padding="sm"
			shadow="none"
			className={[
				"h-full border border-border/10 bg-white self-stretch",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			<div className="flex items-center justify-between gap-2">
				<Text as="h3" variant="bodyStrong">
					{name}
				</Text>
				<Text variant="caption" tone="muted" className="text-xs">
					{label}
				</Text>
			</div>
			<div className="min-h-[44px] flex-1">{children}</div>
			{related ? <RelatedItems {...related} /> : null}
		</Card>
	);
}

export type UsageCardProps = {
	name: string;
	label: string;
	snippet: string;
	related?: RelatedInfo;
};

export function UsageCard({ name, label, snippet, related }: UsageCardProps) {
	return (
		<ComponentCard name={name} label={label} related={related}>
			<CopyField value={snippet} />
		</ComponentCard>
	);
}

export type ComponentGroupProps = {
	title: string;
	description?: string;
	columns?: string;
	children: React.ReactNode;
};

export function ComponentGroup({
	title,
	description,
	columns,
	children,
}: ComponentGroupProps) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-end justify-between gap-4">
				<div className="flex flex-col gap-1">
					<Text as="h2" variant="headingSm">
						{title}
					</Text>
					{description ? (
						<Text variant="caption" tone="muted" className="text-xs">
							{description}
						</Text>
					) : null}
				</div>
			</div>
			<div
				className={[
					"grid gap-3 auto-rows-fr items-stretch",
					columns ?? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
				]
					.filter(Boolean)
					.join(" ")}
			>
				{children}
			</div>
		</div>
	);
}
