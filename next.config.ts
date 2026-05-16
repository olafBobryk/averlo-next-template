import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const getDevIsolationConfig = (
	phase: string,
): Pick<NextConfig, "distDir" | "typescript"> => {
	if (phase !== PHASE_DEVELOPMENT_SERVER) {
		return {};
	}

	const distDir = process.env.NEXT_DEV_DIST_DIR;
	const tsconfigPath = process.env.NEXT_DEV_TSCONFIG_PATH;

	if (!distDir) {
		return {};
	}

	const isValidUserDistDir =
		distDir === ".next-user" || /^\.next-user-\d{4}$/.test(distDir);
	const isValidAgentDistDir = /^\.next-agent-\d{4}$/.test(distDir);

	if (!isValidUserDistDir && !isValidAgentDistDir) {
		throw new Error(
			"NEXT_DEV_DIST_DIR must be .next-user, .next-user-<port>, or .next-agent-<port>.",
		);
	}

	if (!tsconfigPath) {
		throw new Error(
			"NEXT_DEV_TSCONFIG_PATH is required when NEXT_DEV_DIST_DIR is set.",
		);
	}

	const expectedTsconfigPath = `tsconfig${distDir}.json`;

	if (tsconfigPath !== expectedTsconfigPath) {
		throw new Error(
			`NEXT_DEV_TSCONFIG_PATH must be ${expectedTsconfigPath} for ${distDir}.`,
		);
	}

	return {
		distDir,
		typescript: {
			tsconfigPath,
		},
	};
};

const shouldEnableCodeInspector = (phase: string) =>
	phase === PHASE_DEVELOPMENT_SERVER && process.env.NODE_ENV === "development";

const getCodeInspectorRules = (phase: string) => {
	if (!shouldEnableCodeInspector(phase)) {
		return {};
	}

	const { codeInspectorPlugin } =
		require("code-inspector-plugin") as typeof import("code-inspector-plugin");

	return codeInspectorPlugin({
		bundler: "turbopack",
		dev: true,
		editor: "code",
		launchType: "open",
		printServer: true,
	});
};

const createNextConfig = (phase: string): NextConfig => ({
	...getDevIsolationConfig(phase),
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.example.com",
			},
		],
	},
	turbopack: {
		rules: getCodeInspectorRules(phase),
	},
});

const createPayloadNextConfig = (phase: string) =>
	withPayload(createNextConfig(phase));

export default createPayloadNextConfig;
