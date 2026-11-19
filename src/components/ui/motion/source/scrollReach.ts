"use client";

// The `reach(y)` half of a scroll reveal: `reveal = intro(t) × reach(y)` (motion spec, rules V1–V3).
//
// Each item scrubs from its start line `s` to `s + length` (scroll px), from its own position. Items that share a
// row (a grid row) split the row's range with the list stagger. The start never moves. When the page ends before
// the end line, the end is pulled in to the max scroll, so the scrub is shorter and still finishes. An item whose
// start line is past the max scroll starts as its top enters the screen. An item whose row top was above the entry
// line at the entry scroll is reached (1): it is revealed by the entry sequence instead, and since scroll only grows
// from there it never fades back.

import type { UseScrollOptions } from "motion/react";

type Offset = NonNullable<UseScrollOptions["offset"]>;

export type ReachSlot = { start: number; length: number; reached: boolean };

/** Items whose top is above this line of the viewport at the entry scroll join the entry sequence and are reached. */
export const ENTRY_LINE = 0.95;

const edgeFraction: Record<string, number> = { start: 0, center: 0.5, end: 1 };

function parsePart(part: string, size: number): number | null {
	if (part in edgeFraction) return edgeFraction[part] * size;
	const value = Number.parseFloat(part);
	if (Number.isNaN(value)) return null;
	if (part.endsWith("%")) return (value / 100) * size;
	if (part.endsWith("px")) return value;
	return value * size;
}

/** Scroll position where `"<element edge> <viewport line>"` (for example `"start 95%"`) meets. */
export function resolveLine(
	line: Offset[number],
	elementTop: number,
	elementHeight: number,
	viewportHeight: number,
): number {
	const [elementPart = "start", viewportPart = "end"] =
		typeof line === "string" ? line.trim().split(/\s+/) : [];
	const onElement = parsePart(elementPart, elementHeight) ?? 0;
	const onViewport = parsePart(viewportPart, viewportHeight) ?? viewportHeight;
	return elementTop + onElement - onViewport;
}

export type ReachItem = { top: number; height: number };

/**
 * Slots for a group of items in reading order. `itemDuration` and `stagger` are the timed reveal's values; they
 * only set how a row's range is split between the items in it.
 */
export function layoutReach({
	items,
	offset,
	viewportHeight,
	maxScroll,
	entryScroll,
	itemDuration,
	stagger,
}: {
	items: readonly ReachItem[];
	offset: Offset;
	viewportHeight: number;
	maxScroll: number;
	entryScroll: number;
	itemDuration: number;
	stagger: number;
}): ReachSlot[] {
	const rows: number[][] = [];
	items.forEach((item, index) => {
		const row = rows[rows.length - 1];
		if (row && Math.abs(items[row[0]].top - item.top) < 2) row.push(index);
		else rows.push([index]);
	});
	const slots: ReachSlot[] = new Array(items.length);
	const lastScroll = Math.max(0, maxScroll);
	for (const row of rows) {
		const first = items[row[0]];
		const rowStart = resolveLine(
			offset[0],
			first.top,
			first.height,
			viewportHeight,
		);
		// The start stays put; one the page never scrolls to falls back to the top entering the screen.
		const start =
			rowStart < lastScroll
				? rowStart
				: Math.min(rowStart, first.top - viewportHeight);
		const rowEnd = Math.min(
			resolveLine(offset[1], first.top, first.height, viewportHeight),
			lastScroll,
		);
		const rowLength = Math.max(1, rowEnd - start);
		const total = itemDuration + Math.max(0, row.length - 1) * stagger;
		row.forEach((itemIndex, position) => {
			slots[itemIndex] = {
				start: start + (rowLength * position * stagger) / total,
				length: (rowLength * itemDuration) / total,
				reached: first.top - ENTRY_LINE * viewportHeight <= entryScroll,
			};
		});
	}
	return slots;
}

export function reachAt(slot: ReachSlot, scrollY: number) {
	if (slot.reached) return 1;
	const value = (scrollY - slot.start) / slot.length;
	// Float error must not leave a finished reveal a hair short of 1.
	return value >= 1 - 1e-9 ? 1 : Math.max(0, value);
}

// One scheduler for every group: scroll updates, layout changes re-measure. Both run once per frame.
type ReachGroup = { measure: () => void; update: (scrollY: number) => void };

const groups = new Set<ReachGroup>();
let frame: number | null = null;
let needsMeasure = false;
let observer: ResizeObserver | null = null;

function flush() {
	frame = null;
	const remeasure = needsMeasure;
	needsMeasure = false;
	const scrollY = window.scrollY;
	for (const group of groups) {
		if (remeasure) group.measure();
		group.update(scrollY);
	}
}

function schedule(measure: boolean) {
	if (measure) needsMeasure = true;
	frame ??= requestAnimationFrame(flush);
}

const onScroll = () => schedule(false);
const onLayout = () => schedule(true);

export function subscribeReachGroup(group: ReachGroup) {
	if (groups.size === 0) {
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onLayout);
		window.addEventListener("load", onLayout);
		observer = new ResizeObserver(onLayout);
		observer.observe(document.body);
	}
	groups.add(group);
	schedule(true);
	return () => {
		groups.delete(group);
		if (groups.size > 0) return;
		window.removeEventListener("scroll", onScroll);
		window.removeEventListener("resize", onLayout);
		window.removeEventListener("load", onLayout);
		observer?.disconnect();
		observer = null;
		if (frame !== null) cancelAnimationFrame(frame);
		frame = null;
	};
}

/** A group's items changed (mounted, unmounted): re-measure on the next frame. */
export function invalidateReach() {
	if (groups.size > 0) schedule(true);
}
