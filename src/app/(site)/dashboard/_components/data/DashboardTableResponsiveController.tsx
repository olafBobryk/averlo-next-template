"use client";

import * as React from "react";

const OVERFLOW_TOLERANCE = 1;

type ResponsiveColumn = {
	elements: HTMLElement[];
	index: number;
	priority: number;
};

function getColumnElements(table: HTMLTableElement, columnIndex: number) {
	return Array.from(
		table.querySelectorAll<HTMLElement>(
			`[data-dashboard-table-column-index="${columnIndex}"]`,
		),
	);
}

function setColumnHidden(column: ResponsiveColumn, hidden: boolean) {
	for (const element of column.elements) element.hidden = hidden;
}

function readResponsiveColumns(table: HTMLTableElement) {
	return Array.from(
		table.querySelectorAll<HTMLElement>(
			"thead [data-dashboard-table-column-index]",
		),
	)
		.map((header, index, headers): ResponsiveColumn | null => {
			if (header.dataset.dashboardTableRequired === "true") return null;
			const columnIndex = Number(header.dataset.dashboardTableColumnIndex);
			if (!Number.isInteger(columnIndex)) return null;
			const explicitPriority = Number(
				header.dataset.dashboardTableResponsivePriority,
			);
			return {
				elements: getColumnElements(table, columnIndex),
				index: columnIndex,
				priority: Number.isFinite(explicitPriority)
					? explicitPriority
					: headers.length - index,
			};
		})
		.filter((column): column is ResponsiveColumn => column !== null)
		.sort(
			(left, right) =>
				left.priority - right.priority || right.index - left.index,
		);
}

export function DashboardTableResponsiveController({
	tableId,
}: {
	tableId: string;
}) {
	React.useLayoutEffect(() => {
		const table = document.getElementById(tableId);
		if (!(table instanceof HTMLTableElement)) return;
		const scrollContainer = table.closest<HTMLElement>(
			"[data-dashboard-table-scroll]",
		);
		if (!scrollContainer) return;

		let animationFrame = 0;
		let disposed = false;

		const updateColumns = () => {
			animationFrame = 0;
			if (disposed) return;
			const columns = readResponsiveColumns(table);
			for (const column of columns) setColumnHidden(column, false);

			const focusedElement =
				document.activeElement instanceof HTMLElement
					? document.activeElement
					: null;
			for (const column of columns) {
				if (
					table.scrollWidth <=
					scrollContainer.clientWidth + OVERFLOW_TOLERANCE
				) {
					break;
				}
				if (
					focusedElement &&
					column.elements.some((element) => element.contains(focusedElement))
				) {
					continue;
				}
				setColumnHidden(column, true);
			}
			scrollContainer.dataset.dashboardTableLayout = "ready";
		};

		const scheduleUpdate = () => {
			if (disposed || animationFrame) return;
			animationFrame = window.requestAnimationFrame(updateColumns);
		};

		const resizeObserver =
			typeof ResizeObserver === "undefined"
				? null
				: new ResizeObserver(scheduleUpdate);
		resizeObserver?.observe(scrollContainer);

		const mutationObserver = new MutationObserver(scheduleUpdate);
		mutationObserver.observe(table, {
			characterData: true,
			childList: true,
			subtree: true,
		});

		const handleFocusOut = () => scheduleUpdate();
		const handleWindowResize = () => scheduleUpdate();
		scrollContainer.addEventListener("focusout", handleFocusOut);
		window.addEventListener("resize", handleWindowResize);

		const fonts = document.fonts;
		fonts?.ready.then(scheduleUpdate);
		fonts?.addEventListener?.("loadingdone", scheduleUpdate);
		updateColumns();

		return () => {
			disposed = true;
			if (animationFrame) window.cancelAnimationFrame(animationFrame);
			resizeObserver?.disconnect();
			mutationObserver.disconnect();
			scrollContainer.removeEventListener("focusout", handleFocusOut);
			window.removeEventListener("resize", handleWindowResize);
			fonts?.removeEventListener?.("loadingdone", scheduleUpdate);
		};
	}, [tableId]);

	return null;
}
