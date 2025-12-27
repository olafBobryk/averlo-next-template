// components/ui/primitives/Icon.tsx
"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { iconMap, type IconName } from "@/components/ui/primitives/iconMap";

export type { IconName };

const iconStyles = cva("inline-flex items-center justify-center", {
	variants: {
		size: {
			sm: "w-[0.75rem] h-[0.75rem]",
			md: "w-[0.9375rem] h-[0.9375rem]",
			lg: "w-[1.25rem] h-[1.25rem]",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

type IconProps = {
	name: IconName;
	className?: string;
} & VariantProps<typeof iconStyles> &
	Omit<ComponentProps<"span">, "children">;

export function Icon({ name, size, className, ...rest }: IconProps) {
	const icon = iconMap[name];
	if (!icon) return null;

	return (
		<span className={[iconStyles({ size }), className].filter(Boolean).join(" ")} {...rest}>
			{icon}
		</span>
	);
}
