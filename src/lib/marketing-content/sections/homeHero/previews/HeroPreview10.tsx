"use client";
// Native specimen adapted from @/app/(site)/dashboard/_components/entities/record/RecordIdentity.catalog.
import { RecordIdentity } from "@/app/(site)/dashboard/_components/entities/record/RecordIdentity";

const presentation = { slugLabel: "north-star", title: "North star" };
const sizes = ["sm", "md", "lg", "xl"] as const;
const variants = ["default", "actor"] as const;
function CatalogPreview() {
	const render = () => (
		<div className="grid max-w-4xl gap-8">
			{variants.map((variant) => (
				<section className="grid gap-4" key={variant}>
					<h2 className="font-semibold capitalize">{variant}</h2>
					{sizes.map((avatarSize) => (
						<div className="grid gap-3 sm:grid-cols-2" key={avatarSize}>
							<RecordIdentity
								avatarSize={avatarSize}
								presentation={presentation}
								variant={variant}
							/>
							<RecordIdentity.Skeleton
								avatarSize={avatarSize}
								variant={variant}
							/>
						</div>
					))}
				</section>
			))}
		</div>
	);
	return render();
}
export default CatalogPreview;
