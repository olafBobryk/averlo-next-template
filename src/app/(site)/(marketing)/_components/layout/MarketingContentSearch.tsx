"use client";

import { getVisibleDemoPages } from "@/app/(site)/(marketing)/(internal)/demo/content";
import {
	ContentSearch,
	type ContentSearchEntry,
	type ContentSearchFieldProps,
	type ContentSearchInputProps,
} from "@/components/domain/search/ContentSearch";
import { getMarketingLinkHref } from "@/lib/marketing-content/links";
import type { MarketingNavLink } from "@/lib/marketing-content/types";

type MarketingContentSearchProps = {
	navLinks: MarketingNavLink[];
	onNavigate?: () => void;
	portalTargetId?: string;
	field?: ContentSearchFieldProps;
	input?: ContentSearchInputProps;
};

function getMarketingSearchEntries(
	navLinks: MarketingNavLink[],
): ContentSearchEntry[] {
	const entries: ContentSearchEntry[] = [];
	const seen = new Set<string>();

	function addEntry(entry: ContentSearchEntry) {
		if (seen.has(entry.href)) return;
		seen.add(entry.href);
		entries.push(entry);
	}

	for (const link of navLinks) {
		const href = getMarketingLinkHref(link);

		addEntry({
			id: `nav-${href}`,
			label: link.label,
			href,
		});

		for (const section of link.sections ?? []) {
			const sectionHref = getMarketingLinkHref(section);

			addEntry({
				id: `section-${sectionHref}`,
				label: section.label,
				href: sectionHref,
			});
		}
	}

	for (const page of getVisibleDemoPages()) {
		addEntry({
			id: `demo-${page.id}`,
			label: `Demo: ${page.title}`,
			href: `/demo/${page.slug.join("/")}`,
		});
	}

	addEntry({
		id: "playground-motion-reveal-root",
		label: "Playground: Reveal Group Scheduler",
		href: "/internal/playground/motion/reveal-root",
	});

	return entries;
}

export default function MarketingContentSearch({
	navLinks,
	onNavigate,
	portalTargetId,
	field,
	input,
}: MarketingContentSearchProps) {
	return (
		<ContentSearch
			entries={getMarketingSearchEntries(navLinks)}
			onNavigate={onNavigate}
			portalTargetId={portalTargetId}
			field={field}
			input={input}
		/>
	);
}
