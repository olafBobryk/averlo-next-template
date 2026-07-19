import type { IconName } from "@/components/ui/icons/Icon";

export type DashboardPresentationTone =
	| "danger"
	| "info"
	| "neutral"
	| "primary"
	| "success"
	| "warning";

export type DashboardEntityNouns = {
	plural: string;
	shortLabel: string;
	singular: string;
};

export type DashboardEntityActionLabels = {
	archive?: string;
	create?: string;
	delete?: string;
	edit?: string;
	save?: string;
};

export type DashboardEntityEmptyState = {
	description: string;
	icon: IconName;
	title: string;
};

export type DashboardEntityPresentationDefinition = {
	actions: DashboardEntityActionLabels;
	emptyState: DashboardEntityEmptyState;
	icon: IconName;
	nouns: DashboardEntityNouns;
};

export type DashboardFieldDefinition<Entity> = {
	emptyValue: string;
	getValue: (entity: Entity) => string | null | undefined;
	icon?: IconName;
	id: string;
	label: string;
};

export type DashboardColumnDefinition<Entity> = {
	align?: "left" | "right";
	getSortValue: (entity: Entity) => number | string;
	id: string;
	label: string;
	sortable?: boolean;
};

export type DashboardVariantPresentation = {
	description?: string;
	label: string;
	shortLabel: string;
	tone: DashboardPresentationTone;
};

export type DashboardCommandPresentation = {
	description: string;
	href: string;
	id: string;
	keywords: readonly string[];
	label: string;
};
