"use client";

import Image from "next/image";
import * as React from "react";
import { Button } from "@/components/ui/primitives/Button";
import { showToast } from "@/lib/toast";

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
				showToast({
					type: "info",
					message: "Sharing is not available on this device.",
				});
			}
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Unable to share this image.";
			showToast({ type: "error", message });
		} finally {
			setIsSharing(false);
		}
	};

	const canShowShare = Boolean(onShare || shareUrl);

	return (
		<div className="relative w-full h-full max-w-full max-h-full flex flex-col gap-5">
			<div className="relative justify-end flex gap-2">
				{canShowShare ? (
					<Button
						variant="ghost"
						size="icon"
						trailingIcon="camera"
						onClick={handleShare}
						disabled={isSharing}
						className="!rounded-full !border !border-white/40 !bg-black/40 text-white hover:!bg-black/60"
					/>
				) : null}
				<Button
					variant="ghost"
					size="icon"
					trailingIcon="cross"
					onClick={onClose}
					className="!rounded-full !border !border-white/40 !bg-black/40 text-white hover:!bg-black/60"
				/>
			</div>
			<div className="relative w-full h-full">
				<Image
					src={src}
					alt={alt}
					fill
					className="object-contain select-none"
					priority
				/>
			</div>
		</div>
	);
}
