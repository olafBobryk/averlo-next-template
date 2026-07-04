#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const HOST = "127.0.0.1";
const SCHEMA_VERSION = 1;
const DEFAULT_PORT_START = 9121;
const DEFAULT_PORT_COUNT = 50;
const STATE_PATH = path.join(ROOT, ".codex", "serena.json");
const LOG_DIR = path.join(ROOT, ".codex", "tmp");
const PACKAGE_JSON_PATH = path.join(ROOT, "package.json");
const SERENA_PROJECT_PATH = path.join(ROOT, ".serena", "project.yml");
const BOOLEAN_FLAGS = new Set(["dry-run", "json"]);

function parseArgs(argv) {
	const values = new Map();
	const positional = [];

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (!arg.startsWith("--")) {
			positional.push(arg);
			continue;
		}

		const [key, inlineValue] = arg.slice(2).split("=");
		if (BOOLEAN_FLAGS.has(key)) {
			values.set(key, true);
			continue;
		}

		const nextValue = inlineValue ?? argv[index + 1];
		if (inlineValue === undefined) index += 1;
		values.set(key, nextValue);
	}

	return { positional, values };
}

function readNumber(values, key, fallback) {
	const value = values.get(key);
	if (value === undefined) return fallback;

	const parsed = Number(value);
	if (!Number.isFinite(parsed) || parsed < 0) {
		throw new Error(`--${key} must be a non-negative number.`);
	}

	return parsed;
}

function withLocalBinEnv() {
	const localBin = path.join(os.homedir(), ".local", "bin");
	const pathValue = process.env.PATH ?? "";
	const separator = process.platform === "win32" ? ";" : ":";
	const pathParts = pathValue.split(separator).filter(Boolean);
	const nextPath = pathParts.includes(localBin)
		? pathValue
		: [localBin, pathValue].filter(Boolean).join(separator);

	return {
		...process.env,
		PATH: nextPath,
	};
}

function commandExists(command, env = process.env) {
	const result = spawnSync(command, ["--version"], {
		cwd: ROOT,
		encoding: "utf8",
		env,
		stdio: ["ignore", "pipe", "pipe"],
	});
	return result.status === 0;
}

function run(command, args, options = {}) {
	const result = spawnSync(command, args, {
		cwd: ROOT,
		encoding: "utf8",
		env: options.env ?? process.env,
		stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
	});

	if (result.status !== 0) {
		const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
		throw new Error(
			`${command} ${args.join(" ")} failed${output ? `:\n${output}` : "."}`,
		);
	}

	return result;
}

async function readPackageName() {
	try {
		const raw = await fs.readFile(PACKAGE_JSON_PATH, "utf8");
		const parsed = JSON.parse(raw);
		if (typeof parsed.name === "string" && parsed.name.trim()) {
			return parsed.name.trim();
		}
	} catch {
		// Fall back to the checkout directory name.
	}

	return path.basename(ROOT);
}

function sanitizeProjectName(name) {
	const sanitized = name
		.toLowerCase()
		.replace(/[^a-z0-9-]+/g, "-")
		.replace(/^-+|-+$/g, "");
	return sanitized || "template-project";
}

export async function getSerenaProjectName(root = ROOT) {
	const realRoot = await fs.realpath(root);
	const hash = crypto
		.createHash("sha1")
		.update(realRoot)
		.digest("hex")
		.slice(0, 8);
	const packageName = await readPackageName();
	return `${sanitizeProjectName(packageName)}-${hash}`;
}

async function getRootMetadata() {
	const realRoot = await fs.realpath(ROOT);
	const projectName = await getSerenaProjectName(realRoot);
	return { realRoot, projectName };
}

async function ensureStateDir() {
	await fs.mkdir(path.dirname(STATE_PATH), { recursive: true });
	await fs.mkdir(LOG_DIR, { recursive: true });
}

export async function readSerenaState() {
	try {
		const raw = await fs.readFile(STATE_PATH, "utf8");
		return JSON.parse(raw);
	} catch (error) {
		if (error?.code === "ENOENT") return null;
		throw error;
	}
}

async function writeSerenaState(state) {
	await ensureStateDir();
	await fs.writeFile(
		`${STATE_PATH}.tmp`,
		`${JSON.stringify(state, null, 2)}\n`,
	);
	await fs.rename(`${STATE_PATH}.tmp`, STATE_PATH);
}

