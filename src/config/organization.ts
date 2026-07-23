export type OrganizationIdentityVisual = "icon" | "profile-picture";

export const organizationPresentationConfig = {
	identityVisual:
		process.env.NEXT_PUBLIC_ORGANIZATION_IDENTITY_VISUAL === "icon"
			? "icon"
			: "profile-picture",
} as const satisfies { identityVisual: OrganizationIdentityVisual };
