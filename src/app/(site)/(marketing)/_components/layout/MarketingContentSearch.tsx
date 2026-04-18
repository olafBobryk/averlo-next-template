"use client";

import { getVisibleDemoPages } from "@/app/(site)/(marketing)/(internal)/demo/content";
import {
	ContentSearch,
	type ContentSearchEntry,
	type ContentSearchFieldProps,
	type ContentSearchInputProps,
} from "@/components/domain/search/ContentSearch";
import { hrefFor } from "@/lib/routes";
import { MARKETING_NAV_LINKS } from "./marketingNav";

type MarketingContentSearchProps = {
	onNavigate?: () => void;
	portalTargetId?: string;
	field?: ContentSearchFieldProps;
	input?: ContentSearchInputProps;
};

function getMarketingSearchEntries(): ContentSearchEntry[] {
	const entries: ContentSearchEntry[] = [];
	const seen = new Set<string>();

	function addEntry(entry: ContentSearchEntry) {
		if (seen.has(entry.href)) return;
		seen.add(entry.href);
		entries.push(entry);
	}

	for (const link of MARKETING_NAV_LINKS) {
		addEntry({
			id: `nav-${link.routeId}`,
			label: link.name,
			href: hrefFor(link.routeId),
		});
	}

	for (const page of getVisibleDemoPages()) {
		addEntry({
			id: `demo-${page.id}`,
			label: `Demo: ${page.title}`,
			href: `/demo/${page.slug.join("/")}`,
		});
	}

	return entries;
}

export default function MarketingContentSearch({
	onNavigate,
	portalTargetId,
	field,
	input,
}: MarketingContentSearchProps) {
	return (
		<ContentSearch
			entries={getMarketingSearchEntries()}
			onNavigate={onNavigate}
			portalTargetId={portalTargetId}
			field={field}
			input={input}
		/>
	);
}
