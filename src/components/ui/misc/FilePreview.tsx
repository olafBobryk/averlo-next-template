"use client";

import { motion } from "motion/react";
import { useConfirmationModal } from "@/components/ui/floating/modal/useConfirmationModal";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";
import { InspectableImage } from "./InspectableImage";

type PendingItem = {
	key: string;
	status: "pending";
	type: string; // e.g. "image/png"
	url: string; // blob url
	name: string;
};

type UploadedItem = {
	key: string;
	status: "uploaded";
	url: string; // uploaded url
};

export type FilePreviewItem = PendingItem | UploadedItem;

type Props = {
	item: FilePreviewItem;
	index: number;

	// If you already have this helper, pass it in (keeps component generic)
	urlLooksLikeImage: (url: string) => boolean;

	// Disable interactions
	isDisabled?: boolean;

	// Called when user removes a pending item
	onRemovePending: (url: string) => void;

	// Called when user removes an uploaded item
	onRemoveUploaded: (url: string) => void;

	className?: string;
};

export function FilePreview({
	item,
	index,
	urlLooksLikeImage,
	isDisabled = false,
	onRemovePending,
	onRemoveUploaded,
	className,
}: Props) {
	const isPending = item.status === "pending";
	const { openConfirmation } = useConfirmationModal("modal-root");

	const isImage =
		("type" in item && item.type.startsWith("image/")) ||
		(!("type" in item) && urlLooksLikeImage(item.url));

	return (
		<motion.div
			key={item.key}
			layout
			initial={{ opacity: 0, y: 6, scale: 0.98 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: -6, scale: 0.98 }}
			transition={{ duration: 0.2 }}
			className={[
				"relative w-[182px] h-[105px] bg-black/10 rounded-md flex items-center justify-center shrink-0",
				className,
			].join(" ")}
		>
			{/* content */}
			{isImage ? (
				<InspectableImage
					src={item.url}
					alt={`file-${index}`}
					width={182}
					height={105}
					className="object-cover rounded-md h-full w-full overflow-hidden"
				/>
			) : (
				<div className="text-xs text-center flex flex-col items-center gap-1 px-2 w-full h-full justify-center">
					<Text variant="captionMuted" className="text-[10px] break-all">
						{"type" in item ? item.name : item.url}
					</Text>
				</div>
			)}

			{/* status label */}
			<div className="absolute top-2 left-2">
				<Text
					variant="captionMuted"
					className="text-[10px] px-2 py-1 rounded-md bg-white/80 border border-border/15"
				>
					{isPending ? "Pending" : "Uploaded"}
				</Text>
			</div>

			<Button
				variant="primaryDark"
				size="icon-sm"
				trailingIcon="cross"
				className="absolute top-2 right-2"
				onClick={(e) => {
					e.stopPropagation();
					if (isPending) {
						onRemovePending(item.url);
						return;
					}
					openConfirmation({
						title: "Remove file",
						description: "This file will be removed from the upload list.",
						warning: "This file will be lost forever, are you sure?",
						confirmLabel: "Remove",
						onConfirm: () => onRemoveUploaded(item.url),
					});
				}}
				disabled={isDisabled}
			/>
		</motion.div>
	);
}
