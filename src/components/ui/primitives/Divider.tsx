import clsx from "clsx";
import { Text, type TextSpanProps } from "./Text";

type DividerProps = {
	children?: string;
	textProps?: Omit<TextSpanProps, "children" | "as">;
};

export default function Divider({ children, textProps }: DividerProps) {
	if (!children) {
		return (
			<div className="flex-grow-0 flex-shrink-0 w-full h-px overflow-hidden rounded-[5px] bg-border" />
		);
	}

	const { className, ...resolvedTextProps } = textProps ?? {};

	return (
		<div className="flex w-full items-center before:h-px before:min-w-0 before:flex-1 before:-translate-y-1/2 before:rounded-l-[5px] before:bg-border before:content-[''] after:h-px after:min-w-0 after:flex-1 after:-translate-y-1/2 after:rounded-r-[5px] after:bg-border after:content-['']">
			<Text
				as="span"
				className={clsx("shrink-0 px-3", className)}
				{...resolvedTextProps}
			>
				{children}
			</Text>
		</div>
	);
}
