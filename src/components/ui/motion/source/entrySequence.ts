"use client";

// The `intro(t)` half of a scroll reveal: `reveal = intro(t) × reach(y)` (motion spec V1–V3).
// One page-wide clock. Once the app is ready, every registered scroll Sequence item whose top is above the 95%
// line at the entry scroll position joins one sequence in reading order. Each plays its own `slow` entrance; the
// next item starts its Sequence's `stagger` later, or `defaultStagger` later when it belongs to another Sequence.
// An item nested inside another sequenced item shares its parent's slot. Every other item (and any item mounted
// after the sequence was measured) has intro = 1, so for it only scroll counts.

import type { MotionValue } from "motion/react";
import { ENTRY_LINE, invalidateReach } from "./scrollReach";
import { getEntryScroll } from "./sourceShared";

/** Seconds between Sequence items, and between the last item of one Sequence and the first of the next. */
export const defaultStagger = 0.18;

/** Plays `intro` from 0 to 1 at a constant rate over one `slow` reveal; returns a stop. */
export type PlayIntro = (
	intro: MotionValue<number>,
	delay: number,
) => () => void;

export type EntryItem = {
	intro: MotionValue<number>;
	/** The item's Sequence: consecutive items of one Sequence are `stagger` apart. */
	sequence: object;
	stagger: number;
	/** `false` (Sequence `intro={false}`): the item never joins; only scroll reveals it. */
	joins: boolean;
	play: PlayIntro;
};

const entries = new Map<HTMLElement, EntryItem>();
let measured = false;
let pending: number | null = null;
let stops: (() => void)[] = [];
let lastPathname: string | null = null;
let entryScroll: number | null = null;

/** The scroll position this page was entered at, fixed once the entry sequence has measured the page. */
export function getPageEntryScroll() {
	return entryScroll ?? getEntryScroll();
}

function isEntryItem(node: HTMLElement, entryAt: number) {
	const rect = node.getBoundingClientRect();
	if (rect.width <= 0 || rect.height <= 0) return false;
	const top = rect.top + window.scrollY - entryAt;
	const bottom = rect.bottom + window.scrollY - entryAt;
	return top < window.innerHeight * ENTRY_LINE && bottom > 0;
}

function run(animated: boolean) {
	pending = null;
	measured = true;
	const entryAt = getEntryScroll();
	entryScroll = entryAt;
	const nodes = [...entries.keys()].filter((node) => node.isConnected);
	nodes.sort((a, b) =>
		a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
	);
	const delays = new Map<HTMLElement, number>();
	let previous: EntryItem | null = null;
	let delay = 0;
	for (const node of nodes) {
		const entry = entries.get(node);
		if (!entry) continue;
		if (!animated || !entry.joins || !isEntryItem(node, entryAt)) {
			entry.intro.jump(1);
			continue;
		}
		// An item inside another sequenced item enters with it: it shares its parent's slot (V3).
		let parentDelay: number | undefined;
		for (
			let parent = node.parentElement;
			parent && parentDelay === undefined;
			parent = parent.parentElement
		) {
			parentDelay = delays.get(parent);
		}
		if (parentDelay === undefined && previous) {
			delay +=
				previous.sequence === entry.sequence ? entry.stagger : defaultStagger;
		}
		if (parentDelay === undefined) previous = entry;
		const slot = parentDelay ?? delay;
		delays.set(node, slot);
		entry.intro.jump(0);
		stops.push(entry.play(entry.intro, slot));
	}
	// Reach depends on the entry scroll: re-measure every Sequence with the fixed value.
	invalidateReach();
}

function resetEntrySequence() {
	if (pending !== null) cancelAnimationFrame(pending);
	pending = null;
	for (const stop of stops) stop();
	stops = [];
	measured = false;
	entryScroll = null;
}

/** A route change: the next page measures its own entry sequence. Registrations stay; unmounts remove them. */
function syncPathname(pathname: string) {
	if (lastPathname !== null && lastPathname !== pathname) resetEntrySequence();
	lastPathname = pathname;
}

/** Registers an item's intro value. It stays 0 until `startEntrySequence` measures the page. */
export function registerEntryItem(
	node: HTMLElement,
	item: EntryItem,
	pathname: string,
) {
	syncPathname(pathname);
	item.intro.jump(measured ? 1 : 0);
	entries.set(node, item);
}

/** With no reveal items left, the next one mounted starts a new entry sequence. */
export function unregisterEntryItem(node: HTMLElement) {
	entries.delete(node);
	if (entries.size > 0) return;
	resetEntrySequence();
	lastPathname = null;
}

/** Called once the app is ready. `animated: false` (motion off) settles every intro at 1. */
export function startEntrySequence(animated: boolean, pathname: string) {
	syncPathname(pathname);
	if (measured || pending !== null) return;
	// Wait one frame so every item mounted in the same commit has registered.
	pending = requestAnimationFrame(() => run(animated));
}
