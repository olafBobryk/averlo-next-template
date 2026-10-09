"use client";
// Native specimen adapted from @/components/ui/foundations/Settings.catalog.
import { resolveAppearance } from "@/components/ui/foundations/appearance";

function CatalogPreview1() {
	const render = () => (
		<dl className="grid grid-cols-2 gap-2">
			<dt>System with dark preference</dt>
			<dd data-testid="system-dark">{resolveAppearance("system", true)}</dd>
			<dt>Explicit light preference</dt>
			<dd data-testid="explicit-light">{resolveAppearance("light", true)}</dd>
		</dl>
	);
	return render();
}
export default CatalogPreview1;
