"use client";

import Image from "next/image";
import { type ChangeEvent, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/primitives/Button";
import { createFakeFetcher } from "@/lib/mock";

export default function FileUploader({
	uploadType,
}: {
	uploadType: UploadTypes;
}) {
	const [imageUrls, setImageUrls] = useState<
		{ url: string; type: string; name: string }[]
	>([]);
	const imageInputRef = useRef<HTMLInputElement>(null);

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files);
			const newImageUrls = filesArray.map((file) => ({
				url: URL.createObjectURL(file),
				type: file.type,
				name: file.name,
			}));
			setImageUrls([...imageUrls, ...newImageUrls]);
		}
	};

	const [isPending, startTransition] = useTransition();

	const handleClickUploadImagesButton = () => {
		startTransition(async () => {
			const urls: string[] = [];
			const bucket = getCorrespondingBucket(uploadType);

			for (const props of imageUrls) {
				const imageFile = await convertBlobUrlToFile(props.url);

				// ✅ mocked upload (no supabase)
				const { imageUrl, error } = await fakeUploadToBucket({
					file: imageFile,
					bucket,
				});

				if (error) {
					console.error(error);
					return;
				}

				urls.push(imageUrl);
			}

			console.log("URLS: ", urls);
			setImageUrls([]);
		});
	};

	const handleClearImages = () => {
		setImageUrls([]);
	};

	return (
		<div
			className="flex flex-col gap-4 p-4 border rounded-lg bg-slate-100 w-full max-w-[500px]"
			style={{ height: "360px" }}
		>
			<input
				type="file"
				hidden
				multiple
				ref={imageInputRef}
				onChange={handleImageChange}
				disabled={isPending}
			/>

			<div className="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => imageInputRef.current?.click()}
				>
					Select
				</Button>

				{imageUrls.length === 0 ? (
					""
				) : (
					<Button
						variant="outline"
						size="sm"
						onClick={handleClearImages}
						disabled={isPending}
					>
						Clear
					</Button>
				)}

				<Button
					variant="primary"
					size="sm"
					className="ml-auto"
					onClick={handleClickUploadImagesButton}
					disabled={isPending}
				>
					{isPending ? "Uploading..." : "Upload"}
				</Button>
			</div>

			<div className="flex gap-3 overflow-x-auto p-2 bg-white rounded-md border">
				{imageUrls.map((props, index) => (
					<div
						key={props.url}
						className="relative w-24 h-24 bg-black/10 rounded-md flex items-center justify-center shrink-0"
					>
						{!props.type.startsWith("image/") ? (
							<div className="text-xs text-center flex flex-col items-center gap-1 px-2">
								📄<span className="text-[10px] break-all">{props.name}</span>
							</div>
						) : (
							<Image
								src={props.url}
								alt={`file-${index}`}
								width={96}
								height={96}
								className="object-cover rounded-md"
							/>
						)}

						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() =>
								setImageUrls(imageUrls.filter((f) => f.url !== props.url))
							}
							className="absolute top-1 right-1 !h-5 !w-5 !min-w-0 !min-h-0 !rounded-full bg-black/60 text-white text-[10px] hover:bg-black/70"
						>
							X
						</Button>
					</div>
				))}
			</div>
		</div>
	);
}

/**
 * Keep this exactly, since you're still building File from the blob URL.
 */
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

/** -----------------------------
 * Mocked "uploadImage" replacement
 * ------------------------------*/
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
		// Just to simulate time + occasional errors
		await fakeUploadFetcher();

		const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
		const id = Math.random().toString(36).slice(2, 10);

		// Fake but consistent-looking public URL
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
