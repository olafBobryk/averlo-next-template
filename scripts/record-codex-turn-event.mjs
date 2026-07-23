#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import process from "node:process";
import {
	appendCodexHookEvent,
	normalizeHookPayload,
} from "./lib/codex-turn-recording.mjs";

const MAX_INPUT_BYTES = 64 * 1024 * 1024;

async function readStdin() {
	const chunks = [];
	let size = 0;
	for await (const chunk of process.stdin) {
		size += chunk.length;
		if (size > MAX_INPUT_BYTES) throw new Error("input too large");
		chunks.push(chunk);
	}
	return Buffer.concat(chunks).toString("utf8");
}

function repositoryRoot() {
	return execFileSync("git", ["rev-parse", "--show-toplevel"], {
		encoding: "utf8",
		stdio: ["ignore", "pipe", "ignore"],
	}).trim();
}

try {
	const root = repositoryRoot();
	const payload = JSON.parse(await readStdin());
	const event = normalizeHookPayload(payload, { root });
	await appendCodexHookEvent(event, { root });
} catch {
	console.error("Codex turn recorder: event could not be recorded.");
}
