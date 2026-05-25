#!/usr/bin/env node

import process from "node:process";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

const commands = [
	"uv tool install serena-agent",
	"serena project index .",
	"serena project health-check .",
];

if (dryRun) {
	console.log("Template Intelligence Serena setup dry run");
	for (const command of commands) {
		console.log(`- ${command}`);
	}
	console.log("Serena remains user-local and is not a repo dependency.");
	process.exit(0);
}

console.log(`Serena is optional and user-local.

Run the setup commands manually when you want semantic code navigation:

${commands.map((command) => `  ${command}`).join("\n")}

After the local project server is available, query it with:

POST /query_project
{"query":"Find the symbols and references relevant to <task> after reading the Template Intelligence task-map starting files."}
`);
