"use client";

import { motion } from "motion/react";
import * as React from "react";
import { Pill, type PillTone } from "@/components/ui/misc/Pill";
import { useConfirmationModal } from "@/components/ui/overlays/modal/useConfirmationModal";
import { useModal } from "@/components/ui/overlays/modal/useModal";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";
import { FileInspectModal } from "./FileInspectModal";
import { InspectableImage } from "./InspectableImage";

export type FilePreviewTag = {
	label: React.ReactNode;
	tone?: PillTone;
};

type PendingItem = {
	key: string;
	status: "pending";
	type: string; // e.g. "image/png"
	url: string; // blob url
	name: string;
	tag?: FilePreviewTag;
	sortPriority?: number;
};

type UploadedItem = {
	key: string;
	status: "uploaded";
	url: string; // uploaded url
	name?: string;
	type?: string;
	tag?: FilePreviewTag;
	sortPriority?: number;
};

export type FilePreviewItem = PendingItem | UploadedItem;

type Props = {
	item: FilePreviewItem;
	index: number;

	// If you already have this helper, pass it in (keeps component generic)
	urlLooksLikeImage: (url: string) => boolean;
	urlLooksLikePdf?: (url: string) => boolean;

	// Disable interactions
	isDisabled?: boolean;

	// Hides the remove button entirely (regardless of disabled state)
	hideRemove?: boolean;

	// Preview item height in px (default 105)
	previewHeight?: number;

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
	urlLooksLikePdf,
	isDisabled = false,
	hideRemove = false,
	previewHeight,
	onRemovePending,
	onRemoveUploaded,
	className,
}: Props) {
	const isPending = item.status === "pending";
	const { openConfirmation } = useConfirmationModal("modal-root");
	const { openModal } = useModal();
	const fileType = "type" in item ? item.type : undefined;

	const isImage =
		fileType?.startsWith("image/") ||
		(!fileType && urlLooksLikeImage(item.url));
	const isPdf =
		fileType === "application/pdf" ||
		(!fileType && (urlLooksLikePdf?.(item.url) ?? false));
	const name = "name" in item && item.name ? item.name : nameFromUrl(item.url);

	const handleOpenFile = React.useCallback(() => {
		openModal(
			({ close }) => (
				<FileInspectModal
					url={item.url}
					name={name}
					type={isPdf ? "pdf" : "file"}
					onClose={close}
				/>
			),
			{
				panelClassName:
					"!p-0 !bg-transparent h-full w-full !border-0 !rounded-none !shadow-none max-w-none max-h-none",
				panelWrapperClassName: "!px-10",
				panelStyle: { boxShadow: "none" },
			},
		);
	}, [isPdf, item.url, name, openModal]);

	return (
		<motion.div
			key={item.key}
			layout
			initial={{ opacity: 0, y: 6, scale: 0.98 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: -6, scale: 0.98 }}
			transition={{ duration: 0.2 }}
			style={
				previewHeight !== undefined ? { height: previewHeight } : undefined
			}
			className={[
				"relative w-auto aspect-video h-[105px] bg-background/10 border-border border overflow-hidden rounded-md flex items-center justify-center shrink-0",
				className,
			].join(" ")}
		>
			{isImage ? (
				<InspectableImage
					src={item.url}
					alt={`file-${index}`}
					width={182}
					height={105}
					className="w-full h-full!"
				/>
			) : (
				<Button
					variant="ghost"
					size="md"
					align="center"
					className="h-full w-full !rounded-md !p-2"
					onClick={handleOpenFile}
				>
					<Text as="span" variant="bodyStrong" className="block text-xs">
						{isPdf ? "PDF" : "File"}
					</Text>
					<Text
						as="span"
						variant="caption"
						tone="muted"
						className="block max-w-full break-all text-[10px]"
					>
						{name}
					</Text>
				</Button>
			)}

			<div className="absolute top-2 left-2 flex max-w-[125px] flex-wrap gap-1.5">
				<Pill
					tone={isPending ? "warning" : "success"}
					className="px-2 py-1 text-[10px] font-medium leading-none backdrop-blur-sm"
				>
					{isPending ? "Pending" : "Uploaded"}
				</Pill>
				{item.tag ? (
					<Pill
						tone={item.tag.tone ?? "neutral"}
						className="max-w-full px-2 py-1 text-[10px] font-medium leading-none backdrop-blur-sm"
					>
						<span className="min-w-0 truncate">{item.tag.label}</span>
					</Pill>
				) : null}
			</div>

			{!hideRemove ? (
				<Button
					variant="ghost"
					size="icon-sm"
					trailingIcon="cross"
					className="absolute! top-2! right-2"
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
			) : null}
		</motion.div>
	);
}

function nameFromUrl(url: string) {
	try {
		const parsed = new URL(url);
		const name = parsed.pathname.split("/").pop();
		return name ? decodeURIComponent(name) : url;
	} catch {
		return url.split("/").pop() ?? url;
	}
}
