// components/ui/input/ComboboxTextInput.tsx
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: this input is keyboard-accessible via input + buttons */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: trigger wrapper uses Dropdown renderTrigger */
"use client";

import * as React from "react";
import { Dropdown } from "@/components/ui/primitives/Dropdown";
import { Text } from "@/components/ui/primitives/Text";

export type ComboboxOption = {
	id: string;
	label: string;
	// optional: use a different value than label
	value?: string;
};

type ComboboxTextInputProps = {
	label: React.ReactNode;
	placeholder?: string;

	id?: string;
	name?: string;

	// Uncontrolled
	defaultValue?: string;

	// Controlled
	value?: string;
	onChange?: (value: string) => void;

	required?: boolean;
	disabled?: boolean;

	// Options shown in dropdown
	options: ComboboxOption[];

	// Optional filter: if omitted, defaults to case-insensitive includes
	filterOption?: (query: string, option: ComboboxOption) => boolean;

	// Validation (recommended: pass error from parent)
	error?: React.ReactNode;

	// Optional client-side validation helper
	validate?: (value: string) => string | null;

	className?: string;
	inputClassName?: string;
	menuClassName?: string;

	// Dropdown behavior
	openOnFocus?: boolean; // default true
	openOnChevronClick?: boolean; // default true

	portalTargetId?: string;
};

function defaultFilter(query: string, option: ComboboxOption) {
	const q = query.trim().toLowerCase();
	if (!q) return true;
	return option.label.toLowerCase().includes(q);
}

