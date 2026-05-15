import { hrefFor } from "@/lib/routes";
import type { MarketingLink } from "./types";

export function getMarketingLinkHref(link: MarketingLink) {
	return link.href ?? hrefFor(link.routeId);
}
