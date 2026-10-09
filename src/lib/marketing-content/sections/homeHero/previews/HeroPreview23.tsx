"use client";
// Native specimen adapted from @/components/ui/foundations/MotionProvider.catalog.
import {
	MotionScope,
	useMotionTransition,
} from "@/components/ui/foundations/MotionProvider";

function TransitionEvidence() {
	const transition = useMotionTransition("interaction");
	return (
		<output data-testid="transition-duration">
			{String(transition.duration)}
		</output>
	);
}
function CatalogPreview1() {
	const render = () => (
		<MotionScope expressive={-0.25}>
			<MotionScope expressive={0.75}>
				<div data-testid="motion-scope">
					<TransitionEvidence />
				</div>
			</MotionScope>
		</MotionScope>
	);
	return render();
}
export default CatalogPreview1;
