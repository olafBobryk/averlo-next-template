import { strict as assert } from "node:assert";
import { test } from "node:test";
import { pastedTextFile, shouldAttachPastedText } from "./pasted-text";

test("clipboard threshold counts complete Unicode characters", () => {
	assert.equal(shouldAttachPastedText("a".repeat(1999)), false);
	assert.equal(shouldAttachPastedText("a".repeat(2000)), true);
	assert.equal(shouldAttachPastedText("🍷".repeat(1999)), false);
	assert.equal(shouldAttachPastedText("🍷".repeat(2000)), true);
	assert.equal(shouldAttachPastedText("short\n".repeat(3)), false);
});
test("attachment preserves UTF-8, whitespace and newlines verbatim", async () => {
	const value = "  French: cuvée 🍷\r\n".repeat(150);
	const a = pastedTextFile(value),
		b = pastedTextFile(value);
	assert.equal(await a.text(), value);
	assert.equal(a.type, "text/plain;charset=utf-8");
	assert.notEqual(a.name, b.name);
});
