"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import * as React from "react";
import { createFakeFetcher } from "@/lib/createFakeFetcher";
import { showToast } from "@/lib/toast";
import { FilePreview } from "../misc/FilePreview";
import { Button } from "../primitives/Button";
import { Text } from "../primitives/Text";

export enum UploadTypes {
	PROFILE,
	CAR,
	DOCUMENTS,
	OTHER,
}

function getCorrespondingBucket(uploadType: UploadTypes): string {
	switch (uploadType) {
		case UploadTypes.PROFILE:
			return "profile_images";
		case UploadTypes.CAR:
			return "car_images";
		case UploadTypes.DOCUMENTS:
			return "documents";
		default:
			return "miscellaneous";
	}
}

type FileInputItem = { url: string; type: string; name: string };

type FileInputProps = {
	uploadType: UploadTypes;
	disabled?: boolean;
	className?: string;

	/**
	 * Server-hydrated already-uploaded URLs for this section
	 */
	uploadedUrls?: string[];

	/**
	 * Parent-controlled update for uploaded URLs.
	 * Called after uploads succeed and when a user removes an uploaded file.
	 */
	onUploadedChange?: (urls: string[]) => void;

	/**
	 * Optional: Fired after a successful upload() call (button click OR imperative upload)
	 * with ONLY the newly uploaded public URLs.
	 */
	onUploaded?: (urls: string[]) => void;
};

export type FileInputHandle = {
	/** returns true if there are selected files waiting to be uploaded */
	hasPending: () => boolean;
	/** uploads any pending files, returns uploaded public URLs */
	upload: () => Promise<
		{ ok: true; urls: string[] } | { ok: false; error: string }
	>;
	/** clears the currently selected (pending) files */
	clear: () => void;
};

function dedupe(arr: string[]) {
	return Array.from(new Set(arr));
}

function urlLooksLikeImage(url: string) {
	const base = url.split("?")[0] ?? url;
	return /\.(png|jpg|jpeg|webp|gif|avif)$/i.test(base);
}

