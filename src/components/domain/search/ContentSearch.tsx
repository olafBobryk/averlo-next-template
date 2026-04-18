"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	type ComboboxOption,
	ComboboxTextInput,
} from "@/components/ui/input/ComboboxTextInput";
import type { InputFrameSize } from "@/components/ui/primitives/InputFrame";

export type ContentSearchEntry = {
	id: string;
	label: string;
	href: string;
};

export type ContentSearchFieldProps = {
	className?: string;
};

export type ContentSearchInputProps = {
	className?: string;
	textClassName?: string;
	size?: InputFrameSize;
	placeholder?: string;
	noResultsText?: string;
};

type ContentSearchProps = {
	entries: ContentSearchEntry[];
	onNavigate?: () => void;
	portalTargetId?: string;
	field?: ContentSearchFieldProps;
	input?: ContentSearchInputProps;
};

function toOptions(entries: ContentSearchEntry[]): ComboboxOption[] {
	return entries.map((entry) => ({
		id: entry.id,
		label: entry.label,
		value: entry.href,
	}));
}

export function ContentSearch({
	entries,
	onNavigate,
	portalTargetId,
	field,
	input,
}: ContentSearchProps) {
	const router = useRouter();
	const [query, setQuery] = useState("");
	const options = toOptions(entries);

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
			fieldClassName={field?.className}
			className={input?.className}
			size={input?.size}
			inputClassName={input?.textClassName}
			placeholder={input?.placeholder ?? "Search pages"}
			options={options}
			value={query}
			onChange={setQuery}
			hideDropdown={(currentQuery) => currentQuery.trim().length === 0}
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
			noResultsText={input?.noResultsText ?? "No matching pages"}
		/>
	);
}
