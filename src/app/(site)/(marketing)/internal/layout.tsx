import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

const CANONICAL_TEMPLATE_PRODUCTION_HOSTS = new Set([
	"verilo-next-template.vercel.app",
]);
const INTERNAL_ROUTES_ENABLED_VALUES = new Set(["1", "true", "yes", "enabled"]);

export const metadata: Metadata = {
	robots: {
		index: false,
		follow: false,
	},
};

function normalizeHost(value: string | undefined) {
	return value
		?.replace(/^https?:\/\//, "")
		.replace(/\/$/, "")
		.toLowerCase();
}

async function areInternalRoutesAllowedInProduction() {
	const explicitSetting = process.env.TEMPLATE_INTERNAL_ROUTES?.toLowerCase();

	if (explicitSetting && INTERNAL_ROUTES_ENABLED_VALUES.has(explicitSetting)) {
		return true;
	}

	const productionHost = normalizeHost(
		process.env.VERCEL_PROJECT_PRODUCTION_URL,
	);
	const requestHost = normalizeHost((await headers()).get("host") ?? undefined);

	return (
		CANONICAL_TEMPLATE_PRODUCTION_HOSTS.has(productionHost ?? "") ||
		CANONICAL_TEMPLATE_PRODUCTION_HOSTS.has(requestHost ?? "")
	);
}

export default async function DevOnlyInternalMarketingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	if (
		process.env.NODE_ENV === "production" &&
		!(await areInternalRoutesAllowedInProduction())
	) {
		notFound();
	}

	return children;
}
