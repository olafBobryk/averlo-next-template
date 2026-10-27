import assert from "node:assert/strict";
import { exerciseLifecycle, routeUrl, until } from "./shared.mjs";

export async function verifyLogin({ context, page, baseUrl, record }) {
	const api = new URL("/api/auth/login", baseUrl).href;
	assert.equal(
		(
			await context.request.post(api, {
				data: { email: "invalid", password: "" },
			})
		).status(),
		401,
	);
	assert.equal(
		(
			await context.request.get(new URL("/api/auth/session", baseUrl).href)
		).status(),
		200,
	);
	await page.goto(routeUrl(baseUrl, "/login?next=/dashboard/support"));
	const form = page.getByRole("form", { name: "Sign in", exact: true });
	// Bypass client validation at the native serialization boundary, retaining
	// the actual server action and its response rather than mocking either.
	await form.evaluate((element) => {
		element.addEventListener(
			"formdata",
			(event) => {
				event.formData.set("email", "invalid");
				event.formData.set("password", "");
			},
			{ once: true },
		);
	});
	await form.locator('button[type="submit"]').click();
	await until(
		async () =>
			(await form.locator('[name="email"]').getAttribute("aria-invalid")) ===
			"true",
		"server action rejects bypassed field validation",
	);
	assert.equal(new URL(page.url()).pathname, "/login");
	record("real server-action validation rejects a client-bypassed payload");
	await form.locator('[name="password"]').fill("wrong-password");
	await form.locator('[name="email"]').fill("operator@averlo.local");
	await form.locator('button[type="submit"]').click();
	await form
		.getByRole("alert")
		.filter({ hasText: "The email or password is not valid." })
		.waitFor();
	assert.equal(
		await form.locator('[name="email"]').inputValue(),
		"operator@averlo.local",
	);
	await until(
		async () => (await form.locator('[name="password"]').inputValue()) === "",
		"rejected password clears",
	);
	assert.equal(new URL(page.url()).pathname, "/login");
	record(
		"real server-action credential rejection retains email and clears password",
	);
	await exerciseLifecycle({
		page,
		form,
		record,
		fields: [
			{ name: "email", invalid: "invalid", valid: "operator@averlo.local" },
			{
				name: "password",
				invalid: "",
				valid: "demo-password",
				sensitive: true,
			},
		],
		matchesRequest: (request) =>
			request.method() === "POST" && !!request.headers()["next-action"],
		success: async () => {
			await page.waitForURL((url) => url.pathname === "/dashboard/support");
			await page
				.getByRole("form", { name: "Contact support", exact: true })
				.waitFor();
		},
	});

	// New cookie jars exercise actual redirects without inheriting the first login.
	for (const [email, next, expected] of [
		["multi@averlo.local", "/dashboard/support", "/select-organization"],
		["operator@averlo.local", "https://example.com/unsafe", "/dashboard"],
	]) {
		const isolated = await context
			.browser()
			.newContext({ viewport: page.viewportSize() });
		try {
			const extra = await isolated.newPage();
			extra.setDefaultNavigationTimeout(60_000);
			await extra.goto(
				routeUrl(baseUrl, `/login?next=${encodeURIComponent(next)}`),
			);
			const login = extra.getByRole("form", { name: "Sign in", exact: true });
			await login.locator('[name="email"]').fill(email);
			await login.locator('[name="password"]').fill("demo-password");
			await login.locator('[name="password"]').press("Enter");
			await extra.waitForURL(
				(url) =>
					url.origin === new URL(baseUrl).origin &&
					(expected === "/dashboard"
						? url.pathname.startsWith("/dashboard")
						: url.pathname === expected),
			);
			if (expected === "/select-organization")
				assert.equal(new URL(extra.url()).searchParams.get("next"), next);
		} finally {
			await isolated.close();
		}
	}
	record("real organization-selection and unsafe-continuation redirects");
}
