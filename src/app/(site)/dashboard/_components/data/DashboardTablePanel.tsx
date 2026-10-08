import clsx from "clsx";
import Link from "next/link";
import { type Key, type ReactNode, useId } from "react";
import { Icon } from "@/components/ui/icons/Icon";
import { PaginationControls } from "@/components/ui/misc/PaginationControls";
import { Button } from "@/components/ui/primitives/Button";
import Divider from "@/components/ui/primitives/Divider";
import { ContentSection } from "@/components/ui/primitives/surfaces";
import { DashboardTablePagination } from "./DashboardTablePagination";
import { DashboardTableResponsiveController } from "./DashboardTableResponsiveController";
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
	kind?: "action" | "data";
	render: (row: Row, context: DashboardTableRenderContext) => ReactNode;
	responsivePriority?: number;
	rowLink?: boolean | ((row: Row, index: number) => boolean);
	sortable?: boolean;
};

function assertActionColumnContract(
	columns: readonly { id: string; kind?: "action" | "data" }[],
) {
	const actionColumns = columns
		.map((column, index) => ({ column, index }))
		.filter(({ column }) => column.kind === "action");
	if (actionColumns.length > 1) {
		throw new Error("Dashboard tables support at most one action column.");
	}
	const actionColumn = actionColumns[0];
	if (actionColumn && actionColumn.index !== columns.length - 1) {
		throw new Error(
			`Dashboard table action column "${actionColumn.column.id}" must be last.`,
		);
	}
}

type DashboardTablePanelProps<Row> = {
	className?: string;
	columns: readonly DashboardTableColumn<Row>[];
	emptyState?: ReactNode;
	getRowAriaLabel?: (row: Row, index: number) => string;
	getRowHref?: (row: Row, index: number) => string | undefined;
	getRowKey: (row: Row, index: number) => Key;
	header?: ReactNode;
	id?: string;
	rows: readonly Row[];
	/** Paginate a fully loaded collection. Omit for overview excerpts. */
	pageSize?: number;
	viewMoreHref?: string;
	viewMoreLabel?: ReactNode;
};

