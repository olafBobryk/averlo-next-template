// components/ui/input/ChoiceInput.tsx
"use client";

import { motion } from "framer-motion";
import type * as React from "react";

type ChoiceProps = {
	id: string;
	name: string;
	value: string;
	label: React.ReactNode;
	checked?: boolean;
	disabled?: boolean;

	/**
	 * How the underlying input behaves:
	 * - "radio": single-select in a group (default, backwards-compatible)
	 * - "checkbox": multi-select toggle
	 */
	inputType?: "radio" | "checkbox";

	/**
	 * Visual indicator style.
	 * - "checkbox": current square check style (default)
	 * - "circle": circular toggle indicator
	 */
	indicator?: "checkbox" | "circle";

	/**
	 * Called when the input changes.
	 * - For radio: onChange(value, true) when it becomes checked.
	 * - For checkbox: onChange(value, checked).
	 */
	onChange?: (value: string, checked?: boolean) => void;

	className?: string;
};

const PRIMARY_COLOR = "rgb(var(--color-primary-rgb))";
const BORDER_COLOR = "rgba(var(--color-border-rgb), 0.15)";

export function ChoiceInput({
	id,
	name,
	value,
	label,
	checked = false,
	disabled = false,
	inputType = "radio",
	indicator = "checkbox",
	onChange,
	className,
}: ChoiceProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;

		if (inputType === "radio") {
			if (e.target.checked) onChange?.(value, true);
		} else {
			onChange?.(value, e.target.checked);
		}
	};

	// shared shadow logic
	const squareBaseIndicatorStyle: React.CSSProperties = checked
		? { boxShadow: "2px 4px 15px 0 rgba(2,2,2,0.03)" }
		: { filter: "drop-shadow(2px 4px 15px rgba(2,2,2,0.03))" };

	const squareIndicatorStyle: React.CSSProperties = disabled
		? { ...squareBaseIndicatorStyle, opacity: 0.15 }
		: squareBaseIndicatorStyle;

	// circle shadows match your provided snippets
	const circleOuterShadowOff: React.CSSProperties = {
		filter: "drop-shadow(2px 4px 15px rgba(2,2,2,0.03))",
	};
	const circleInnerShadowOff: React.CSSProperties = {
		filter: "drop-shadow(2px 4px 15px rgba(2,2,2,0.03))",
	};
	const circleOuterShadowOn: React.CSSProperties = {
		filter: "drop-shadow(2px 4px 15px rgba(2,2,2,0.03))",
	};
	const circleInnerShadowOn: React.CSSProperties = {
		boxShadow: "2px 4px 15px 0 rgba(2,2,2,0.03)",
	};

	const circleOuterStyle: React.CSSProperties = disabled
		? {
				...(checked ? circleOuterShadowOn : circleOuterShadowOff),
				opacity: 0.15,
			}
		: checked
			? circleOuterShadowOn
			: circleOuterShadowOff;

	const circleInnerStyle: React.CSSProperties = disabled
		? {
				...(checked ? circleInnerShadowOn : circleInnerShadowOff),
				opacity: 0.15,
			}
		: checked
			? circleInnerShadowOn
			: circleInnerShadowOff;

	return (
		<div
			className={[
				"flex h-[25px] items-center gap-2.5 overflow-hidden",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			<input
				id={id}
				name={name}
				type={inputType}
				value={value}
				checked={checked}
				disabled={disabled}
				onChange={handleChange}
				className="sr-only"
			/>

			<label
				htmlFor={id}
				className={[
					"flex h-[25px] items-center gap-2.5 cursor-pointer",
					"transition-all motion-interactive",
					disabled ? "opacity-70 cursor-not-allowed" : "",
				]
					.filter(Boolean)
					.join(" ")}
			>
				{indicator === "circle" ? (
					<motion.div
						initial={false}
						animate={
							checked
								? { borderColor: PRIMARY_COLOR }
								: { borderColor: BORDER_COLOR }
						}
						transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
						style={circleOuterStyle}
						className="flex justify-start items-center flex-shrink-0 flex-grow-0 p-[3px] rounded-[100px] border"
					>
						<motion.div
						initial={false}
						animate={
							checked
								? { backgroundColor: PRIMARY_COLOR, scale: 1 }
								: { backgroundColor: "rgba(255,255,255,0)", scale: 0 }
						}
							transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
							style={circleInnerStyle}
							className={[
								"flex justify-between items-center flex-grow-0 flex-shrink-0 w-[15px] h-[15px]",
								"rounded-[100px] border border-white/[0.15]",
							].join(" ")}
						/>
					</motion.div>
				) : (
					<motion.div
						initial={false}
						animate={
							checked
								? {
										backgroundColor: PRIMARY_COLOR,
										borderColor: "rgba(255,255,255,0.15)",
										scale: 1,
									}
								: {
										backgroundColor: "#ffffff",
										borderColor: BORDER_COLOR,
										scale: 0.9,
									}
						}
						transition={{
							duration: 0.26,
							ease: [0.16, 1, 0.3, 1],
						}}
						style={squareIndicatorStyle}
						className="flex h-[25px] w-[25px] flex-shrink-0 flex-grow-0 items-center justify-center rounded-[5px] border transition-transform motion-component"
					>
						<motion.div
							initial={false}
							animate={
								checked ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
							}
							transition={{
								duration: 0.18,
								ease: [0.33, 0.1, 0.2, 1],
							}}
							className="flex items-center justify-center"
						>
							<svg
								width={15}
								height={15}
								viewBox="0 0 15 15"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="h-[15px] w-[15px]"
								preserveAspectRatio="none"
							>
								<title>check</title>
								<path
									d="M2.5 7.88194L5.57693 10.9375L12.5 4.0625"
									stroke="white"
									strokeWidth="1.25"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</motion.div>
					</motion.div>
				)}

				<span
					className={[
						"text-sm font-medium text-left whitespace-nowrap transition-colors motion-micro",
						checked ? "text-foreground" : "text-muted/60",
					]
						.filter(Boolean)
						.join(" ")}
				>
					{label}
				</span>
			</label>
		</div>
	);
}

type BooleanChoiceProps = Omit<
	ChoiceProps,
	"value" | "onChange" | "checked" | "inputType"
> & {
	value: boolean;
	onChange: (next: boolean) => void;
};

export function BooleanChoiceInput({
	value,
	onChange,
	...choiceProps
}: BooleanChoiceProps) {
	return (
		<ChoiceInput
			{...choiceProps}
			value="true"
			inputType="checkbox"
			checked={value}
			onChange={(_, checked) => onChange(Boolean(checked))}
		/>
	);
}
