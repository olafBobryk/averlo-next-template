import { spawnSync } from "node:child_process";

const shouldGenerateSitemap =
	process.env.GENERATE_SITEMAP === "1" ||
	process.env.GENERATE_SITEMAP === "true" ||
	process.env.VERCEL_ENV === "production";

if (!shouldGenerateSitemap) {
	console.log(
		"Skipping sitemap generation. Set GENERATE_SITEMAP=1 to run next-sitemap.",
	);
	process.exit(0);
}

const result = spawnSync("npx", ["next-sitemap"], {
	stdio: "inherit",
	shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
