import assert from "node:assert/strict";
import { test } from "node:test";
import { AuthApiError, fetchSession } from "./auth";
import { createMockFetch } from "./createMockFetch";

test("the application session wrapper uses an injected mock without a parallel endpoint", async (context) => {
	const transport = createMockFetch([
		{
			matcher: "/api/auth/session",
			response: { body: { user: null, status: "anonymous" } },
		},
	]);
	context.mock.method(
		globalThis,
		"fetch",
		(input: string, init?: RequestInit) =>
			transport(new URL(input, "https://fixture.invalid"), init),
	);
	assert.deepEqual(await fetchSession(), { user: null, status: "anonymous" });
});

test("application wrapper exposes typed rejection and malformed-response failures", async (context) => {
	for (const response of [
		new Response(
			JSON.stringify({
				code: "session-required",
				message: "Sign in to continue.",
			}),
			{ status: 401 },
		),
		new Response("not-json", { status: 502 }),
		new Response("not-json", { status: 200 }),
		new Response("null", { status: 200 }),
	]) {
		const fetch = context.mock.method(
			globalThis,
			"fetch",
			async () => response,
		);
		await assert.rejects(fetchSession(), (error) => {
			assert.ok(error instanceof AuthApiError);
			if (response.status === 401) {
				assert.equal(error.code, "session-required");
				assert.equal(error.message, "Sign in to continue.");
			} else {
				assert.equal(
					error.message,
					"The authentication response could not be read.",
				);
			}
			return true;
		});
		fetch.mock.restore();
	}
});

test("application wrapper retains native network and cancellation failures", async (context) => {
	for (const failure of [
		new TypeError("Network unavailable"),
		new DOMException("Cancelled", "AbortError"),
	]) {
		const fetch = context.mock.method(globalThis, "fetch", async () => {
			throw failure;
		});
		await assert.rejects(fetchSession(), (error) => error === failure);
		fetch.mock.restore();
	}
});

test("response-body network and cancellation failures preserve native identity", async (context) => {
	for (const failure of [
		new TypeError("Body connection interrupted"),
		new DOMException("Body cancelled", "AbortError"),
	]) {
		const response = new Response(
			new ReadableStream({
				start(controller) {
					controller.error(failure);
				},
			}),
		);
		const fetch = context.mock.method(
			globalThis,
			"fetch",
			async () => response,
		);
		await assert.rejects(fetchSession(), (error) => error === failure);
		fetch.mock.restore();
	}
});
