"use client";
// Native specimen adapted from @/components/ui/misc/SocialLinks.catalog.
import { type ComponentType, createElement } from "react";
import { SocialLinks } from "@/components/ui/misc/SocialLinks";

const links = [
	{
		href: "https://github.com/olafBobryk/averlo-next-template",
		label: "GitHub",
	},
	{ href: "https://www.instagram.com/averlo.co/", label: "Instagram" },
	{ href: "https://www.tiktok.com/@averloagency", label: "TikTok" },
	{ href: "https://www.linkedin.com/company/averlo", label: "LinkedIn" },
] as const;
function CatalogPreview1() {
	return createElement(
		SocialLinks as unknown as ComponentType<Record<string, unknown>>,
		{
			...{ links: [...links] },
			...{},
		},
	);
}
export default CatalogPreview1;
