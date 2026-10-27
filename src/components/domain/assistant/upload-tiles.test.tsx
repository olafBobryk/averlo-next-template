import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => {
	// biome-ignore lint/suspicious/noExportsInTest: This assigns the CSS loader stub, not an export from this test file.
	module.exports = {};
};

test("upload placeholders and failures keep one ordered FileInput tray", async () => {
	const { FileInput } = await import("../../ui/input/files/FileInput");
	const html = renderToStaticMarkup(
		<FileInput
			label={null}
			showAddControl={false}
			onItemsChange={() => {}}
			items={[
				{
					key: "a",
					name: "First.txt",
					status: "uploaded",
					url: "",
					uploadState: "failed",
					uploadError: "Try again",
					onRetry: () => {},
				},
				{
					key: "b",
					name: "Second.txt",
					status: "uploaded",
					url: "",
					uploadState: "uploading",
				},
			]}
		/>,
	);
	assert.equal((html.match(/<fieldset/g) || []).length, 1);
	assert.equal((html.match(/aria-busy="true"/g) || []).length, 1);
	assert.match(html, /Remove First.txt/);
	assert.match(html, /Remove Second.txt/);
	assert.match(html, /Retry/);
	assert.ok(html.indexOf("First.txt") < html.indexOf("Second.txt"));
});
