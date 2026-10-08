"use client";

import { useLayoutEffect, useState } from "react";
import { PaginationControls } from "@/components/ui/misc/PaginationControls";
import Divider from "@/components/ui/primitives/Divider";

/** Pages the complete rendered collection, including the shared table's sorted order. */
export function DashboardTablePagination({
	tableId,
	pageSize,
	rowCount,
}: {
	tableId: string;
	pageSize: number;
	rowCount: number;
}) {
	const [page, setPage] = useState(1);
	const total = Math.max(1, Math.ceil(rowCount / pageSize));
	const current = Math.min(page, total);
	useLayoutEffect(() => {
		if (rowCount === 0) return;
		const table = document.getElementById(tableId) as HTMLTableElement | null;
		const body = table?.tBodies[0];
		if (!body) return;
		const applyPage = () => {
			const rows = Array.from(body.rows);
			rows.forEach((row, index) => {
				row.hidden =
					index < (current - 1) * pageSize || index >= current * pageSize;
				row.dataset.pageLast = String(
					index === Math.min(current * pageSize, rows.length) - 1,
				);
			});
		};
		applyPage();
		// Sorting moves the existing rows; React may also add/remove rows after a mutation.
		const observer = new MutationObserver(applyPage);
		observer.observe(body, { childList: true });
		const resetPage = () => setPage(1);
		table?.addEventListener("dashboard-table-sorted", resetPage);
		return () => {
			observer.disconnect();
			table?.removeEventListener("dashboard-table-sorted", resetPage);
		};
	}, [tableId, current, pageSize, rowCount]);
	useLayoutEffect(() => {
		setPage((value) => Math.min(value, total));
	}, [total]);
	return (
		<div data-dashboard-table-pagination="">
			<Divider decorative className="!bg-[var(--card-border-color)]" />
			<div className="flex items-center justify-end bg-[var(--card-chrome-background)] px-4 py-1">
				<span role="status" className="sr-only">
					Page {current} of {total}
				</span>
				<PaginationControls
					ariaLabel="Table pages"
					current={current}
					total={total}
					countFormat="pages"
					variant="ghost"
					buttonSize="compact"
					textVariant="caption"
					textClassName="!text-[var(--card-chrome-foreground)]"
					prevLabel="Previous page"
					nextLabel="Next page"
					disablePrev={current === 1}
					disableNext={current === total}
					onPrev={() => setPage(current - 1)}
					onNext={() => setPage(current + 1)}
				/>
			</div>
		</div>
	);
}
