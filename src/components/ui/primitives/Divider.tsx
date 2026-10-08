import clsx from "clsx";
import { Text, type TextSpanProps } from "./Text";

type DividerProps = {
	children?: string;
	className?: string;
	decorative?: boolean;
	textProps?: Omit<TextSpanProps, "children" | "as">;
};

export default function Divider({
	children,
	className,
	decorative = false,
	textProps,
}: DividerProps) {
	if (!children) {
		return (
			<hr
				aria-hidden={decorative || undefined}
				className={clsx(
					"flex-grow-0 flex-shrink-0 w-full h-px border-0 bg-border",
					className,
				)}
			/>
		);
	}

	const { className: textClassName, ...resolvedTextProps } = textProps ?? {};

	return (
		<div
			className={clsx(
				"flex w-full items-center before:h-px before:min-w-0 before:flex-1 before:bg-border before:content-[''] after:h-px after:min-w-0 after:flex-1 after:bg-border after:content-['']",
				className,
			)}
		>
			<Text
				as="span"
				className={clsx("shrink-0 px-3", textClassName)}
				{...resolvedTextProps}
			>
				{children}
			</Text>
		</div>
	);
}
