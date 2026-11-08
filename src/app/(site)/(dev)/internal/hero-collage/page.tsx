import { notFound } from "next/navigation";
import { getMarketingPage } from "@/lib/marketing-content/resolvers";
import HomeHeroLibrary, {
	type HeroTextRegion,
} from "@/lib/marketing-content/sections/homeHero/HomeHeroLibrary";

// Capture fixture for `npm run hero:capture`: the live collage fills the
// viewport so the script can size it to the real hero background box.
// `?avoid=x,y,width,height` is the hero text region measured on `/`, in
// section pixels; the repository cards are packed clear of it.
export default async function HeroCollageCapturePage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	if (process.env.NODE_ENV === "production") notFound();
	const page = await getMarketingPage("home");
	const hero = page.layout.find((section) => section.blockType === "homeHero");
	if (!hero) notFound();
	const { avoid: rawAvoid } = await searchParams;
	const values =
		typeof rawAvoid === "string" ? rawAvoid.split(",").map(Number) : [];
	const avoid: HeroTextRegion | undefined =
		values.length === 4 && values.every(Number.isFinite)
			? {
					x: values[0],
					y: values[1],
					width: values[2],
					height: values[3],
				}
			: undefined;

	return (
		<div
			className="fixed inset-0 z-[2147483646] bg-background"
			data-hero-capture-box=""
		>
			<HomeHeroLibrary services={hero.services} avoid={avoid} />
		</div>
	);
}
