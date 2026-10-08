import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

await mkdir("node_modules/.cache", { recursive: true });
const directory = await mkdtemp(
	join(process.cwd(), "node_modules/.cache/averlo-assistant-"),
);
try {
	const outfile = join(directory, "runtime.mjs");
	await build({
		entryPoints: ["scripts/verify/assistant-runtime-cases.ts"],
		outfile,
		bundle: true,
		platform: "node",
		format: "esm",
		packages: "external",
		plugins: [
			{
				name: "server-only-marker",
				setup(builder) {
					builder.onResolve(
						{ filter: /^@\/lib\/assistant\/(access.server|server)$/ },
						() => ({
							path: join(
								process.cwd(),
								"scripts/verify/assistant-route-test-adapters.ts",
							),
						}),
					);
					builder.onResolve({ filter: /^server-only$/ }, () => ({
						path: "server-only",
						namespace: "marker",
					}));
					builder.onLoad({ filter: /.*/, namespace: "marker" }, () => ({
						contents: "",
						loader: "js",
					}));
				},
			},
		],
	});
	await import(pathToFileURL(outfile).href);
} finally {
	await rm(directory, { recursive: true, force: true });
}
