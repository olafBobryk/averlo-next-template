"use client";
// Native specimen adapted from @/components/ui/motion/scroll/Scroll.catalog.
import * as Scroll from "@/components/ui/motion/scroll/index";

function ScrollLagPreview() {
	return (
		<div className="min-h-[120vh] overflow-hidden p-12">
			<Scroll.Lag className="max-w-xl">
				<div className="rounded-xl border border-subtle bg-surface p-8">
					Velocity lag remains a scroll-only non-scalar effect.
				</div>
			</Scroll.Lag>
		</div>
	);
}
export default ScrollLagPreview;
