"use client";

import * as React from "react";

type SortDirection = "ascending" | "descending" | "neutral";

function comparableValue(row: HTMLTableRowElement, columnIndex: number) {
	const text =
		row.cells.item(columnIndex)?.textContent?.trim().replaceAll(/\s+/g, " ") ??
		"";
	const numericValue = Number(text.replaceAll(/[^0-9.-]+/g, ""));
	if (text && Number.isFinite(numericValue) && /[0-9]/.test(text)) {
		return numericValue;
	}
	const timestamp = Date.parse(text);
	return Number.isFinite(timestamp) ? timestamp : text.toLocaleLowerCase();
}

function compare(left: number | string, right: number | string) {
	if (typeof left === "number" && typeof right === "number") {
		return left - right;
	}
	return String(left).localeCompare(String(right), undefined, {
		numeric: true,
		sensitivity: "base",
	});
}

function nextDirection(current?: string): SortDirection {
	if (current === "neutral") return "ascending";
	if (current === "ascending") return "descending";
	return "neutral";
}

export function DashboardTableSortController({ tableId }: { tableId: string }) {
	React.useEffect(() => {
		const table = document.getElementById(tableId);
		if (!(table instanceof HTMLTableElement)) return;
		const body = table.tBodies.item(0);
		if (!body) return;
		const buttons = Array.from(
			table.querySelectorAll<HTMLButtonElement>(
				"[data-dashboard-table-sort-header]",
			),
		);
		function sortRows(button: HTMLButtonElement) {
			const columnIndex = Number(button.dataset.columnIndex);
			if (!Number.isInteger(columnIndex)) return;
			const direction = nextDirection(button.dataset.sortDirection);
			const rows = Array.from(body?.rows ?? []).sort((left, right) => {
				if (direction === "neutral") {
					return (
						Number(left.dataset.originalIndex ?? 0) -
						Number(right.dataset.originalIndex ?? 0)
					);
				}
				const result = compare(
					comparableValue(left, columnIndex),
					comparableValue(right, columnIndex),
				);
				return direction === "ascending" ? result : -result;
			});
			for (const candidate of buttons) {
				const active = candidate === button;
				candidate.dataset.sortDirection = active ? direction : "neutral";
				candidate
					.closest("th")
					?.setAttribute(
						"aria-sort",
						active && direction !== "neutral" ? direction : "none",
					);
			}
			body?.append(...rows);
		}
		const controller = new AbortController();
		for (const button of buttons) {
			button.addEventListener("click", () => sortRows(button), {
				signal: controller.signal,
			});
		}
		return () => controller.abort();
	}, [tableId]);
	return null;
}
