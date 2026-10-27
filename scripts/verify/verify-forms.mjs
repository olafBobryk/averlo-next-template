#!/usr/bin/env node
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const args = process.argv.slice(2);
assert.equal(
	args.length,
	2,
	"Usage: npm run verify:forms -- --base-url <verified-local-preview-url>",
);
assert.equal(args[0], "--base-url");
const baseUrl = new URL(args[1]);
assert.ok(
	["http:", "https:"].includes(baseUrl.protocol) &&
		["localhost", "127.0.0.1", "[::1]"].includes(baseUrl.hostname) &&
		!baseUrl.username &&
		!baseUrl.password,
	"Form verification only accepts a loopback Preview URL",
);
assert.equal(
	(await fetch(new URL("/api/health", baseUrl))).status,
	200,
	"Preview health must be reachable",
);

const installedForms = [
	{
		name: "login",
		source: "src/app/(site)/(auth)/login/page.tsx",
		exportName: "verifyLogin",
	},
	{
		name: "support",
		source: "src/app/(site)/dashboard/support/page.tsx",
		exportName: "verifySupport",
	},
	{
		name: "contact",
		source: "src/app/(site)/(marketing)/contact/page.tsx",
		exportName: "verifyContact",
	},
];
const receiptPath = ".template-profile.json";
if (existsSync(receiptPath)) {
	const receipt = JSON.parse(await fs.readFile(receiptPath, "utf8"));
	const surfaces = new Set(receipt.assembly.surfaces);
	for (const form of installedForms) {
		const selected = surfaces.has(
			form.name === "contact" ? "marketing" : "dashboard",
		);
		assert.equal(
			existsSync(form.source),
			selected,
			`${form.name} must match the selected project surfaces`,
		);
		assert.equal(
			existsSync(`scripts/verify/forms/${form.name}.mjs`),
			selected,
			`${form.name} test ownership must match its surface`,
		);
	}
}
const targets = installedForms.filter((target) => existsSync(target.source));
assert.ok(targets.length, "At least one installed form must be verified");
const output = path.resolve("test-results/forms");
await fs.mkdir(output, { recursive: true });
const results = [];
const browser = await chromium.launch({ headless: true });
let failed = false;
try {
	for (const viewport of [
		{ width: 1280, height: 900 },
		{ width: 390, height: 844 },
	]) {
		for (const target of targets) {
			const name = `${target.name}-${viewport.width}`;
			const context = await browser.newContext({
				viewport,
				reducedMotion: "reduce",
			});
			const page = await context.newPage();
			page.setDefaultTimeout(20_000);
			page.setDefaultNavigationTimeout(60_000);
			const scenarios = [];
			try {
				const module = await import(`./forms/${target.name}.mjs`);
				await module[target.exportName]({
					context,
					page,
					baseUrl: baseUrl.href,
					record: (scenario) => scenarios.push(scenario),
				});
				results.push({ name, status: "passed", scenarios });
				console.log(`ok ${name}: ${scenarios.length} scenario groups`);
			} catch (error) {
				failed = true;
				const screenshot = path.join(output, `${name}.png`);
				await page
					.screenshot({ path: screenshot, fullPage: true })
					.catch(() => {});
				results.push({
					name,
					status: "failed",
					scenarios,
					error: error.message,
					screenshot,
				});
				console.error(`FAIL ${name}: ${error.message}`);
			} finally {
				await context.close();
			}
		}
	}
} finally {
	await browser.close();
	await fs.writeFile(
		path.join(output, "results.json"),
		`${JSON.stringify({ verifiedAt: new Date().toISOString(), baseUrl: baseUrl.href, results }, null, 2)}\n`,
	);
}
if (failed) process.exitCode = 1;
else
	console.log(
		`Form verification passed (${results.length} form/viewport combinations).`,
	);
