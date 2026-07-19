"use client";

import clsx from "clsx";
import * as React from "react";
import { Icon } from "@/components/ui/icons/Icon";
import {
	DropdownPanel,
	type DropdownPositionStrategy,
} from "@/components/ui/primitives/Dropdown";
import { Field } from "@/components/ui/primitives/Field";
import {
	InputFrame,
	inputTextClasses,
} from "@/components/ui/primitives/InputFrame";

type DateInputProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"children" | "onChange" | "type" | "value"
> & {
	description?: React.ReactNode;
	dropdownPortalTargetId?: string;
	dropdownPositionStrategy?: DropdownPositionStrategy;
	error?: React.ReactNode;
	label?: React.ReactNode;
	onChange?: (value: string) => void;
	value?: string;
};

const weekdayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function parseDateValue(value?: string) {
	if (!value) return null;
	const [year, month, day] = value.split("-").map(Number);
	if (!year || !month || !day) return null;
	const date = new Date(Date.UTC(year, month - 1, day));
	return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateValue(date: Date) {
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	const day = String(date.getUTCDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function formatDisplayDate(value?: string) {
	const date = parseDateValue(value);
	if (!date) return "Select date";

	return new Intl.DateTimeFormat("en", {
		day: "numeric",
		month: "short",
		timeZone: "UTC",
		year: "numeric",
	}).format(date);
}

function getMonthLabel(monthDate: Date) {
	return new Intl.DateTimeFormat("en", {
		month: "long",
		timeZone: "UTC",
		year: "numeric",
	}).format(monthDate);
}

function getCalendarDays(monthDate: Date) {
	const year = monthDate.getUTCFullYear();
	const month = monthDate.getUTCMonth();
	const firstDay = new Date(Date.UTC(year, month, 1));
	const offset = (firstDay.getUTCDay() + 6) % 7;
	const start = new Date(Date.UTC(year, month, 1 - offset));

	return Array.from({ length: 42 }, (_, index) => {
		const date = new Date(start);
		date.setUTCDate(start.getUTCDate() + index);
		return date;
	});
}

function addMonths(date: Date, amount: number) {
	return new Date(
		Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1),
	);
}

function getInitialDate(
	value: string | undefined,
	defaultValue: DateInputProps["defaultValue"],
) {
	if (value) return value;
	if (typeof defaultValue === "string") return defaultValue;
	return formatDateValue(new Date());
}

export function DateInput({
	className,
	defaultValue,
	description,
	disabled,
	dropdownPortalTargetId,
	dropdownPositionStrategy = "absolute",
	error,
	form,
	id,
	label,
	name,
	onChange,
	required,
	value,
	...props
}: DateInputProps) {
	const generatedId = React.useId();
	const inputId = id ?? generatedId;
	const descriptionId = description ? `${inputId}-description` : undefined;
	const errorId = error ? `${inputId}-error` : undefined;
	const rootRef = React.useRef<HTMLDivElement | null>(null);
	const panelRef = React.useRef<HTMLDivElement | null>(null);
	const [open, setOpen] = React.useState(false);
	const [internalValue, setInternalValue] = React.useState(() =>
		getInitialDate(value, defaultValue),
	);
	const selectedValue = value ?? internalValue;
	const selectedDate = parseDateValue(selectedValue);
	const [visibleMonth, setVisibleMonth] = React.useState(
		selectedDate ??
			new Date(
				Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1),
			),
	);
	const calendarDays = getCalendarDays(visibleMonth);

	React.useEffect(() => {
		if (!open) return;

		const handlePointerDown = (event: PointerEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) return;
			if (
				!rootRef.current?.contains(target) &&
				!panelRef.current?.contains(target)
			) {
				setOpen(false);
			}
		};

		document.addEventListener("pointerdown", handlePointerDown);
		return () => document.removeEventListener("pointerdown", handlePointerDown);
	}, [open]);

	const commitDate = (nextValue: string) => {
		if (value === undefined) setInternalValue(nextValue);
		const nextDate = parseDateValue(nextValue);
		if (nextDate) setVisibleMonth(nextDate);
		onChange?.(nextValue);
		setOpen(false);
	};

	return (
		<Field
			className={className}
			description={description}
			descriptionId={descriptionId}
			inputId={inputId}
			label={label}
			message={error}
			messageId={errorId}
			tone={error ? "error" : "default"}
		>
			<div className="relative" ref={rootRef}>
				{name ? (
					<input
						disabled={disabled}
						form={form}
						name={name}
						required={required}
						type="hidden"
						value={selectedValue}
					/>
				) : null}
				<InputFrame fullWidth tone={error ? "error" : "default"}>
					<button
						aria-describedby={
							[descriptionId, errorId].filter(Boolean).join(" ") || undefined
						}
						aria-expanded={open}
						aria-haspopup="dialog"
						aria-invalid={Boolean(error)}
						className={clsx(
							inputTextClasses,
							"flex items-center justify-between gap-3 text-left",
						)}
						disabled={disabled}
						id={inputId}
						onClick={() => setOpen((current) => !current)}
						type="button"
						{...(props as Omit<
							React.ButtonHTMLAttributes<HTMLButtonElement>,
							"className" | "disabled" | "id" | "onChange" | "type" | "value"
						>)}
					>
						<span
							className={clsx(
								"truncate",
								!selectedDate && "text-muted-foreground",
							)}
						>
							{formatDisplayDate(selectedValue)}
						</span>
						<Icon
							name="calendar"
							size="sm"
							className="shrink-0 text-muted-foreground"
						/>
					</button>
				</InputFrame>
				{open ? (
					<DropdownPanel
						align="start"
						anchorRef={rootRef}
						className={clsx(
							dropdownPositionStrategy === "absolute" && "left-0 top-full",
							"w-[min(20rem,calc(100vw-2rem))] rounded-xl border-border bg-surface p-3 shadow-xl",
						)}
						portalTargetId={dropdownPortalTargetId}
						positionStrategy={dropdownPositionStrategy}
						ref={panelRef}
						role="dialog"
					>
						<div className="mb-3 flex items-center justify-between gap-3">
							<button
								aria-label="Previous month"
								className="inline-flex size-8 items-center justify-center rounded-full hover:bg-muted"
								onClick={() =>
									setVisibleMonth((current) => addMonths(current, -1))
								}
								type="button"
							>
								<Icon name="arrow-left" size="sm" />
							</button>
							<div className="text-sm font-medium">
								{getMonthLabel(visibleMonth)}
							</div>
							<button
								aria-label="Next month"
								className="inline-flex size-8 items-center justify-center rounded-full hover:bg-muted"
								onClick={() =>
									setVisibleMonth((current) => addMonths(current, 1))
								}
								type="button"
							>
								<Icon name="arrow-right" size="sm" />
							</button>
						</div>
						<div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
							{weekdayLabels.map((weekday) => (
								<div key={weekday}>{weekday}</div>
							))}
						</div>
						<div className="mt-1 grid grid-cols-7 gap-1">
							{calendarDays.map((date) => {
								const dateValue = formatDateValue(date);
								const inMonth =
									date.getUTCMonth() === visibleMonth.getUTCMonth();
								const selected = dateValue === selectedValue;

								return (
									<button
										aria-pressed={selected}
										className={clsx(
											"inline-flex size-9 items-center justify-center rounded-full text-sm transition-colors",
											selected
												? "bg-primary text-primary-foreground"
												: "hover:bg-muted",
											!inMonth && !selected && "text-muted-foreground/50",
										)}
										key={dateValue}
										onClick={() => commitDate(dateValue)}
										type="button"
									>
										{date.getUTCDate()}
									</button>
								);
							})}
						</div>
					</DropdownPanel>
				) : null}
			</div>
		</Field>
	);
}
