#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import net from "node:net";
import process from "node:process";

const ROOT = process.cwd();
const PROJECT_NAME = "verilo-next-template";
const LOCAL_BIN_HINT = "$HOME/.local/bin";
const BOOLEAN_FLAGS = new Set(["debug-port-discovery"]);

function parseArgs(argv) {
	const values = new Map();

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (!arg.startsWith("--")) continue;

		const [key, inlineValue] = arg.slice(2).split("=");
		if (BOOLEAN_FLAGS.has(key)) {
			values.set(key, true);
			continue;
		}

		const nextValue = inlineValue ?? argv[index + 1];

		if (inlineValue === undefined) index += 1;
		values.set(key, nextValue);
	}

	return values;
}

function readString(values, key) {
	const value = values.get(key);
	return typeof value === "string" && value.trim() ? value.trim() : null;
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

function readTopics(values) {
	const topics = readString(values, "topics");
	if (!topics) return [];
	return topics
		.split(",")
		.map((topic) => topic.trim())
		.filter(Boolean);
}

function printUsage() {
	console.log(`Usage: npm run intelligence:hybrid -- \\
  --task-id T1 \\
  --task-name "Route architecture" \\
  --topics route-architecture,dev-server \\
  --serena-file src/config/routes.ts \\
  --serena-symbol appRoutes

Optional:
  --serena-port 9121
  --port-range-start 9121
  --port-range-count 50
  --debug-port-discovery
  --correctness 3
  --wrong-turns 0
  --generated-artifact-mistakes 0
  --notes "Short note"
`);
}

function commandExists(command) {
	const result = spawnSync(command, ["--version"], {
		cwd: ROOT,
		encoding: "utf8",
		stdio: ["ignore", "pipe", "pipe"],
	});
	return result.status === 0;
}

function run(command, args, options = {}) {
	const result = spawnSync(command, args, {
		cwd: ROOT,
		encoding: "utf8",
		stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
		...options,
	});

	if (result.status !== 0) {
		const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
		throw new Error(
			`${command} ${args.join(" ")} failed${output ? `:\n${output}` : "."}`,
		);
	}

	return result;
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
		server.listen(port, "127.0.0.1");
	});
}

function formatPortFailure(attempt) {
	if (attempt.available) return `${attempt.port}: available`;
	return `${attempt.port}: ${attempt.code} ${attempt.message}`;
}

async function findOpenPort(startPort = 9121, portCount = 50, options = {}) {
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
			`No open local port found for Serena project server on 127.0.0.1:${startPort}-${endPort}.`,
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

async function debugPortDiscovery(values) {
	const startPort = readNumber(values, "port-range-start", 9121);
	const portCount = readNumber(values, "port-range-count", 50);
	const requestedPort = readNumber(values, "serena-port", 0);

	if (portCount <= 0) {
		throw new Error("--port-range-count must be greater than 0.");
	}

	console.log("Serena port discovery debug");
	console.log(`cwd: ${ROOT}`);
	console.log(`uv on PATH: ${commandExists("uv") ? "yes" : "no"}`);
	console.log(`serena on PATH: ${commandExists("serena") ? "yes" : "no"}`);

	if (requestedPort > 0) {
		console.log(`checking requested port: ${requestedPort}`);
		const port = await assertRequestedPort(requestedPort);
		console.log(`requested port available: ${port}`);
		return;
	}

	const port = await findOpenPort(startPort, portCount, { debug: true });
	console.log(`first available port: ${port}`);
}

async function waitForServer(port, timeoutMs = 20_000) {
	const started = Date.now();
	while (Date.now() - started < timeoutMs) {
		try {
			const response = await fetch(`http://127.0.0.1:${port}/`);
			if (response.status < 500) return;
		} catch {
			// Server is not ready yet.
		}
		await new Promise((resolve) => setTimeout(resolve, 300));
	}

	throw new Error(
		`Serena project server did not become ready on port ${port}.`,
	);
}

async function querySerena(port, toolName, toolParams) {
	const response = await fetch(`http://127.0.0.1:${port}/query_project`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			project_name: PROJECT_NAME,
			tool_name: toolName,
			tool_params_json: JSON.stringify(toolParams),
		}),
	});

	const text = await response.text();
	if (!response.ok) {
		throw new Error(`Serena ${toolName} query failed: ${text}`);
	}

	if (!text.trim() || text.includes("Error executing tool:")) {
		throw new Error(`Serena ${toolName} query returned an error: ${text}`);
	}

	return text;
}

