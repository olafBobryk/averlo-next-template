import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
	slug: "media",
	admin: {
		group: "Content",
		useAsTitle: "alt",
	},
	access: {
		read: () => true,
	},
	upload: {
		imageSizes: [
			{
				name: "card",
				width: 900,
				height: 600,
				position: "centre",
			},
			{
				name: "hero",
				width: 1800,
				height: 1200,
				position: "centre",
			},
		],
		mimeTypes: ["image/*"],
	},
	fields: [
		{
			name: "alt",
			type: "text",
			required: true,
		},
	],
};
