import assert from "node:assert/strict";
import { exerciseLifecycle, routeUrl, signInFixture } from "./shared.mjs";

export async function verifySupport({ context, page, baseUrl, record }) {
	const endpoint = new URL("/api/support", baseUrl).href;
	assert.equal(
		(
			await context.request.post(endpoint, {
				multipart: {
					subject: "Hello",
					message: "A synthetic support message.",
				},
			})
		).status(),
		401,
	);
	await signInFixture(context, baseUrl);
	assert.equal(
		(await context.request.post(endpoint, { data: "invalid body" })).status(),
		400,
	);
	const invalid = await context.request.post(endpoint, {
		multipart: { subject: "x", message: "short" },
	});
	assert.equal(invalid.status(), 400);
	assert.ok((await invalid.json()).fieldErrors.subject);
	assert.equal(
		(
			await context.request.post(endpoint, {
				multipart: {
					membershipId: "not-my-membership",
					subject: "Hello",
					message: "A synthetic support message.",
				},
			})
		).status(),
		400,
	);
	const trapped = await context.request.post(endpoint, {
		multipart: { website: "bot", subject: "x", message: "short" },
	});
	assert.equal(trapped.status(), 200);
	assert.deepEqual(await trapped.json(), {
		message: "Support request received.",
	});
	assert.equal(
		trapped.headers()["set-cookie"],
		undefined,
		"Honeypot cannot activate cooldown or persist a request",
	);
	record(
		"real server validation, unauthenticated and unauthorized rejection, existing honeypot policy",
	);
	await page.goto(routeUrl(baseUrl, "/dashboard/support"));
	const form = page.getByRole("form", { name: "Contact support", exact: true });
	await exerciseLifecycle({
		page,
		form,
		record,
		fields: [
			{ name: "subject", invalid: "x", valid: "Synthetic form verification" },
			{
				name: "message",
				invalid: "short",
				valid: "A synthetic support message for verification.",
			},
		],
		matchesRequest: (request) =>
			request.method() === "POST" &&
			new URL(request.url()).pathname === "/api/support",
		success: async () => {
			await page
				.getByText("Support request saved to the demo Platform Inbox.", {
					exact: true,
				})
				.waitFor();
			assert.equal(await form.locator('[name="subject"]').inputValue(), "");
			assert.equal(await form.locator('[name="message"]').inputValue(), "");
			const throttled = await context.request.post(endpoint, {
				multipart: {
					subject: "Another request",
					message: "A synthetic repeated support request.",
				},
			});
			assert.equal(
				throttled.status(),
				429,
				"Existing cooldown remains enforced",
			);
		},
	});
}
