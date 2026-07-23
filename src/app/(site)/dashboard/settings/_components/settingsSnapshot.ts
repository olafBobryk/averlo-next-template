import type {
	AdapterMethodAvailability,
	AuthIdentity,
} from "@/lib/auth/contracts";

export type DashboardSettingsSnapshot = {
	authMethods: AdapterMethodAvailability;
	identities: readonly AuthIdentity[];
	joinedAtLabel: string;
};
