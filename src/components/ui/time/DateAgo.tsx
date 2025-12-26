// components/ui/DateAgo.tsx
"use client";

import * as React from "react";
import { Text, type TextProps } from "@/components/ui/primitives/Text";

type DateInput = string | Date | null | undefined;

type DateAgoProps = Omit<TextProps, "children" | "as"> & {
	date: DateInput;
	leadingText?: React.ReactNode;
	trailingText?: React.ReactNode;
	placeholder?: React.ReactNode;
	updateIntervalMs?: number;
};

function toDate(value: DateInput): Date | null {
	if (!value) return null;
	if (value instanceof Date)
		return Number.isNaN(value.getTime()) ? null : value;
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? null : d;
}

function formatAgo(msDiff: number): string {
	const isFuture = msDiff < 0;
	const abs = Math.abs(msDiff);

	const minute = 60_000;
	const hour = 60 * minute;
	const day = 24 * hour;

	const plural = (n: number, unit: string) =>
		`${n} ${unit}${n === 1 ? "" : "s"}`;

	if (abs < minute) return isFuture ? "in moments" : "just now";

	if (abs < hour) {
		const m = Math.floor(abs / minute);
		return isFuture
			? `in ${plural(m, "minute")}`
			: `${plural(m, "minute")} ago`;
	}

	if (abs < day) {
		const h = Math.floor(abs / hour);
		return isFuture ? `in ${plural(h, "hour")}` : `${plural(h, "hour")} ago`;
	}

	const d = Math.floor(abs / day);
	return isFuture ? `in ${plural(d, "day")}` : `${plural(d, "day")} ago`;
}

export function DateAgo({
	date,
	leadingText,
	trailingText,
	placeholder = "—",
	updateIntervalMs = 60_000,
	...textProps
}: DateAgoProps) {
	const parsed = React.useMemo(() => toDate(date), [date]);
	const [, force] = React.useReducer((x) => x + 1, 0);

	React.useEffect(() => {
		if (!parsed) return;
		const id = window.setInterval(() => force(), updateIntervalMs);
		return () => window.clearInterval(id);
	}, [parsed, updateIntervalMs]);

	const value = parsed ? formatAgo(Date.now() - parsed.getTime()) : null;

	return (
		<Text as="p" {...(textProps as any)}>
			{leadingText ?? null}
			{value ?? placeholder}
			{trailingText ?? null}
		</Text>
	);
}
