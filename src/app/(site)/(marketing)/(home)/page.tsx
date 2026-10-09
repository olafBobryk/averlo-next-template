import type { Metadata } from "next";
import { getMarketingPage } from "@/lib/marketing-content/resolvers";
import { MarketingSectionReviewState } from "@/lib/marketing-content/sections/MarketingSectionReviewState";
import { renderMarketingSections } from "@/lib/marketing-content/sections/renderMarketingSections";
import { createMarketingPageMetadata } from "@/lib/metadata";
import { hrefFor } from "@/lib/routes";
import shareImage from "./opengraph-image.jpg";

type HomeProps = {
	searchParams?: Promise<{
		review?: string | string[];
	}>;
};

const isSectionReviewEnabled = (review: string | string[] | undefined) =>
	Array.isArray(review) ? review.includes("sections") : review === "sections";

export async function generateMetadata(): Promise<Metadata> {
	const page = await getMarketingPage("home");

	const metadata = createMarketingPageMetadata({
		description: page.description,
		home: true,
		path: hrefFor("marketing.home"),
		title: page.title,
	});
	return {
		...metadata,
		twitter: {
			...metadata.twitter,
			card: "summary_large_image",
			images: [
				{
					url: shareImage.src,
					width: shareImage.width,
					height: shareImage.height,
					alt: "The Averlo design system component collection, packed from the center out.",
				},
			],
		},
	};
}

export default async function Home({ searchParams }: HomeProps) {
	const page = await getMarketingPage("home");
	const resolvedSearchParams = await searchParams;
	const reviewSections = isSectionReviewEnabled(resolvedSearchParams?.review);

	return (
		<main>
			<MarketingSectionReviewState enabled={reviewSections} />
			{renderMarketingSections(page.layout)}
		</main>
	);
}
