"use client";
// Native specimen adapted from @/components/ui/primitives/InputFrame.catalog.
import {
	InputFrame,
	inputVariants,
} from "@/components/ui/primitives/InputFrame";

function CatalogPreview1() {
	const render = () => (
		<div className="grid gap-4">
			<InputFrame
				start={<span aria-hidden>€</span>}
				end={<span>EUR</span>}
				fullWidth
				size="sm"
			>
				{/* biome-ignore lint/plugin/noRawFormControls: debt */}
				<input
					aria-label="Small amount"
					className={inputVariants({
						size: "sm",
						hasStart: true,
						hasEnd: true,
					})}
				/>
			</InputFrame>
			<InputFrame fullWidth size="md">
				{/* biome-ignore lint/plugin/noRawFormControls: debt */}
				<input
					aria-label="Medium input"
					className={inputVariants({ size: "md" })}
				/>
			</InputFrame>
			<InputFrame fullWidth size="lg">
				{/* biome-ignore lint/plugin/noRawFormControls: debt */}
				<input
					aria-label="Large input"
					className={inputVariants({ size: "lg" })}
				/>
			</InputFrame>
		</div>
	);
	return render();
}
export default CatalogPreview1;
