import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const bin = fileURLToPath(new URL("../bin/create-averlo.mjs", import.meta.url));

test("subcommand help never reads owner configuration or credentials", async () => {
	const home = await fs.mkdtemp(path.join(os.tmpdir(), "create-averlo-cli-"));
	try {
		const help = (...args) =>
			execFileSync(process.execPath, [bin, ...args], {
				encoding: "utf8",
				env: { ...process.env, HOME: home },
			});
		assert.match(help("--help"), /create-averlo publish preflight\|config/);
		assert.match(help("contact", "--help"), /contact provision --project/);
		assert.match(help("contact"), /contact sync --client-email/);
		assert.match(help("publish", "preflight", "--help"), /prints only/);
		assert.match(help("publish"), /publish config/);
		assert.match(help("backport", "--help"), /backport fingerprint/);
		assert.deepEqual(await fs.readdir(home), []);
	} finally {
		await fs.rm(home, { recursive: true, force: true });
	}
});
