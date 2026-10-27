import assert from "node:assert/strict";
import { test } from "node:test";
import { POST as contactSubmission } from "../../app/api/contact/route";

test("real contact endpoint is neutral on honeypot and rejects direct invalid input without external work", async (context) => {
	const fetch = context.mock.method(globalThis, "fetch", async () => {
		throw Error("Fixture must not call a provider");
	});
	const log = context.mock.method(console, "log", () => {});
	for (const honeypot of [false, true]) {
		const formData = new FormData();
		formData.set("email", "invalid");
		formData.set("message", "");
		if (honeypot) formData.set("website", "filled");
		const response = await contactSubmission(
			new Request("http://localhost/api/contact", {
				method: "POST",
				body: formData,
			}),
		);
		assert.equal(response.status, honeypot ? 200 : 400);
		if (honeypot)
			assert.deepEqual(await response.json(), {
				message: "Demo complete. Nothing was sent or stored.",
			});
	}
	assert.equal(fetch.mock.callCount(), 0);
	assert.equal(log.mock.callCount(), 0);
});
