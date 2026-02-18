"use client";

import Image, { type ImageProps } from "next/image";
import * as React from "react";
import { useImageInspectModal } from "../overlays/modal/useImageInspectModal";
import { Button } from "@/components/ui/primitives/Button";

type InspectableImageProps = Omit<ImageProps, "onClick"> & {
	className?: string; // applied to button
	inspectShareUrl?: string;
	inspectOnShare?: () => void | Promise<void>;
	inspectPortalTargetId?: string;
};

export function InspectableImage({
	className,
	inspectShareUrl,
	inspectOnShare,
	inspectPortalTargetId,
	...imageProps
}: InspectableImageProps) {
	const { openImageInspect } = useImageInspectModal(inspectPortalTargetId);

	const handleOpen = React.useCallback(() => {
		openImageInspect({
			src: imageProps.src as string,
			alt: imageProps.alt,
			shareUrl: inspectShareUrl,
			onShare: inspectOnShare,
			portalTargetId: inspectPortalTargetId,
		});
	}, [
		imageProps.src,
		imageProps.alt,
		inspectShareUrl,
		inspectOnShare,
		inspectPortalTargetId,
		openImageInspect,
	]);

	return (
		<Button
			variant="ghost"
			size="md"
			align="center"
			className={["!p-0 !rounded-none border-0 bg-transparent", className]
				.filter(Boolean)
				.join(" ")}
			onClick={handleOpen}
		>
			<Image {...imageProps} className="w-full h-full object-cover" />
		</Button>
	);
}
