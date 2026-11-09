import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

// Operational helpers for the template's `.specify/workflows/contact-delivery/`
// workflow. Nothing here prints, logs or passes a secret value through argv.

export const BOBRYK_EMAIL = "bobryk.olaf@gmail.com";
export const MANAGEMENT_TOKEN_PATH =
	".codex/secrets/averlo-contact-form/resend-management.token";

export function validEmail(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

/** Production recipients: the client plus Bobryk, trimmed and deduplicated. */
export function recipients(clientEmail) {
	const values = clientEmail ? [clientEmail, BOBRYK_EMAIL] : [BOBRYK_EMAIL];
	const seen = new Set();
	return values
		.map((v) => v.trim().toLowerCase())
		.filter((v) => validEmail(v) && !seen.has(v) && seen.add(v));
}

export function parseEnv(text) {
	const result = new Map();
	for (const line of text.split(/\r?\n/)) {
		const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
		if (match) result.set(match[1], match[2].replace(/^['"]|['"]$/g, ""));
	}
	return result;
}

export function assertSafeEnvFile(file) {
	if (!fs.existsSync(file)) return;
	const stat = fs.lstatSync(file);
	if (stat.isSymbolicLink() || !stat.isFile())
		throw new Error(".env.local must be a regular file, not a symlink");
}

export function upsertEnv(file, values) {
	assertSafeEnvFile(file);
	const original = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
	const managed = new Set(Object.keys(values));
	const kept = original
		.split(/\r?\n/)
		.filter((line) => {
			const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=/);
			return !(match && managed.has(match[1]));
		})
		.filter((line, index, all) => line || index < all.length - 1);
	const additions = Object.entries(values)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => `${key}=${value}`);
	const output = `${[...kept, ...additions].join("\n").replace(/^\n+/, "")}\n`;
	const temp = `${file}.${process.pid}.tmp`;
	fs.writeFileSync(temp, output, { mode: 0o600, flag: "wx" });
	fs.renameSync(temp, file);
	fs.chmodSync(file, 0o600);
}

export function ensureIgnored(repo) {
	const ignore = path.join(repo, ".gitignore");
	const text = fs.existsSync(ignore) ? fs.readFileSync(ignore, "utf8") : "";
	const ignored = text
		.split(/\r?\n/)
		.some((line) =>
			[".env.local", ".env*", ".env*.local"].includes(line.trim()),
		);
	if (!ignored)
		throw new Error(
			"Refusing to write: .env.local is not covered by .gitignore",
		);
}

const VALUE_OPTIONS = new Set(["--repo", "--project", "--client-email"]);

export function parseContactArgs(argv) {
	const [command, ...rest] = argv;
	const options = { command, help: false, repo: process.cwd() };
	for (let index = 0; index < rest.length; index += 1) {
		const arg = rest[index];
		if (arg === "--help" || arg === "-h") options.help = true;
		else if (VALUE_OPTIONS.has(arg)) {
			const value = rest[index + 1];
			if (!value || value.startsWith("--"))
				throw new Error(`${arg} requires a value.`);
			const key = arg === "--client-email" ? "clientEmail" : arg.slice(2);
			options[key] = value;
			index += 1;
		} else throw new Error(`Unknown contact option: ${arg}`);
	}
	if (command === "--help" || command === "-h" || command === undefined)
		options.help = true;
	options.repo = path.resolve(options.repo);
	return options;
}

function readEnvFile(envFile) {
	return fs.existsSync(envFile)
		? parseEnv(fs.readFileSync(envFile, "utf8"))
		: new Map();
}

/** Read-only preflight: candidate files and non-secret env metadata. */
export function auditContactForm({ repo }) {
	const files = [];
	const walk = (dir) => {
		if (!fs.existsSync(dir)) return;
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) walk(full);
			else if (/\.(tsx?|jsx?)$/.test(entry.name)) files.push(full);
		}
	};
	for (const root of ["app", "pages", "src/app", "src/pages", "src/components"])
		walk(path.join(repo, root));
	const hits = files.filter((file) =>
		/contact|enquir|booking|callback|resend|CONTACT_FORM_RECIPIENTS/i.test(
			fs.readFileSync(file, "utf8"),
		),
	);
	const envFile = path.join(repo, ".env.local");
	const env = readEnvFile(envFile);
	const envMode = fs.existsSync(envFile)
		? (fs.statSync(envFile).mode & 0o777).toString(8)
		: null;
	const ignored =
		fs.existsSync(envFile) &&
		spawnSync("git", ["check-ignore", "-q", ".env.local"], { cwd: repo })
			.status === 0;
	const localRecipients = String(env.get("CONTACT_FORM_RECIPIENTS") || "")
		.split(",")
		.map((value) => value.trim().toLowerCase())
		.filter(Boolean);
	return {
		framework: ["next.config.js", "next.config.mjs", "next.config.ts"].some(
			(name) => fs.existsSync(path.join(repo, name)),
		)
			? "Next.js"
			: "unconfirmed",
		guidance: ["AGENTS.md", "PRODUCT.md", "DESIGN.md"].filter((name) =>
			fs.existsSync(path.join(repo, name)),
		),
		candidateFiles: hits.map((file) => path.relative(repo, file)),
		envMetadata: {
			resendKeyConfigured: Boolean(env.get("RESEND_API_KEY")),
			recipientConfigured: Boolean(env.get("CONTACT_FORM_RECIPIENTS")),
			clientEmailConfigured: Boolean(env.get("AVERLO_CONTACT_CLIENT_EMAIL")),
			envLocalIgnored: ignored,
			envLocalMode: envMode,
			bobrykOnlyLocalRouting:
				localRecipients.length === 1 && localRecipients[0] === BOBRYK_EMAIL,
		},
	};
}

