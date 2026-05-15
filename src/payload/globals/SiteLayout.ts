import type { GlobalConfig } from "payload";

const linkFields = [
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
] satisfies GlobalConfig["fields"];

const navLinkFields = [
	...linkFields,
	{
		name: "sections",
		type: "array",
		fields: [
			...linkFields,
			{
				name: "description",
				type: "textarea",
			},
			{
				name: "icon",
				type: "text",
			},
		],
	},
] satisfies GlobalConfig["fields"];

const menuGroupFields = [
	{
		name: "label",
		type: "text",
		required: true,
	},
	{
		name: "icon",
		type: "text",
	},
	{
		name: "link",
		type: "group",
		fields: linkFields,
	},
	{
		name: "links",
		type: "array",
		fields: linkFields,
	},
] satisfies GlobalConfig["fields"];

export const SiteLayout: GlobalConfig = {
	slug: "site-layout",
	label: "Site layout",
	admin: {
		group: "Site",
		description:
			"Header and footer content for future Payload-backed rendering. The live template currently uses static fallback data.",
	},
	versions: {
		drafts: true,
	},
	fields: [
		{
			name: "header",
			type: "group",
			fields: [
				{
					name: "cta",
					type: "group",
					fields: linkFields,
				},
				{
					name: "topNavLinks",
					type: "array",
					fields: linkFields,
				},
				{
					name: "navLinks",
					type: "array",
					fields: navLinkFields,
				},
				{
					name: "menuGroups",
					type: "array",
					fields: menuGroupFields,
				},
				{
					name: "searchGroups",
					type: "array",
					fields: menuGroupFields,
				},
				{
					name: "search",
					type: "group",
					fields: [
						{
							name: "ariaLabel",
							type: "text",
							required: true,
						},
						{
							name: "clearLabel",
							type: "text",
							required: true,
						},
						{
							name: "noResultsText",
							type: "text",
							required: true,
						},
					],
				},
				{
					name: "mobile",
					type: "group",
					fields: [
						{
							name: "menuLabel",
							type: "text",
							required: true,
						},
						{
							name: "openAriaLabel",
							type: "text",
							required: true,
						},
						{
							name: "closeAriaLabel",
							type: "text",
							required: true,
						},
					],
				},
			],
		},
		{
			name: "footer",
			type: "group",
			fields: [
				{
					name: "navLinks",
					type: "array",
					fields: linkFields,
				},
				{
					name: "socialLinks",
					type: "array",
					fields: [
						...linkFields,
						{
							name: "icon",
							type: "text",
							required: true,
						},
					],
				},
			],
		},
	],
};
