import type * as React from "react";
import { Field } from "@/components/ui/primitives/Field";
import type {
	InputFrameSize,
	InputFrameSkeletonProps,
} from "@/components/ui/primitives/InputFrame";

export type InputSkeletonProps = {
	className?: string;
	description?: React.ReactNode;
	inputClassName?: string;
	label?: React.ReactNode;
	radius?: InputFrameSkeletonProps["radius"];
	required?: boolean;
	size?: InputFrameSize;
	value?: React.ReactNode;
};

/** Shared closed-field loading geometry for inputs that do not own extra rows. */
export function InputSkeleton({
	className,
	description,
	inputClassName,
	label,
	radius,
	required,
	size,
	value,
}: InputSkeletonProps) {
	return (
		<Field.Skeleton
			className={className}
			description={description}
			fullWidth
			inputClassName={inputClassName}
			label={label}
			required={required}
			radius={radius}
			size={size}
		>
			{value}
		</Field.Skeleton>
	);
}
