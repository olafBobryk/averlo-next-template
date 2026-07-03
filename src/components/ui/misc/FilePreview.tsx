"use client";

import { motion } from "motion/react";
import * as React from "react";
import { resolveMotionTransition } from "@/components/ui/foundations/motionTiming";
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

export type FilePreviewLabels = {
	file?: React.ReactNode;
	pdf?: React.ReactNode;
	pending?: React.ReactNode;
	removeConfirmLabel?: string;
	removeDescription?: string;
	removeTitle?: string;
	removeWarning?: string;
	uploaded?: React.ReactNode;
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

	labels?: FilePreviewLabels;
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
	labels,
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
	const fileTypeLabel = isPdf
		? (labels?.pdf ?? "PDF")
		: (labels?.file ?? "File");

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
			transition={resolveMotionTransition("interaction")}
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
			) : isPdf ? (
				<div className="relative h-full w-full p-2">
					<div className="h-full w-full overflow-hidden rounded-[3px] bg-white shadow-[inset_0_0_0_1px_rgba(25,27,37,0.12)]">
						<object
							data={pdfPreviewUrl(item.url)}
							type="application/pdf"
							className="pointer-events-none h-full w-full"
							title={`${name} preview`}
						>
							<div className="flex h-full min-w-0 flex-col items-center justify-center gap-1 px-2 text-center">
								<Text as="span" variant="bodyStrong" className="block text-xs">
									{fileTypeLabel}
								</Text>
								<Text
									as="span"
									variant="caption"
									tone="muted"
									className="block max-w-full whitespace-normal break-words text-[10px]"
								>
									{name}
								</Text>
							</div>
						</object>
					</div>
					<Button
						variant="ghost"
						size="md"
						align="center"
						className="absolute! inset-0! z-10 h-full! w-full! !rounded-md !p-0"
						aria-label={`Open ${name}`}
						onClick={handleOpenFile}
					/>
				</div>
			) : (
				<Button
					variant="ghost"
					size="md"
					align="center"
					className="h-full w-full !rounded-md !p-2"
					contentClassName="min-w-0 flex-col gap-1 whitespace-normal"
					onClick={handleOpenFile}
				>
					<Text as="span" variant="bodyStrong" className="block text-xs">
						{fileTypeLabel}
					</Text>
					<Text
						as="span"
						variant="caption"
						tone="muted"
						className="block max-w-full break-words text-[10px]"
					>
						{name}
					</Text>
				</Button>
			)}

			<div className="absolute top-2 left-2 z-20 flex max-w-[125px] flex-wrap gap-1.5">
				<Pill
					tone={isPending ? "warning" : "success"}
					className="px-2 py-1 text-[10px] font-medium leading-none backdrop-blur-sm"
				>
					{isPending
						? (labels?.pending ?? "Pending")
						: (labels?.uploaded ?? "Uploaded")}
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
					className="absolute! top-2! right-2 z-20"
					onClick={(e) => {
						e.stopPropagation();
						if (isPending) {
							onRemovePending(item.url);
							return;
						}
						openConfirmation({
							title: labels?.removeTitle ?? "Remove file",
							description:
								labels?.removeDescription ??
								"This file will be removed from the upload list.",
							warning:
								labels?.removeWarning ??
								"This file will be lost forever, are you sure?",
							confirmLabel: labels?.removeConfirmLabel ?? "Remove",
							onConfirm: () => onRemoveUploaded(item.url),
						});
					}}
					disabled={isDisabled}
				/>
			) : null}
		</motion.div>
	);
}

function pdfPreviewUrl(url: string) {
	const [baseUrl] = url.split("#");
	return `${baseUrl}#page=1&view=Fit&zoom=page-fit&toolbar=0&navpanes=0&scrollbar=0`;
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
