"use client";
// Native specimen adapted from @/components/ui/misc/state/State.catalog.
import { IdleState } from "@/components/ui/misc/state/IdleState";
import { StateIndicator } from "@/components/ui/misc/state/State";

function CatalogPreview1() {
	const render = () => (
		<div className="grid w-[36rem] max-w-full gap-8">
			<StateIndicator
				title="Route unavailable"
				description="A prerequisite is missing."
				iconName="warning"
			/>
			<IdleState
				variant="framed"
				layout="stacked"
				align="center"
				title="No projects yet"
				description="Create a project to begin."
			/>
		</div>
	);
	return render();
}
export default CatalogPreview1;
