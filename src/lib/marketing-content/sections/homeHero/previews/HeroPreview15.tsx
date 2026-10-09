"use client";
// Native specimen adapted from @/components/branding/Logo.catalog.
import Logo from "@/components/branding/Logo";

function CatalogPreview1() {
	return (
		<div className="grid gap-6">
			<div className="flex flex-wrap items-end gap-6">
				{(["sm", "md", "lg"] as const).map((size) => (
					<Logo aria-label={`${size} full logo`} key={size} size={size} />
				))}
			</div>
			<div className="flex flex-wrap items-end gap-6">
				{(["sm", "md", "lg"] as const).map((size) => (
					<Logo
						aria-label={`${size} logo mark`}
						key={size}
						size={size}
						variant="mark"
					/>
				))}
			</div>
		</div>
	);
}
export default CatalogPreview1;
