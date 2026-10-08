import assert from "node:assert/strict";
import { test } from "node:test";
import {
	loadFile,
	MAX_PREVIEW_BYTES,
	previewMime,
	previewToolbarVisibility,
	safeFileUrl,
} from "./source";

test("supported formats and complete control groups", () => {
	assert.equal(previewMime({ name: "BRIEF.PDF" }), "application/pdf");
	assert.equal(previewMime({ name: "photo.jpeg" }), "image/jpeg");
	assert.equal(previewToolbarVisibility(1000, true).pages, true);
	assert.equal(previewToolbarVisibility(240, true).pages, false);
	assert.equal(previewToolbarVisibility(240, true).zoom, false);
});
test("preview rejects unsupported and oversized blobs before reading", async () => {
	await assert.rejects(
		loadFile(
			{
				name: "file.svg",
				file: new Blob(["<svg />"], { type: "image/svg+xml" }),
			},
			new AbortController().signal,
		),
		/available for/,
	);
	const blob = new Blob([], { type: "application/pdf" });
	Object.defineProperty(blob, "size", { value: MAX_PREVIEW_BYTES + 1 });
	await assert.rejects(
		loadFile({ name: "large.pdf", file: blob }, new AbortController().signal),
		/100 MB/,
	);
});
test("URL safety, fresh access, size checks and cancellation", async () => {
	const nativeFetch = globalThis.fetch;
	const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
	Object.defineProperty(globalThis, "window", {
		configurable: true,
		value: { location: { href: "https://averlo.test/dashboard" } },
	});
	try {
		assert.throws(() => safeFileUrl("javascript:alert(1)"), /cannot be opened/);
		assert.throws(
			() => safeFileUrl("file:///private/report.pdf"),
			/cannot be opened/,
		);
		let access = 0;
		const source = {
			name: "brief.pdf",
			resolveUrl: async () => `/file?access=${++access}`,
		};
		globalThis.fetch = async () =>
			new Response("pdf", {
				headers: { "content-length": String(MAX_PREVIEW_BYTES + 1) },
			});
		await assert.rejects(
			loadFile(source, new AbortController().signal),
			/100 MB/,
		);
		globalThis.fetch = async () => new Response("pdf");
		await loadFile(source, new AbortController().signal);
		assert.equal(access, 2);
		const abort = new AbortController();
		abort.abort();
		await assert.rejects(loadFile(source, abort.signal), {
			name: "AbortError",
		});
	} finally {
		globalThis.fetch = nativeFetch;
		if (originalWindow)
			Object.defineProperty(globalThis, "window", originalWindow);
		else Reflect.deleteProperty(globalThis, "window");
	}
});
