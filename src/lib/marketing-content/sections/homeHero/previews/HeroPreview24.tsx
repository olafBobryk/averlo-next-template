"use client";
// Native specimen adapted from @/components/ui/foundations/MotionTiming.catalog.
import {
	motionSteps,
	motionTiming,
} from "@/components/ui/foundations/motionTiming";

function CatalogPreview1() {
	return (
		<dl className="grid grid-cols-2 gap-2" data-testid="step-table">
			{motionSteps.map((step) => (
				<div className="contents" key={step}>
					<dt>{step}</dt>
					<dd>{String(motionTiming[step].duration)}</dd>
				</div>
			))}
		</dl>
	);
}
export default CatalogPreview1;
