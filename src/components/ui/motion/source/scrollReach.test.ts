import assert from "node:assert/strict";
import test from "node:test";
import { layoutReach, reachAt, resolveLine } from "./scrollReach";

const vh = 1000;
const base = {
	offset: ["start 95%", "start 55%"] as ["start 95%", "start 55%"],
	viewportHeight: vh,
	entryScroll: 0,
	itemDuration: 0.56,
	stagger: 0.18,
};

test("resolves element edge and viewport line to a scroll position", () => {
	assert.equal(resolveLine("start 95%", 2000, 100, vh), 1050);
	assert.equal(resolveLine("start 55%", 2000, 100, vh), 1450);
	assert.equal(resolveLine("end start", 2000, 100, vh), 2100);
	assert.equal(resolveLine("start 100px", 2000, 100, vh), 1900);
});

test("a single item scrubs over its usual length from its own position", () => {
	const { slots, shift } = layoutReach({
		...base,
		items: [{ top: 2000, height: 100 }],
		maxScroll: 10_000,
	});
	assert.equal(shift, 0);
	assert.equal(reachAt(slots[0], shift, 1050), 0);
	assert.equal(reachAt(slots[0], shift, 1250), 0.5);
	assert.equal(reachAt(slots[0], shift, 1450), 1);
});

test("content reachable only at the max scroll finishes exactly there, keeping length and stagger", () => {
	// Three stacked lines near the bottom: their natural end lines lie past the max scroll.
	const items = [
		{ top: 5700, height: 40 },
		{ top: 5760, height: 40 },
		{ top: 5820, height: 40 },
	];
	const maxScroll = 5000;
	const { slots, shift } = layoutReach({ ...base, items, maxScroll });
	assert.ok(shift > 0);
	assert.equal(reachAt(slots[2], shift, maxScroll), 1);
	assert.ok(
		reachAt(slots[0], shift, maxScroll - 100) >
			reachAt(slots[2], shift, maxScroll - 100),
	);
	for (const slot of slots) assert.equal(slot.length, 400);
});

test("items in one grid row split the row's range; stacked items each use their own position", () => {
	const row = layoutReach({
		...base,
		items: [
			{ top: 3000, height: 300 },
			{ top: 3000, height: 300 },
			{ top: 3000, height: 300 },
		],
		maxScroll: 10_000,
	});
	assert.ok(row.slots[0].start < row.slots[1].start);
	assert.ok(row.slots[1].start < row.slots[2].start);
	const stacked = layoutReach({
		...base,
		items: [
			{ top: 3000, height: 300 },
			{ top: 3400, height: 300 },
		],
		maxScroll: 10_000,
	});
	assert.equal(stacked.slots[1].start - stacked.slots[0].start, 400);
	assert.equal(stacked.slots[0].length, stacked.slots[1].length);
});

test("items above the 95% line at the entry scroll are reached and never fade back", () => {
	const { slots, shift } = layoutReach({
		...base,
		items: [
			{ top: 900, height: 40 },
			{ top: 960, height: 40 },
		],
		maxScroll: 10_000,
	});
	assert.equal(slots[0].reached, true);
	assert.equal(reachAt(slots[0], shift, 0), 1);
	assert.equal(slots[1].reached, false);
	assert.equal(reachAt(slots[1], shift, 0), 0);
});
