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

	return (
		<div className="relative w-full flex flex-col items-center">
			<Text as="span" className="z-10 bg-background px-3" {...textProps}>
				{children}
			</Text>
			<div className="flex-grow-0 absolute top-1/2 -translate-y-1/2 flex-shrink-0 w-full h-px overflow-hidden rounded-[5px] bg-border" />
		</div>
	);
}
