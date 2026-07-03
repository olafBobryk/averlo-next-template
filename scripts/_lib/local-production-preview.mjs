import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { createRequire } from "node:module";
import net from "node:net";

export const HOST = "127.0.0.1";
export const DEFAULT_PORT_START = 3100;
export const DEFAULT_PORT_END = 3199;
const STARTUP_TIMEOUT_MS = 30_000;

const require = createRequire(import.meta.url);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

export const findAvailablePort = async (
	start = DEFAULT_PORT_START,
	end = DEFAULT_PORT_END,
) => {
	for (let port = start; port <= end; port += 1) {
		if (await canListenOnHost(port, HOST)) {
			return port;
		}
	}

	return null;
};

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

export const assertBuildExists = async () => {
	try {
		await access(".next/BUILD_ID");
	} catch {
		throw new Error(
			"Missing .next/BUILD_ID. Run `npm run build` first, or run `npm run verify`.",
		);
	}
};

export async function stopServer(child) {
	if (!child || child.exitCode !== null) {
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
}

export async function startLocalProductionServer({
	portStart = DEFAULT_PORT_START,
	portEnd = DEFAULT_PORT_END,
	env = {},
	pipeOutput = true,
} = {}) {
	await assertBuildExists();

	const port = await findAvailablePort(portStart, portEnd);
	if (!port) {
		throw new Error(
			`No available preview ports found in ${portStart}-${portEnd}.`,
		);
	}

	const nextBin = require.resolve("next/dist/bin/next");
	const child = spawn(
		process.execPath,
		[nextBin, "start", "--hostname", HOST, "--port", String(port)],
		{
			env: {
				...process.env,
				NODE_ENV: "production",
				PORT: String(port),
				...env,
			},
			stdio: pipeOutput ? ["ignore", "pipe", "pipe"] : "inherit",
		},
	);

	if (pipeOutput) {
		child.stdout?.on("data", (chunk) => {
			process.stdout.write(chunk);
		});

		child.stderr?.on("data", (chunk) => {
			process.stderr.write(chunk);
		});
	}

	try {
		await waitForServer(child, port);
	} catch (error) {
		await stopServer(child);
		throw error;
	}

	return {
		baseUrl: `http://${HOST}:${port}`,
		child,
		port,
	};
}
