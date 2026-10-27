import assert from "node:assert/strict";
import path from "node:path";

export function routeUrl(baseUrl, route) {
	const target = new URL(baseUrl);
	const supplied = new URL(route, target);
	target.pathname = supplied.pathname;
	for (const [key, value] of supplied.searchParams)
		target.searchParams.set(key, value);
	target.searchParams.set("loading", "off");
	return target.href;
}

export async function signInFixture(context, baseUrl) {
	const response = await context.request.post(
		new URL("/api/auth/login", baseUrl).href,
		{ data: { email: "operator@averlo.local", password: "demo-password" } },
	);
	assert.equal(response.status(), 200, "Fixture authentication must succeed");
}

export async function checkLayout(region) {
	const bounds = await region.evaluate((element) => {
		const rect = element.getBoundingClientRect();
		return { left: rect.left, right: rect.right, viewport: innerWidth };
	});
	assert.ok(
		bounds.left >= -1 && bounds.right <= bounds.viewport + 1,
		"Region must fit the viewport",
	);
}

export async function checkLoading(region) {
	assert.equal(await region.getAttribute("aria-busy"), "true");
	assert.equal(
		await region.locator('[role="status"]').count(),
		0,
		"Progress status must not wrap or repeat every placeholder",
	);
	const placeholders = region.locator(
		'[data-skeleton-variant], [aria-hidden="true"]',
	);
	assert.ok(
		await placeholders.count(),
		"Unknown content must have owner placeholders",
	);
	const violations = await placeholders.evaluateAll((nodes) =>
		nodes.flatMap((node) => {
			const actions = [
				node,
				...node.querySelectorAll(
					"a[href], button, input, select, textarea, [tabindex]",
				),
			];
			return actions
				.filter(
					(action) =>
						action.matches(
							"a[href], button, input, select, textarea, [tabindex]",
						) &&
						!action.disabled &&
						action.tabIndex >= 0 &&
						!action.closest("[inert]"),
				)
				.map((action) => action.outerHTML.slice(0, 150));
		}),
	);
	assert.deepEqual(
		violations,
		[],
		"Visual placeholders must not contain keyboard actions",
	);
	const motion = await region
		.locator('[data-skeleton-variant="shimmer"]')
		.evaluateAll((nodes) =>
			nodes.every((node) => {
				const style = getComputedStyle(node, "::after");
				return style.animationName === "none" || style.display === "none";
			}),
		);
	assert.ok(
		motion,
		"Reduced motion must suppress shimmer without removing content",
	);
	await checkLayout(region);
}

export async function capture(page, output, id, state) {
	await page.screenshot({
		path: path.join(output, `${id}-${state}.png`),
		fullPage: true,
	});
}

// Delay the actual App Router transport, then release its genuine server result.
// The previous usable page may remain during React's navigation transition.
export async function delayedNavigation({
	page,
	targetPath,
	activate,
	pending,
}) {
	let announce;
	const started = new Promise((resolve) => {
		announce = resolve;
	});
	let release;
	const gate = new Promise((resolve) => {
		release = resolve;
	});
	let intercepted = false;
	let finish;
	const finished = new Promise((resolve) => {
		finish = resolve;
	});
	const handler = async (route) => {
		const request = route.request();
		if (
			intercepted ||
			new URL(request.url()).pathname !== targetPath ||
			request.headers().rsc !== "1"
		)
			return route.continue();
		intercepted = true;
		announce();
		await gate;
		try {
			await route.continue();
		} finally {
			finish();
		}
	};
	await page.route("**/*", handler);
	try {
		await activate();
		await Promise.race([
			started,
			new Promise((_, reject) =>
				setTimeout(
					() =>
						reject(new Error(`No real navigation request for ${targetPath}`)),
					15_000,
				),
			),
		]);
		await pending();
	} finally {
		release();
		if (intercepted) await finished;
		await page.unroute("**/*", handler);
	}
	assert.ok(intercepted);
}
