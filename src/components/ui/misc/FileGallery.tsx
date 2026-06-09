"use client";

import { AnimatePresence } from "motion/react";
import * as React from "react";
import {
	FilePreview,
	type FilePreviewItem,
	type FilePreviewLabels,
	type FilePreviewTag,
} from "./FilePreview";
import { IdleState } from "./state/IdleState";

export type FileGalleryUploadedItem = {
	url: string;
	name?: string;
	type?: string;
	tag?: FilePreviewTag;
	key?: string;
	sortPriority?: number;
};

export type FileGalleryPendingItem = {
	file: File;
	tag?: FilePreviewTag;
	key?: string;
	sortPriority?: number;
};

type FileGalleryProps = {
	uploadedUrls?: string[];
	pendingFiles?: File[];
	uploadedItems?: FileGalleryUploadedItem[];
	pendingItems?: FileGalleryPendingItem[];
	disabled?: boolean;
	hideRemove?: boolean;
	previewHeight?: number;
	onRemoveUploaded?: (url: string) => void;
	onRemovePending?: (file: File) => void;
	onRemoveUploadedItem?: (item: FileGalleryUploadedItem) => void;
	onRemovePendingItem?: (item: FileGalleryPendingItem) => void;
	emptyTitle?: React.ReactNode;
	emptyDescription?: React.ReactNode;
	labels?: FilePreviewLabels;
	className?: string;
};

type PendingPreview = {
	item: FileGalleryPendingItem;
	url: string;
	key: string;
};

function fileKey(file: File, index: number) {
	return `${file.name}-${file.size}-${file.lastModified}-${index}`;
}

function pendingItemKey(item: FileGalleryPendingItem, index: number) {
	return item.key ?? fileKey(item.file, index);
}

function urlLooksLikeImage(url: string) {
	const base = url.split("?")[0] ?? url;
	return /\.(png|jpg|jpeg|webp|gif|avif|svg)$/i.test(base);
}

function urlLooksLikePdf(url: string) {
	const base = url.split("?")[0] ?? url;
	return /\.pdf$/i.test(base);
}

export function FileGallery({
	uploadedUrls = [],
	pendingFiles = [],
	uploadedItems,
	pendingItems,
	disabled = false,
	hideRemove = false,
	previewHeight,
	onRemoveUploaded,
	onRemovePending,
	onRemoveUploadedItem,
	onRemovePendingItem,
	emptyTitle = "No files yet",
	emptyDescription = "Uploaded files will appear here.",
	labels,
	className,
}: FileGalleryProps) {
	const [pendingPreviews, setPendingPreviews] = React.useState<
		PendingPreview[]
	>([]);

	const sourcePendingItems =
		pendingItems ??
		pendingFiles.map((file, index) => ({
			file,
			key: fileKey(file, index),
		}));
	const sourcePendingItemsRef = React.useRef(sourcePendingItems);
	sourcePendingItemsRef.current = sourcePendingItems;
	const pendingSignature = sourcePendingItems
		.map((item, index) => pendingItemKey(item, index))
		.join("\n");

	// biome-ignore lint/correctness/useExhaustiveDependencies: recreate object URLs when the pending file signature changes
	React.useEffect(() => {
		const previews = sourcePendingItemsRef.current.map((item, index) => ({
			item,
			url: URL.createObjectURL(item.file),
			key: pendingItemKey(item, index),
		}));
		setPendingPreviews(previews);
		return () => {
			for (const preview of previews) URL.revokeObjectURL(preview.url);
		};
	}, [pendingSignature]);

	const normalizedUploadedItems: FileGalleryUploadedItem[] =
		uploadedItems ??
		uploadedUrls.map((url) => ({
			url,
			key: `uploaded:${url}`,
		}));

	const combined: FilePreviewItem[] = [
		...normalizedUploadedItems.map((item) => ({
			key: item.key ?? `uploaded:${item.url}`,
			status: "uploaded" as const,
			url: item.url,
			name: item.name,
			type: item.type,
			tag: item.tag,
			sortPriority: item.sortPriority,
		})),
		...pendingPreviews.map((preview) => ({
			key: `pending:${preview.key}`,
			status: "pending" as const,
			url: preview.url,
			type: preview.item.file.type,
			name: preview.item.file.name,
			tag: preview.item.tag,
			sortPriority: preview.item.sortPriority,
		})),
	].sort(
		(a, b) =>
			(a.sortPriority ?? Number.MAX_SAFE_INTEGER) -
			(b.sortPriority ?? Number.MAX_SAFE_INTEGER),
	);

	if (combined.length === 0) {
		return (
			<div className={className}>
				<IdleState
					layout="stacked"
					title={emptyTitle}
					description={emptyDescription}
				/>
			</div>
		);
	}

	return (
		<div
			className={["min-w-0 max-w-full overflow-x-auto rounded-md", className]
				.filter(Boolean)
				.join(" ")}
		>
			<div className="flex w-max gap-3 overscroll-x-contain [-webkit-overflow-scrolling:touch]">
				<AnimatePresence initial={false}>
					{combined.map((item, index) => (
						<FilePreview
							key={item.key}
							item={item}
							index={index}
							urlLooksLikeImage={urlLooksLikeImage}
							urlLooksLikePdf={urlLooksLikePdf}
							isDisabled={
								disabled ||
								(item.status === "pending"
									? !onRemovePending && !onRemovePendingItem
									: !onRemoveUploaded && !onRemoveUploadedItem)
							}
							hideRemove={hideRemove}
							previewHeight={previewHeight}
							labels={labels}
							onRemovePending={(url) => {
								const preview = pendingPreviews.find(
									(entry) => entry.url === url,
								);
								if (!preview) return;
								if (onRemovePendingItem) {
									onRemovePendingItem(preview.item);
									return;
								}
								onRemovePending?.(preview.item.file);
							}}
							onRemoveUploaded={(url) => {
								const uploadedItem = normalizedUploadedItems.find(
									(entry) => entry.url === url,
								);
								if (uploadedItem && onRemoveUploadedItem) {
									onRemoveUploadedItem(uploadedItem);
									return;
								}
								onRemoveUploaded?.(url);
							}}
						/>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
}
