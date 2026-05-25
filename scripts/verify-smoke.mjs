#!/usr/bin/env node

import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { createRequire } from "node:module";
import net from "node:net";

const PORT_START = 3100;
const PORT_END = 3199;
const HOST = "127.0.0.1";
const STARTUP_TIMEOUT_MS = 30_000;
const REQUEST_TIMEOUT_MS = 10_000;
const ROUTES = ["/", "/login", "/dashboard", "/settings"];

const require = createRequire(import.meta.url);

const canListenOnHost = (port, host) =>
	new Promise((resolve, reject) => {
		const server = net.createServer();

		server.once("error", (error) => {
			if (error.code === "EADDRINUSE" || error.code === "EACCES") {
				resolve(false);
				return;
			}

			reject(error);
		});

		server.once("listening", () => {
			server.close(() => resolve(true));
		});

		server.listen({ host, port });
	});

const findAvailablePort = async () => {
	for (let port = PORT_START; port <= PORT_END; port += 1) {
		if (await canListenOnHost(port, HOST)) {
			return port;
		}
	}

	return null;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const canConnect = (port) =>
	new Promise((resolve) => {
		const socket = net.createConnection({ host: HOST, port });

		socket.once("connect", () => {
			socket.end();
			resolve(true);
		});

		socket.once("error", () => {
			resolve(false);
		});

		socket.setTimeout(1000, () => {
			socket.destroy();
			resolve(false);
		});
	});

const waitForServer = async (child, port) => {
	const startedAt = Date.now();

	while (Date.now() - startedAt < STARTUP_TIMEOUT_MS) {
		if (child.exitCode !== null) {
			throw new Error(`next start exited early with code ${child.exitCode}.`);
		}

		if (await canConnect(port)) {
			return;
		}

		await wait(250);
	}

	throw new Error(
		`Timed out after ${STARTUP_TIMEOUT_MS / 1000}s waiting for next start.`,
	);
};

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
	const statusIsOk = response.status >= 200 && response.status < 400;

	if (!statusIsOk) {
		throw new Error(`${route} returned HTTP ${response.status}.`);
	}

	if (response.status >= 300) {
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

const assertBuildExists = async () => {
	try {
		await access(".next/BUILD_ID");
	} catch {
		throw new Error(
			"Missing .next/BUILD_ID. Run `npm run build` first, or run `npm run verify`.",
		);
	}
};

const stopServer = async (child) => {
	if (child.exitCode !== null) {
		return;
	}

	child.kill("SIGTERM");

	const exited = await new Promise((resolve) => {
		const timeout = setTimeout(() => resolve(false), 5000);

		child.once("exit", () => {
			clearTimeout(timeout);
			resolve(true);
		});
	});

	if (!exited && child.exitCode === null) {
		child.kill("SIGKILL");
	}
};

const start = async () => {
	await assertBuildExists();

	const port = await findAvailablePort();
	if (!port) {
		throw new Error(
			`No available smoke-test ports found in ${PORT_START}-${PORT_END}.`,
		);
	}

	const baseUrl = `http://${HOST}:${port}`;
	const nextBin = require.resolve("next/dist/bin/next");
	const child = spawn(
		process.execPath,
		[nextBin, "start", "--hostname", HOST, "--port", String(port)],
		{
			env: {
				...process.env,
				NODE_ENV: "production",
				PORT: String(port),
			},
			stdio: ["ignore", "pipe", "pipe"],
		},
	);

	child.stdout.on("data", (chunk) => {
		process.stdout.write(chunk);
	});

	child.stderr.on("data", (chunk) => {
		process.stderr.write(chunk);
	});

	try {
		console.log(`Starting smoke server at ${baseUrl}`);
		await waitForServer(child, port);

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