/**
 * Creates a domain-restricted `sending_access` Resend key with the owner-only
 * management credential and stores it in the project's ignored `.env.local`.
 */
export async function provisionProjectKey({ repo, project }) {
	const managerFile = path.join(os.homedir(), MANAGEMENT_TOKEN_PATH);
	const envFile = path.join(repo, ".env.local");
	if (!project || !/^[a-zA-Z0-9._-]+$/.test(project))
		throw new Error("Pass a safe --project value");
	if (!fs.existsSync(managerFile))
		throw new Error(`Management credential is missing at ${managerFile}`);
	if ((fs.statSync(managerFile).mode & 0o077) !== 0)
		throw new Error("Management credential permissions must be 600");
	ensureIgnored(repo);
	const current = readEnvFile(envFile);
	if (
		current.get("RESEND_API_KEY")?.startsWith("re_") &&
		current.get("AVERLO_RESEND_API_KEY_ID")
	) {
		return "Existing project sending credential retained.";
	}

	const token = fs.readFileSync(managerFile, "utf8").trim();
	if (!token.startsWith("re_"))
		throw new Error("Management credential has an invalid format");
	const base = process.env.RESEND_API_BASE || "https://api.resend.com";
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
		"User-Agent": "create-averlo-contact/1.0",
	};
	const domainsResponse = await fetch(`${base}/domains`, { headers });
	if (!domainsResponse.ok)
		throw new Error(`Resend domain lookup failed (${domainsResponse.status})`);
	const domainPayload = await domainsResponse.json();
	const domain = (domainPayload.data || domainPayload).find(
		(item) => item.name === "averlo.co" && item.status === "verified",
	);
	if (!domain)
		throw new Error("Verified averlo.co Resend domain was not found");
	const createResponse = await fetch(`${base}/api-keys`, {
		method: "POST",
		headers,
		body: JSON.stringify({
			name: `averlo-${project}`.slice(0, 50),
			permission: "sending_access",
			domain_id: domain.id,
		}),
	});
	if (!createResponse.ok)
		throw new Error(`Resend key creation failed (${createResponse.status})`);
	const created = await createResponse.json();
	if (!created.token?.startsWith("re_") || !created.id)
		throw new Error("Resend returned an incomplete project key");
	upsertEnv(envFile, {
		RESEND_API_KEY: created.token,
		AVERLO_RESEND_API_KEY_ID: created.id,
		CONTACT_FORM_RECIPIENTS: BOBRYK_EMAIL,
	});
	return "Project sending credential created; local recipient is Bobryk only.";
}

/**
 * Syncs the sending key and client+Bobryk recipients to Vercel Production only,
 * passing values through stdin. Local recipients stay Bobryk only.
 */
export function syncVercelContactEnv({ repo, clientEmail }) {
	const client = String(clientEmail || "")
		.trim()
		.toLowerCase();
	if (!validEmail(client)) throw new Error("Pass a valid --client-email");
	const envFile = path.join(repo, ".env.local");
	if (!fs.existsSync(envFile)) throw new Error(".env.local is missing");
	const key = readEnvFile(envFile).get("RESEND_API_KEY");
	if (!key?.startsWith("re_"))
		throw new Error("RESEND_API_KEY is missing or invalid");
	const vercel = process.env.VERCEL_BIN || "vercel";
	const messages = [];
	for (const [name, value] of [
		["RESEND_API_KEY", key],
		["CONTACT_FORM_RECIPIENTS", recipients(client).join(",")],
	]) {
		const result = spawnSync(
			vercel,
			["env", "add", name, "production", "--sensitive", "--yes", "--force"],
			{ cwd: repo, input: `${value}\n`, encoding: "utf8", env: process.env },
		);
		if (result.status !== 0)
			throw new Error(`Vercel Production sync failed for ${name}`);
		messages.push(`Synced ${name} to Vercel Production.`);
	}
	upsertEnv(envFile, {
		AVERLO_CONTACT_CLIENT_EMAIL: client,
		CONTACT_FORM_RECIPIENTS: BOBRYK_EMAIL,
	});
	messages.push("Local recipients remain Bobryk only.");
	return messages.join("\n");
}

export const CONTACT_HELP = `Usage: create-averlo contact audit [--repo <path>]
       create-averlo contact provision --project <vercel-project> [--repo <path>]
       create-averlo contact sync --client-email <email> [--repo <path>]

Operational steps of the template's contact-delivery workflow
(.specify/workflows/contact-delivery/). --repo defaults to the current directory.

  audit      Read-only: candidate contact files and non-secret .env.local metadata (JSON).
  provision  Create a domain-restricted Resend sending key with the owner-only
             management credential and store it in the ignored, mode-600
             .env.local with Bobryk-only local recipients. Keeps an existing
             project key. Credential: ~/${MANAGEMENT_TOKEN_PATH}
  sync       Push the sending key and client+Bobryk recipients to Vercel Production
             only, through stdin. Local recipients stay Bobryk only.

No command prints, logs or passes a secret value through arguments.`;

export async function runContact(argv) {
	const options = parseContactArgs(argv);
	if (options.help) return CONTACT_HELP;
	if (options.command === "audit")
		return JSON.stringify(auditContactForm(options), null, 2);
	if (options.command === "provision") return provisionProjectKey(options);
	if (options.command === "sync") return syncVercelContactEnv(options);
	throw new Error(
		`Unknown contact command: ${options.command}. Use audit, provision or sync.`,
	);
}
