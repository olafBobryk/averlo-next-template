"use client";
// Native specimen adapted from @/components/ui/misc/InteractionGate.catalog.
import { InteractionGate } from "@/components/ui/misc/InteractionGate";

function CatalogPreview1() {
	const render = (args: Parameters<typeof InteractionGate>[0]) => (
		<div className="relative h-80 bg-muted">
			<InteractionGate {...args} />
		</div>
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({
		...{},
		...{
			active: true,
			title: "Enable map",
			description: "The map loads third-party content.",
			actionLabel: "Enable map",
			onActivate: () => undefined,
		},
	} as never);
}
export default CatalogPreview1;
