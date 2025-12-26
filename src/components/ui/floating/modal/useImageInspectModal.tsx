"use client";

import * as React from "react";
import { ImageInspectModal } from "./ImageInspectModal";
import { useModal } from "./useModal";

export type OpenImageInspectOptions = {
	src: string;
	alt?: string;
	shareUrl?: string;
	onShare?: () => void | Promise<void>;
	portalTargetId?: string;
};

export function useImageInspectModal(defaultPortalTargetId?: string) {
	const { openModal } = useModal();

	const openImageInspect = React.useCallback(
		({
			src,
			alt,
			shareUrl,
			onShare,
			portalTargetId,
		}: OpenImageInspectOptions) => {
			const targetId = portalTargetId ?? defaultPortalTargetId;

			openModal(
				({ close }) => (
					<ImageInspectModal
						src={src}
						alt={alt}
						shareUrl={shareUrl}
						onShare={onShare}
						onClose={close}
					/>
				),
				{
					panelClassName:
						"!p-0 !bg-transparent h-full w-full !border-0 !rounded-none !shadow-none max-w-none max-h-none",
					wrapperClassName: "!px-10",
					backdropClassName: "",
					panelStyle: { boxShadow: "none" },
					portalTargetId: targetId,
				},
			);
		},
		[openModal, defaultPortalTargetId],
	);

	return { openImageInspect };
}