export function ComboboxTextInput({
	label,
	placeholder,
	id,
	name,
	defaultValue,
	value,
	onChange,
	required = false,
	disabled,
	options,
	filterOption = defaultFilter,
	error,
	validate,
	className,
	inputClassName,
	menuClassName,
	openOnFocus = true,
	openOnChevronClick = true,
	portalTargetId,
}: ComboboxTextInputProps) {
	const isControlled = value !== undefined;
	const [clientError, setClientError] = React.useState<string | null>(null);
	const derivedError = error ?? clientError;

	// local input state for uncontrolled mode
	const [uncontrolledValue, setUncontrolledValue] = React.useState(
		defaultValue ?? "",
	);

	const inputValue = isControlled ? (value ?? "") : uncontrolledValue;

	const setValue = React.useCallback(
		(next: string) => {
			if (!isControlled) setUncontrolledValue(next);
			onChange?.(next);
		},
		[isControlled, onChange],
	);

	const filtered = React.useMemo(() => {
		return options.filter((opt) => filterOption(inputValue, opt));
	}, [options, filterOption, inputValue]);

	const wrapperFocusStyles =
		" transition-all motion-micro focus-within:!border-primary/60 focus-within:ring-4 focus-within:ring-primary/10 hover:border-border/25";

	return (
		<div
			className={[
				"flex flex-col justify-start items-start flex-grow relative",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			<Text as="label" variant="bodyStrong" htmlFor={id}>
				{label}
			</Text>

			<Dropdown
				portalTargetId={portalTargetId}
				// Left click is used here as "open/pin" and also lets us focus the input
				onLeftClick={() => {
					// focus the input on any left click inside trigger if possible
					const el = document.getElementById(id ?? "");
					if (el instanceof HTMLInputElement) el.focus();
				}}
				renderTrigger={({
					ref,
					isOpen,
					onRootMouseEnter,
					onRootMouseLeave,
					onLeftClick,
					onRightClick,
					chevronIcon,
				}) => {
					return (
						<div
							ref={ref}
							onMouseEnter={onRootMouseEnter}
							onMouseLeave={onRootMouseLeave}
							className={[
								"flex justify-start items-center mt-5 self-stretch flex-grow-0 flex-shrink-0 relative gap-2.5",
								"px-[15px] py-2.5 rounded-[10px] bg-surface border border-border/15",
								"shadow-[2px_4px_15px_rgba(2,2,2,0.03)]",
								wrapperFocusStyles,
								disabled ? "opacity-60 pointer-events-none" : "",
								derivedError
									? "border-danger focus-within:border-danger focus-within:ring-danger/10"
									: "",
							]
								.filter(Boolean)
								.join(" ")}
							// clicking anywhere in the trigger (left side) should open/pin AND focus input
							onMouseDown={(e) => {
								// keep focus on input, prevent wrapper from stealing it
								// but do not block selecting text inside input
								const target = e.target as HTMLElement;
								if (target.tagName !== "INPUT") e.preventDefault();
							}}
							onClick={(e) => {
								// If chevron click is disabled, avoid pinning from clicks on chevron
								// We still allow left side click to pin/open via Dropdown's onLeftClick.
								onLeftClick?.(e);
							}}
						>
							<input
								id={id}
								name={name}
								type="text"
								disabled={disabled}
								placeholder={placeholder}
								required={required}
								className={[
									"w-full bg-transparent outline-none text-sm text-left text-foreground",
									"placeholder:text-muted/70",
									inputClassName,
								]
									.filter(Boolean)
									.join(" ")}
								value={inputValue}
								onChange={(e) => {
									if (validate) setClientError(null);
									// typing always takes priority
									setValue(e.target.value);
								}}
								onBlur={(e) => {
									if (!validate) return;
									setClientError(validate(e.target.value));
								}}
								onFocus={() => {
									if (!openOnFocus) return;
									// Open by simulating the "left click" behavior
									// (Dropdown pins + opens on left click)
									// We do it without needing the event object
									// by using the prop call onLeftClick via a synthetic click.
									// Safer: just trigger the wrapper click.
									const wrapper = (document.getElementById(id ?? "") as any)
										?.parentElement as HTMLElement | null;
									if (wrapper) wrapper.click();
								}}
								aria-invalid={Boolean(derivedError)}
								aria-describedby={
									derivedError ? `${id ?? name}-error` : undefined
								}
								role="combobox"
								aria-expanded={isOpen}
								aria-autocomplete="list"
								autoComplete="off"
							/>

							<button
								type="button"
								aria-label="Toggle options"
								className="flex items-center justify-center rounded-[8px]"
								onClick={(e) => {
									if (!openOnChevronClick) return;
									// Right click toggles pin open/close
									onRightClick(e);
								}}
							>
								{chevronIcon}
							</button>
						</div>
					);
				}}
				renderMenu={({ close }) => {
					return (
						<div className={[menuClassName].filter(Boolean).join(" ")}>
							{filtered.length === 0 ? (
								<div className="px-4 py-2">
									<Text variant="muted">No results</Text>
								</div>
							) : (
								<ul className="p-2 max-h-[300px] overflow-y-auto">
									{filtered.map((opt) => (
										<li key={opt.id}>
											<button
												type="button"
												className={[
													"flex w-full items-center motion-micro cursor-pointer justify-between px-3 py-1.5 text-sm " +
														"transition-colors motion-micro text-left rounded-lg " +
														"bg-white text-foreground/80 hover:bg-surface",
												]
													.filter(Boolean)
													.join(" ")}
												onClick={() => {
													// clicking option sets the input value and closes
													setValue(opt.value ?? opt.label);
													close();
												}}
											>
												{opt.label}
											</button>
										</li>
									))}
								</ul>
							)}
						</div>
					);
				}}
			/>
			<div
				className={[
					"transition-all motion-micro", // reserve one line
					derivedError ? "max-h-[26px]" : "max-h-0",
				].join(" ")}
			>
				<Text
					as="p"
					id={derivedError ? `${id ?? name}-error` : undefined}
					variant="captionMuted"
					className={[
						"transition-all motion-micro mt-2.5", // reserve one line
						derivedError ? "text-danger" : "text-transparent",
					].join(" ")}
				>
					{derivedError ?? "placeholder"}
				</Text>
			</div>
		</div>
	);
}
