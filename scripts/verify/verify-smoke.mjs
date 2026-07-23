#!/usr/bin/env node

import {
	startLocalProductionServer,
	stopServer,
} from "../_lib/local-production-preview.mjs";

const REQUEST_TIMEOUT_MS = 10_000;
const ROUTES = ["/", "/internal/intelligence", "/api/health"];
const ROUTE_STATUS_OVERRIDES = new Map([["/api/health", new Set([200, 503])]]);

const fetchWithTimeout = async (url) => {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

	try {
		return await fetch(url, {
			redirect: "manual",
			signal: controller.signal,
		});
	} finally {
		clearTimeout(timeout);
	}
};

const validateResponse = async (baseUrl, route) => {
	const url = new URL(route, baseUrl);
	const response = await fetchWithTimeout(url);
	const acceptedStatuses = ROUTE_STATUS_OVERRIDES.get(route);
	const statusIsOk = acceptedStatuses
		? acceptedStatuses.has(response.status)
		: response.status >= 200 && response.status < 400;

	if (!statusIsOk) {
		throw new Error(`${route} returned HTTP ${response.status}.`);
	}

	if (response.status >= 300 && response.status < 400) {
		const location = response.headers.get("location");
		if (!location) {
			throw new Error(`${route} redirected without a Location header.`);
		}

		console.log(`ok ${route} ${response.status} -> ${location}`);
		return;
	}

	const body = await response.text();
	if (body.trim().length === 0) {
		throw new Error(`${route} returned an empty response body.`);
	}

	const contentType = response.headers.get("content-type") ?? "";
	if (
		contentType.includes("text/html") &&
		!body.toLowerCase().includes("<html")
	) {
		throw new Error(`${route} returned HTML without a document marker.`);
	}

	console.log(`ok ${route} ${response.status}`);
};

const start = async () => {
	const { baseUrl, child } = await startLocalProductionServer({
		env: {
			TEMPLATE_INTERNAL_ROUTES: "enabled",
		},
	});

	try {
		console.log(`Starting smoke server at ${baseUrl}`);
		for (const route of ROUTES) {
			await validateResponse(baseUrl, route);
		}

		console.log("Smoke verification passed.");
	} finally {
		await stopServer(child);
	}
};

start().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
