"use client";

import * as React from "react";
import { Loader } from "@/components/ui/misc/Loader";
import { Reveal } from "@/components/ui/motion";
import { Button } from "@/components/ui/primitives/Button";
import { showToast } from "@/lib/feedback";

type ImageInspectModalProps = {
	src: string;
	alt?: string;
	onClose: () => void;
	shareUrl?: string;
	onShare?: () => void | Promise<void>;
};

export function ImageInspectModal({
	src,
	alt = "Preview image",
	onClose,
	shareUrl, //TODO: Figure out what needs to be on supabase for a share to happen
	onShare,
}: ImageInspectModalProps) {
	const [isSharing, setIsSharing] = React.useState(false);

	const handleShare = async () => {
		if (isSharing) return;
		setIsSharing(true);
		try {
			if (onShare) {
				await onShare();
				return;
			}

			const targetUrl = shareUrl ?? src;

			if (typeof navigator !== "undefined" && navigator.share && targetUrl) {
				await navigator.share({ url: targetUrl });
			} else {
				showToast.info("Sharing is not available on this device.");
			}
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Unable to share this image.";
			showToast.error(message);
		} finally {
			setIsSharing(false);
		}
	};

	const canShowShare = Boolean(onShare || shareUrl);

	return (
		<div className="relative w-full h-full max-w-full max-h-full p-1 flex flex-col gap-5">
			<div className="relative justify-end flex gap-2">
				{canShowShare ? (
					<Button
						size="icon"
						trailingIcon="camera"
						onClick={handleShare}
						loading={isSharing}
						disabled={isSharing}
					/>
				) : null}
				<Button size="icon" trailingIcon="cross" onClick={onClose} />
			</div>
			<div className="relative w-full h-full">
				<Reveal.Image
					src={src}
					alt={alt}
					fill
					priority
					className="h-full w-full"
					contentClassName="h-full w-full"
					imageClassName="object-contain select-none"
					fallback={
						<div className="flex h-full w-full items-center justify-center">
							<Loader className="text-white" />
						</div>
					}
					fallbackClassName="flex items-center justify-center"
				/>
			</div>
		</div>
	);
}
