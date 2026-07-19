"use client";

import clsx from "clsx";
import type * as React from "react";
import {
	MoreMenuDropdown,
	type MoreMenuOption,
} from "@/components/ui/misc/MoreMenuDropdown";
import { Text } from "@/components/ui/primitives/Text";

export type DashboardPropertyOption = {
	disabled?: boolean;
	icon?: React.ReactNode;
	id: string;
	label: React.ReactNode;
};

function DashboardPropertyListRoot({
	children,
	className,
}: {
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<section className={clsx("grid gap-2", className)}>{children}</section>
	);
}

function DashboardPropertyListHeader({
	actions,
	onAdd,
	options = [],
	title = "Properties",
}: {
	actions?: React.ReactNode;
	onAdd?: (id: string) => void;
	options?: readonly DashboardPropertyOption[];
	title?: React.ReactNode;
}) {
	const addOptions: MoreMenuOption[] = options.map((option) => ({
		disabled: option.disabled,
		id: option.id,
		label: option.label,
		leadingIcon: option.icon,
		onSelect: () => onAdd?.(option.id),
	}));
	return (
		<div className="flex min-h-8 items-center justify-between gap-3">
			<Text as="h3" className="font-medium" variant="support">
				{title}
			</Text>
			{actions ??
				(addOptions.length > 0 ? (
					<MoreMenuDropdown
						ariaLabel="Add property"
						openOnHover={false}
						options={addOptions}
						positionStrategy="fixed"
						renderTrigger={(trigger) => (
							<button
								className="rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								onClick={trigger.onRightClick}
								ref={trigger.ref as React.Ref<HTMLButtonElement>}
								type="button"
							>
								+ Add
							</button>
						)}
					/>
				) : null)}
		</div>
	);
}

function DashboardPropertyListRows({
	children,
}: {
	children?: React.ReactNode;
}) {
	return children ? (
		<div className="divide-y divide-border/70 border-y border-border/70">
			{children}
		</div>
	) : null;
}

function DashboardPropertyRow({
	action,
	children,
	icon,
	label,
	menuOptions,
}: {
	action?: React.ReactNode;
	children: React.ReactNode;
	icon: React.ReactNode;
	label: string;
	menuOptions?: MoreMenuOption[];
}) {
	return (
		<div className="grid min-h-12 grid-cols-[minmax(8rem,.6fr)_minmax(0,1fr)_auto] items-center gap-4 py-2 max-sm:grid-cols-[1fr_auto]">
			<div className="flex min-w-0 items-center gap-3 text-muted-foreground">
				<span className="inline-flex size-5 shrink-0 items-center justify-center">
					{icon}
				</span>
				<Text as="span" className="truncate font-medium" variant="support">
					{label}
				</Text>
			</div>
			<div className="min-w-0 text-sm max-sm:col-span-2 max-sm:row-start-2">
				{children}
			</div>
			<div className="flex justify-end">
				{action ??
					(menuOptions ? (
						<MoreMenuDropdown
							ariaLabel={`Manage ${label.toLowerCase()}`}
							options={menuOptions}
							positionStrategy="fixed"
						/>
					) : null)}
			</div>
		</div>
	);
}

export const DashboardPropertyList = Object.assign(DashboardPropertyListRoot, {
	Header: DashboardPropertyListHeader,
	Row: DashboardPropertyRow,
	Rows: DashboardPropertyListRows,
});
