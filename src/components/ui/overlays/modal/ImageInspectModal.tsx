"use client";

import Image from "next/image";
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
			<div className="relative h-[70vh] w-full overflow-hidden rounded-md">
				<Image
					src={src}
					alt={alt}
					fill
					className="object-contain"
					sizes="90vw"
				/>
			</div>
			<div className="flex justify-end">
				<Button type="button" variant="ghost" onClick={onClose}>
					Close
				</Button>
			</div>
		</div>
	);
}
