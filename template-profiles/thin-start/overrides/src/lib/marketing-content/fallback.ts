import type { MarketingPageDocument, SiteLayoutDocument } from "./types";

export const fallbackHomePage: MarketingPageDocument = {
	slug: "home",
	title: "Home",
	layout: [
		{
			id: "home-hero",
			blockType: "homeHero",
			headline: "A focused website starter.",
			descriptions: [
				{
					text: "Start with the smallest useful primitive surface, then add only the components this website needs.",
				},
			],
			cta: {
				label: "Start",
				href: "/#home-hero",
			},
		},
	],
};

export const fallbackSiteLayout: SiteLayoutDocument = {
	header: {
		cta: {
			label: "Start",
			href: "/#home-hero",
		},
		menuGroups: [
			{
				label: "Start",
				icon: "dot",
				link: { label: "Home", routeId: "home" },
				links: [
					{ label: "Hero", href: "/#home-hero" },
					{ label: "Intelligence", routeId: "intelligence" },
				],
			},
			{
				label: "Build",
				icon: "dot",
				links: [
					{ label: "Home", routeId: "home" },
					{ label: "Contact", routeId: "contact" },
				],
			},
		],
		mobile: {
			closeAriaLabel: "Close navigation",
			menuLabel: "Menu",
			openAriaLabel: "Open navigation",
		},
		navLinks: [
			{
				label: "Home",
				routeId: "home",
				sections: [
					{
						label: "Hero",
						href: "/#home-hero",
						description: "Primary home page introduction.",
					},
				],
			},
			{
				label: "Intelligence",
				routeId: "intelligence",
				sections: [
					{
						label: "Concept map",
						href: "/internal/intelligence",
						description: "Generated template intelligence overview.",
					},
				],
			},
		],
		search: {
			ariaLabel: "Search pages",
			clearLabel: "Clear",
			noResultsText: "No matching pages",
		},
		searchGroups: [
			{
				label: "Home",
				icon: "dot",
				link: { label: "Home", routeId: "home" },
				links: [{ label: "Hero", href: "/#home-hero" }],
			},
			{
				label: "Internal",
				icon: "dot",
				links: [{ label: "Intelligence", routeId: "intelligence" }],
			},
		],
		topNavLinks: [
			{ label: "Home", routeId: "home" },
			{ label: "Intelligence", routeId: "intelligence" },
		],
	},
	footer: {
		navLinks: [
			{ label: "Home", routeId: "home" },
			{ label: "Intelligence", routeId: "intelligence" },
		],
	},
};
