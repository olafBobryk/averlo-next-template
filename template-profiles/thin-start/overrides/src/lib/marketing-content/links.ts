import { hrefFor } from "@/lib/routes";
import type { MarketingLink } from "./types";

export function getMarketingLinkHref(link: MarketingLink) {
	if (link.routeId) {
		return hrefFor(link.routeId);
	}

	return link.href;
}
