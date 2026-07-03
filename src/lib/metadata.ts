import type { Metadata } from "next";
import {
	type StaticPageMetadataConfig,
	type StaticPageMetadataKey,
	siteMetadata,
	staticPageMetadata,
} from "@/config/metadataConfig";

type PageMetadataInput = StaticPageMetadataConfig & {
	noIndex?: boolean;
};

function getMetadataBase() {
	if (!siteMetadata.baseUrl) return undefined;

	try {
		return new URL(siteMetadata.baseUrl);
	} catch {
		return undefined;
	}
}

function getAbsoluteUrl(path: string) {
	const metadataBase = getMetadataBase();
	return metadataBase ? new URL(path, metadataBase).toString() : undefined;
}

function createTitle(value: { absoluteTitle?: boolean; title: string }) {
	return value.absoluteTitle ? { absolute: value.title } : value.title;
}

export function createRootMetadata(): Metadata {
	const metadataBase = getMetadataBase();

	return {
		...(metadataBase ? { metadataBase } : {}),
		title: {
			default: siteMetadata.name,
			template: `%s | ${siteMetadata.name}`,
		},
		description: siteMetadata.defaultDescription,
		keywords: [...siteMetadata.keywords],
		icons: siteMetadata.icons,
		manifest: siteMetadata.manifest,
		robots: {
			index: true,
			follow: true,
		},
		openGraph: {
			type: "website",
			siteName: siteMetadata.name,
			title: siteMetadata.name,
			description: siteMetadata.defaultDescription,
			...(metadataBase ? { url: metadataBase.toString() } : {}),
		},
		twitter: {
			card: "summary",
			title: siteMetadata.name,
			description: siteMetadata.defaultDescription,
		},
	};
}

export function createPageMetadata({
	absoluteTitle,
	description,
	noIndex = false,
	path,
	title,
}: PageMetadataInput): Metadata {
	const canonicalUrl = getAbsoluteUrl(path);

	return {
		title: createTitle({ absoluteTitle, title }),
		description,
		alternates: {
			canonical: path,
		},
		robots: {
			index: !noIndex,
			follow: !noIndex,
		},
		openGraph: {
			title,
			description,
			siteName: siteMetadata.name,
			...(canonicalUrl ? { url: canonicalUrl } : {}),
		},
		twitter: {
			card: "summary",
			title,
			description,
		},
	};
}

export function createStaticPageMetadata(key: StaticPageMetadataKey): Metadata {
	return createPageMetadata(staticPageMetadata[key]);
}
