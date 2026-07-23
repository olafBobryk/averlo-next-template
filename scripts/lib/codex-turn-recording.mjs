import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const CODEX_HOOK_EVENT_SCHEMA_VERSION = 1;
export const CODEX_HOOK_EVENT_RECORD_KIND = "codex-hook-event";
export const CODEX_TURN_EVENTS_RELATIVE_PATH =
	".template-intelligence/codex-turn-events.jsonl";

const SUPPORTED_EVENTS = new Set([
	"SessionStart",
	"UserPromptSubmit",
	"PostToolUse",
	"SubagentStart",
	"SubagentStop",
	"Stop",
]);

const SAFE_SESSION_SOURCES = new Set(["startup", "resume", "clear", "compact"]);
const SAFE_PERMISSION_MODES = new Set([
	"default",
	"acceptEdits",
	"plan",
	"dontAsk",
	"bypassPermissions",
]);

function nonEmptyString(value, maxLength = 512) {
	if (typeof value !== "string") return undefined;
	const trimmed = value.trim();
	return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

function stableEventId(parts) {
	const digest = crypto
		.createHash("sha256")
		.update(parts.join("\u0000"))
		.digest("hex")
		.slice(0, 24);
	return `che_${digest}`;
}

function normalizeEditedPath(root, candidate) {
	const raw = nonEmptyString(candidate, 4096);
	if (!raw || raw === "/dev/null") return undefined;
	const withoutPrefix = raw.replace(/^[ab]\//, "");
	const absolute = path.resolve(root, withoutPrefix);
	const relative = path.relative(root, absolute);
	if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`)) {
		return undefined;
	}
	return relative.split(path.sep).join("/");
}

export function extractEditedPaths(root, toolName, toolInput) {
	if (toolName !== "apply_patch") return [];
	const command = nonEmptyString(toolInput?.command, 16 * 1024 * 1024);
	if (!command) return [];

	const candidates = [];
	for (const match of command.matchAll(
		/^\*\*\* (?:Add|Update|Delete) File: (.+)$/gm,
	)) {
		candidates.push(match[1]);
	}
	for (const match of command.matchAll(/^\+\+\+\s+([^\t\r\n ]+)/gm)) {
		candidates.push(match[1]);
	}

	return [
		...new Set(
			candidates
				.map((candidate) => normalizeEditedPath(root, candidate))
				.filter(Boolean),
		),
	].slice(0, 100);
}

function shellCommand(toolName, toolInput) {
	if (toolName !== "Bash") return undefined;
	return nonEmptyString(toolInput?.command, 16 * 1024 * 1024);
}

function hasCommandInvocation(command, pattern) {
	return pattern.test(command);
}

export function deriveActivitySignals(toolName, toolInput) {
	const signals = new Set();
	const loweredToolName = toolName.toLowerCase();

	if (loweredToolName.includes("serena")) signals.add("serena");

	const command = shellCommand(toolName, toolInput);
	if (!command) return [...signals];

	if (
		hasCommandInvocation(
			command,
			/(?:^|[;&|]\s*)(?:npm|pnpm|yarn)\s+(?:run\s+)?intelligence:(?:generate|query)\b|node\s+scripts\/generate-template-intelligence\.mjs\b/m,
		)
	) {
		signals.add("template-map");
	}

	if (
		hasCommandInvocation(
			command,
			/(?:^|[;&|]\s*)(?:npm|pnpm|yarn)\s+(?:run\s+)?intelligence:hybrid\b/m,
		)
	) {
		signals.add("template-map");
		signals.add("serena");
	}

	if (
		hasCommandInvocation(
			command,
			/(?:^|[;&|]\s*)(?:npm|pnpm|yarn)\s+(?:run\s+)?intelligence:serena(?::[\w-]+)?\b|node\s+scripts\/template-intelligence-serena-service\.mjs\b/m,
		)
	) {
		signals.add("serena");
	}

	if (
		hasCommandInvocation(
			command,
			/(?:^|[;&|]\s*)(?:uvx\s+--from\s+graphifyy\s+)?graphify\s+(?:\.|query\b)/m,
		)
	) {
		signals.add("graphify");
	}

	if (hasCommandInvocation(command, /(?:^|[;&|]\s*)(?:rg|git\s+grep)\s+/m)) {
		signals.add("direct-search");
	}

	return [...signals].sort();
}

export function normalizeToolCategory(toolName) {
	if (toolName === "Bash") return "shell";
	if (toolName === "apply_patch") return "file-edit";
	if (toolName === "Agent" || toolName === "spawn_agent") {
		return "subagent-control";
	}
	if (toolName.startsWith("mcp__")) return "mcp";
	return "local-tool";
}

export function normalizeHookPayload(payload, { root, now = new Date() }) {
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
		throw new Error("invalid payload");
	}

	const eventName = nonEmptyString(payload.hook_event_name, 64);
	const sessionId = nonEmptyString(payload.session_id, 256);
	if (!eventName || !SUPPORTED_EVENTS.has(eventName) || !sessionId) {
		throw new Error("unsupported event");
	}

	const turnId = nonEmptyString(payload.turn_id, 256);
	if (eventName !== "SessionStart" && !turnId) {
		throw new Error("turn id required");
	}

	const identityParts = [sessionId, eventName];
	if (turnId) identityParts.push(turnId);

	const event = {
		schemaVersion: CODEX_HOOK_EVENT_SCHEMA_VERSION,
		recordKind: CODEX_HOOK_EVENT_RECORD_KIND,
		recordedAt: now.toISOString(),
		sessionId,
		eventName,
	};

	if (turnId) event.turnId = turnId;
	const model = nonEmptyString(payload.model, 160);
	if (model) event.model = model;
	if (SAFE_PERMISSION_MODES.has(payload.permission_mode)) {
		event.permissionMode = payload.permission_mode;
	}
	if (eventName === "SessionStart") {
		if (SAFE_SESSION_SOURCES.has(payload.source)) event.source = payload.source;
		event.eventId = crypto.randomUUID();
		return event;
	}

	if (eventName === "PostToolUse") {
		const toolName = nonEmptyString(payload.tool_name, 256);
		const toolUseId = nonEmptyString(payload.tool_use_id, 256);
		if (!toolName || !toolUseId) throw new Error("tool identity required");
		identityParts.push(toolUseId);
		event.toolCategory = normalizeToolCategory(toolName);
		const activitySignals = deriveActivitySignals(toolName, payload.tool_input);
		if (activitySignals.length > 0) event.activitySignals = activitySignals;
		const editedPaths = extractEditedPaths(root, toolName, payload.tool_input);
		if (editedPaths.length > 0) event.editedPaths = editedPaths;
	}

	if (eventName === "SubagentStart" || eventName === "SubagentStop") {
		const agentId = nonEmptyString(payload.agent_id, 256);
		const agentType = nonEmptyString(payload.agent_type, 160);
		if (!agentId || !agentType) throw new Error("agent identity required");
		identityParts.push(agentId);
		event.agentId = agentId;
		event.agentType = agentType;
	}

	event.eventId = stableEventId(identityParts);
	return event;
}

export function getCodexTurnEventsPath(root) {
	const override = nonEmptyString(process.env.CODEX_TURN_RECORDING_PATH, 4096);
	return override
		? path.resolve(override)
		: path.join(root, CODEX_TURN_EVENTS_RELATIVE_PATH);
}

async function acquireLock(lockPath) {
	for (let attempt = 0; attempt < 80; attempt += 1) {
		try {
			return await fs.open(lockPath, "wx", 0o600);
		} catch (error) {
			if (error?.code !== "EEXIST" || attempt === 79) throw error;
			await new Promise((resolve) => setTimeout(resolve, 25));
		}
	}
	throw new Error("lock unavailable");
}

export async function appendCodexHookEvent(event, { root }) {
	const outputPath = getCodexTurnEventsPath(root);
	await fs.mkdir(path.dirname(outputPath), { recursive: true });
	const lockPath = `${outputPath}.lock`;
	const lock = await acquireLock(lockPath);

	try {
		const file = await fs.open(outputPath, "a", 0o600);
		try {
			await file.write(`${JSON.stringify(event)}\n`, null, "utf8");
			await file.chmod(0o600);
		} finally {
			await file.close();
		}
	} finally {
		await lock.close();
		await fs.unlink(lockPath).catch(() => undefined);
	}

	return outputPath;
}
