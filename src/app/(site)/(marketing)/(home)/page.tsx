import { getMarketingPage } from "@/lib/marketing-content/resolvers";
import { renderMarketingSections } from "@/lib/marketing-content/sections/renderMarketingSections";

export default async function Home() {
	const page = await getMarketingPage("home");

	return <main>{renderMarketingSections(page.layout)}</main>;
}