export const FileInput = React.forwardRef<FileInputHandle, FileInputProps>(
	function FileInput(
		{
			uploadType,
			disabled,
			onUploaded,
			onUploadedChange,
			uploadedUrls = [],
			className,
		},
		ref,
	) {
		// Pending only (blob URLs)
		const [imageUrls, setImageUrls] = React.useState<FileInputItem[]>([]);
		const imageInputRef = React.useRef<HTMLInputElement>(null);
		const cameraInputRef = React.useRef<HTMLInputElement>(null);

		const [isPending, startTransition] = React.useTransition();
		const [isDragging, setIsDragging] = React.useState(false);

		const isDisabled = Boolean(disabled) || isPending;

		const addFiles = React.useCallback((files: FileList | File[]) => {
			const filesArray = Array.isArray(files) ? files : Array.from(files);

			const newItems: FileInputItem[] = filesArray.map((file) => ({
				url: URL.createObjectURL(file),
				type: file.type,
				name: file.name,
			}));

			setImageUrls((prev) => [...prev, ...newItems]);
		}, []);

		const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (
			e,
		) => {
			if (!e.target.files) return;
			addFiles(e.target.files);
			// allow re-selecting the same file
			e.target.value = "";
		};

		const handleClearImages = React.useCallback(() => {
			setImageUrls([]);
		}, []);

		const performUpload = React.useCallback(async () => {
			if (imageUrls.length === 0)
				return { ok: true as const, urls: [] as string[] };

			const bucket = getCorrespondingBucket(uploadType);

			const successes: string[] = [];
			const failures: FileInputItem[] = [];

			for (const props of imageUrls) {
				try {
					const imageFile = await convertBlobUrlToFile(props.url);

					const { imageUrl, error } = await fakeUploadToBucket({
						file: imageFile,
						bucket,
					});

					if (error) {
						failures.push(props);
						continue;
					}

					successes.push(imageUrl);
				} catch {
					failures.push(props);
				}
			}

			// keep failed in pending so user can retry
			setImageUrls(failures);

			// update uploaded list in parent (append + dedupe)
			if (successes.length > 0) {
				const nextUploaded = dedupe([...(uploadedUrls ?? []), ...successes]);
				onUploadedChange?.(nextUploaded);
				onUploaded?.(successes);
			}

			// toast summary (single toast, not per file)
			if (failures.length === 0) {
				showToast.success(
					`Uploaded ${successes.length} file${
						successes.length === 1 ? "" : "s"
					}.`,
				);
				return { ok: true as const, urls: successes };
			}

			showToast.error(
				successes.length > 0
					? `Uploaded ${successes.length}, failed ${failures.length}. Please try again.`
					: `Failed to upload ${failures.length} file${
							failures.length === 1 ? "" : "s"
						}. Please try again.`,
			);

			// If at least one succeeded, allow flow to continue (ok: true)
			if (successes.length > 0) return { ok: true as const, urls: successes };

			return { ok: false as const, error: "One or more uploads failed." };
		}, [imageUrls, onUploaded, onUploadedChange, uploadType, uploadedUrls]);

		const handleClickUploadImagesButton = () => {
			startTransition(async () => {
				const res = await performUpload();
				if (!res.ok) {
					// toast already shown, but keep console for dev
					console.error(res.error);
				}
			});
		};

		// Expose API to parent
		React.useImperativeHandle(
			ref,
			() => ({
				hasPending: () => imageUrls.length > 0,
				clear: () => handleClearImages(),
				upload: async () => {
					if (isDisabled) {
						return {
							ok: false as const,
							error: "Upload is currently disabled.",
						};
					}
					try {
						return await performUpload();
					} catch (e) {
						return {
							ok: false as const,
							error: e instanceof Error ? e.message : "Upload failed",
						};
					}
				},
			}),
			[handleClearImages, imageUrls.length, isDisabled, performUpload],
		);

		// Drag & drop handlers
		const onDragEnter: React.DragEventHandler<HTMLDivElement> = (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (isDisabled) return;
			setIsDragging(true);
		};

		const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (isDisabled) return;
			setIsDragging(true);
		};

		const onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
		};

		const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
			if (isDisabled) return;

			const files = e.dataTransfer.files;
			if (!files || files.length === 0) return;

			addFiles(files);
		};

		// unified list for rendering (1 row)
		const combined = React.useMemo(
			() => [
				...uploadedUrls.map((url) => ({
					key: `uploaded:${url}`,
					status: "uploaded" as const,
					url,
				})),
				...imageUrls.map((item) => ({
					key: `pending:${item.url}`,
					status: "pending" as const,
					url: item.url,
					type: item.type,
					name: item.name,
				})),
			],
			[uploadedUrls, imageUrls],
		);

		return (
			// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
			<div
				onDragEnter={onDragEnter}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
				className={[
					"w-full min-w-0 flex flex-col justify-center h-[244px] max-h-[244px] items-center self-stretch flex-grow-0 flex-shrink-0 gap-[35px] p-[15px] rounded-[10px] bg-[#f5f7f9] border border-[#020202]/[0.15] border-dashed",
					className,
				].join(" ")}
				style={{
					boxShadow: "2px 4px 15px 0 rgba(2,2,2,0.03)",
					// subtle drag highlight without changing your design system
					outline: isDragging ? "2px solid rgba(2,2,2,0.18)" : "none",
					outlineOffset: isDragging ? "3px" : "0px",
				}}
			>
				<input
					type="file"
					hidden
					multiple
					ref={imageInputRef}
					onChange={handleImageChange}
					disabled={isDisabled}
				/>

				<input
					type="file"
					hidden
					multiple
					ref={cameraInputRef}
					accept="image/*"
					capture="environment"
					onChange={handleImageChange}
					disabled={isDisabled}
				/>

				<div className="flex flex-col w-full">
					<div
						className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2.5 max-h-[135px] motion-component data-[close=true]:max-h-0 transition-all overflow-hidden"
						data-close={imageUrls.length !== 0 || uploadedUrls.length !== 0}
					>
						{/* icon */}
						<svg
							width={20}
							height={20}
							viewBox="0 0 20 20"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="flex-grow-0 flex-shrink-0 w-5 h-5 relative mt-[35px]"
							preserveAspectRatio="none"
						>
							<title>upload</title>
							<path
								d="M10.4616 2.07827C10.3432 1.94877 10.1758 1.875 10.0003 1.875C9.82483 1.875 9.6575 1.94877 9.53908 2.07827L6.20573 5.7241C5.97281 5.97885 5.99051 6.37418 6.24526 6.6071C6.50002 6.84002 6.89535 6.82232 7.12826 6.56757L9.37533 4.10983V13.3333C9.37533 13.6785 9.65516 13.9583 10.0003 13.9583C10.3455 13.9583 10.6253 13.6785 10.6253 13.3333V4.10983L12.8724 6.56757C13.1053 6.82232 13.5007 6.84002 13.7554 6.6071C14.0102 6.37418 14.0278 5.97885 13.7949 5.7241L10.4616 2.07827Z"
								fill="#020202"
								fillOpacity="0.5"
							/>
							<path
								d="M3.125 12.5C3.125 12.1548 2.84518 11.875 2.5 11.875C2.15483 11.875 1.875 12.1548 1.875 12.5V12.5458C1.87498 13.6854 1.87497 14.604 1.9721 15.3265C2.07295 16.0766 2.28869 16.7081 2.79029 17.2097C3.29189 17.7113 3.92345 17.9271 4.67354 18.0279C5.39602 18.125 6.31462 18.125 7.45428 18.125H12.5458C13.6854 18.125 14.604 18.125 15.3265 18.0279C16.0766 17.9271 16.7081 17.7113 17.2097 17.2097C17.7113 16.7081 17.9271 16.0766 18.0279 15.3265C18.125 14.604 18.125 13.6854 18.125 12.5458V12.5C18.125 12.1548 17.8452 11.875 17.5 11.875C17.1548 11.875 16.875 12.1548 16.875 12.5C16.875 13.6962 16.8737 14.5304 16.7891 15.1599C16.7068 15.7714 16.5565 16.0952 16.3258 16.3258C16.0952 16.5565 15.7714 16.7068 15.1599 16.7891C14.5304 16.8737 13.6962 16.875 12.5 16.875H7.5C6.30383 16.875 5.46956 16.8737 4.8401 16.7891C4.22863 16.7068 3.90481 16.5565 3.67418 16.3258C3.44354 16.0952 3.29317 15.7714 3.21096 15.1599C3.12633 14.5304 3.125 13.6962 3.125 12.5Z"
								fill="#020202"
								fillOpacity="0.5"
							/>
						</svg>

						<Text as="span" variant="headingXs" className="!font-black">
							Upload {uploadType === UploadTypes.CAR ? "Photos" : "Files"}
						</Text>

						<Text variant="captionMuted" className="mb-[25px]">
							Drag &amp; drop or click to choose files
						</Text>
					</div>

					<div className="flex gap-[7.5px] justify-center w-full">
						<Button
							variant="outline"
							onClick={() => imageInputRef.current?.click()}
							disabled={isDisabled}
						>
							Select
						</Button>

						<Button
							variant="primaryDark"
							onClick={() => cameraInputRef.current?.click()}
							disabled={isDisabled}
							trailingIcon="camera"
						>
							Take Photo
						</Button>

						<div
							className="motion-component transition-all data-[expand=true]:grow"
							data-expand={imageUrls.length !== 0 || uploadedUrls.length !== 0}
						/>

						<div className="flex gap-[15px]">
							{imageUrls.length !== 0 && (
								<Button
									variant="ghost"
									onClick={handleClearImages}
									disabled={isDisabled}
								>
									Clear
								</Button>
							)}

							<Button
								variant="primary"
								disabled={isDisabled || imageUrls.length === 0}
								onClick={handleClickUploadImagesButton}
							>
								{isPending ? "Uploading..." : "Upload"}
							</Button>
						</div>
					</div>
				</div>

				{/* ONE ROW: uploaded + pending, status label absolutely positioned per item */}
				{combined.length !== 0 && (
					<div className="w-full min-w-0 max-w-full">
						<div className="flex gap-3 rounded-md overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] w-full min-w-0">
							<AnimatePresence initial={false}>
								{combined.map((item, index) => (
									<FilePreview
										key={item.key}
										item={item}
										index={index}
										urlLooksLikeImage={urlLooksLikeImage}
										isDisabled={isDisabled}
										onRemovePending={(url) => {
											setImageUrls((prev) => prev.filter((f) => f.url !== url));
										}}
										onRemoveUploaded={(url) => {
											const next = uploadedUrls.filter((u) => u !== url);
											onUploadedChange?.(next);
										}}
									/>
								))}
							</AnimatePresence>
						</div>
					</div>
				)}
			</div>
		);
	},
);

