import type { MarketingPageDocument, SiteLayoutDocument } from "./types";

export const fallbackHomePage: MarketingPageDocument = {
	slug: "home",
	title: "Home",
	layout: [
		{
			id: "home-hero",
			blockType: "homeHero",
			headline: "A design system built for full control.",
			descriptions: [
				{
					text: "Compose pages from shared primitives, motion, and layout building blocks so every screen stays consistent, adaptable, and easy to extend.",
				},
			],
			cta: {
				label: "Contact",
				href: "/contact",
			},
		},
	],
};

export const fallbackSiteLayout: SiteLayoutDocument = {
	header: {
		cta: {
			label: "Join Now",
			href: "/contact",
		},
		menuGroups: [
			{
				label: "Start",
				link: { label: "Home", routeId: "home" },
				links: [
					{ label: "Hero", href: "/#hero" },
					{ label: "Settings", routeId: "settings" },
				],
			},
			{
				label: "Template",
				links: [
					{ label: "Demo", routeId: "demo" },
					{ label: "Playground", routeId: "playground" },
					{ label: "Dictionary", routeId: "dictionary" },
					{ label: "Reference", routeId: "reference" },
				],
			},
			{
				label: "Build",
				links: [
					{ label: "Dashboard", routeId: "dashboard" },
					{ label: "Pages", routeId: "dashboardPages" },
					{ label: "Dashboard settings", routeId: "dashboardSettings" },
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
						href: "/#hero",
						description: "Primary home page introduction.",
					},
				],
			},
			{
				label: "Demo",
				routeId: "demo",
				sections: [
					{
						label: "Header",
						href: "/demo/layout/header",
						description: "Responsive marketing header patterns.",
					},
					{
						label: "Toast",
						href: "/demo/ui/overlays/toast",
						description: "Transient feedback examples.",
					},
				],
			},
			{
				label: "Playground",
				routeId: "playground",
				sections: [
					{
						label: "Reveal root",
						href: "/playground/motion/reveal-root",
						description: "Motion reveal scheduler playground.",
					},
				],
			},
			{ label: "Settings", routeId: "settings" },
			{ label: "Dictionary", routeId: "dictionary" },
			{ label: "Reference", routeId: "reference" },
		],
		search: {
			ariaLabel: "Search pages",
			clearLabel: "Clear",
			noResultsText: "No matching pages",
		},
		searchGroups: [
			{
				label: "Home",
				link: { label: "Home", routeId: "home" },
				links: [{ label: "Hero", href: "/#hero" }],
			},
			{
				label: "Template",
				links: [
					{ label: "Demo", routeId: "demo" },
					{ label: "Playground", routeId: "playground" },
					{ label: "Dictionary", routeId: "dictionary" },
					{ label: "Reference", routeId: "reference" },
				],
			},
			{
				label: "Dashboard",
				link: { label: "Dashboard", routeId: "dashboard" },
				links: [
					{ label: "Pages", routeId: "dashboardPages" },
					{ label: "Settings", routeId: "dashboardSettings" },
				],
			},
		],
		topNavLinks: [
			{ label: "Home", routeId: "home" },
			{ label: "Demo", routeId: "demo" },
			{ label: "Settings", routeId: "settings" },
		],
	},
	footer: {
		navLinks: [
			{ label: "Home", routeId: "home" },
			{ label: "Demo", routeId: "demo" },
			{ label: "Playground", routeId: "playground" },
			{ label: "Settings", routeId: "settings" },
			{ label: "Dictionary", routeId: "dictionary" },
			{ label: "Reference", routeId: "reference" },
		],
		socialLinks: [
			{
				label: "X",
				icon: "x",
				href: "",
			},
			{
				label: "Instagram",
				icon: "instagram",
				href: "",
			},
			{
				label: "LinkedIn",
				icon: "linked-in",
				href: "",
			},
			{
				label: "Meta",
				icon: "meta",
				href: "",
			},
			{
				label: "You Tube",
				icon: "youtube",
				href: "",
			},
		],
	},
};
