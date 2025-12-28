// components/ui/input/PhoneInput.tsx
"use client";

import type { CountryCode } from "libphonenumber-js";
import { AsYouType, parsePhoneNumberFromString } from "libphonenumber-js";
import * as React from "react";
import flags from "react-phone-number-input/flags";
import { Dropdown } from "@/components/ui/primitives/Dropdown";
import { Field } from "@/components/ui/primitives/Field";
import {
	InputFrame,
	inputTextClasses,
} from "@/components/ui/primitives/InputFrame";
import { Text } from "@/components/ui/primitives/Text";

export function PhoneFlag({ code }: { code: CountryCode }) {
	const Flag = (flags as any)[code] as React.ComponentType<any> | undefined;
	if (!Flag) return null;

	return (
		<span className="inline-flex h-[14px] w-[20px] overflow-hidden rounded-[3px]">
			<Flag title={code} />
		</span>
	);
}

type PhoneValue = string | undefined; // E.164

type PhoneInputProps = {
	label: React.ReactNode;
	placeholder?: string;

	id?: string;
	name?: string;

	value?: PhoneValue;
	onChange?: (value: PhoneValue) => void;

	required?: boolean;
	disabled?: boolean;

	error?: React.ReactNode;
	validate?: (value: PhoneValue) => string | null;

	className?: string;
	inputClassName?: string;

	defaultCountry?: CountryCode;
	countries?: CountryOption[]; // allow override/extension
};

function findCountry(
	list: CountryOption[],
	code: CountryCode | undefined,
): CountryOption {
	return (
		list.find((c) => c.code === code) ??
		list.find((c) => c.code === "DO") ??
		list[0]
	);
}

export function PhoneInput({
	label,
	placeholder = "Phone number",
	id,
	name,
	value,
	onChange,
	required = false,
	disabled,
	error,
	validate,
	className,
	inputClassName,
	defaultCountry = "DO",
	countries = PHONE_COUNTRIES,
}: PhoneInputProps) {
	const inputId = id ?? name;
	const messageId = inputId ? `${inputId}-message` : undefined;

	const [clientError, setClientError] = React.useState<string | null>(null);
	const derivedError = error ?? clientError;
	const tone = derivedError ? "error" : "default";

	const [country, setCountry] = React.useState<CountryCode>(defaultCountry);

	// what user sees/edits (national formatting)
	const [display, setDisplay] = React.useState<string>("");

	// hydrate display when value changes externally
	React.useEffect(() => {
		if (!value) {
			setDisplay("");
			return;
		}
		const parsed = parsePhoneNumberFromString(value);
		if (!parsed) {
			setDisplay(value);
			return;
		}
		setCountry((parsed.country as CountryCode) || country);
		setDisplay(parsed.formatNational());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, country]);

	const selected = React.useMemo(
		() => findCountry(countries, country),
		[countries, country],
	);

	const setNextDisplay = (raw: string) => {
		// Keep a nice "as you type" formatting per country
		const formatted = new AsYouType(country).input(raw);
		setDisplay(formatted);

		// Convert to E.164 for storage if valid-ish
		const parsed = parsePhoneNumberFromString(formatted, country);
		const e164 = parsed?.isValid() ? parsed.number : undefined;

		if (validate) setClientError(null);
		onChange?.(e164);
	};

	const handleBlur: React.FocusEventHandler<HTMLInputElement> = () => {
		if (!validate) return;
		setClientError(validate(value));
	};

	return (
		<Field
			label={label}
			required={required}
			inputId={inputId}
			className={className}
			message={derivedError ?? undefined}
			tone={tone}
		>
			<InputFrame
				tone={tone}
				disabled={disabled}
				fullWidth
				start={
					<Dropdown
						renderTrigger={({
							ref,
							onRootMouseEnter,
							onRootMouseLeave,
							onRightClick,
						}) => (
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							<button
								ref={ref as any}
								onMouseEnter={onRootMouseEnter}
								onMouseLeave={onRootMouseLeave}
								className="flex items-center gap-2 cursor-pointer"
								onClick={onRightClick}
								type="button"
								tabIndex={0}
							>
								<PhoneFlag code={selected.code} />
								<Text as="span" className="!text-sm text-left text-foreground">
									{selected.dialCode}
								</Text>
							</button>
						)}
						renderMenu={({ close }) => (
							<div className="p-2 max-h-[300px] overflow-y-auto">
								{countries.map((c) => {
									const active = c.code === country;
									return (
										<button
											key={c.code}
											type="button"
											onClick={() => {
												setCountry(c.code);
												const reformatted = new AsYouType(c.code).input(
													display,
												);
												setDisplay(reformatted);

												const parsed = parsePhoneNumberFromString(
													reformatted,
													c.code,
												);
												onChange?.(
													parsed?.isValid() ? parsed.number : undefined,
												);

												close();
											}}
											className={[
												"w-full flex items-center motion-interactive justify-between gap-3 rounded-[10px] px-3 py-2 text-left hover:bg-border/5",
												active ? "bg-border/5" : "",
											]
												.filter(Boolean)
												.join(" ")}
										>
											<span className="flex items-center gap-3">
												<PhoneFlag code={c.code} />
												<Text as="span" className="text-sm text-foreground">
													{c.name}
												</Text>
											</span>
											<Text as="span" className="text-sm text-muted/70">
												{c.dialCode}
											</Text>
										</button>
									);
								})}
							</div>
						)}
					/>
				}
			>
				<input
					id={inputId}
					name={name}
					type="tel"
					placeholder={placeholder}
					required={required}
					disabled={disabled}
					onChange={(e) => setNextDisplay(e.target.value)}
					onBlur={handleBlur}
					className={[inputTextClasses, inputClassName]
						.filter(Boolean)
						.join(" ")}
					aria-invalid={Boolean(derivedError)}
					aria-describedby={derivedError ? messageId : undefined}
					value={display}
				/>
			</InputFrame>
		</Field>
	);
}