export async function convertBlobUrlToFile(bloburl: string) {
	const response = await fetch(bloburl);
	const blob = await response.blob();
	const fileName = Math.random().toString(36).slice(2, 9);
	const mimeType = blob.type || "application/octet-stream";
	const file = new File([blob], `${fileName}.${mimeType.split("/")[1]}`, {
		type: mimeType,
	});
	return file;
}

/** Mocked upload */
type FakeUploadProps = {
	file: File;
	bucket: string;
	folder?: string;
};

type FakeUploadResponse = {
	success: boolean;
	imageUrl: string;
};

const fakeUploadFetcher = createFakeFetcher<FakeUploadResponse>({
	data: [{ success: true, imageUrl: "https://cdn.example.com/mock.png" }],
	minDelay: 500,
	maxDelay: 600,
	errorRate: 0.2,
});

async function fakeUploadToBucket({ file, bucket, folder }: FakeUploadProps) {
	try {
		await fakeUploadFetcher();

		const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
		const id = Math.random().toString(36).slice(2, 10);

		const imageUrl = `https://cdn.example.com/${bucket}${
			folder ? `/${folder}` : ""
		}/${id}.${ext}`;

		return { imageUrl, error: "" };
	} catch (e) {
		return {
			imageUrl: "",
			error: e instanceof Error ? e.message : "Image upload failed",
		};
	}
}
