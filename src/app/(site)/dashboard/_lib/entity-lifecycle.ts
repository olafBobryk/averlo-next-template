export type DashboardEntityDeletionImpact = {
	description: string;
	label: string;
};

export type DashboardEntityDeletionDefinition = {
	disabledReason?: string;
	entityLabel: string;
	entityTypeLabel: string;
	impacts: readonly DashboardEntityDeletionImpact[];
	summary?: string;
	warning: string;
};

export type DashboardEntityMutationResult = {
	message: string;
	ok: boolean;
};
