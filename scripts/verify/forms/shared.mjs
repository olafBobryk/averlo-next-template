import assert from "node:assert/strict";

export async function until(check, label, timeout = 15_000) {
	const started = Date.now();
	while (Date.now() - started < timeout) {
		if (await check()) return;
		await new Promise((resolve) => setTimeout(resolve, 50));
	}
	throw new Error(`Timed out: ${label}`);
}

export function routeUrl(baseUrl, route) {
	const target = new URL(baseUrl);
	const supplied = new URL(route, target);
	target.pathname = supplied.pathname;
	for (const [key, value] of supplied.searchParams)
		target.searchParams.set(key, value);
	target.searchParams.set("loading", "off");
	return target.href;
}

export async function signInFixture(
	context,
	baseUrl,
	email = "operator@averlo.local",
) {
	const response = await context.request.post(
		new URL("/api/auth/login", baseUrl).href,
		{
			data: { email, password: "demo-password" },
		},
	);
	assert.equal(response.status(), 200, "Fixture authentication must succeed");
}

export async function checkLayout(form) {
	const result = await form.evaluate((element) => {
		const bounds = element.getBoundingClientRect();
		return {
			left: bounds.left,
			right: bounds.right,
			width: window.innerWidth,
			overflow: element.scrollWidth - element.clientWidth,
		};
	});
	assert.ok(
		result.left >= -1 &&
			result.right <= result.width + 1 &&
			result.overflow <= 1,
		"Form must fit the viewport",
	);
}

// Shared form-level assertions; individual modules own fields, transport and outcome.
export async function exerciseLifecycle({
	page,
	form,
	fields,
	matchesRequest,
	success,
	record,
}) {
	await form.waitFor({ state: "visible" });
	const button = form.locator('button[type="submit"]');
	const actionLabel = await button.getAttribute("aria-label");
	assert.ok(
		actionLabel,
		"Submit action has an explicit stable accessible name",
	);
	await until(() => button.isEnabled(), "hydrated submit action");
	let requests = 0;
	let release;
	const gate = new Promise((resolve) => {
		release = resolve;
	});
	let failNext = false;
	const handler = async (route) => {
		if (!matchesRequest(route.request())) return route.continue();
		requests++;
		if (failNext) {
			await gate;
			return route.abort("failed");
		}
		return route.continue();
	};
	await page.route("**/*", handler);
	try {
		const firstField = form.locator(`[name="${fields[0].name}"]`);
		await firstField.focus();
		await firstField.press("Tab");
		assert.ok(
			await form.evaluate(
				(element) =>
					element.contains(document.activeElement) &&
					document.activeElement.getAttribute("aria-hidden") !== "true",
			),
			"Tab moves to a visible form control",
		);
		for (const field of fields) {
			const control = form.locator(`[name="${field.name}"]`);
			assert.ok(
				await control.evaluate(
					(input) => input.labels?.length > 0 && input.required,
				),
				`${field.name} has a real required label`,
			);
			await control.fill(field.invalid);
		}
		await button.focus();
		await button.press("Enter");
		for (const field of fields) {
			const control = form.locator(`[name="${field.name}"]`);
			await until(
				async () => (await control.getAttribute("aria-invalid")) === "true",
				`${field.name} inline validation`,
			);
			const described = await control.getAttribute("aria-describedby");
			assert.ok(described, "Invalid field must describe its error");
			assert.ok(
				await control.evaluate((input) =>
					input
						.getAttribute("aria-describedby")
						.split(" ")
						.some((id) => document.getElementById(id)?.textContent?.trim()),
				),
				"Error relationship resolves to text",
			);
		}
		assert.equal(
			requests,
			0,
			"Client-invalid submission must not send a request",
		);
		await checkLayout(form);
		record("accessible client validation and keyboard submission");

		for (const field of fields)
			await form.locator(`[name="${field.name}"]`).fill(field.valid);
		await until(
			async () => (await form.getByRole("alert").count()) === 0,
			"old field errors clear",
		);
		failNext = true;
		// Both events run before React can publish pending state.
		await form.evaluate((element) => {
			element.requestSubmit();
			element.requestSubmit();
		});
		await until(() => requests === 1, "one request starts");
		await until(
			async () => (await button.getAttribute("aria-busy")) === "true",
			"pending state is visible",
		);
		assert.equal(await button.isDisabled(), true);
		assert.equal(
			await form
				.getByRole("button", { name: actionLabel, exact: true })
				.count(),
			1,
			"Pending action keeps the same accessible name",
		);
		assert.ok(
			(await button.textContent())?.trim(),
			"Pending action retains its label",
		);
		await form.evaluate((element) => element.requestSubmit());
		assert.equal(requests, 1, "Duplicate submission is blocked");
		await checkLayout(form);
		record("same-turn duplicate guard and delayed pending state");
		failNext = false;
		release();
		await until(() => button.isEnabled(), "request failure unlocks retry");
		await until(
			async () => (await form.getByRole("alert").count()) === 1,
			"one operational error",
		);
		for (const field of fields) {
			const expected = field.sensitive ? "" : field.valid;
			assert.equal(
				await form.locator(`[name="${field.name}"]`).inputValue(),
				expected,
				`${field.name} recovery value`,
			);
		}
		await checkLayout(form);
		record("one recoverable error and retained non-sensitive values");
		for (const field of fields)
			if (field.sensitive)
				await form.locator(`[name="${field.name}"]`).fill(field.valid);
		await button.focus();
		await button.press("Enter");
		await success();
		assert.equal(requests, 2, "Retry sends exactly one additional request");
		record("keyboard retry reaches the real successful server boundary");
	} finally {
		release();
		await page.unroute("**/*", handler);
	}
}
