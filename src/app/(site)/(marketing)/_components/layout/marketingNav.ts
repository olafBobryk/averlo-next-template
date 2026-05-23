import type { IconName } from "@/components/ui/icons/Icon";
import type { AppRouteId } from "@/config/routes";

export type MarketingNavLink = {
	name: string;
	routeId: AppRouteId;
};

export type MarketingSocialLink = {
	name: string;
	icon: IconName;
	href: string;
};

export const MARKETING_NAV_LINKS: MarketingNavLink[] = [
	{ name: "Home", routeId: "home" },
	{ name: "Demo", routeId: "demo" },
	{ name: "Intelligence", routeId: "intelligence" },
	{ name: "Playground", routeId: "playground" },
	{ name: "Settings", routeId: "settings" },
	{ name: "Dictionary", routeId: "dictionary" },
	{ name: "Reference", routeId: "reference" },
];

export const MARKETING_SOCIAL_LINKS: MarketingSocialLink[] = [
	{
		name: "X",
		icon: "x",
		href: "",
	},
	{
		name: "Instagram",
		icon: "instagram",
		href: "",
	},
	{
		name: "LinkedIn",
		icon: "linked-in",
		href: "",
	},
	{
		name: "Meta",
		icon: "meta",
		href: "",
	},
	{
		name: "You Tube",
		icon: "youtube",
		href: "",
	},
];
