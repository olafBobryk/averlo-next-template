import { notFound } from "next/navigation";
import { getMarketingPage } from "@/lib/marketing-content/resolvers";
import HomeHeroLibrary from "@/lib/marketing-content/sections/homeHero/HomeHeroLibrary";

// Capture fixture for `npm run hero:capture`: the live collage fills the
// viewport so the script can size it to the real hero background box.
export default async function HeroCollageCapturePage() {
	if (process.env.NODE_ENV === "production") notFound();
	const page = await getMarketingPage("home");
	const hero = page.layout.find((section) => section.blockType === "homeHero");
	if (!hero) notFound();

	return (
		<div
			className="fixed inset-0 z-[2147483646] bg-background"
			data-hero-capture-box=""
		>
			<HomeHeroLibrary services={hero.services} />
		</div>
	);
}
