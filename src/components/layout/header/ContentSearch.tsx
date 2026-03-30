"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getVisibleDemoPages } from "@/app/demo/content";
import {
	type ComboboxOption,
	ComboboxTextInput,
} from "@/components/ui/input/ComboboxTextInput";
import type { InputFrameSize } from "@/components/ui/primitives/InputFrame";
import { NAV_LINKS } from "@/config/navConfig";

type HeaderLink = {
	name: string;
	link: string;
};

function buildSearchOptions(navLinks: HeaderLink[]): ComboboxOption[] {
	const options: ComboboxOption[] = [];
	const seen = new Set<string>();

	function addOption(id: string, label: string, href: string) {
		if (seen.has(href)) return;
		seen.add(href);
		options.push({
			id,
			label,
			value: href,
		});
	}

	for (const link of navLinks) {
		addOption(`nav-${link.link}`, link.name, link.link);
	}

	for (const page of getVisibleDemoPages()) {
		addOption(
			`demo-${page.id}`,
			`Demo: ${page.title}`,
			`/demo/${page.slug.join("/")}`,
		);
	}

	return options;
}

type ContentSearchProps = {
	className?: string;
	fieldClassName?: string;
	onNavigate?: () => void;
	portalTargetId?: string;
	size?: InputFrameSize;
	inputClassName?: string;
	navLinks?: HeaderLink[];
};

export default function ContentSearch({
	className,
	fieldClassName,
	onNavigate,
	portalTargetId,
	size,
	inputClassName,
	navLinks = NAV_LINKS,
}: ContentSearchProps) {
	const router = useRouter();
	const [query, setQuery] = useState("");
	const options = buildSearchOptions(navLinks);

	function navigate(href: string) {
		setQuery("");
		router.push(href);
		onNavigate?.();
	}

	function handleSelect(option: ComboboxOption) {
		navigate(option.value ?? option.label);
	}

	return (
		<ComboboxTextInput
			label={<span className="sr-only">Search pages</span>}
			fieldClassName={fieldClassName}
			className={className}
			size={size}
			inputClassName={inputClassName}
			placeholder="Search pages"
			options={options}
			value={query}
			onChange={setQuery}
			filterOption={(currentQuery, option) => {
				const normalizedQuery = currentQuery.trim().toLowerCase();
				if (!normalizedQuery) return false;
				return (
					option.label.toLowerCase().includes(normalizedQuery) ||
					(option.value ?? "").toLowerCase().includes(normalizedQuery)
				);
			}}
			openOnChevronClick={false}
			showResultsOnEmptyQuery={false}
			hideNoResults
			onSelect={handleSelect}
			portalTargetId={portalTargetId}
			noResultsText="No matching pages"
		/>
	);
}
