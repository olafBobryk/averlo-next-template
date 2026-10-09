"use client";
// Native specimen adapted from @/components/ui/misc/ScrollBorders.catalog.
import { ScrollBorders } from "@/components/ui/misc/ScrollBorders";

const rows = Array.from({ length: 12 }, (_, index) => `Result ${index + 1}`);
function CatalogPreview1() {
	const render = (args: Parameters<typeof ScrollBorders>[0]) => (
		<ScrollBorders
			{...args}
			data-testid="scroll-region"
			tabIndex={0}
			className="h-40 w-72 overflow-y-auto"
		>
			{rows.map((row) => (
				<div className="border-b border-border p-3" key={row}>
					{row}
				</div>
			))}
		</ScrollBorders>
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{ onScroll: () => undefined } } as never);
}
export default CatalogPreview1;
