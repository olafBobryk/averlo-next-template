// components/ui/input/DateRangeInput.tsx
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: trigger behavior is handled by the nested button and dropdown keyboard handling */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: trigger wrapper forwards interaction to the nested button and dropdown state */
"use client";

import * as React from "react";
import { focusRing } from "../foundations/focus";
import { Dropdown } from "../primitives/Dropdown";
import { InputFrame, inputSizeClasses } from "../primitives/InputFrame";
import { Listbox } from "../primitives/Listbox";
import { Text } from "../primitives/Text";

const APP_TIMEZONE = process.env.NEXT_PUBLIC_APP_TIMEZONE || "Europe/Amsterdam";

export type DateRange<TValue = Date> = {
	start: TValue;
	end: TValue;
};

export type DateRangePresetKey =
	| "all_time"
	| "last_7_days"
	| "last_30_days"
	| "this_month"
	| "last_month";

export type DateRangeSelection<
	TValue = Date,
	TPreset extends string = DateRangePresetKey | "custom",
> = {
	preset: TPreset;
	range: DateRange<TValue> | null;
};

export type DateRangeInputProps = {
	value?: DateRange;
	// range can be null for "All time"
	onChange?: (
		range: DateRange | null,
		preset: DateRangePresetKey | "custom",
	) => void;
	className?: string;
	resetSignal?: number; // ⬅ bump this from parent to reset
	resetTo?: DateRangePresetKey; // ⬅ optional, default "last_30_days"
};

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
	timeZone: APP_TIMEZONE,
});

function formatDate(date: Date): string {
	return DATE_FMT.format(date);
}

function formatRange(range: DateRange): string {
	return `${formatDate(range.start)} - ${formatDate(range.end)}`;
}

