// components/ui/DateRangeDropdown.tsx
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
"use client";

import * as React from "react";
import { Dropdown } from "../primitives/Dropdown";
import { InputFrame } from "../primitives/InputFrame";
import { Icon } from "../primitives/Icon";
import { Text } from "../primitives/Text";

const APP_TIMEZONE = process.env.NEXT_PUBLIC_APP_TIMEZONE || "Europe/Amsterdam";

export type DateRange = {
	start: Date;
	end: Date;
};

type PresetKey =
	| "all_time"
	| "last_7_days"
	| "last_30_days"
	| "this_month"
	| "last_month";

type DateRangeDropdownProps = {
	value?: DateRange;
	// range can be null for "All time"
	onChange?: (range: DateRange | null, preset: PresetKey | "custom") => void;
	className?: string;
	resetSignal?: number; // ⬅ bump this from parent to reset
	resetTo?: PresetKey; // ⬅ optional, default "last_30_days"
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

function getPresetRange(key: PresetKey): DateRange {
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

const PRESETS: { key: PresetKey; label: string }[] = [
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

function getPresetKeyForRange(range: DateRange): PresetKey | "custom" {
	for (const preset of PRESETS) {
		const presetRange = getPresetRange(preset.key);
		if (isSameRange(range, presetRange)) {
			return preset.key;
		}
	}
	return "custom";
}

export function DateRangeDropdown({
	value,
	onChange,
	className,
	resetSignal,
	resetTo = "last_30_days",
}: DateRangeDropdownProps) {
	// This is just the dropdown's internal "selection"; parent can override via `value`.
	const [preset, setPreset] = React.useState<PresetKey | "custom">(
		"last_30_days",
	);
	const [range, setRange] = React.useState<DateRange>(
		() => value ?? getPresetRange("last_30_days"),
	);
	const [showCustom, setShowCustom] = React.useState(false);
	const [startInput, setStartInput] = React.useState<string>("");
	const [endInput, setEndInput] = React.useState<string>("");

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

	// update inputs when range or showCustom changes
	React.useEffect(() => {
		if (!showCustom) return;
		const start = range.start;
		const end = range.end;
		const pad = (n: number) => (n < 10 ? `0${n}` : String(n));

		setStartInput(
			`${pad(start.getDate())}/${pad(start.getMonth() + 1)}/${start.getFullYear()}`,
		);
		setEndInput(
			`${pad(end.getDate())}/${pad(end.getMonth() + 1)}/${end.getFullYear()}`,
		);
	}, [range, showCustom]);

	React.useEffect(() => {
		if (resetSignal === undefined) return;

		const nextRange = getPresetRange(resetTo);
		setPreset(resetTo);
		setRange(nextRange);
		setShowCustom(false);
		setStartInput("");
		setEndInput("");
	}, [resetSignal, resetTo]);

	const currentRangeLabel = formatRange(range);
	const currentPresetLabel =
		preset === "custom"
			? "Custom range"
			: (PRESETS.find((p) => p.key === preset)?.label ?? "Custom range");

	const handlePresetClick = (p: PresetKey, close: () => void) => {
		const newRange = getPresetRange(p);
		setPreset(p);
		setRange(newRange);

		if (p === "all_time") {
			// All time corresponds to no explicit range filter on the parent → null
			onChange?.(null, "all_time");
		} else {
			onChange?.(newRange, p);
		}

		setShowCustom(false);
		close();
	};

	const handleApplyCustom = (close: () => void) => {
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
		close();
	};

	// left icon (calendar)
	const calendarIcon = (
		<svg
			width={15}
			height={15}
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="w-[15px] h-[15px]"
			preserveAspectRatio="none"
		>
			<title>calendar</title>
			<path
				d="M4.375 2.5V1.5625"
				stroke="#020202"
				strokeWidth="0.9375"
				strokeLinecap="round"
			/>
			<path
				d="M10.625 2.5V1.5625"
				stroke="#020202"
				strokeWidth="0.9375"
				strokeLinecap="round"
			/>
			<path
				d="M10.3125 11.25C10.8303 11.25 11.25 10.8303 11.25 10.3125C11.25 9.79473 10.8303 9.375 10.3125 9.375C9.79473 9.375 9.375 9.79473 9.375 10.3125C9.375 10.8303 9.79473 11.25 10.3125 11.25Z"
				stroke="#020202"
				strokeWidth="0.9375"
			/>
			<path
				d="M13.4375 5.625H10.3906H6.71875M1.25 5.625H3.67188"
				stroke="#020202"
				strokeWidth="0.9375"
				strokeLinecap="round"
			/>
			<path
				d="M8.75 13.75H6.25C3.89298 13.75 2.71447 13.75 1.98223 13.0177C1.25 12.2856 1.25 11.107 1.25 8.75V7.5C1.25 5.14298 1.25 3.96447 1.98223 3.23223C2.71447 2.5 3.89298 2.5 6.25 2.5H8.75C11.107 2.5 12.2856 2.5 13.0177 3.23223C13.75 3.96447 13.75 5.14298 13.75 7.5V8.75C13.75 11.107 13.75 12.2856 13.0177 13.0177C12.6095 13.426 12.0626 13.6066 11.25 13.6866"
				stroke="#020202"
				strokeWidth="0.9375"
				strokeLinecap="round"
			/>
		</svg>
	);

	return (
		<Dropdown
			className={className}
			renderTrigger={({
				ref,
				chevronIcon,
				onRootMouseEnter,
				onRootMouseLeave,
				onLeftClick,
				onRightClick,
			}) => (
				<InputFrame
					ref={ref as any}
					onMouseEnter={onRootMouseEnter}
					onMouseLeave={onRootMouseLeave}
					start={<Icon name="calendar" className="text-foreground" />}
					end={
						<button
							type="button"
							onClick={onRightClick}
							className="flex items-center gap-2 pl-4 border-l border-border/20 hover:opacity-80 motion-micro"
						>
							<Text as="span" variant="bodyStrong">
								{currentPresetLabel}
							</Text>
							{chevronIcon}
						</button>
					}
					className={["w-fit cursor-pointer", className].filter(Boolean).join(" ")}
				>
					<button
						type="button"
						onClick={onLeftClick}
						className="flex items-center gap-2.5 text-left hover:opacity-80 motion-micro"
					>
						<Text as="span" variant="bodyStrong">
							{currentRangeLabel}
						</Text>
					</button>
				</InputFrame>
			)}
			renderMenu={({ close }) => (
				<div className="flex flex-col gap-2 p-2">
					{/* Custom range section */}
					<div className="rounded-xl bg-surface p-2">
						<div className="mb-1 flex items-center justify-between">
							<Text as="p" variant="bodyStrong">
								Custom range
							</Text>
							<Text as="p" variant="captionMuted">
								dd/mm/yyyy
							</Text>
						</div>
						<div className="flex gap-2">
							<input
								type="text"
								value={startInput}
								onChange={(e) => setStartInput(e.target.value)}
								placeholder="Start"
								className="flex-1 rounded-lg border border-border/15 bg-white px-2 py-1 text-xs text-foreground outline-none transition-colors motion-micro focus:border-primary"
							/>
							<input
								type="text"
								value={endInput}
								onChange={(e) => setEndInput(e.target.value)}
								placeholder="End"
								className="flex-1 rounded-lg border  border-border/15 bg-white px-2 py-1 text-xs text-foreground outline-none transition-colors motion-micro focus:border-primary"
							/>
						</div>
						<div className="mt-2 flex justify-end gap-2">
							<button
								type="button"
								className="text-xs text-foreground/60 cursor-pointer hover:text-foreground transition-colors motion-micro"
								onClick={() => {
									setShowCustom(false);
									close();
								}}
							>
								Cancel
							</button>
							<button
								type="button"
								className="rounded-[100px] bg-primary cursor-pointer px-3 py-1 text-xs font-medium text-primary-foreground transition-all motion-interactive"
								onClick={() => handleApplyCustom(close)}
							>
								Apply
							</button>
						</div>
					</div>

					{/* Presets */}
					<div className="mt-1 flex flex-col">
						{PRESETS.map((p) => {
							const isActive = preset === p.key;
							return (
								<button
									key={p.key}
									type="button"
									onClick={() => handlePresetClick(p.key, close)}
									className={[
										"flex w-full items-center cursor-pointer justify-between px-3 py-1.5 text-sm",
										"transition-colors motion-micro text-left rounded-lg",
										isActive
											? "bg-primary/10 text-primary"
											: "bg-white text-foreground/80 hover:bg-surface",
									]
										.filter(Boolean)
										.join(" ")}
								>
									<span>{p.label}</span>
								</button>
							);
						})}
					</div>
				</div>
			)}
		/>
	);
}