export type CountryOption = {
	code: CountryCode; // "DO"
	name: string; // "Dominican Republic"
	dialCode: string; // "+1"
};

export const PHONE_COUNTRIES: CountryOption[] = [
	{ code: "AF", name: "Afghanistan", dialCode: "+93" },
	{ code: "AL", name: "Albania", dialCode: "+355" },
	{ code: "DZ", name: "Algeria", dialCode: "+213" },
	{ code: "AS", name: "American Samoa", dialCode: "+1" },
	{ code: "AD", name: "Andorra", dialCode: "+376" },
	{ code: "AO", name: "Angola", dialCode: "+244" },
	{ code: "AI", name: "Anguilla", dialCode: "+1" },
	{ code: "AG", name: "Antigua and Barbuda", dialCode: "+1" },
	{ code: "AR", name: "Argentina", dialCode: "+54" },
	{ code: "AM", name: "Armenia", dialCode: "+374" },
	{ code: "AW", name: "Aruba", dialCode: "+297" },
	{ code: "AU", name: "Australia", dialCode: "+61" },
	{ code: "AT", name: "Austria", dialCode: "+43" },
	{ code: "AZ", name: "Azerbaijan", dialCode: "+994" },

	{ code: "BS", name: "Bahamas", dialCode: "+1" },
	{ code: "BH", name: "Bahrain", dialCode: "+973" },
	{ code: "BD", name: "Bangladesh", dialCode: "+880" },
	{ code: "BB", name: "Barbados", dialCode: "+1" },
	{ code: "BY", name: "Belarus", dialCode: "+375" },
	{ code: "BE", name: "Belgium", dialCode: "+32" },
	{ code: "BZ", name: "Belize", dialCode: "+501" },
	{ code: "BJ", name: "Benin", dialCode: "+229" },
	{ code: "BM", name: "Bermuda", dialCode: "+1" },
	{ code: "BT", name: "Bhutan", dialCode: "+975" },
	{ code: "BO", name: "Bolivia", dialCode: "+591" },
	{ code: "BA", name: "Bosnia and Herzegovina", dialCode: "+387" },
	{ code: "BW", name: "Botswana", dialCode: "+267" },
	{ code: "BR", name: "Brazil", dialCode: "+55" },
	{ code: "BN", name: "Brunei", dialCode: "+673" },
	{ code: "BG", name: "Bulgaria", dialCode: "+359" },
	{ code: "BF", name: "Burkina Faso", dialCode: "+226" },
	{ code: "BI", name: "Burundi", dialCode: "+257" },

	{ code: "KH", name: "Cambodia", dialCode: "+855" },
	{ code: "CM", name: "Cameroon", dialCode: "+237" },
	{ code: "CA", name: "Canada", dialCode: "+1" },
	{ code: "CV", name: "Cape Verde", dialCode: "+238" },
	{ code: "KY", name: "Cayman Islands", dialCode: "+1" },
	{ code: "CF", name: "Central African Republic", dialCode: "+236" },
	{ code: "TD", name: "Chad", dialCode: "+235" },
	{ code: "CL", name: "Chile", dialCode: "+56" },
	{ code: "CN", name: "China", dialCode: "+86" },
	{ code: "CO", name: "Colombia", dialCode: "+57" },
	{ code: "KM", name: "Comoros", dialCode: "+269" },
	{ code: "CG", name: "Congo", dialCode: "+242" },
	{ code: "CR", name: "Costa Rica", dialCode: "+506" },
	{ code: "CI", name: "Côte d’Ivoire", dialCode: "+225" },
	{ code: "HR", name: "Croatia", dialCode: "+385" },
	{ code: "CU", name: "Cuba", dialCode: "+53" },
	{ code: "CY", name: "Cyprus", dialCode: "+357" },
	{ code: "CZ", name: "Czech Republic", dialCode: "+420" },

	{ code: "DK", name: "Denmark", dialCode: "+45" },
	{ code: "DJ", name: "Djibouti", dialCode: "+253" },
	{ code: "DO", name: "Dominican Republic", dialCode: "+1" },

	{ code: "EC", name: "Ecuador", dialCode: "+593" },
	{ code: "EG", name: "Egypt", dialCode: "+20" },
	{ code: "SV", name: "El Salvador", dialCode: "+503" },
	{ code: "EE", name: "Estonia", dialCode: "+372" },
	{ code: "ET", name: "Ethiopia", dialCode: "+251" },

	{ code: "FI", name: "Finland", dialCode: "+358" },
	{ code: "FR", name: "France", dialCode: "+33" },

	{ code: "GE", name: "Georgia", dialCode: "+995" },
	{ code: "DE", name: "Germany", dialCode: "+49" },
	{ code: "GH", name: "Ghana", dialCode: "+233" },
	{ code: "GR", name: "Greece", dialCode: "+30" },
	{ code: "GT", name: "Guatemala", dialCode: "+502" },

	{ code: "HT", name: "Haiti", dialCode: "+509" },
	{ code: "HN", name: "Honduras", dialCode: "+504" },
	{ code: "HK", name: "Hong Kong", dialCode: "+852" },
	{ code: "HU", name: "Hungary", dialCode: "+36" },

	{ code: "IS", name: "Iceland", dialCode: "+354" },
	{ code: "IN", name: "India", dialCode: "+91" },
	{ code: "ID", name: "Indonesia", dialCode: "+62" },
	{ code: "IR", name: "Iran", dialCode: "+98" },
	{ code: "IQ", name: "Iraq", dialCode: "+964" },
	{ code: "IE", name: "Ireland", dialCode: "+353" },
	{ code: "IL", name: "Israel", dialCode: "+972" },
	{ code: "IT", name: "Italy", dialCode: "+39" },

	{ code: "JP", name: "Japan", dialCode: "+81" },
	{ code: "JO", name: "Jordan", dialCode: "+962" },

	{ code: "KE", name: "Kenya", dialCode: "+254" },
	{ code: "KW", name: "Kuwait", dialCode: "+965" },
	{ code: "KZ", name: "Kazakhstan", dialCode: "+7" },

	{ code: "LA", name: "Laos", dialCode: "+856" },
	{ code: "LV", name: "Latvia", dialCode: "+371" },
	{ code: "LB", name: "Lebanon", dialCode: "+961" },
	{ code: "LT", name: "Lithuania", dialCode: "+370" },
	{ code: "LU", name: "Luxembourg", dialCode: "+352" },

	{ code: "MY", name: "Malaysia", dialCode: "+60" },
	{ code: "MX", name: "Mexico", dialCode: "+52" },
	{ code: "MD", name: "Moldova", dialCode: "+373" },
	{ code: "MA", name: "Morocco", dialCode: "+212" },

	{ code: "NL", name: "Netherlands", dialCode: "+31" },
	{ code: "NZ", name: "New Zealand", dialCode: "+64" },
	{ code: "NG", name: "Nigeria", dialCode: "+234" },
	{ code: "NO", name: "Norway", dialCode: "+47" },

	{ code: "PK", name: "Pakistan", dialCode: "+92" },
	{ code: "PA", name: "Panama", dialCode: "+507" },
	{ code: "PE", name: "Peru", dialCode: "+51" },
	{ code: "PH", name: "Philippines", dialCode: "+63" },
	{ code: "PL", name: "Poland", dialCode: "+48" },
	{ code: "PT", name: "Portugal", dialCode: "+351" },

	{ code: "QA", name: "Qatar", dialCode: "+974" },

	{ code: "RO", name: "Romania", dialCode: "+40" },
	{ code: "RU", name: "Russia", dialCode: "+7" },

	{ code: "SA", name: "Saudi Arabia", dialCode: "+966" },
	{ code: "RS", name: "Serbia", dialCode: "+381" },
	{ code: "SG", name: "Singapore", dialCode: "+65" },
	{ code: "SK", name: "Slovakia", dialCode: "+421" },
	{ code: "SI", name: "Slovenia", dialCode: "+386" },
	{ code: "ZA", name: "South Africa", dialCode: "+27" },
	{ code: "KR", name: "South Korea", dialCode: "+82" },
	{ code: "ES", name: "Spain", dialCode: "+34" },
	{ code: "SE", name: "Sweden", dialCode: "+46" },
	{ code: "CH", name: "Switzerland", dialCode: "+41" },

	{ code: "TW", name: "Taiwan", dialCode: "+886" },
	{ code: "TH", name: "Thailand", dialCode: "+66" },
	{ code: "TR", name: "Turkey", dialCode: "+90" },

	{ code: "UA", name: "Ukraine", dialCode: "+380" },
	{ code: "AE", name: "United Arab Emirates", dialCode: "+971" },
	{ code: "GB", name: "United Kingdom", dialCode: "+44" },
	{ code: "US", name: "United States", dialCode: "+1" },

	{ code: "VE", name: "Venezuela", dialCode: "+58" },
	{ code: "VN", name: "Vietnam", dialCode: "+84" },

	{ code: "ZM", name: "Zambia", dialCode: "+260" },
	{ code: "ZW", name: "Zimbabwe", dialCode: "+263" },
];