async function ensureSerenaProjectConfig(projectName) {
	try {
		const raw = await fs.readFile(SERENA_PROJECT_PATH, "utf8");
		const next = raw.match(/^project_name:\s*.*$/m)
			? raw.replace(/^project_name:\s*.*$/m, `project_name: "${projectName}"`)
			: `project_name: "${projectName}"\n${raw}`;

		if (next === raw) return false;

		await fs.writeFile(SERENA_PROJECT_PATH, next);
		return true;
	} catch (error) {
		if (error?.code === "ENOENT") return false;
		throw error;
	}
}

function isProcessAlive(pid) {
	if (!Number.isInteger(pid) || pid <= 0) return false;

	try {
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
}

async function isServerReady(port) {
	if (!Number.isInteger(port) || port <= 0) return false;

	try {
		const response = await fetch(`http://${HOST}:${port}/`);
		return response.status < 500;
	} catch {
		return false;
	}
}

async function waitForServer(port, timeoutMs = 20_000) {
	const started = Date.now();
	while (Date.now() - started < timeoutMs) {
		if (await isServerReady(port)) return;
		await new Promise((resolve) => setTimeout(resolve, 300));
	}

	throw new Error(
		`Serena project server did not become ready on port ${port}.`,
	);
}

async function checkLocalPort(port) {
	return new Promise((resolve) => {
		const server = net.createServer();
		server.once("error", (error) => {
			resolve({
				port,
				available: false,
				code: error.code ?? "UNKNOWN",
				message: error.message,
			});
		});
		server.once("listening", () => {
			server.close(() =>
				resolve({
					port,
					available: true,
				}),
			);
		});
		server.listen(port, HOST);
	});
}

function formatPortFailure(attempt) {
	if (attempt.available) return `${attempt.port}: available`;
	return `${attempt.port}: ${attempt.code} ${attempt.message}`;
}

async function findOpenPort(
	startPort = DEFAULT_PORT_START,
	portCount = DEFAULT_PORT_COUNT,
	options = {},
) {
	const attempts = [];
	const endPort = startPort + portCount - 1;

	for (let port = startPort; port <= endPort; port += 1) {
		const attempt = await checkLocalPort(port);
		attempts.push(attempt);

		if (options.debug) {
			console.log(formatPortFailure(attempt));
		}

		if (attempt.available) return port;
	}

	const preview = attempts.slice(0, 8).map(formatPortFailure).join("\n");
	const allPermissionDenied = attempts.every(
		(attempt) => attempt.code === "EPERM",
	);
	const allInUse = attempts.every((attempt) => attempt.code === "EADDRINUSE");
	const likelyCause = allPermissionDenied
		? "All checked ports failed with EPERM. This usually means the current shell sandbox cannot bind loopback ports, not that Serena used every port."
		: allInUse
			? "All checked ports are already in use."
			: "Port discovery saw mixed bind failures.";

	throw new Error(
		[
			`No open local port found for Serena project server on ${HOST}:${startPort}-${endPort}.`,
			likelyCause,
			"First port attempts:",
			preview,
			"Run `npm run intelligence:serena:debug` for a focused port-discovery check.",
		].join("\n"),
	);
}

async function assertRequestedPort(port) {
	const attempt = await checkLocalPort(port);
	if (attempt.available) return port;

	throw new Error(
		[
			`Requested Serena port ${port} is not available.`,
			formatPortFailure(attempt),
			attempt.code === "EPERM"
				? "The current shell may not be allowed to bind loopback ports."
				: null,
		]
			.filter(Boolean)
			.join("\n"),
	);
}

async function classifyStatus() {
	const env = withLocalBinEnv();
	const serenaAvailable = commandExists("serena", env);
	const uvAvailable = commandExists("uv", env);
	const { realRoot, projectName } = await getRootMetadata();

	if (!serenaAvailable) {
		return {
			status: "missing-tools",
			root: realRoot,
			projectName,
			tools: {
				uv: uvAvailable,
				serena: serenaAvailable,
			},
		};
	}

	const state = await readSerenaState();
	if (!state) {
		return {
			status: "not-started",
			root: realRoot,
			projectName,
			tools: {
				uv: uvAvailable,
				serena: serenaAvailable,
			},
		};
	}

	if (state.root !== realRoot || state.projectName !== projectName) {
		return {
			status: "stale-root",
			root: realRoot,
			projectName,
			state,
			tools: {
				uv: uvAvailable,
				serena: serenaAvailable,
			},
		};
	}

	if (!isProcessAlive(state.pid) || !(await isServerReady(state.port))) {
		return {
			status: "dead-pid",
			root: realRoot,
			projectName,
			state,
			tools: {
				uv: uvAvailable,
				serena: serenaAvailable,
			},
		};
	}

	return {
		status: "running",
		root: realRoot,
		projectName,
		state,
		tools: {
			uv: uvAvailable,
			serena: serenaAvailable,
		},
	};
}

export async function getWarmSerenaState() {
	const status = await classifyStatus();
	return status.status === "running" ? status.state : null;
}

function printStatus(status, options = {}) {
	if (options.json) {
		console.log(JSON.stringify(status, null, 2));
		return;
	}

	console.log(`status: ${status.status}`);
	console.log(`root: ${status.root}`);
	console.log(`project: ${status.projectName}`);
	console.log(`uv: ${status.tools?.uv ? "yes" : "no"}`);
	console.log(`serena: ${status.tools?.serena ? "yes" : "no"}`);

	if (status.state) {
		console.log(`state: ${STATE_PATH}`);
		console.log(`port: ${status.state.port ?? "unknown"}`);
		console.log(`pid: ${status.state.pid ?? "unknown"}`);
		console.log(`log: ${status.state.logPath ?? "unknown"}`);
	}
}

async function printSetupGuidance(values) {
	const dryRun = values.has("dry-run");
	const { realRoot, projectName } = await getRootMetadata();

	console.log(
		dryRun
			? "Template Intelligence Serena setup dry run"
			: "Serena is optional and user-local.",
	);
	console.log(`root: ${realRoot}`);
	console.log(`project: ${projectName}`);
	console.log("");
	console.log("Warm-service commands:");
	console.log("- npm run intelligence:serena:ensure");
	console.log("- npm run intelligence:serena:status");
	console.log("- npm run intelligence:serena:stop");
	console.log("");
	console.log("Planned ensure actions:");
	console.log("- Add $HOME/.local/bin to PATH for this command");
	console.log(
		"- Install serena-agent with `uv tool install serena-agent` if missing",
	);
	console.log(`- Index this checkout as ${projectName}`);
	console.log("- Health-check this checkout");
	console.log(
		`- Start or reuse a local project server and write ${STATE_PATH}`,
	);
	console.log("Serena remains user-local and is not a repo dependency.");
}

async function debugPortDiscovery(values) {
	const env = withLocalBinEnv();
	const startPort = readNumber(values, "port-range-start", DEFAULT_PORT_START);
	const portCount = readNumber(values, "port-range-count", DEFAULT_PORT_COUNT);
	const requestedPort = readNumber(values, "serena-port", 0);

	if (portCount <= 0) {
		throw new Error("--port-range-count must be greater than 0.");
	}

	console.log("Serena port discovery debug");
	console.log(`cwd: ${ROOT}`);
	console.log(`uv on PATH: ${commandExists("uv", env) ? "yes" : "no"}`);
	console.log(`serena on PATH: ${commandExists("serena", env) ? "yes" : "no"}`);

	if (requestedPort > 0) {
		console.log(`checking requested port: ${requestedPort}`);
		const port = await assertRequestedPort(requestedPort);
		console.log(`requested port available: ${port}`);
		return;
	}

	const port = await findOpenPort(startPort, portCount, { debug: true });
	console.log(`first available port: ${port}`);
}

function installSerena(env) {
	if (!commandExists("uv", env)) {
		throw new Error(
			"Serena is missing and uv is not available. Install uv or put serena on PATH, then rerun `npm run intelligence:serena:ensure`.",
		);
	}

	console.log("Installing serena-agent with uv tool install serena-agent...");
	run("uv", ["tool", "install", "serena-agent"], { env });
}

async function startServer({
	env,
	projectName,
	requestedPort,
	portRangeStart,
	portRangeCount,
}) {
	const port =
		requestedPort > 0
			? await assertRequestedPort(requestedPort)
			: await findOpenPort(portRangeStart, portRangeCount);
	const logPath = path.join(
		LOG_DIR,
		`serena-${projectName}-${new Date().toISOString().replace(/[:.]/g, "-")}.log`,
	);

	await ensureStateDir();
	const logFile = await fs.open(logPath, "a");
	try {
		const child = spawn(
			"serena",
			[
				"start-project-server",
				"--host",
				HOST,
				"--port",
				String(port),
				"--log-level",
				"WARNING",
			],
			{
				cwd: ROOT,
				detached: true,
				env,
				stdio: ["ignore", logFile.fd, logFile.fd],
			},
		);

		child.unref();
		await waitForServer(port);

		return {
			pid: child.pid,
			port,
			logPath,
		};
	} finally {
		await logFile.close();
	}
}

export async function ensureSerenaService(options = {}) {
	const env = withLocalBinEnv();
	const dryRun = options.dryRun ?? false;
	const installMissing = options.installMissing ?? true;
	const runIndex = options.runIndex ?? true;
	const requestedPort = options.requestedPort ?? 0;
	const portRangeStart = options.portRangeStart ?? DEFAULT_PORT_START;
	const portRangeCount = options.portRangeCount ?? DEFAULT_PORT_COUNT;
	const { realRoot, projectName } = await getRootMetadata();
	const currentStatus = await classifyStatus();

	if (dryRun) {
		console.log("Serena ensure dry run");
		console.log(`root: ${realRoot}`);
		console.log(`project: ${projectName}`);
		console.log(`state: ${STATE_PATH}`);
		console.log(`current-status: ${currentStatus.status}`);
		console.log(
			`serena-action: ${currentStatus.tools?.serena ? "reuse installed serena" : "install serena-agent with uv tool install serena-agent"}`,
		);
		console.log(`index-action: serena project index . --name ${projectName}`);
		console.log("health-action: serena project health-check .");
		console.log(
			`server-action: ${currentStatus.status === "running" ? "reuse running server" : "start local project server"}`,
		);
		console.log("write-action: none");
		return null;
	}

	if (!commandExists("serena", env)) {
		if (!installMissing) {
			throw new Error(
				"Serena is missing. Run `npm run intelligence:serena:ensure` to install it with uv.",
			);
		}
		installSerena(env);
	}

	if (runIndex) {
		const projectConfigChanged = await ensureSerenaProjectConfig(projectName);
		if (projectConfigChanged && currentStatus.status === "running") {
			process.kill(currentStatus.state.pid, "SIGINT");
			await fs.rm(STATE_PATH, { force: true });
		}

		run(
			"serena",
			[
				"project",
				"index",
				".",
				"--name",
				projectName,
				"--language",
				"typescript",
				"--log-level",
				"WARNING",
			],
			{ env },
		);
		run("serena", ["project", "health-check", "."], { env });
	}

	const refreshedStatus = await classifyStatus();
	if (refreshedStatus.status === "running") {
		console.log(
			`Serena service already running on port ${refreshedStatus.state.port}.`,
		);
		return refreshedStatus.state;
	}

	const server = await startServer({
		env,
		projectName,
		requestedPort,
		portRangeStart,
		portRangeCount,
	});
	const state = {
		schemaVersion: SCHEMA_VERSION,
		root: realRoot,
		projectName,
		port: server.port,
		pid: server.pid,
		startedAt: new Date().toISOString(),
		logPath: server.logPath,
	};

	await writeSerenaState(state);
	console.log(`Serena service running on port ${state.port}.`);
	console.log(`State written to ${STATE_PATH}.`);
	return state;
}

async function stopSerenaService() {
	const status = await classifyStatus();
	if (status.status !== "running") {
		console.log(`status: ${status.status}`);
		console.log("No running Serena service for this checkout.");
		return;
	}

	process.kill(status.state.pid, "SIGINT");
	await fs.rm(STATE_PATH, { force: true });
	console.log(`Stopped Serena service pid ${status.state.pid}.`);
	console.log(`Removed ${STATE_PATH}.`);
}

async function runCli(argv) {
	const command = argv[0] ?? "status";
	const { values } = parseArgs(argv.slice(1));

	switch (command) {
		case "ensure": {
			await ensureSerenaService({
				dryRun: values.has("dry-run"),
				installMissing: true,
				runIndex: true,
				requestedPort: readNumber(values, "serena-port", 0),
				portRangeStart: readNumber(
					values,
					"port-range-start",
					DEFAULT_PORT_START,
				),
				portRangeCount: readNumber(
					values,
					"port-range-count",
					DEFAULT_PORT_COUNT,
				),
			});
			return;
		}
		case "start": {
			await ensureSerenaService({
				dryRun: values.has("dry-run"),
				installMissing: false,
				runIndex: true,
				requestedPort: readNumber(values, "serena-port", 0),
				portRangeStart: readNumber(
					values,
					"port-range-start",
					DEFAULT_PORT_START,
				),
				portRangeCount: readNumber(
					values,
					"port-range-count",
					DEFAULT_PORT_COUNT,
				),
			});
			return;
		}
		case "status": {
			const status = await classifyStatus();
			printStatus(status, { json: values.has("json") });
			return;
		}
		case "stop":
			await stopSerenaService();
			return;
		case "setup":
			await printSetupGuidance(values);
			return;
		case "debug":
			await debugPortDiscovery(values);
			return;
		default:
			throw new Error(
				`Unknown Serena command "${command}". Use ensure, start, status, stop, setup, or debug.`,
			);
	}
}

export async function main(argv = process.argv.slice(2)) {
	try {
		await runCli(argv);
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exitCode = 2;
	}
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	await main();
}
