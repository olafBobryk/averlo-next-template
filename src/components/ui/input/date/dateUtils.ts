import type {
	DateRangePresetKey,
	DateRangeValue,
	ISODateString,
} from "./types";

const ISO_DATE_PATTERN = /^(\d{4,})-(\d{2})-(\d{2})$/;

export const DATE_RANGE_PRESETS: readonly {
	key: DateRangePresetKey;
	label: string;
}[] = [
	{ key: "last_7_days", label: "Last 7 days" },
	{ key: "last_30_days", label: "Last 30 days" },
	{ key: "this_month", label: "This month" },
	{ key: "last_month", label: "Last month" },
];

export const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function parseISODate(value?: string | null) {
	if (!value) return null;
	const match = ISO_DATE_PATTERN.exec(value);
	if (!match) return null;

	const year = Number(match[1]);
	const monthIndex = Number(match[2]) - 1;
	const day = Number(match[3]);
	const date = new Date(0);
	date.setUTCHours(0, 0, 0, 0);
	date.setUTCFullYear(year, monthIndex, day);

	if (
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() !== monthIndex ||
		date.getUTCDate() !== day
	) {
		return null;
	}

	return date;
}

export function formatISODate(date: Date): ISODateString {
	const year = String(date.getUTCFullYear()).padStart(4, "0");
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	const day = String(date.getUTCDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function formatDisplayDate(value?: string | null) {
	const date = parseISODate(value);
	if (!date) return value ?? "";

	return new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "short",
		timeZone: "UTC",
		year: "numeric",
	}).format(date);
}

export function formatDisplayRange(range: DateRangeValue) {
	if (range.start === range.end) return formatDisplayDate(range.start);
	return `${formatDisplayDate(range.start)} - ${formatDisplayDate(range.end)}`;
}

export function getMonthLabel(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		timeZone: "UTC",
		year: "numeric",
	}).format(date);
}

export function getMonthName(monthIndex: number) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		timeZone: "UTC",
	}).format(new Date(Date.UTC(2026, monthIndex, 1)));
}

export function startOfMonth(date: Date) {
	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function addDays(date: Date, amount: number) {
	const next = new Date(date);
	next.setUTCDate(next.getUTCDate() + amount);
	return next;
}

export function addMonths(date: Date, amount: number) {
	return new Date(
		Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1),
	);
}

export function addYears(date: Date, amount: number) {
	return new Date(
		Date.UTC(date.getUTCFullYear() + amount, date.getUTCMonth(), 1),
	);
}

export function getCalendarDays(monthDate: Date) {
	const monthStart = startOfMonth(monthDate);
	const mondayOffset = (monthStart.getUTCDay() + 6) % 7;
	const gridStart = addDays(monthStart, -mondayOffset);
	return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

export function sortDateRange(
	first: ISODateString,
	second: ISODateString,
): DateRangeValue {
	return first <= second
		? { end: second, start: first }
		: { end: first, start: second };
}

export function isDateInBounds(
	value: ISODateString,
	min?: ISODateString,
	max?: ISODateString,
) {
	if (min && value < min) return false;
	if (max && value > max) return false;
	return true;
}

export function getTodayISO() {
	return formatISODate(new Date());
}

export function resolveDateRangePreset(
	preset: DateRangePresetKey,
	todayValue = getTodayISO(),
): DateRangeValue {
	const today = parseISODate(todayValue) ?? new Date();

	switch (preset) {
		case "last_7_days":
			return {
				end: formatISODate(today),
				start: formatISODate(addDays(today, -6)),
			};
		case "last_30_days":
			return {
				end: formatISODate(today),
				start: formatISODate(addDays(today, -29)),
			};
		case "this_month":
			return {
				end: formatISODate(today),
				start: formatISODate(startOfMonth(today)),
			};
		case "last_month": {
			const start = addMonths(startOfMonth(today), -1);
			return {
				end: formatISODate(addDays(addMonths(start, 1), -1)),
				start: formatISODate(start),
			};
		}
	}
}

export function normalizeDateRange(value?: DateRangeValue | null) {
	if (!value) return null;
	if (!parseISODate(value.start) || !parseISODate(value.end)) return null;
	return sortDateRange(value.start, value.end);
}

export function getMatchingDateRangePreset(
	range: DateRangeValue | null,
	presets: readonly DateRangePresetKey[],
	todayValue: ISODateString,
) {
	if (!range) return null;
	return (
		presets.find((preset) => {
			const resolved = resolveDateRangePreset(preset, todayValue);
			return resolved.start === range.start && resolved.end === range.end;
		}) ?? null
	);
}
