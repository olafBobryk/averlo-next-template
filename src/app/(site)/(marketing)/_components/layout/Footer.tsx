import Logo from "@/components/branding/Logo";
import { Button } from "@/components/ui/primitives/Button";
import { getMarketingLinkHref } from "@/lib/marketing-content/links";
import type { SiteLayoutDocument } from "@/lib/marketing-content/types";

export default function Footer({
	className = "",
	layout,
}: {
	className?: string;
	layout: SiteLayoutDocument["footer"];
}) {
	return (
		<footer
			className={
				"flex flex-col items-center py-section-y px-section-x border-t border-white/[0.15] " +
				className
			}
		>
			<div className="flex flex-col justify-center items-center max-w-section-max relative gap-[25px] ">
				<Logo size="md" />
				<div className="flex justify-center gap-y-[10px] flex-wrap items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-[45px] p-2.5">
					{layout.navLinks.map((item) => (
						<Button
							href={getMarketingLinkHref(item)}
							key={`${item.label}-${getMarketingLinkHref(item)}`}
							variant="ghost"
						>
							{item.label}
						</Button>
					))}
				</div>
				<div className="flex flex-wrap justify-center items-center flex-grow-0 flex-shrink-0 gap-2.5">
					{layout.socialLinks.map((item) => (
						<Button
							key={item.label}
							variant="outline"
							className="w-[50px] h-[50px] !p-0 rounded-full"
							iconSize={15}
							leadingIcon={item.icon}
							href={item.href}
						/>
					))}
				</div>
			</div>
		</footer>
	);
}
