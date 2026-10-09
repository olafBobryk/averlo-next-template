"use client";
// Native specimen adapted from @/components/ui/misc/SuspenseBoundary.catalog.
import { SuspenseBoundary } from "@/components/ui/misc/SuspenseBoundary";

function CatalogPreview1() {
	const render = () => (
		<div className="grid gap-5">
			<SuspenseBoundary
				loading
				fallback={<p>Loading account</p>}
				forceReducedMotion
			>
				<p>Account ready</p>
			</SuspenseBoundary>
			<SuspenseBoundary
				error
				errorFallback={{
					title: "Account unavailable",
					description: "Try again later.",
				}}
				forceReducedMotion
			>
				<p>Hidden account</p>
			</SuspenseBoundary>
			<SuspenseBoundary forceReducedMotion>
				<p>Resolved account</p>
			</SuspenseBoundary>
		</div>
	);
	return render();
}
export default CatalogPreview1;
