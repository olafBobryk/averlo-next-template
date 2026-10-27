import assert from "node:assert/strict";
import {
	capture,
	checkLayout,
	checkLoading,
	delayedNavigation,
	routeUrl,
	signInFixture,
} from "./shared.mjs";

export async function verify({ context, page, baseUrl, output, id, record }) {
	await signInFixture(context, baseUrl);
	await page.goto(routeUrl(baseUrl, "/dashboard/records"));
	const table = page.locator("#reference-records-table");
	await table.waitFor();
	const ready = await table.evaluate((element) => ({
		rows: element.tBodies[0].rows.length,
		width: element.getBoundingClientRect().width,
		headers: [...element.tHead.rows[0].cells]
			.filter((cell) => getComputedStyle(cell).display !== "none")
			.map((cell) => cell.textContent.trim()),
	}));
	await capture(page, output, id, "list-ready");
	await page.goto(routeUrl(baseUrl, "/dashboard/records?debug-state=loading"));
	const listRegion = page.locator('[data-loading-region="Loading records"]');
	await checkLoading(listRegion);
	const skeletonTable = listRegion.locator("table");
	const loading = await skeletonTable.evaluate((element) => ({
		rows: element.tBodies[0].rows.length,
		width: element.getBoundingClientRect().width,
		headers: [...element.tHead.rows[0].cells]
			.filter((cell) => getComputedStyle(cell).display !== "none")
			.map((cell) => cell.textContent.trim()),
	}));
	assert.equal(
		loading.rows,
		ready.rows,
		"Fixture loading reserves repeated record rows",
	);
	assert.ok(
		Math.abs(loading.width - ready.width) < 2,
		"Table width follows the ready layout",
	);
	assert.deepEqual(
		loading.headers,
		ready.headers,
		"Responsive header retention matches ready table",
	);
	assert.equal(
		(await listRegion
			.getByRole("heading", { name: "Records", exact: true })
			.count()) > 0,
		true,
	);
	const overview = page.getByRole("link", {
		name: "Dashboard overview",
		exact: true,
	});
	if (page.viewportSize().width < 768) {
		const navigation = page.getByRole("button", {
			name: "Open navigation",
			exact: true,
		});
		await navigation.focus();
		await navigation.press("Enter");
	}
	await overview.focus();
	assert.equal(
		await overview.evaluate((link) => document.activeElement === link),
		true,
		"Independent shell navigation stays keyboard usable",
	);
	if (page.viewportSize().width < 768) {
		await page
			.getByRole("button", { name: "Close navigation", exact: true })
			.press("Enter");
		await page
			.getByRole("dialog", { name: "Dashboard navigation", exact: true })
			.waitFor({ state: "hidden" });
	}
	await capture(page, output, id, "list-loading");
	record(
		"actual record-list loading owner preserves rows, responsive columns, containment, static headings and usable shell navigation",
	);

	await page.goto(routeUrl(baseUrl, "/dashboard/records"));
	await table.waitFor();
	await delayedNavigation({
		page,
		targetPath: "/dashboard/records/north-star",
		activate: () =>
			page
				.getByRole("link", { name: "Open North star", exact: true })
				.first()
				.click(),
		pending: async () => {
			assert.equal(
				await table.isVisible(),
				true,
				"Known list remains readable while detail navigation is delayed",
			);
		},
	});
	await page
		.getByRole("heading", { name: "North star", exact: true })
		.waitFor();
	const details = page.getByRole("heading", {
		name: "Record details",
		exact: true,
	});
	await details.waitFor();
	await capture(page, output, id, "detail-ready");
	record(
		"genuine delayed record navigation settles into server-rendered detail",
	);
	await page.goto(
		routeUrl(baseUrl, "/dashboard/records/north-star?debug-state=loading"),
	);
	const detailRegion = page.locator(
		'[data-loading-region="Loading record details"]',
	);
	await checkLoading(detailRegion);
	assert.equal(
		await detailRegion
			.getByRole("heading", { name: "Record details", exact: true })
			.count(),
		1,
	);
	assert.equal(
		await detailRegion
			.getByRole("heading", { name: "Description", exact: true })
			.count(),
		1,
	);
	assert.equal(
		await detailRegion.getByRole("button").count(),
		0,
		"Unknown record actions remain gated",
	);
	await capture(page, output, id, "detail-loading");
	record(
		"actual detail loading owner preserves known sections and gates data-dependent actions",
	);

	for (const [state, title] of [
		["empty", "Nothing here yet"],
		["unavailable", "Surface unavailable"],
		["error", "Something went wrong"],
	]) {
		await page.goto(
			routeUrl(baseUrl, `/dashboard/records?debug-state=${state}`),
		);
		const outcome = page.locator('[data-slot="dashboard-status-frame"]');
		await outcome.getByText(title, { exact: true }).waitFor();
		assert.equal(await outcome.locator("[data-loading-region]").count(), 0);
		await checkLayout(outcome);
		if (state === "error") {
			const retry = outcome.getByRole("button", {
				name: "Try again",
				exact: true,
			});
			await retry.focus();
			await retry.press("Enter");
			await table.waitFor();
			assert.equal(new URL(page.url()).searchParams.has("debug-state"), false);
		}
	}
	record(
		"deterministic review states distinguish empty/unavailable/error; keyboard retry clears forced failure and reaches genuine ready route (not injected backend failure)",
	);
}
