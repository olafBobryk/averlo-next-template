"use client";

import Image from "next/image";
import * as React from "react";
import { Text } from "@/components/ui/primitives/Text";

type UploadedFilesListProps = {
	files: string[];
	onRemove: (url: string) => void;
	disabled?: boolean;
	className?: string;
};

function isLikelyImage(url: string) {
	return /\.(png|jpg|jpeg|webp|gif|svg)(\?.*)?$/i.test(url);
}

function nameFromUrl(url: string) {
	try {
		const u = new URL(url);
		const last = u.pathname.split("/").pop() ?? url;
		return decodeURIComponent(last);
	} catch {
		return url.split("/").pop() ?? url;
	}
}

export function UploadedFilesList({
	files,
	onRemove,
	disabled,
	className,
}: UploadedFilesListProps) {
	if (!files.length) return null;

	return (
		<div
			className={[
				"flex flex-col gap-3 rounded-[12px] border border-border/15 bg-white p-3",
				className,
			].join(" ")}
		>
			<Text variant="muted" className="text-xs uppercase">
				Uploaded files
			</Text>

			<div className="flex gap-3 overflow-x-auto">
				{files.map((url) => {
					const isImg = isLikelyImage(url);
					const name = nameFromUrl(url);

					return (
						<div
							key={url}
							className="relative w-24 h-24 bg-black/10 rounded-md flex items-center justify-center shrink-0"
						>
							{isImg ? (
								<Image
									src={url}
									alt={name}
									width={96}
									height={96}
									className="object-cover rounded-md"
								/>
							) : (
								<div className="text-xs text-center flex flex-col items-center gap-1 px-2">
									📄<span className="text-[10px] break-all">{name}</span>
								</div>
							)}

							<button
								type="button"
								onClick={() => onRemove(url)}
								disabled={disabled}
								className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
							>
								X
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}
