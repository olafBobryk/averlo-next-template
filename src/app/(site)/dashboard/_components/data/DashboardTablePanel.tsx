import clsx from "clsx";
import Link from "next/link";
import { type Key, type ReactNode, useId } from "react";
import { Icon } from "@/components/ui/icons/Icon";
import { Skeleton } from "@/components/ui/misc/Skeleton";
import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import { DashboardTableSortController } from "./DashboardTableSortController";

export type DashboardTableRenderContext = {
	index: number;
	isLastBodyRow: boolean;
};

export type DashboardTableColumn<Row> = {
	align?: "left" | "right";
	cellClassName?: string;
	header: ReactNode;
	headerClassName?: string;
	id: string;
	render: (row: Row, context: DashboardTableRenderContext) => ReactNode;
	rowLink?: boolean | ((row: Row, index: number) => boolean);
	sortable?: boolean;
};

type DashboardTablePanelProps<Row> = {
	action?: ReactNode;
	className?: string;
	columns: readonly DashboardTableColumn<Row>[];
	description?: ReactNode;
	emptyState?: ReactNode;
	getRowAriaLabel?: (row: Row, index: number) => string;
	getRowHref?: (row: Row, index: number) => string | undefined;
	getRowKey: (row: Row, index: number) => Key;
	icon?: ReactNode;
	id?: string;
	minWidth?: string;
	rows: readonly Row[];
	title: ReactNode;
	viewMoreHref?: string;
	viewMoreLabel?: ReactNode;
};

function DashboardTablePanelRoot<Row>({
	action,
	className,
	columns,
	description,
	emptyState,
	getRowAriaLabel,
	getRowHref,
	getRowKey,
	icon,
	id,
	minWidth = "760px",
	rows,
	title,
	viewMoreHref,
	viewMoreLabel = "View more",
}: DashboardTablePanelProps<Row>) {
	const generatedId = useId();
	const tableId = id ? `${id}-table` : generatedId;
	const firstLinkColumn = columns.findIndex(
		(column) => column.rowLink !== false,
	);
	return (
		<Card
			className={clsx("!gap-0 !pb-0", className)}
			id={id}
			overflow="visible"
		>
			<Card.Header className="border-b">
				<Card.Title className="inline-flex items-center gap-2">
					{icon}
					{title}
				</Card.Title>
				{description ? (
					<Card.Description>{description}</Card.Description>
				) : null}
				{action ? <Card.Action>{action}</Card.Action> : null}
			</Card.Header>
			<Card.Content className={rows.length > 0 ? "!px-0" : "py-4"}>
				{rows.length > 0 ? (
					<div className="overflow-x-auto">
						<DashboardTableSortController tableId={tableId} />
						<table
							className="w-full border-separate border-spacing-0 text-sm [&_tbody_tr:last-child_td]:border-b-0"
							id={tableId}
							style={{ minWidth }}
						>
							<thead>
								<tr className="bg-muted/50 text-left text-xs text-muted-foreground">
									{columns.map((column, columnIndex) => (
										<th
											aria-sort={column.sortable === false ? undefined : "none"}
											className={clsx(
												"border-b border-border/70 px-4 py-2.5 font-medium",
												column.align === "right" && "text-right",
												column.headerClassName,
											)}
											key={column.id}
											scope="col"
										>
											{column.sortable === false ? (
												column.header
											) : (
												<button
													className={clsx(
														"group -mx-1.5 -my-1 inline-flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors motion-interactive hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
														column.align === "right" && "ml-auto",
													)}
													data-column-index={columnIndex}
													data-dashboard-table-sort-header=""
													data-sort-direction="neutral"
													type="button"
												>
													<span className="truncate">{column.header}</span>
													<Icon
														className="text-muted-foreground transition-transform group-data-[sort-direction=ascending]:rotate-180"
														name="chevron-down"
														size="sm"
													/>
												</button>
											)}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{rows.map((row, index) => {
									const href = getRowHref?.(row, index);
									const context = {
										index,
										isLastBodyRow: index === rows.length - 1,
									};
									return (
										<tr
											className={clsx(
												"group/table-row",
												href && "cursor-pointer",
											)}
											data-original-index={index}
											key={getRowKey(row, index)}
										>
											{columns.map((column, columnIndex) => {
												const usesRowLink =
													typeof column.rowLink === "function"
														? column.rowLink(row, index)
														: column.rowLink !== false;
												const linked = Boolean(href) && usesRowLink;
												return (
													<td
														className={clsx(
															"border-b border-border/70 text-muted-foreground transition-colors group-hover/table-row:bg-muted/55 group-focus-within/table-row:bg-muted/55",
															linked ? "p-0" : "px-4 py-3",
															column.align === "right" && "text-right",
															column.cellClassName,
														)}
														key={column.id}
													>
														{linked && href ? (
															<Link
																aria-label={
																	columnIndex === firstLinkColumn
																		? getRowAriaLabel?.(row, index)
																		: undefined
																}
																className="block px-4 py-3 text-current outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30"
																href={href}
																tabIndex={
																	columnIndex === firstLinkColumn
																		? undefined
																		: -1
																}
															>
																{column.render(row, context)}
															</Link>
														) : (
															column.render(row, context)
														)}
													</td>
												);
											})}
										</tr>
									);
								})}
							</tbody>
						</table>
						{viewMoreHref ? (
							<div className="flex justify-center border-t border-border/70 p-3">
								<Button href={viewMoreHref} size="sm" variant="secondary">
									{viewMoreLabel}
								</Button>
							</div>
						) : null}
					</div>
				) : (
					emptyState
				)}
			</Card.Content>
		</Card>
	);
}

type DashboardTablePanelSkeletonProps = {
	className?: string;
	columns: readonly {
		align?: "left" | "right";
		id: string;
		label: ReactNode;
	}[];
	description?: ReactNode;
	rowCount?: number;
	title: ReactNode;
};

function DashboardTablePanelSkeleton({
	className,
	columns,
	description,
	rowCount = 3,
	title,
}: DashboardTablePanelSkeletonProps) {
	const skeletonRowIds = ["one", "two", "three", "four", "five"].slice(
		0,
		rowCount,
	);
	return (
		<Card className={clsx("!gap-0 !pb-0", className)}>
			<Card.Header className="border-b">
				<Card.Title>{title}</Card.Title>
				{description ? (
					<Card.Description>{description}</Card.Description>
				) : null}
			</Card.Header>
			<Card.Content className="!px-0">
				<table className="w-full border-separate border-spacing-0 text-sm">
					<thead>
						<tr className="bg-muted/50 text-left text-xs text-muted-foreground">
							{columns.map((column) => (
								<th
									className="border-b px-4 py-2.5 font-medium"
									key={column.id}
								>
									{column.label}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{skeletonRowIds.map((rowId) => (
							<tr key={rowId}>
								{columns.map((column, columnIndex) => (
									<td className="border-b px-4 py-3" key={column.id}>
										<Skeleton
											className={clsx(
												"h-5 rounded-sm",
												columnIndex === 0 ? "w-40" : "w-24",
											)}
										/>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</Card.Content>
		</Card>
	);
}

export const DashboardTablePanel = Object.assign(DashboardTablePanelRoot, {
	Skeleton: DashboardTablePanelSkeleton,
});
