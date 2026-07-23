"use client";

import { Icon } from "@/components/ui/icons/Icon";
import {
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/overlays/modal/ModalShell";
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
		<>
			<ModalHeader leadingIcon={<Icon name="notes" size="sm" />}>
				<ModalTitle className="min-w-0 truncate">{name}</ModalTitle>
				<ModalDescription>
					{type === "pdf" ? "PDF preview" : "File preview"}
				</ModalDescription>
			</ModalHeader>
			<ModalContent className="p-4">
				<div className="h-[min(70dvh,48rem)] min-h-0 overflow-hidden rounded-md bg-background">
					{type === "pdf" ? (
						<iframe src={url} title={name} className="h-full w-full border-0" />
					) : (
						<div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
							<Text variant="bodyStrong">Preview unavailable</Text>
							<Text variant="body" tone="muted">
								This file type can be opened in a new tab.
							</Text>
						</div>
					)}
				</div>
			</ModalContent>
			<ModalFooter>
				<Button onClick={onClose} type="button" variant="ghost">
					Close
				</Button>
				<Button
					href={url}
					leadingIcon="external-link"
					rel="noreferrer"
					target="_blank"
				>
					Open in new tab
				</Button>
			</ModalFooter>
		</>
	);
}
