import Logo from "@/components/branding/Logo";
import { Button } from "@/components/ui/primitives/Button";
import { getMarketingLinkHref } from "@/lib/marketing-content/links";
import type { SiteLayoutDocument } from "@/lib/marketing-content/types";

export default function Footer({
	layout,
}: {
	layout: SiteLayoutDocument["footer"];
}) {
	return (
		<footer className="border-t border-border px-section-x py-10">
			<div className="mx-auto flex max-w-section-max flex-col items-center gap-6">
				<Logo size="sm" />
				<div className="flex flex-wrap justify-center gap-2">
					{layout.navLinks.map((item) => (
						<Button
							key={item.label}
							href={getMarketingLinkHref(item)}
							variant="ghost"
						>
							{item.label}
						</Button>
					))}
				</div>
			</div>
		</footer>
	);
}
