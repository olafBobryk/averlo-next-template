"use client";

import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";

type FileInspectModalProps = {
	url: string;
	name: string;
	type: "pdf" | "file";
	onClose: () => void;
};

export function FileInspectModal({
	url,
	name,
	type,
	onClose,
}: FileInspectModalProps) {
	return (
		<div className="relative flex h-full w-full max-w-full max-h-full flex-col gap-5 p-1">
			<div className="flex items-center justify-between gap-3">
				<Text variant="bodyStrong" className="min-w-0 truncate text-background">
					{name}
				</Text>
				<div className="flex shrink-0 gap-2">
					<Button
						size="icon"
						trailingIcon="arrow-up"
						href={url}
						target="_blank"
						rel="noreferrer"
					/>
					<Button size="icon" trailingIcon="cross" onClick={onClose} />
				</div>
			</div>
			<div className="min-h-0 flex-1 overflow-hidden rounded-xl bg-background">
				{type === "pdf" ? (
					<iframe src={url} title={name} className="h-full w-full border-0" />
				) : (
					<div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
						<Text variant="bodyStrong">Preview unavailable</Text>
						<Text variant="body" tone="muted">
							This file type can be opened in a new tab.
						</Text>
						<Button href={url} target="_blank" rel="noreferrer">
							Open file
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
