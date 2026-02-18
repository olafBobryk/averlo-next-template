// components/ui/icons/Icon.tsx
"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { type IconName } from "@/components/ui/icons/iconMap";
import { useIconRegistry } from "@/components/ui/icons/iconRegistry";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

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
	animate?: boolean;
} & VariantProps<typeof iconStyles> &
	Omit<ComponentProps<"span">, "children">;

const animatedIconClassMap: Record<string, string> = {
	close:
		"group-hover:scale-105 group-active:scale-100 transition-transform motion-interactive",
	plus: "group-hover:rotate-[180deg] transition-[transform] motion-interactive",
	"arrow-right":
		"group-hover:translate-x-[2px] transition-transform motion-interactive",
	spinner: "animate-spin-smooth",
	warning: "animate-pulse",
	bell: "icon-bell-animate transition-transform motion-interactive",
};

export function Icon({
	name,
	size,
	className,
	animate = false,
	...rest
}: IconProps) {
	const registry = useIconRegistry();
	const IconNode = registry[name];
	const motionAllowed = useMotionAllowed(true);
	if (!IconNode) return null;

	const shouldAnimate = animate && (motionAllowed || name === "spinner");

	return (
		<span
			className={[
				iconStyles({ size }),
				shouldAnimate ? animatedIconClassMap[name] : undefined,
				className,
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<IconNode className="w-full h-full" aria-hidden={true} />
		</span>
	);
}
