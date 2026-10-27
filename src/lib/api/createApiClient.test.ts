import assert from "node:assert/strict";
import { test } from "node:test";
import { type ApiError, createApiClient } from "./createApiClient";
import { createMockFetch } from "./createMockFetch";

test("shared request client owns URL, headers, JSON and request options", async () => {
	const client = createApiClient({
		baseUrl: () => "https://fixture.invalid/v1/",
		credentials: "include",
		defaultHeaders: { "x-project": "fixture" },
		fetcher: createMockFetch([
			{
				matcher: "/v1/records",
				method: "POST",
				response: ({ init }) => {
					const headers = new Headers(init.headers);
					assert.equal(headers.get("accept"), "application/json");
					assert.equal(headers.get("content-type"), "application/json");
					assert.equal(headers.get("x-project"), "override");
					assert.equal(init.credentials, "include");
					assert.deepEqual(JSON.parse(String(init.body)), {
						name: "North star",
					});
					return { body: { id: "record-1" }, status: 201 };
				},
			},
		]),
	});
	assert.deepEqual(
		await client.request<{ id: string }>("records", {
			body: { name: "North star" },
			headers: { "x-project": "override" },
			method: "POST",
		}),
		{ id: "record-1" },
	);
});

test("HTTP failures and malformed success preserve shared typed outcomes", async () => {
	for (const [response, status, message] of [
		[
			new Response(JSON.stringify({ message: "Unavailable" }), { status: 503 }),
			503,
			"Unavailable",
		],
		[new Response("not-json", { status: 502 }), 502, "Request failed."],
		[
			new Response("not-json", { status: 200 }),
			200,
			"Empty response from server.",
		],
	] as const) {
		const client = createApiClient({
			baseUrl: "https://fixture.invalid",
			fetcher: async () => response,
		});
		await assert.rejects(client.request("/records"), (error: ApiError) => {
			assert.equal(error.status, status);
			assert.equal(error.message, message);
			return true;
		});
	}
});

test("network rejection and cancellation retain native error identity and signal", async () => {
	for (const failure of [
		new TypeError("Network unavailable"),
		new DOMException("Cancelled", "AbortError"),
	]) {
		const controller = new AbortController();
		const client = createApiClient({
			baseUrl: "https://fixture.invalid",
			fetcher: async (_input, init) => {
				assert.equal(init?.signal, controller.signal);
				throw failure;
			},
		});
		await assert.rejects(
			client.request("/records", { signal: controller.signal }),
			(error) => error === failure,
		);
	}
});

test("response-body network and cancellation failures preserve native identity", async () => {
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
		const client = createApiClient({
			baseUrl: "https://fixture.invalid",
			fetcher: async () => response,
		});
		await assert.rejects(
			client.request("/records"),
			(error) => error === failure,
		);
	}
});
