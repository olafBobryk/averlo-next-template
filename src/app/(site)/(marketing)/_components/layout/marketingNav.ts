export type MarketingNavLink = {
	name: string;
	href: string;
};

export type MarketingSocialLink = {
	name: string;
	href: string;
};

export const MARKETING_NAV_LINKS: MarketingNavLink[] = [
	{ name: "Home", href: "/" },
	{ name: "Intelligence", href: "/internal/intelligence" },
];

export const MARKETING_SOCIAL_LINKS: MarketingSocialLink[] = [];
