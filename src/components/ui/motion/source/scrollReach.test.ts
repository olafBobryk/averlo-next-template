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
	const [slot] = layoutReach({
		...base,
		items: [{ top: 2000, height: 100 }],
		maxScroll: 10_000,
	});
	assert.equal(reachAt(slot, 1050), 0);
	assert.equal(reachAt(slot, 1250), 0.5);
	assert.equal(reachAt(slot, 1450), 1);
});

test("content the page ends under keeps its start and finishes exactly at the max scroll", () => {
	// Three stacked lines near the bottom: their natural end lines lie past the max scroll.
	const items = [
		{ top: 5700, height: 40 },
		{ top: 5760, height: 40 },
		{ top: 5820, height: 40 },
	];
	const maxScroll = 5000;
	const slots = layoutReach({ ...base, items, maxScroll });
	items.forEach((item, index) => {
		// Nothing starts before its top reaches the 95% line.
		assert.equal(slots[index].start, item.top - 950);
		assert.equal(reachAt(slots[index], item.top - 950), 0);
		assert.equal(reachAt(slots[index], maxScroll), 1);
		assert.ok(slots[index].length < 400);
	});
	assert.ok(
		reachAt(slots[0], maxScroll - 100) > reachAt(slots[2], maxScroll - 100),
	);
});

test("an item whose start line is past the max scroll starts as it enters the screen", () => {
	const [slot] = layoutReach({
		...base,
		items: [{ top: 5980, height: 40 }],
		maxScroll: 5000,
	});
	assert.equal(slot.start, 4980);
	assert.equal(reachAt(slot, 4980), 0);
	assert.equal(reachAt(slot, 5000), 1);
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
	assert.ok(row[0].start < row[1].start);
	assert.ok(row[1].start < row[2].start);
	assert.ok(Math.abs(row[2].start + row[2].length - 2450) < 1e-9);
	const stacked = layoutReach({
		...base,
		items: [
			{ top: 3000, height: 300 },
			{ top: 3400, height: 300 },
		],
		maxScroll: 10_000,
	});
	assert.equal(stacked[1].start - stacked[0].start, 400);
	assert.equal(stacked[0].length, stacked[1].length);
});

test("items above the 95% line at the entry scroll are reached and never fade back", () => {
	const slots = layoutReach({
		...base,
		items: [
			{ top: 900, height: 40 },
			{ top: 960, height: 40 },
		],
		maxScroll: 10_000,
	});
	assert.equal(slots[0].reached, true);
	assert.equal(reachAt(slots[0], 0), 1);
	assert.equal(slots[1].reached, false);
	assert.equal(reachAt(slots[1], 0), 0);
});
