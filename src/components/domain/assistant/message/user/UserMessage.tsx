"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/primitives/Button";
import { InlineError } from "@/components/ui/primitives/InlineError";
import { InputFrame } from "@/components/ui/primitives/InputFrame";
import { reconcileReferences } from "@/lib/assistant/composer-context";
import type {
	AssistantContextReference,
	AssistantUserMessage as Contract,
} from "@/lib/assistant/contracts";
import { MessageFrame } from "../frame";
import { UserMessageAttachments } from "./UserMessageAttachments";

export function UserMessage({
	message,
	onEdit,
}: {
	message: Contract;
	onEdit?: (
		text: string,
		references?: AssistantContextReference[],
	) => Promise<void>;
}) {
	const text = message.parts
		.flatMap((part) => (part.type === "text" ? [part.text] : []))
		.join("\n");
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(text);
	const [draftReferences, setDraftReferences] = useState(
		message.contextReferences ?? [],
	);
	const [expanded, setExpanded] = useState(false);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");
	const [copied, setCopied] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const editRef = useRef<HTMLButtonElement>(null);
	const restoreFocus = useRef(false);
	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(timer);
	}, [copied]);
	useLayoutEffect(() => {
		const el = textareaRef.current;
		if (!editing || !el || el.value !== draft) return;
		el.style.height = "auto";
		el.style.height = `${Math.max(98, Math.min(el.scrollHeight, 300))}px`;
	}, [editing, draft]);
	useLayoutEffect(() => {
		if (!editing && restoreFocus.current) {
			restoreFocus.current = false;
			editRef.current?.focus();
		}
		if (editing) {
			const el = textareaRef.current;
			el?.focus();
			el?.setSelectionRange(el.value.length, el.value.length);
		}
	}, [editing]);
	const close = () => {
		restoreFocus.current = true;
		setEditing(false);
		setError("");
	};
	const save = async () => {
		if (!onEdit || pending) return;
		if (!draft.trim() && !message.parts.some((part) => part.type === "file")) {
			setError("Message cannot be empty.");
			textareaRef.current?.focus();
			return;
		}
		if (draft.trim() === text.trim()) {
			close();
			return;
		}
		setPending(true);
		setError("");
		try {
			await onEdit(draft, draftReferences);
			close();
		} catch (error) {
			setError(error instanceof Error ? error.message : "Could not save.");
		} finally {
			setPending(false);
		}
	};
	return (
		<MessageFrame ariaLabel="You">
			<div
				data-slot="user-message"
				className={`group/turn ml-auto flex min-w-0 flex-col ${editing ? "w-full" : "w-fit max-w-[85%]"}`}
			>
				{editing ? (
					<InputFrame
						presentation="composer"
						fullWidth
						className="h-auto"
						contentClassName="w-full min-w-0"
					>
						<textarea
							ref={textareaRef}
							aria-label="Edit message"
							aria-invalid={!!error}
							aria-describedby={
								error ? `message-error-${message.id}` : undefined
							}
							className="block min-h-[98px] w-full min-w-0 resize-none bg-transparent px-4 py-3 text-sm outline-none"
							value={draft}
							disabled={pending}
							onChange={(event) => {
								setDraftReferences(
									reconcileReferences(
										draft,
										event.target.value,
										draftReferences,
									),
								);
								setDraft(event.target.value);
								setError("");
							}}
							onKeyDown={(event) => {
								if (event.nativeEvent.isComposing || event.keyCode === 229)
									return;
								if (event.key === "Escape" && !pending) {
									event.preventDefault();
									close();
								}
								if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
									event.preventDefault();
									void save();
								}
							}}
						/>
					</InputFrame>
				) : text.trim() ? (
					<div
						data-slot="user-message-bubble"
						className="w-fit max-w-full self-end rounded-xl bg-surface px-4 py-2.5"
					>
						<p
							className={`whitespace-pre-wrap break-words text-sm [overflow-wrap:anywhere] ${!expanded && text.length > 1200 ? "line-clamp-8" : ""}`}
						>
							{text}
						</p>
						{text.length > 1200 && (
							<Button
								variant="bare"
								size="none"
								iconSize={14}
								className="min-h-7 py-1"
								onClick={() => setExpanded(!expanded)}
							>
								{expanded ? "Show less" : "Show more"}
							</Button>
						)}
					</div>
				) : null}
				{message.parts.some((part) => part.type === "file") && (
					<div className={text.trim() ? "mt-3" : undefined}>
						<UserMessageAttachments parts={message.parts} />
					</div>
				)}
				<div
					data-slot="user-message-actions"
					className="relative mt-2 flex h-7 items-center justify-end text-xs text-muted-foreground"
				>
					<div
						className={`absolute right-4 flex items-center gap-3 motion-micro transition-opacity ${editing ? "" : "opacity-0 group-hover/turn:opacity-100 group-focus-within/turn:opacity-100"}`}
					>
						{!editing && (
							<time className="whitespace-nowrap" dateTime={message.createdAt}>
								{new Date(message.createdAt).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</time>
						)}
						{editing ? (
							<>
								<Button
									aria-label="Save message in place"
									title="Save message in place"
									variant="bare"
									size="none"
									iconSize={14}
									className="min-h-7 py-1"
									shape="round"
									leadingIcon="check"
									loading={pending}
									onClick={() => void save()}
								/>
								<Button
									aria-label="Cancel editing"
									title="Cancel editing"
									variant="bare"
									size="none"
									iconSize={14}
									className="min-h-7 py-1"
									shape="round"
									leadingIcon="close"
									disabled={pending}
									onClick={close}
								/>
							</>
						) : (
							<>
								{onEdit && (
									<Button
										ref={editRef}
										aria-label="Edit message"
										title="Edit message"
										variant="bare"
										size="none"
										iconSize={14}
										className="min-h-7 py-1"
										shape="round"
										leadingIcon="pencil"
										onClick={() => {
											setDraft(text);
											setDraftReferences(message.contextReferences ?? []);
											setError("");
											setEditing(true);
										}}
									/>
								)}
								<Button
									aria-label={copied ? "Copied message" : "Copy message"}
									title={copied ? "Copied" : "Copy message"}
									variant="bare"
									size="none"
									iconSize={14}
									className="min-h-7 py-1"
									shape="round"
									leadingIcon={copied ? "check" : "copy"}
									onClick={async () => {
										try {
											await navigator.clipboard.writeText(text);
											setCopied(true);
										} catch {
											setError("Could not copy message.");
										}
									}}
								/>
							</>
						)}
					</div>
				</div>
				{error && (
					<InlineError id={`message-error-${message.id}`} open>
						{error}
					</InlineError>
				)}
			</div>
		</MessageFrame>
	);
}
