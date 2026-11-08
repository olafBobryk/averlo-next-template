"use client";
// Native specimen adapted from @/components/ui/foundations/MotionProvider.catalog.
import {
	useIntroDisableOverride,
	useMotionDisableOverride,
} from "@/components/ui/foundations/motionDisableOverride";

function CatalogPreview1() {
	const motionDisabled = useMotionDisableOverride();
	const introDisabled = useIntroDisableOverride();
	return (
		<output aria-live="polite">
			Motion {motionDisabled ? "disabled" : "enabled"}; intro{" "}
			{introDisabled ? "disabled" : "enabled"}
		</output>
	);
}
export default CatalogPreview1;
