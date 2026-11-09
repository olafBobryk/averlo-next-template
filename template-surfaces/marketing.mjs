export const marketingSurface = {
	marketing: {
		ownedPaths: [
			"specs/platform/surfaces/marketing",
			"docs/testing/content-sources.md",
			"docs/testing/marketing-composition.md",
			"docs/testing/contact-delivery.md",
			"src/app/api/contact",
			"src/lib/forms/contact.test.ts",
			"scripts/verify/forms/contact.mjs",
			"scripts/verify/verify-marketing.mjs",
			"scripts/verify/verify-marketing-media-policy.mjs",
			"scripts/verify/verify-marketing-media-policy.test.mjs",
			"scripts/verify/verify-marketing-section-policy.ts",
			"scripts/verify/verify-marketing-site-layout.ts",
			"src/app/(site)/(marketing)",
			"src/config/surfaces/marketing.ts",
			"src/lib/marketing-content",
		],
		packageScripts: [
			"verify:marketing",
			"verify:marketing-media",
			"verify:marketing-sections",
			"verify:site-layout",
		],
	},
};
