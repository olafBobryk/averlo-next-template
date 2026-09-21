import assert from "node:assert/strict";
import test from "node:test";
import { MOTION_CONFIG, resolveMotionDriver } from "./motionConfig";

test("hybrid default and development-only Motion rollback", () => {
	assert.equal(MOTION_CONFIG.defaultDriver, "hybrid");
	assert.equal(
		resolveMotionDriver("?motionCompare=1&motionDriver=motion", true),
		"motion",
	);
	assert.equal(
		resolveMotionDriver("?motionCompare=1&motionDriver=hybrid", true),
		"hybrid",
	);
	for (const search of [
		"",
		"?motionDriver=motion",
		"?motionCompare=true&motionDriver=motion",
		"?motionCompare=1&motionDriver=invalid",
		"?motionCompare=1&motionDriver=motion&motionDriver=hybrid",
		"?motionCompare=1&motionCompare=0&motionDriver=motion",
	])
		assert.equal(resolveMotionDriver(search, true), "hybrid");
	assert.equal(
		resolveMotionDriver("?motionCompare=1&motionDriver=motion", false),
		"hybrid",
	);
});
