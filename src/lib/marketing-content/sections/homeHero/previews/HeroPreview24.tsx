"use client";
// Native specimen adapted from @/components/ui/foundations/MotionTiming.catalog.
import {
	getMotionCssVariables,
	getMotionTiming,
	motionTiming,
} from "@/components/ui/foundations/motionTiming";

function CatalogPreview1() {
	const render = () => {
		const variables = getMotionCssVariables();
		return (
			<dl className="grid grid-cols-2 gap-2" data-testid="timing-table">
				<dt>Feedback</dt>
				<dd>{String(motionTiming.feedback.duration)}</dd>
				<dt>Overlay</dt>
				<dd>{String(motionTiming.overlay.duration)}</dd>
				<dt>Reveal</dt>
				<dd>{String(getMotionTiming("grand").duration)}</dd>
				<dt>CSS token</dt>
				<dd>
					{String(
						variables["--motion-overlay-duration" as keyof typeof variables],
					)}
				</dd>
			</dl>
		);
	};
	return render();
}
export default CatalogPreview1;
