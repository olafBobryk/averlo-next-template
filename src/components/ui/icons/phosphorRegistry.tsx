// components/ui/icons/phosphorRegistry.tsx
"use client";

import {
	ArrowRight,
	Bell,
	Calendar,
	CaretDown,
	Check,
	Copy,
	DiscordLogo,
	DotsThreeVertical,
	Eye,
	EyeClosed,
	InstagramLogo,
	List,
	LinkedinLogo,
	Lock,
	MetaLogo,
	Minus,
	Plus,
	Spinner,
	TiktokLogo,
	X,
	XLogo,
	YoutubeLogo,
} from "@phosphor-icons/react";
import {
	createIconRegistry,
	type IconRegistry,
} from "@/components/ui/icons/iconRegistry";

const phosphorOverrides: Partial<IconRegistry> = {
	"arrow-right": ArrowRight,
	bell: Bell,
	calendar: Calendar,
	chevron: CaretDown,
	"chevron-down": CaretDown,
	check: Check,
	copy: Copy,
	discord: DiscordLogo,
	"ellipsis-vertical": DotsThreeVertical,
	eye: Eye,
	"eye-closed": EyeClosed,
	instagram: InstagramLogo,
	"linked-in": LinkedinLogo,
	lock: Lock,
	menu: List,
	meta: MetaLogo,
	minus: Minus,
	plus: Plus,
	spinner: Spinner,
	tiktok: TiktokLogo,
	close: X,
	cross: X,
	x: XLogo,
	youtube: YoutubeLogo,
};

export const phosphorIconRegistry = createIconRegistry(phosphorOverrides);
