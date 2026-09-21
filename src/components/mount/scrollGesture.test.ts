import assert from "node:assert/strict";
import test from "node:test";
import { shouldHandlePageScroll } from "./scrollGesture";

test("ordinary wheel input remains page-owned, including over cooperative maps", () => {
	assert.equal(shouldHandlePageScroll({ defaultPrevented: false }), true);
});

test("map-owned input and Ctrl/Cmd zoom never drive the page", () => {
	for (const gesture of [
		{ defaultPrevented: true },
		{ defaultPrevented: false, ctrlKey: true },
		{ defaultPrevented: false, metaKey: true },
	])
		assert.equal(shouldHandlePageScroll(gesture), false);
});
