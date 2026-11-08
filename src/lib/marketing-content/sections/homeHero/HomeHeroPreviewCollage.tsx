import Image, { type StaticImageData } from "next/image";
import { Skeleton } from "@/components/ui/misc";
import type { HomeHeroServiceItem } from "../../types";
import dark390 from "./capture/hero-collage-390-dark.webp";
import light390 from "./capture/hero-collage-390-light.webp";
import dark768 from "./capture/hero-collage-768-dark.webp";
import light768 from "./capture/hero-collage-768-light.webp";
import dark1440 from "./capture/hero-collage-1440-dark.webp";
import light1440 from "./capture/hero-collage-1440-light.webp";
import dark1920 from "./capture/hero-collage-1920-dark.webp";
import light1920 from "./capture/hero-collage-1920-light.webp";

// Pre-captured by `npm run hero:capture` (see capture/manifest.json). CSS picks
// one capture per hero breakpoint and app theme; hidden lazy images never load.
const captures: Array<{
	className: string;
	dark: StaticImageData;
	light: StaticImageData;
}> = [
	{ className: "sm:hidden", dark: dark390, light: light390 },
	{ className: "hidden sm:block lg:hidden", dark: dark768, light: light768 },
	{
		className: "hidden lg:block 2xl:hidden",
		dark: dark1440,
		light: light1440,
	},
	{ className: "hidden 2xl:block", dark: dark1920, light: light1920 },
];

export function HomeHeroPreviewCollage({
	services: _services,
}: {
	services: HomeHeroServiceItem[];
}) {
	return (
		<div
			className="absolute inset-0 opacity-80"
			aria-hidden="true"
			data-fidelity-preview-collage="pre-captured-component-library"
		>
			{(["light", "dark"] as const).map((theme) => (
				<div
					key={theme}
					className={
						theme === "light"
							? "absolute inset-0 dark:hidden"
							: "absolute inset-0 hidden dark:block"
					}
				>
					{captures.map((capture) => (
						<Image
							key={capture[theme].src}
							src={capture[theme]}
							alt=""
							fill
							sizes="100vw"
							placeholder="blur"
							className={`object-cover ${capture.className}`}
						/>
					))}
				</div>
			))}
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
