import clsx from "clsx";
import type { ReactNode } from "react";
import { Text } from "@/components/ui/primitives/Text";

type NullStateContent = Exclude<ReactNode, boolean | null | undefined>;

export type NullStateProps = {
	className?: string;
	copy: NullStateContent;
	title: NullStateContent;
};

export function NullState({ className, copy, title }: NullStateProps) {
	return (
		<div
			className={clsx(
				"grid min-h-52 place-items-center rounded-md border border-dashed border-border text-center",
				className,
			)}
		>
			<div className="grid gap-1">
				<Text as="h3" variant="headingXs">
					{title}
				</Text>
				<Text className="max-w-xs" tone="muted" variant="support">
					{copy}
				</Text>
			</div>
		</div>
	);
}
