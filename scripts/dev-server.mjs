#!/usr/bin/env node

import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import net from "node:net";

const USER_PORT = 3000;
const USER_PORT_END = 3010;
const AGENT_PORT_START = 3011;
const AGENT_PORT_END = 3099;

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const mode = args.find((arg) => !arg.startsWith("-")) ?? "user";
const isDryRun = args.includes("--dry-run");

const printUsageAndExit = () => {
	console.error("Usage: node scripts/dev-server.mjs <user|agent> [--dry-run]");
	process.exit(1);
};

const canListenOnHost = (port, host) =>
	new Promise((resolve, reject) => {
		const server = net.createServer();

		server.once("error", (error) => {
			if (error.code === "EADDRINUSE" || error.code === "EACCES") {
				resolve(false);
				return;
			}

			if (error.code === "EAFNOSUPPORT" || error.code === "EADDRNOTAVAIL") {
				resolve(true);
				return;
			}

			reject(error);
		});

		server.once("listening", () => {
			server.close(() => resolve(true));
		});

		server.listen({ host, port });
	});

const isPortAvailable = async (port) =>
	(await canListenOnHost(port, "127.0.0.1")) &&
	(await canListenOnHost(port, "::"));

const findAvailablePort = async (start, end) => {
	for (let port = start; port <= end; port += 1) {
		if (await isPortAvailable(port)) {
			return port;
		}
	}

	return null;
};

const getPayloadAdminUrl = (url) => {
	const loginUrl = new URL("/api/dev/payload-login", url);
	loginUrl.searchParams.set("next", "/admin");

	return loginUrl.toString();
};

const getServerTarget = async () => {
	if (mode === "user") {
		const port = await findAvailablePort(USER_PORT, USER_PORT_END);

		if (!port) {
			console.error(
				[
					`No available user dev server ports found in ${USER_PORT}-${USER_PORT_END}.`,
					"The user dev server avoids the agent port range so it does not collide with isolated agent servers.",
					"Stop the existing process yourself if you want to replace it, or run npm run dev:agent for an isolated agent server.",
				].join("\n"),
			);
			process.exit(1);
		}

		return {
			distDir: port === USER_PORT ? ".next-user" : `.next-user-${port}`,
			label: "user",
			port,
			tsconfigPath:
				port === USER_PORT
					? "tsconfig.next-user.json"
					: `tsconfig.next-user-${port}.json`,
		};
	}

	if (mode === "agent") {
		const port = await findAvailablePort(AGENT_PORT_START, AGENT_PORT_END);

		if (!port) {
			console.error(
				`No available agent dev server ports found in ${AGENT_PORT_START}-${AGENT_PORT_END}.`,
			);
			process.exit(1);
		}

		return {
			distDir: `.next-agent-${port}`,
			label: "agent",
			port,
			tsconfigPath: `tsconfig.next-agent-${port}.json`,
		};
	}

	printUsageAndExit();
};

const start = async () => {
	const target = await getServerTarget();
	const url = `http://localhost:${target.port}`;

	console.log(`Mode: ${target.label}`);
	console.log(`URL: ${url}`);
	if (target.label === "agent") {
		console.log(`Automation URL: ${url}?motion=off&reveal=off`);
	}
	if (process.env.PAYLOAD_DEV_MAGIC_LOGIN === "1") {
		console.log(`Payload Admin URL: ${getPayloadAdminUrl(url)}`);
	}
	console.log(`Next distDir: ${target.distDir}`);
	console.log(`TypeScript config: ${target.tsconfigPath}`);

	if (isDryRun) {
		return;
	}

	await writeFile(
		target.tsconfigPath,
		`${JSON.stringify(
			{
				extends: "./tsconfig.json",
				include: [
					"next-env.d.ts",
					"**/*.ts",
					"**/*.tsx",
					`${target.distDir}/types/**/*.ts`,
					`${target.distDir}/dev/types/**/*.ts`,
				],
				exclude: ["node_modules"],
			},
			null,
			2,
		)}\n`,
	);

	const nextBin = require.resolve("next/dist/bin/next");
	const child = spawn(
		process.execPath,
		[nextBin, "dev", "--turbopack", "--port", String(target.port)],
		{
			env: {
				...process.env,
				NEXT_DEV_DIST_DIR: target.distDir,
				NEXT_DEV_TSCONFIG_PATH: target.tsconfigPath,
				PORT: String(target.port),
			},
			stdio: "inherit",
		},
	);

	child.on("exit", (code, signal) => {
		if (signal) {
			process.kill(process.pid, signal);
			return;
		}

		process.exit(code ?? 0);
	});
};

start().catch((error) => {
	console.error(error);
	process.exit(1);
});