async function main() {
	const values = parseArgs(process.argv.slice(2));
	if (values.has("debug-port-discovery")) {
		try {
			await debugPortDiscovery(values);
		} catch (error) {
			console.error(error instanceof Error ? error.message : String(error));
			process.exitCode = 2;
		}
		return;
	}

	const taskId = readString(values, "task-id");
	const taskName = readString(values, "task-name");
	const topics = readTopics(values);
	const serenaFile = readString(values, "serena-file");
	const serenaSymbol = readString(values, "serena-symbol");
	const serenaPort = readNumber(values, "serena-port", 0);
	const portRangeStart = readNumber(values, "port-range-start", 9121);
	const portRangeCount = readNumber(values, "port-range-count", 50);
	const correctness = readNumber(values, "correctness", 3);
	const wrongTurns = readNumber(values, "wrong-turns", 0);
	const generatedArtifactMistakes = readNumber(
		values,
		"generated-artifact-mistakes",
		0,
	);
	const extraNotes = readString(values, "notes");

	if (!taskId || !taskName || topics.length === 0 || !serenaFile) {
		printUsage();
		process.exit(1);
	}

	const uvPath = commandExists("uv");
	const serenaPath = commandExists("serena");

	if (!uvPath || !serenaPath) {
		console.warn(
			[
				"Hybrid benchmark not recorded: uv and serena must both be on PATH.",
				`Found uv: ${uvPath ? "yes" : "no"}`,
				`Found serena: ${serenaPath ? "yes" : "no"}`,
				`If installed user-locally, retry with: PATH="${LOCAL_BIN_HINT}:$PATH" npm run intelligence:hybrid -- ...`,
			].join("\n"),
		);
		process.exit(2);
	}

	let semanticCalls = 0;
	let server = null;

	try {
		if (portRangeCount <= 0) {
			throw new Error("--port-range-count must be greater than 0.");
		}

		const port =
			serenaPort > 0
				? await assertRequestedPort(serenaPort)
				: await findOpenPort(portRangeStart, portRangeCount);

		run("npm", ["run", "intelligence:generate"]);
		for (const topic of topics) {
			run("npm", ["run", "intelligence:query", "--", topic]);
		}

		run("serena", [
			"project",
			"index",
			".",
			"--name",
			PROJECT_NAME,
			"--language",
			"typescript",
			"--log-level",
			"WARNING",
		]);
		run("serena", ["project", "health-check", "."]);

		server = spawn(
			"serena",
			[
				"start-project-server",
				"--host",
				"127.0.0.1",
				"--port",
				String(port),
				"--log-level",
				"WARNING",
			],
			{
				cwd: ROOT,
				stdio: ["ignore", "pipe", "pipe"],
			},
		);

		server.stdout.on("data", (chunk) => process.stdout.write(chunk));
		server.stderr.on("data", (chunk) => process.stderr.write(chunk));

		await waitForServer(port);

		const overview = await querySerena(port, "get_symbols_overview", {
			relative_path: serenaFile,
		});
		semanticCalls += 1;
		console.log(
			`Serena get_symbols_overview returned ${overview.length} bytes.`,
		);

		if (serenaSymbol) {
			const symbolResult = await querySerena(port, "find_symbol", {
				name_path_pattern: serenaSymbol,
				relative_path: serenaFile,
				depth: 1,
			});
			semanticCalls += 1;
			console.log(`Serena find_symbol returned ${symbolResult.length} bytes.`);
		}

		if (semanticCalls === 0) {
			throw new Error("No successful Serena semantic calls were made.");
		}

		const shellCommands = 1 + topics.length + 3;
		const notes = [
			`Enforced hybrid preset: generated Template Intelligence, queried topics ${topics.join(", ")}, indexed and health-checked Serena, and queried ${serenaFile}${serenaSymbol ? ` / ${serenaSymbol}` : ""}.`,
			extraNotes,
		]
			.filter(Boolean)
			.join(" ");

		run("npm", [
			"run",
			"intelligence:record",
			"--",
			"--task-id",
			taskId,
			"--task-name",
			taskName,
			"--strategy",
			"Hybrid",
			"--shell-commands",
			String(shellCommands),
			"--semantic-calls",
			String(semanticCalls),
			"--lookup-actions",
			String(shellCommands + semanticCalls),
			"--correctness",
			String(correctness),
			"--wrong-turns",
			String(wrongTurns),
			"--generated-artifact-mistakes",
			String(generatedArtifactMistakes),
			"--notes",
			notes,
		]);
	} catch (error) {
		console.warn(
			`Hybrid benchmark not recorded: ${error instanceof Error ? error.message : String(error)}`,
		);
		process.exitCode = 2;
	} finally {
		if (server && !server.killed) {
			server.kill("SIGINT");
		}
	}
}

await main();
