import assert from "node:assert/strict";
import {
	capture,
	checkLoading,
	delayedNavigation,
	routeUrl,
	signInFixture,
} from "./shared.mjs";

export async function verify({ context, page, baseUrl, output, id, record }) {
	await page.goto(routeUrl(baseUrl, "/login?next=%2Fdashboard%2Frecords"));
	await page.getByRole("heading", { name: "Sign in", exact: true }).waitFor();
	await page
		.getByRole("textbox", { name: "Email", exact: true })
		.fill("draft@example.com");
	await delayedNavigation({
		page,
		targetPath: "/sign-in-options",
		activate: () =>
			page.getByRole("link", { name: "Use magic link", exact: true }).click(),
		pending: async () => {
			assert.equal(
				await page
					.getByRole("textbox", { name: "Email", exact: true })
					.inputValue(),
				"draft@example.com",
				"The current usable form survives the delayed route read",
			);
			await page
				.getByRole("link", { name: "Forgot password?", exact: true })
				.focus();
			assert.equal(
				await page
					.getByRole("link", { name: "Forgot password?", exact: true })
					.evaluate((link) => document.activeElement === link),
				true,
			);
		},
	});
	await page
		.getByRole("heading", { name: "Magic link", exact: true })
		.waitFor();
	assert.equal(
		new URL(page.url()).searchParams.get("next"),
		"/dashboard/records",
	);
	await capture(page, output, id, "ready");
	record(
		"genuine auth navigation delayed and released; current form remains usable; safe continuation retained",
	);

	await signInFixture(context, baseUrl);
	await page.goto(
		routeUrl(
			baseUrl,
			"/dashboard/reference/skeletons?next=%2Fdashboard%2Frecords",
		),
	);
	await page
		.getByRole("heading", { name: "Skeleton reference", exact: true })
		.waitFor();
	for (const [owner, label, links] of [
		[
			"login",
			"Loading sign in",
			[
				["Forgot password?", "/forgot-password"],
				["Use magic link", "/sign-in-options"],
			],
		],
		[
			"sign-in-options",
			"Loading magic link sign in",
			[["Use password", "/login"]],
		],
	]) {
		const composition = page.locator(
			`[data-skeleton-route-composition="${owner}"]`,
		);
		const region = composition.locator("[data-loading-region]");
		await checkLoading(region);
		assert.equal(await composition.getByRole("status").textContent(), label);
		for (const [name, pathname] of links) {
			const link = composition.getByRole("link", { name, exact: true });
			const target = new URL(await link.getAttribute("href"), baseUrl);
			assert.equal(target.pathname, pathname);
			assert.equal(target.searchParams.get("next"), "/dashboard/records");
			await link.focus();
			assert.equal(
				await link.evaluate(
					(element) =>
						document.activeElement === element &&
						!element.closest('[aria-hidden="true"], [inert]'),
				),
				true,
			);
		}
		assert.equal(
			await region.locator("input, button:not([disabled])").count(),
			0,
			"Unresolved auth actions remain gated",
		);
	}
	await page
		.locator('[data-skeleton-route-composition="login"]')
		.scrollIntoViewIfNeeded();
	await capture(page, output, id, "loading-owners");
	record(
		"actual login/magic-link loading owners: concise statuses, inert placeholders, live keyboard navigation, reduced motion, narrow layout",
	);
	const magic = page
		.locator('[data-skeleton-route-composition="login"]')
		.getByRole("link", { name: "Use magic link", exact: true });
	await magic.focus();
	await magic.press("Enter");
	await page
		.getByRole("heading", { name: "Magic link", exact: true })
		.waitFor();
	record("known navigation from actual auth loading owner works with Enter");
}
