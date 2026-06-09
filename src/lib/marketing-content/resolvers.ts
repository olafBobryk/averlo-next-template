import { fallbackHomePage, fallbackSiteLayout } from "./fallback";
import type {
	MarketingPageDocument,
	MarketingPageSlug,
	SiteLayoutDocument,
} from "./types";

export async function getMarketingPage(
	slug: MarketingPageSlug,
): Promise<MarketingPageDocument> {
	if (slug === "home") {
		return fallbackHomePage;
	}

	return fallbackHomePage;
}

export async function getSiteLayout(): Promise<SiteLayoutDocument> {
	return fallbackSiteLayout;
}
