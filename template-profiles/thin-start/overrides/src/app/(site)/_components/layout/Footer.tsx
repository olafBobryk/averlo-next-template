import Logo from "@/components/branding/Logo";
import * as MotionEffect from "@/components/ui/motion/effect";
import * as MotionSource from "@/components/ui/motion/source";
import { Button } from "@/components/ui/primitives/Button";
import type { SiteLayoutDocument } from "./siteLayout";
import { getSiteLinkHref } from "./siteLayout";

// The footer ends the page, so a mid-viewport end point is never reached:
// the reveal completes as the content's bottom edge arrives, at max scroll.
const footerRevealOffset: MotionSource.SequenceScrollOffset = [
	"start end",
	"end end",
];

export default function Footer({
	layout,
}: {
	layout: SiteLayoutDocument["footer"];
	socialLinks?: SiteLayoutDocument["socialLinks"];
}) {
	return (
		<footer className="border-t border-border px-section-x py-10">
			<MotionSource.Sequence
				className="mx-auto flex max-w-section-max flex-col items-center gap-6"
				mode="scroll"
				offset={footerRevealOffset}
			>
				<MotionSource.Item>
					<MotionEffect.Entrance>
						<Logo size="sm" />
					</MotionEffect.Entrance>
				</MotionSource.Item>
				<MotionSource.Item asChild>
					<MotionEffect.Entrance asChild>
						<div className="flex flex-wrap justify-center gap-2">
							{layout.navLinks.map((item) => (
								<Button
									key={item.label}
									href={getSiteLinkHref(item)}
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
			</MotionSource.Sequence>
		</footer>
	);
}
