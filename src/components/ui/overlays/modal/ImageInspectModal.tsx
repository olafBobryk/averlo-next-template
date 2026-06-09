"use client";

import { Button } from "@/components/ui/primitives/Button";

type ImageInspectModalProps = {
	src: string;
	alt?: string;
	onClose: () => void;
	onShare?: () => void | Promise<void>;
	shareUrl?: string;
};

export function ImageInspectModal({
	src,
	alt = "Preview image",
	onClose,
}: ImageInspectModalProps) {
	return (
		<div className="grid gap-4">
			<img
				src={src}
				alt={alt}
				className="max-h-[70vh] w-full rounded-md object-contain"
			/>
			<div className="flex justify-end">
				<Button type="button" variant="ghost" onClick={onClose}>
					Close
				</Button>
			</div>
		</div>
	);
}
