export const privateFilePolicy = {
	maxBytes: 10 * 1024 * 1024,
	signedAccessLifetimeSeconds: 5 * 60,
	allowedContentTypes: [
		"application/pdf",
		"image/jpeg",
		"image/png",
		"image/webp",
	],
} as const;

export type PrivateFileOwner = {
	organizationId: string;
	userId: string;
};

export type PrivateFileMetadata = PrivateFileOwner & {
	id: string;
	key: string;
	contentType: string;
	filename: string;
	size: number;
	createdAt: string;
	replacedFileId: string | null;
};

export type PrivateFileAuthorization = {
	action: "create" | "delete" | "read" | "replace";
	actorUserId: string;
	organizationId: string;
	file?: PrivateFileMetadata;
};

export interface PrivateFileAdapter {
	validateUpload(input: {
		contentType: string;
		filename: string;
		size: number;
	}): Promise<void>;
	authorize(input: PrivateFileAuthorization): Promise<void>;
	createOpaqueKey(input: PrivateFileOwner & { filename: string }): string;
	createMetadata(
		input: Omit<PrivateFileMetadata, "createdAt" | "id">,
	): Promise<PrivateFileMetadata>;
	createSignedAccess(input: {
		file: PrivateFileMetadata;
		lifetimeSeconds: number;
	}): Promise<{ expiresAt: string; url: string }>;
	deleteFile(file: PrivateFileMetadata): Promise<void>;
	replaceFile(input: {
		current: PrivateFileMetadata;
		next: Omit<PrivateFileMetadata, "createdAt" | "id" | "replacedFileId">;
	}): Promise<PrivateFileMetadata>;
}

export type PrivateFileProviderState =
	| { configured: true; adapter: PrivateFileAdapter }
	| {
			configured: false;
			reason: "No private-file provider is installed in the template.";
	  };

export const privateFileProvider: PrivateFileProviderState = {
	configured: false,
	reason: "No private-file provider is installed in the template.",
};
