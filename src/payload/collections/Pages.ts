import type { CollectionConfig } from "payload";
import { HomeHeroBlock } from "../blocks/HomeHeroBlock";

export const Pages: CollectionConfig = {
	slug: "pages",
	admin: {
		group: "Content",
		useAsTitle: "title",
		defaultColumns: ["title", "slug", "updatedAt"],
	},
	access: {
		read: () => true,
	},
	versions: {
		drafts: true,
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
		},
		{
			name: "slug",
			type: "text",
			required: true,
			unique: true,
			admin: {
				description:
					'Use "home" for the homepage. Frontend reads are intentionally deferred in this template version.',
			},
		},
		{
			name: "layout",
			type: "blocks",
			required: true,
			blocks: [HomeHeroBlock],
		},
	],
};