function startOfDay(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getToday(): Date {
	const now = new Date();
	return startOfDay(now);
}

function addDays(date: Date, days: number) {
	const d = new Date(date);
	d.setDate(d.getDate() + days);
	return d;
}

function getPresetRange(key: DateRangePresetKey): DateRange {
	const today = getToday();

	switch (key) {
		case "all_time": {
			// fixed earliest date: Jan 1, 2025
			const start = new Date(2025, 0, 1); // months 0-indexed
			const end = today;
			return { start, end };
		}
		case "last_7_days": {
			const end = today;
			const start = addDays(end, -6);
			return { start, end };
		}
		case "last_30_days": {
			const end = today;
			const start = addDays(end, -29);
			return { start, end };
		}
		case "this_month": {
			const end = today;
			const start = new Date(today.getFullYear(), today.getMonth(), 1);
			return { start, end };
		}
		case "last_month": {
			const month = today.getMonth();
			const year = today.getFullYear();
			const start =
				month === 0 ? new Date(year - 1, 11, 1) : new Date(year, month - 1, 1);
			const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
			return { start, end };
		}
	}
}

const PRESETS: { key: DateRangePresetKey; label: string }[] = [
	{ key: "all_time", label: "All time" },
	{ key: "last_7_days", label: "Last 7 days" },
	{ key: "last_30_days", label: "Last 30 days" },
	{ key: "this_month", label: "This month" },
	{ key: "last_month", label: "Last month" },
];

// parse dd/mm/yyyy
function parseDdMmYyyy(value: string): Date | null {
	const [dd, mm, yyyy] = value.split("/").map((v) => v.trim());
	if (!dd || !mm || !yyyy) return null;
	const day = Number(dd);
	const monthIndex = Number(mm) - 1;
	const year = Number(yyyy);
	if (
		Number.isNaN(day) ||
		Number.isNaN(monthIndex) ||
		Number.isNaN(year) ||
		monthIndex < 0 ||
		monthIndex > 11
	) {
		return null;
	}
	const d = new Date(year, monthIndex, day);
	if (
		d.getFullYear() !== year ||
		d.getMonth() !== monthIndex ||
		d.getDate() !== day
	) {
		return null;
	}
	return d;
}

function isSameDay(a: Date, b: Date) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

function isSameRange(a: DateRange, b: DateRange) {
	return isSameDay(a.start, b.start) && isSameDay(a.end, b.end);
}

function getPresetKeyForRange(range: DateRange): DateRangePresetKey | "custom" {
	for (const preset of PRESETS) {
		const presetRange = getPresetRange(preset.key);
		if (isSameRange(range, presetRange)) {
			return preset.key;
		}
	}
	return "custom";
}

export function DateRangeInput({
	value,
	onChange,
	className,
	resetSignal,
	resetTo = "last_30_days",
}: DateRangeInputProps) {
	// This is just the dropdown's internal "selection"; parent can override via `value`.
	const [preset, setPreset] = React.useState<DateRangePresetKey | "custom">(
		"last_30_days",
	);
	const [range, setRange] = React.useState<DateRange>(
		() => value ?? getPresetRange("last_30_days"),
	);
	const [startInput, setStartInput] = React.useState<string>("");
	const [endInput, setEndInput] = React.useState<string>("");
	const [menuOpen, setMenuOpen] = React.useState(false);
	const [activeIndex, setActiveIndex] = React.useState(0);
	const listRef = React.useRef<HTMLDivElement | null>(null);
	const startInputRef = React.useRef<HTMLInputElement | null>(null);
	const endInputRef = React.useRef<HTMLInputElement | null>(null);
	const listId = React.useId();

	// sync external value if provided
	React.useEffect(() => {
		if (!value) {
			// Parent is effectively in "All time" mode (null in filter, undefined here)
			const allRange = getPresetRange("all_time");
			setRange(allRange);
			setPreset("all_time");
			return;
		}

		setRange(value);
		const inferred = getPresetKeyForRange(value);
		setPreset(inferred);
	}, [value]);

	// update inputs when range changes
	React.useEffect(() => {
		const start = range.start;
		const end = range.end;
		const pad = (n: number) => (n < 10 ? `0${n}` : String(n));

		setStartInput(
			`${pad(start.getDate())}/${pad(start.getMonth() + 1)}/${start.getFullYear()}`,
		);
		setEndInput(
			`${pad(end.getDate())}/${pad(end.getMonth() + 1)}/${end.getFullYear()}`,
		);
	}, [range]);

	React.useEffect(() => {
		if (resetSignal === undefined) return;

		const nextRange = getPresetRange(resetTo);
		setPreset(resetTo);
		setRange(nextRange);
		setStartInput("");
		setEndInput("");
	}, [resetSignal, resetTo]);

	React.useEffect(() => {
		if (!menuOpen) return;
		const selectedIndex =
			preset === "custom"
				? 0
				: Math.max(0, PRESETS.findIndex((item) => item.key === preset) + 1);
		setActiveIndex(selectedIndex);
	}, [menuOpen, preset]);

	React.useEffect(() => {
		if (!menuOpen) return;
		const option = listRef.current?.querySelector<HTMLElement>(
			`[data-option-index="${activeIndex}"]`,
		);
		option?.scrollIntoView({ block: "nearest" });
	}, [activeIndex, menuOpen]);

	const currentRangeLabel = formatRange(range);
	const currentPresetLabel =
		preset === "custom"
			? "Custom range"
			: (PRESETS.find((p) => p.key === preset)?.label ?? "Custom range");

	const handlePresetClick = (p: DateRangePresetKey, close: () => void) => {
		const newRange = getPresetRange(p);
		setPreset(p);
		setRange(newRange);

		if (p === "all_time") {
			// All time corresponds to no explicit range filter on the parent → null
			onChange?.(null, "all_time");
		} else {
			onChange?.(newRange, p);
		}

		close();
	};

	const handleApplyCustom = React.useCallback(
		(close?: () => void) => {
			const start = parseDdMmYyyy(startInput);
			const end = parseDdMmYyyy(endInput);
			if (!start || !end || end < start) {
				// minimal guard; in real life you might show error
				return;
			}
			const newRange: DateRange = {
				start: startOfDay(start),
				end: startOfDay(end),
			};
			setRange(newRange);
			setPreset("custom");
			onChange?.(newRange, "custom");
			close?.();
		},
		[endInput, onChange, startInput],
	);

	const listboxOptions = React.useMemo(() => {
		return [
			{
				key: "custom",
				value: "custom" as const,
				selected: preset === "custom",
				unwrapped: true,
				className: "!items-stretch !gap-3 !py-3",
				content: (
					<div className="flex w-full flex-col gap-2.5">
						<div className="flex min-w-0 items-center justify-between gap-3">
							<Text as="span" variant="bodyStrong">
								Custom range
							</Text>
							<Text
								as="span"
								variant="caption"
								tone="muted"
								className="truncate text-right"
							>
								{currentRangeLabel}
							</Text>
						</div>
						<div className="flex gap-2">
							<input
								ref={startInputRef}
								type="text"
								value={startInput}
								onChange={(e) => setStartInput(e.target.value)}
								placeholder="Start"
								onKeyDown={(event) => {
									if (event.key !== "Enter") return;
									event.preventDefault();
									endInputRef.current?.focus({ preventScroll: true });
								}}
								className={[
									"flex-1 rounded-lg border border-border/15 bg-white px-2 py-1 text-xs text-foreground outline-none transition-colors motion-micro",
									focusRing.visibleDefault,
								].join(" ")}
							/>
							<input
								ref={endInputRef}
								type="text"
								value={endInput}
								onChange={(e) => setEndInput(e.target.value)}
								placeholder="End"
								onKeyDown={(event) => {
									if (event.key !== "Enter") return;
									event.preventDefault();
									handleApplyCustom();
								}}
								onBlur={() => {
									handleApplyCustom();
								}}
								className={[
									"flex-1 rounded-lg border border-border/15 bg-white px-2 py-1 text-xs text-foreground outline-none transition-colors motion-micro",
									focusRing.visibleDefault,
								].join(" ")}
							/>
						</div>
					</div>
				),
			},
			...PRESETS.map((presetOption) => ({
				key: presetOption.key,
				value: presetOption.key,
				selected: preset === presetOption.key,
				content: (
					<Text as="span" variant="body">
						{presetOption.label}
					</Text>
				),
			})),
		];
	}, [currentRangeLabel, endInput, handleApplyCustom, preset, startInput]);

	const activeOptionId =
		menuOpen && listboxOptions[activeIndex]
			? `${listId}-option-${activeIndex}`
			: undefined;

	const updateActiveIndex = React.useCallback(
		(nextIndex: number) => {
			if (listboxOptions.length === 0) return;
			const safeIndex =
				(nextIndex + listboxOptions.length) % listboxOptions.length;
			setActiveIndex(safeIndex);
		},
		[listboxOptions.length],
	);

	const focusCustomStart = React.useCallback(() => {
		requestAnimationFrame(() => {
			startInputRef.current?.focus({ preventScroll: true });
		});
	}, []);

	return (
		<Dropdown
			className={className}
			onOpenChange={setMenuOpen}
			renderTrigger={({
				ref,
				chevronIcon,
				onRootMouseEnter,
				onRootMouseLeave,
				openMenu,
				closeMenu,
				isOpen,
			}) => (
				<InputFrame
					ref={ref as React.Ref<HTMLDivElement>}
					onMouseEnter={onRootMouseEnter}
					onMouseLeave={onRootMouseLeave}
					className={[
						"w-fit max-w-full cursor-pointer",
						inputSizeClasses.md,
						className,
					]
						.filter(Boolean)
						.join(" ")}
				>
					<button
						type="button"
						onClick={() => {
							if (isOpen) {
								closeMenu({ restoreFocus: false });
								return;
							}
							openMenu({ focusMenu: true });
						}}
						className="flex min-w-0 w-full items-center justify-between gap-4 bg-transparent p-0 text-left motion-micro outline-none ring-0 shadow-none"
					>
						<Text
							as="span"
							variant="bodyStrong"
							className="min-w-0 flex-1 truncate !leading-[17px]"
						>
							{currentRangeLabel}
						</Text>
						<span className="flex shrink-0 items-center gap-2 text-foreground/70">
							<Text
								as="span"
								variant="caption"
								tone="muted"
								className="!leading-[17px] whitespace-nowrap"
							>
								{currentPresetLabel}
							</Text>
							{chevronIcon}
						</span>
					</button>
				</InputFrame>
			)}
			renderMenu={({ close }) => (
				<Listbox
					options={listboxOptions}
					activeIndex={activeIndex}
					onActiveIndexChange={setActiveIndex}
					onSelect={(option) => {
						if (option.value === "custom") {
							setPreset("custom");
							focusCustomStart();
							return;
						}
						handlePresetClick(option.value as DateRangePresetKey, close);
					}}
					listRef={listRef}
					listId={listId}
					optionIdPrefix={`${listId}-option`}
					listTabIndex={0}
					ariaActivedescendant={activeOptionId}
					onKeyDown={(event) => {
						const target = event.target as HTMLElement;
						if (target.closest("input,textarea,select")) return;
						if (event.key === "ArrowDown") {
							event.preventDefault();
							updateActiveIndex(activeIndex + 1);
							return;
						}
						if (event.key === "ArrowUp") {
							event.preventDefault();
							updateActiveIndex(activeIndex - 1);
							return;
						}
						if (event.key === "Home") {
							event.preventDefault();
							setActiveIndex(0);
							return;
						}
						if (event.key === "End") {
							event.preventDefault();
							setActiveIndex(listboxOptions.length - 1);
							return;
						}
						if (event.key === "Enter" || event.key === " ") {
							event.preventDefault();
							const option = listboxOptions[activeIndex];
							if (!option) return;
							if (option.value === "custom") {
								setPreset("custom");
								focusCustomStart();
								return;
							}
							handlePresetClick(option.value as DateRangePresetKey, close);
						}
					}}
					className={["outline-none", focusRing.visibleDefault]
						.filter(Boolean)
						.join(" ")}
				/>
			)}
		/>
	);
}
