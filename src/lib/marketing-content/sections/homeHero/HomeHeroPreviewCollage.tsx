"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/misc";
import type { HomeHeroServiceItem } from "../../types";

const HomeHeroLibrary = dynamic(() => import("./HomeHeroLibrary"), {
	ssr: false,
});

export function HomeHeroPreviewCollage({
	services,
}: {
	services: HomeHeroServiceItem[];
}) {
	return (
		<div
			className="absolute inset-0 opacity-80"
			data-fidelity-preview-collage="native-component-library"
		>
			<HomeHeroLibrary services={services} />
		</div>
	);
}

export function HomeHeroPreviewCollageSkeleton({
	services: _services,
}: {
	services: HomeHeroServiceItem[];
}) {
	return (
		<div className="absolute inset-0 opacity-80" aria-hidden="true">
			<div className="grid h-full grid-cols-6 grid-rows-5 items-center gap-6 overflow-hidden p-6">
				{Array.from({ length: 30 }, (_, index) => `specimen-${index}`).map(
					(id) => (
						<Skeleton
							key={id}
							className="max-h-full w-full rounded-sm"
							style={{
								height: `${24 + (Number(id.split("-")[1]) % 5) * 18}px`,
							}}
						/>
					),
				)}
			</div>
		</div>
	);
}
