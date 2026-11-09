import assert from "node:assert/strict";
import test from "node:test";
import { diffPixels, parseArgs } from "./compose-diff.mjs";

function image(width, height, rgba) {
	const data = Buffer.alloc(width * height * 4);
	for (let index = 0; index < data.length; index += 4) data.set(rgba, index);
	return { data, height, width };
}

test("identical images have no changed pixels", () => {
	const source = image(4, 2, [10, 20, 30, 255]);
	const result = diffPixels(source, image(4, 2, [10, 20, 30, 255]));
	assert.equal(result.changedPixels, 0);
	assert.equal(result.changedPercent, 0);
});

test("differences within tolerance count as equal", () => {
	const source = image(2, 2, [100, 100, 100, 255]);
	const result = diffPixels(source, image(2, 2, [110, 100, 100, 255]), {
		tolerance: 24,
	});
	assert.equal(result.changedPixels, 0);
});

test("the section region is read at top and left", () => {
	const source = image(2, 1, [0, 0, 0, 255]);
	const build = image(2, 3, [255, 255, 255, 255]);
	for (let index = 2 * 2 * 4; index < 2 * 3 * 4; index += 4) {
		build.data.set([0, 0, 0, 255], index);
	}
	assert.equal(diffPixels(source, build, { top: 2 }).changedPixels, 0);
	assert.equal(diffPixels(source, build, { top: 0 }).changedPixels, 2);
});

test("pixels outside the build count as changed", () => {
	const source = image(2, 2, [0, 0, 0, 255]);
	const result = diffPixels(source, image(2, 1, [0, 0, 0, 255]));
	assert.equal(result.changedPixels, 2);
	assert.equal(result.changedPercent, 50);
});

test("arguments require source and build", () => {
	assert.throws(() => parseArgs(["--source", "a.png"]), /required/u);
	assert.deepEqual(
		parseArgs([
			"--source",
			"a.png",
			"--build",
			"b.png",
			"--top",
			"120",
			"--threshold",
			"5",
		]),
		{
			build: "b.png",
			left: 0,
			out: null,
			source: "a.png",
			threshold: 5,
			tolerance: 24,
			top: 120,
		},
	);
});