function DashboardTablePanelRoot<Row>({
	className,
	columns,
	emptyState,
	getRowAriaLabel,
	getRowHref,
	getRowKey,
	header,
	id,
	rows,
	pageSize,
	viewMoreHref,
	viewMoreLabel = "View more",
}: DashboardTablePanelProps<Row>) {
	assertActionColumnContract(columns);
	if (pageSize !== undefined && (!Number.isInteger(pageSize) || pageSize < 1))
		throw new Error("Table pageSize must be a positive integer.");
	if (pageSize && viewMoreHref)
		throw new Error("Choose pagination or View more for a table.");
	const generatedId = useId();
	const tableId = id ? `${id}-table` : generatedId;
	const firstLinkColumn = columns.findIndex(
		(column) => column.kind !== "action" && column.rowLink !== false,
	);
	return (
		<ContentSection className={clsx("min-w-0", className)} id={id}>
			{header}
			<ContentSection.Content
				className={clsx(
					"min-w-0 overflow-hidden rounded-xl border border-[var(--card-border-color)] bg-card",
					rows.length === 0 && !pageSize && "p-4",
				)}
			>
				{rows.length > 0 ? (
					<div
						className="relative max-w-full overflow-x-auto"
						data-dashboard-table-scroll=""
					>
						<DashboardTableResponsiveController tableId={tableId} />
						<DashboardTableSortController tableId={tableId} />
						<table
							className="w-full border-separate border-spacing-0 text-sm [&_tbody_tr:last-child_td]:border-b-0 [&_tr[data-page-last=true]_td]:border-b-0 [&_tr[hidden]]:hidden"
							id={tableId}
						>
							<thead>
								<tr className="bg-[var(--card-chrome-background)] text-left text-xs text-[var(--card-chrome-foreground)]">
									{columns.map((column, columnIndex) => {
										const isAction = column.kind === "action";
										const isRequired = columnIndex === 0 || isAction;
										const isSortable = !isAction && column.sortable !== false;
										return (
											<th
												aria-sort={isSortable ? "none" : undefined}
												className={clsx(
													"border-b border-[var(--card-border-color)] px-4 py-2.5 font-medium whitespace-nowrap",
													(column.align === "right" || isAction) &&
														"text-right",
													isAction &&
														"sticky right-0 z-10 w-px bg-[var(--card-chrome-background)]",
													column.headerClassName,
												)}
												data-dashboard-table-column-index={columnIndex}
												data-dashboard-table-kind={column.kind ?? "data"}
												data-dashboard-table-required={isRequired}
												data-dashboard-table-responsive-priority={
													column.responsivePriority
												}
												key={column.id}
												scope="col"
											>
												{!isSortable ? (
													column.header
												) : (
													<Button
														align="left"
														className={clsx(
															"-mx-1.5 -my-1 border-0 px-1.5 py-1 !text-[var(--card-chrome-foreground)] transition-colors motion-interactive hover:text-foreground",
															(column.align === "right" || isAction) &&
																"ml-auto",
														)}
														contentClassName="w-fit gap-2"
														data-column-index={columnIndex}
														data-dashboard-table-sort-header=""
														data-sort-direction="neutral"
														radius="sm"
														size="none"
														variant="ghost"
													>
														<span className="truncate">{column.header}</span>
														<span className="relative inline-grid size-3 shrink-0 place-items-center">
															<Icon
																className="absolute opacity-0 scale-50 text-muted-foreground transition-all motion-micro group-data-[sort-direction=neutral]:opacity-100 group-data-[sort-direction=neutral]:scale-100"
																name="minus"
																size="sm"
															/>
															<Icon
																className="absolute text-muted-foreground transition-all motion-micro group-data-[sort-direction=neutral]:opacity-0 group-data-[sort-direction=neutral]:scale-50 group-data-[sort-direction=ascending]:rotate-180"
																name="chevron-down"
																size="sm"
															/>
														</span>
													</Button>
												)}
											</th>
										);
									})}
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
												const isAction = column.kind === "action";
												const usesRowLink =
													!isAction && typeof column.rowLink === "function"
														? column.rowLink(row, index)
														: !isAction && column.rowLink !== false;
												const linked = Boolean(href) && usesRowLink;
												return (
													<td
														className={clsx(
															"border-b border-[var(--card-border-color)] text-muted-foreground transition-colors group-hover/table-row:bg-muted/55 group-focus-within/table-row:bg-muted/55",
															linked
																? "p-0"
																: clsx(
																		"px-4 py-3",
																		context.isLastBodyRow &&
																			!pageSize &&
																			"pb-4",
																	),
															columnIndex === 0
																? "min-w-0 overflow-hidden"
																: "whitespace-nowrap",
															(column.align === "right" || isAction) &&
																"text-right",
															isAction &&
																"sticky right-0 z-10 w-px bg-card group-hover/table-row:bg-muted group-focus-within/table-row:bg-muted",
															column.cellClassName,
														)}
														data-dashboard-table-column-index={columnIndex}
														data-dashboard-table-kind={column.kind ?? "data"}
														data-dashboard-table-required={
															columnIndex === 0 || isAction
														}
														data-dashboard-table-responsive-priority={
															column.responsivePriority
														}
														key={column.id}
													>
														{linked && href ? (
															<Link
																aria-label={
																	columnIndex === firstLinkColumn
																		? getRowAriaLabel?.(row, index)
																		: undefined
																}
																className={clsx(
																	"block px-4 py-3 text-current outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30",
																	context.isLastBodyRow && !pageSize && "pb-4",
																)}
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
							<div className="flex justify-center border-t border-[var(--card-border-color)] p-3">
								<Button href={viewMoreHref} size="sm" variant="secondary">
									{viewMoreLabel}
								</Button>
							</div>
						) : null}
					</div>
				) : (
					<div className={pageSize ? "p-4" : undefined}>{emptyState}</div>
				)}
				{pageSize ? (
					<DashboardTablePagination
						tableId={tableId}
						pageSize={pageSize}
						rowCount={rows.length}
					/>
				) : null}
			</ContentSection.Content>
		</ContentSection>
	);
}

type DashboardTablePanelSkeletonProps = {
	children: ReactNode;
	className?: string;
	columns: readonly {
		align?: "left" | "right";
		header: ReactNode;
		headerClassName?: string;
		id: string;
		kind?: "action" | "data";
		responsivePriority?: number;
	}[];
	header?: ReactNode;
	id?: string;
	viewMoreLabel?: ReactNode;
	pageSize?: number;
};

export function DashboardTablePanelSkeleton({
	children,
	className,
	columns,
	header,
	id,
	viewMoreLabel,
	pageSize,
}: DashboardTablePanelSkeletonProps) {
	assertActionColumnContract(columns);
	const generatedId = useId();
	const tableId = id ? `${id}-skeleton-table` : generatedId;
	return (
		<ContentSection
			className={clsx("min-w-0", className)}
			id={id ? `${id}-skeleton` : undefined}
		>
			{header}
			<ContentSection.Content className="min-w-0 overflow-hidden rounded-xl border border-[var(--card-border-color)] bg-card">
				<div
					className="relative max-w-full overflow-x-auto"
					data-dashboard-table-scroll=""
				>
					<DashboardTableResponsiveController tableId={tableId} />
					<table
						className={clsx(
							"w-full border-separate border-spacing-0 text-sm [&_tbody_tr:last-child_td]:border-b-0",
							!pageSize && "[&_tbody_tr:last-child_td]:pb-4",
						)}
						id={tableId}
					>
						<thead>
							<tr className="bg-[var(--card-chrome-background)] text-left text-xs text-[var(--card-chrome-foreground)]">
								{columns.map((column, columnIndex) => {
									return (
										<th
											className={clsx(
												"border-b border-[var(--card-border-color)] px-4 py-2.5 font-medium whitespace-nowrap",
												(column.align === "right" ||
													column.kind === "action") &&
													"text-right",
												column.kind === "action" &&
													"sticky right-0 z-10 w-px bg-[var(--card-chrome-background)]",
												column.headerClassName,
											)}
											data-dashboard-table-column-index={columnIndex}
											data-dashboard-table-kind={column.kind ?? "data"}
											data-dashboard-table-required={
												columnIndex === 0 || column.kind === "action"
											}
											data-dashboard-table-responsive-priority={
												column.responsivePriority
											}
											key={column.id}
										>
											{column.header}
										</th>
									);
								})}
							</tr>
						</thead>
						<tbody>{children}</tbody>
					</table>
					{viewMoreLabel ? (
						<div className="flex justify-center border-t border-[var(--card-border-color)] p-3">
							<Button.Skeleton size="sm" variant="secondary">
								{viewMoreLabel}
							</Button.Skeleton>
						</div>
					) : null}
				</div>
				{pageSize ? (
					<>
						<Divider decorative className="!bg-[var(--card-border-color)]" />
						<div className="flex items-center justify-end bg-[var(--card-chrome-background)] px-4 py-1">
							<PaginationControls.Skeleton
								variant="ghost"
								textVariant="caption"
								countFormat="pages"
								buttonSize="compact"
								current={1}
								total={1}
							/>
						</div>
					</>
				) : null}
			</ContentSection.Content>
		</ContentSection>
	);
}

export const DashboardTablePanel = Object.assign(DashboardTablePanelRoot, {
	Skeleton: DashboardTablePanelSkeleton,
});
