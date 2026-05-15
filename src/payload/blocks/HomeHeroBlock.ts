import type { Block } from "payload";

export const HomeHeroBlock: Block = {
	slug: "homeHero",
	interfaceName: "HomeHeroSectionBlock",
	labels: {
		singular: "Home hero",
		plural: "Home heroes",
	},
	fields: [
		{
			name: "headline",
			type: "text",
			required: true,
		},
		{
			name: "descriptions",
			type: "array",
			required: true,
			minRows: 1,
			fields: [
				{
					name: "text",
					type: "textarea",
					required: true,
				},
			],
		},
		{
			name: "cta",
			type: "group",
			required: true,
			fields: [
				{
					name: "label",
					type: "text",
					required: true,
				},
				{
					name: "href",
					type: "text",
					required: true,
				},
			],
		},
	],
};
