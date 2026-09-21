import assert from "node:assert/strict";
import test from "node:test";
import { toScrollTriggerPosition } from "./scrollOffsets";

test("keeps named edges, numeric fractions, percentages and pixel offsets", () => {
	for (const [input, expected] of [
		["start end", "top bottom"],
		["end start", "bottom top"],
		["start 85%", "top 85%"],
		["0.2 0.8", "20% 80%"],
		[[0, 1], "0% 100%"],
		[0.5, "50% 50%"],
		["center", "center center"],
		["100px", "100px 0%"],
		["start -10%", "top -10%"],
		[undefined, "top bottom"],
	] as const)
		assert.equal(toScrollTriggerPosition(input, "top bottom"), expected);
});
