import assert from "node:assert/strict";
import { exerciseLifecycle, routeUrl, until } from "./shared.mjs";

export async function verifyContact({ context, page, baseUrl, record }) {
	const endpoint = new URL("/api/contact", baseUrl).href;
	const invalid = await context.request.post(endpoint, {
		multipart: { email: "invalid", message: "short" },
	});
	assert.equal(invalid.status(), 400);
	const invalidBody = await invalid.json();
	assert.ok(invalidBody.fieldErrors.email && invalidBody.fieldErrors.message);
	const valid = await context.request.post(endpoint, {
		multipart: {
			email: " example@example.com ",
			message: " A synthetic message for the contact demo. ",
		},
	});
	assert.equal(valid.status(), 200);
	const body = await valid.json();
	assert.deepEqual(body, {
		message: "Demo complete. Nothing was sent or stored.",
	});
	const trapped = await context.request.post(endpoint, {
		multipart: { website: "bot", email: "invalid", message: "" },
	});
	assert.equal(trapped.status(), 200);
	assert.deepEqual(
		await trapped.json(),
		body,
		"Honeypot exits before field validation with a neutral result",
	);
	assert.equal(
		(await context.request.post(endpoint, { data: "bad body" })).status(),
		400,
	);
	record(
		"real server validation, normalization, malformed body and honeypot short circuit",
	);

	await page.goto(routeUrl(baseUrl, "/contact"));
	const form = page.getByRole("form", { name: "Contact demo", exact: true });
	await form
		.getByText("Demo only · no email is sent and no submission is stored.")
		.waitFor();
	await exerciseLifecycle({
		page,
		form,
		record,
		fields: [
			{ name: "email", invalid: "invalid", valid: "example@example.com" },
			{
				name: "message",
				invalid: "short",
				valid: "A synthetic contact demo message.",
			},
		],
		matchesRequest: (request) =>
			request.method() === "POST" &&
			new URL(request.url()).pathname === "/api/contact",
		success: async () => {
			await page
				.getByText("Demo complete. Nothing was sent or stored.", {
					exact: true,
				})
				.waitFor();
			assert.equal(
				await form.locator('[name="message"]').inputValue(),
				"A synthetic contact demo message.",
			);
			await until(
				async () => (await form.getByRole("alert").count()) === 0,
				"old operational error clears",
			);
		},
	});
}
