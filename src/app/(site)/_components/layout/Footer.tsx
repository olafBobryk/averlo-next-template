import Logo from "@/components/branding/Logo";
import { SocialLinks } from "@/components/ui/misc";
import * as MotionEffect from "@/components/ui/motion/effect";
import * as MotionSource from "@/components/ui/motion/source";
import { Button } from "@/components/ui/primitives/Button";
import type { SiteLayoutDocument } from "./siteLayout";
import { getSiteLinkHref } from "./siteLayout";

export default function Footer({
	className = "",
	layout,
	socialLinks,
}: {
	className?: string;
	layout: SiteLayoutDocument["footer"];
	socialLinks: SiteLayoutDocument["socialLinks"];
}) {
	// The footer ends the page: its reveals finish at the max scroll (motion
	// spec V2). Its top rule draws in first (V4).
	return (
		<MotionSource.Sequence
			as="footer"
			className={
				"relative flex flex-col items-center py-section-y px-section-x " +
				className
			}
			mode="scroll"
		>
			<MotionSource.Item className="absolute inset-x-0 top-0">
				<MotionEffect.Divider />
			</MotionSource.Item>
			<div className="flex flex-col justify-center items-center max-w-section-max relative gap-[25px]">
				<MotionSource.Item>
					<MotionEffect.Entrance>
						<Logo size="md" />
					</MotionEffect.Entrance>
				</MotionSource.Item>
				<MotionSource.Item asChild>
					<MotionEffect.Entrance asChild>
						<div className="flex justify-center gap-y-[10px] flex-wrap items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-[45px] p-2.5">
							{layout.navLinks.map((item) => (
								<Button
									href={getSiteLinkHref(item)}
									key={`${item.label}-${getSiteLinkHref(item)}`}
									size="none"
									variant="bare"
									className="text-sm font-medium"
								>
									{item.label}
								</Button>
							))}
						</div>
					</MotionEffect.Entrance>
				</MotionSource.Item>
				{socialLinks.length > 0 ? (
					<MotionSource.Item>
						<MotionEffect.Entrance>
							<SocialLinks
								className="flex-grow-0 flex-shrink-0 justify-center gap-2.5"
								iconSize={15}
								links={socialLinks}
								presentation="footer"
								size="icon"
								variant="secondary"
							/>
						</MotionEffect.Entrance>
					</MotionSource.Item>
				) : null}
			</div>
		</MotionSource.Sequence>
	);
}
