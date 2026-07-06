import { getMarketingPage } from "@/lib/marketing-content/resolvers";
import { MarketingSectionReviewState } from "@/lib/marketing-content/sections/MarketingSectionReviewState";
import { renderMarketingSections } from "@/lib/marketing-content/sections/renderMarketingSections";

type HomeProps = {
	searchParams?: Promise<{
		review?: string | string[];
	}>;
};

const isSectionReviewEnabled = (review: string | string[] | undefined) =>
	Array.isArray(review) ? review.includes("sections") : review === "sections";

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
