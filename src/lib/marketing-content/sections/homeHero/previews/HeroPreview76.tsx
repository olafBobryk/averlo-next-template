"use client";
import * as AutoCycle from "@/components/ui/motion/auto-cycle/index";
// Native specimen adapted from @/components/ui/motion/auto-cycle/AutoCycle.catalog.
import { Button } from "@/components/ui/primitives/Button";

function CycleItems() {
	const controller = AutoCycle.useController();
	return (
		<div className="grid gap-3">
			<div className="flex gap-3">
				{["Overview", "Details", "History"].map((label, index) => (
					<Button
						type="button"
						key={label}
						{...controller.getItemProps(index)}
						aria-pressed={controller.isActive(index)}
						onClick={() => controller.setActive(index)}
						variant="secondary"
					>
						{label}
					</Button>
				))}
			</div>
			<div
				aria-hidden={true}
				className="h-1 overflow-hidden rounded-full bg-surface"
			>
				<div
					className="h-full origin-left bg-primary"
					data-testid="cycle-progress"
					style={{ transform: `scaleX(${controller.progress})` }}
				/>
			</div>
		</div>
	);
}
function CatalogPreview1() {
	const render = () => (
		<AutoCycle.Root count={3} autoCycle={false}>
			<CycleItems />
		</AutoCycle.Root>
	);
	return render();
}
export default CatalogPreview1;
