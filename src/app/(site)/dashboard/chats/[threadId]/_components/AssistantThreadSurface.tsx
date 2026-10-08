"use client";

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import * as Assistant from "@/components/domain/assistant";
import { ApprovalDecision } from "@/components/domain/assistant/ApprovalDecision";
import {
	MessageQueue,
	type QueuedMessage,
} from "@/components/domain/assistant/MessageQueue";
import { Icon } from "@/components/ui/icons/Icon";
import { useConfirmationModal } from "@/components/ui/overlays/modal/useConfirmationModal";
import { Button } from "@/components/ui/primitives/Button";
import { Dropdown } from "@/components/ui/primitives/dropdown";
import { InlineError } from "@/components/ui/primitives/InlineError";
import { InputFrame } from "@/components/ui/primitives/InputFrame";
import { Card } from "@/components/ui/primitives/surfaces";
import type {
	AssistantApprovalDecision,
	AssistantContextReference,
	AssistantFixtureScenario,
	AssistantMessage,
	AssistantStagedAttachment,
	AssistantThread,
	AssistantToolMode,
	AssistantToolPart,
} from "@/lib/assistant/contracts";
import { toolLabels } from "@/lib/assistant/tool-presentation";
import { showToast } from "@/lib/feedback";
import { useDashboardRouteLoading } from "../../../_components/layout/DashboardShellContext";
import { DashboardWorkspaceToolbar } from "../../../_components/layout/DashboardWorkspaceToolbar";
import {
	AssistantMessagesLoading,
	AssistantWelcome,
	AssistantWorkspaceLoading,
} from "../../_components/AssistantWorkspaceLoading";
import { useAssistantComposerDraft } from "../../_components/useAssistantComposerDraft";

const sessionQueues = new Map<string, QueuedMessage[]>();
const pausedQueues = new Set<string>();
const MIN_LOADING_PHASE_MS = 240;

type AssistantRunPhase = "idle" | "loading" | "streaming" | "thinking";

function notifySidebar() {
	window.dispatchEvent(new Event("assistant:threads-changed"));
}

function approvalDescription(part: AssistantToolPart): string {
	const input =
		part.input && typeof part.input === "object"
			? (part.input as Record<string, unknown>)
			: {};
	const target =
		typeof input.title === "string"
			? `“${input.title}”`
			: typeof input.id === "string"
				? `record “${input.id}”`
				: "this record";
	const consequence =
		part.name === "record_delete"
			? `Permanently delete ${target}. This cannot be undone.`
			: part.name === "record_archive"
				? `Archive ${target}. It will leave the active records list.`
				: part.name === "record_create"
					? `Create ${target} in your organization.`
					: `Update ${target} in your organization.`;
	const changes = Object.entries(input)
		.filter(([key]) => key !== "id" && key !== "title")
		.map(
			([key, value]) =>
				`${key === "descriptionMarkdown" ? "Description" : key.replace(/([a-z])([A-Z])/g, "$1 $2")}: ${typeof value === "string" ? value : JSON.stringify(value)}`,
		)
		.join("; ");
	return changes ? `${consequence} ${changes}.` : consequence;
}

export function AssistantThreadSurface({
	canWrite,
	fixtureEnabled,
	initialThread,
}: {
	canWrite: boolean;
	fixtureEnabled: boolean;
	initialThread: AssistantThread;
}) {
	const [thread, setThread] = React.useState(initialThread);
	const messagesLoading = useDashboardRouteLoading();
	const [renaming, setRenaming] = React.useState(false);
	const [titleDraft, setTitleDraft] = React.useState(initialThread.title);
	const [renamePending, setRenamePending] = React.useState(false);
	const [renameError, setRenameError] = React.useState("");

	const [attachments, setAttachments] = React.useState<
		AssistantStagedAttachment[]
	>([]);
	const [uploading, setUploading] = React.useState(false);
	const uploadLock = React.useRef(false);
	const [busy, setBusy] = React.useState(false);
	const [runPhase, setRunPhase] = React.useState<AssistantRunPhase>("idle");
	const [pendingDecision, setPendingDecision] =
		React.useState<AssistantApprovalDecision | null>(null);
	const decisionPending = pendingDecision !== null;
	const [toolMode, setToolMode] = React.useState<AssistantToolMode>(
		initialThread.toolMode ?? (canWrite ? "read_write" : "read_only"),
	);
	const abortRef = React.useRef<AbortController | null>(null);
	const queueKey = `${initialThread.organizationId}:${initialThread.userId}:${initialThread.id}`;
	const [queue, setQueueState] = React.useState<QueuedMessage[]>(
		() => sessionQueues.get(queueKey) ?? [],
	);
	const queueRef = React.useRef(queue);
	const setQueue = (next: QueuedMessage[]) => {
		queueRef.current = next;
		sessionQueues.set(queueKey, next);
		setQueueState(next);
	};
	const { text: composerText, setText: setComposerText } =
		useAssistantComposerDraft(initialThread.id);
	const [composerReferences, setComposerReferences] = React.useState<
		AssistantContextReference[]
	>([]);
	const [showHelp, setShowHelp] = React.useState(false);
	const [composerFixture, setComposerFixture] =
		React.useState<AssistantFixtureScenario>();
	const composerRef = React.useRef<HTMLDivElement>(null);
	const [queuePaused, setQueuePausedState] = React.useState(() =>
		pausedQueues.has(queueKey),
	);
	const setQueuePaused = (paused: boolean) => {
		if (paused) pausedQueues.add(queueKey);
		else pausedQueues.delete(queueKey);
		setQueuePausedState(paused);
	};
	const [sendingId, setSendingId] = React.useState<string>();
	const [submissionError, setSubmissionError] = React.useState("");
	const [approvalError, setApprovalError] = React.useState("");
	const sendingRef = React.useRef(false);
	const decisionRef = React.useRef(false);
	const cancellingRef = React.useRef(false);
	const mounted = React.useRef(true);
	React.useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);
	const approvals = thread.messages.flatMap((message) =>
		message.parts.flatMap((part) =>
			part.type === "tool" &&
			part.state === "approval-requested" &&
			part.approvalId
				? [{ message, part }]
				: [],
		),
	);
	const router = useRouter();
	const { openConfirmation } = useConfirmationModal();

	const patchThread = async (patch: {
		pinned?: boolean;
		title?: string;
		toolMode?: AssistantToolMode;
	}) => {
		const response = await fetch(
			`/api/assistant/threads/${encodeURIComponent(thread.id)}`,
			{
				body: JSON.stringify(patch),
				headers: { "Content-Type": "application/json" },
				method: "PATCH",
			},
		);
		const body = await response.json();
		if (!response.ok)
			throw new Error(body.error ?? "Could not update conversation.");
		setThread(body.thread);
		notifySidebar();
	};

	const addFiles = async (files: File[]) => {
		if (uploadLock.current) return;
		uploadLock.current = true;
		setUploading(true);
		const available = Math.max(0, 5 - attachments.length);
		for (const file of files.slice(0, available)) {
			const form = new FormData();
			form.set("file", file);
			try {
				const response = await fetch("/api/assistant/files", {
					body: form,
					method: "POST",
				});
				const body = await response.json();
				if (!response.ok) throw new Error(body.error ?? "Upload failed.");
				setAttachments((current) => [
					...current,
					{ ...body.attachment, accessUrl: body.accessUrl },
				]);
			} catch (error) {
				showToast.error(
					error instanceof Error ? error.message : "Upload failed.",
				);
			}
		}
		uploadLock.current = false;
		setUploading(false);
	};

	const removeAttachment = async (attachment: AssistantStagedAttachment) => {
		setAttachments((current) =>
			current.filter((item) => item.id !== attachment.id),
		);
		await fetch(`/api/assistant/files/${encodeURIComponent(attachment.id)}`, {
			method: "DELETE",
		});
	};

	const submit = async (
		text: string,
		fixtureScenario?: AssistantFixtureScenario,
		queuedAttachments: AssistantStagedAttachment[] = [],
		requestId?: string,
		contextReferences: AssistantContextReference[] = [],
	) => {
		const submittedAttachments = queuedAttachments;
		const optimisticMessageId = `optimistic-${crypto.randomUUID()}`;
		const optimisticMessage: AssistantMessage = {
			createdAt: new Date().toISOString(),
			id: optimisticMessageId,
			parts: [
				...(text.trim()
					? [
							{
								id: crypto.randomUUID(),
								text: text.trim(),
								type: "text" as const,
							},
						]
					: []),
				...submittedAttachments.map((attachment) => ({
					attachment,
					id: crypto.randomUUID(),
					type: "file" as const,
				})),
			],
			role: "user",
			contextReferences,
		};
		setThread((current) => ({
			...current,
			messages: [...current.messages, optimisticMessage],
		}));
		setBusy(true);
		setRunPhase("loading");
		const loadingStartedAt = performance.now();
		const controller = new AbortController();
		abortRef.current = controller;
		let streamedMessageId: string | null = null;
		try {
			const response = await fetch("/api/assistant/chat", {
				body: JSON.stringify({
					requestId,
					contextReferences,
					attachmentIds: submittedAttachments.map(
						(attachment) => attachment.id,
					),
					fixtureScenario,
					text,
					threadId: thread.id,
					toolMode,
				}),
				headers: { "Content-Type": "application/json" },
				method: "POST",
				signal: controller.signal,
			});
			if (!response.ok || !response.body) {
				const body = await response.json().catch(() => ({}));
				throw new Error(body.error ?? "Assistant request failed.");
			}
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = "";
			while (true) {
				const { done, value } = await reader.read();
				buffer += decoder.decode(value, { stream: !done });
				const lines = buffer.split("\n");
				buffer = lines.pop() ?? "";
				for (const line of lines) {
					if (!line) continue;
					const event = JSON.parse(line) as {
						delta?: string;
						error?: string;
						message?: AssistantMessage;
						part?: AssistantToolPart;
						partId?: string;
						response?: AssistantMessage;
						title?: string;
						type: string;
					};
					if (event.type === "start" && event.message && event.response) {
						const serverUserMessage = event.message;
						const serverAssistantMessage = event.response;
						const remainingLoadingMs =
							MIN_LOADING_PHASE_MS - (performance.now() - loadingStartedAt);
						if (remainingLoadingMs > 0) {
							await new Promise((resolve) =>
								setTimeout(resolve, remainingLoadingMs),
							);
						}
						if (controller.signal.aborted)
							throw new Error("Assistant run stopped.");
						streamedMessageId = serverAssistantMessage.id;
						setRunPhase("thinking");
						setThread((current) => {
							const hasOptimisticMessage = current.messages.some(
								(message) => message.id === optimisticMessageId,
							);
							const reconciledMessages = hasOptimisticMessage
								? current.messages.map((message) =>
										message.id === optimisticMessageId
											? serverUserMessage
											: message,
									)
								: [...current.messages, serverUserMessage];
							return {
								...current,
								title: event.title ?? current.title,
								messages: [
									...reconciledMessages.filter(
										(item, index, all) =>
											item.id !== serverAssistantMessage.id &&
											all.findIndex((candidate) => candidate.id === item.id) ===
												index,
									),
									serverAssistantMessage,
								],
							};
						});
					}
					if (event.type === "delta" && event.delta && streamedMessageId) {
						setRunPhase("streaming");
						const messageId = streamedMessageId;
						const delta = event.delta;
						const textPartId = event.partId;
						setThread((current) => ({
							...current,
							messages: current.messages.map((message) => {
								if (message.id !== messageId || message.role !== "assistant")
									return message;
								if (
									textPartId &&
									!message.parts.some((part) => part.id === textPartId)
								) {
									return {
										...message,
										parts: [
											...message.parts,
											{
												id: textPartId,
												text: delta,
												type: "text" as const,
											},
										],
									};
								}
								return {
									...message,
									parts: message.parts.map((part) =>
										part.type === "text" &&
										(!textPartId || part.id === textPartId)
											? { ...part, text: part.text + delta }
											: part,
									),
								};
							}),
						}));
					}
					if (event.type === "tool" && event.part && streamedMessageId) {
						setRunPhase("streaming");
						const messageId = streamedMessageId;
						setThread((current) => ({
							...current,
							messages: current.messages.map((message) => {
								if (message.id !== messageId || message.role !== "assistant")
									return message;
								const exists = message.parts.some(
									(part) => part.id === event.part?.id,
								);
								return {
									...message,
									parts: exists
										? message.parts.map((part) =>
												part.id === event.part?.id ? event.part : part,
											)
										: [...message.parts, event.part as AssistantToolPart],
								};
							}),
						}));
					}
					if (event.type === "done" && event.message) {
						if (
							event.message.parts.some(
								(part) => part.type === "tool" && part.state === "error",
							) &&
							!controller.signal.aborted &&
							!cancellingRef.current
						)
							setQueuePaused(true);
						setRunPhase("idle");
						setThread((current) => ({
							...current,
							messages: current.messages.map((message) =>
								message.id === event.message?.id
									? (event.message as AssistantMessage)
									: message,
							),
						}));
					}
					if (event.type === "error")
						throw new Error(event.error ?? "Assistant request failed.");
				}
				if (done) break;
			}
			notifySidebar();
			return true;
		} catch (error) {
			if (controller.signal.aborted && streamedMessageId) {
				const messageId = streamedMessageId;
				setThread((current) => ({
					...current,
					messages: current.messages.map((message) =>
						message.id === messageId && message.role === "assistant"
							? {
									...message,
									parts: message.parts.map((part) =>
										part.type === "tool" &&
										(part.state === "input-streaming" ||
											part.state === "input-available")
											? {
													...part,
													error: "Tool preparation was stopped.",
													state: "error" as const,
												}
											: part,
									),
								}
							: message,
					),
				}));
			}
			if (!cancellingRef.current && !controller.signal.aborted) {
				setSubmissionError(
					error instanceof Error ? error.message : "Assistant request failed.",
				);
				setQueuePaused(true);
			}
			const refresh = await fetch(
				`/api/assistant/threads/${encodeURIComponent(thread.id)}`,
			)
				.then((response) => response.json())
				.catch(() => null);
			if (refresh?.thread && mounted.current) setThread(refresh.thread);
			return cancellingRef.current || controller.signal.aborted;
		} finally {
			abortRef.current = null;
			setBusy(false);
			setRunPhase("idle");
		}
	};

	const decideTool = async (
		message: AssistantMessage,
		part: AssistantToolPart,
		decision: AssistantApprovalDecision,
	) => {
		if (!part.approvalId || decisionRef.current) return;
		decisionRef.current = true;
		setApprovalError("");
		setPendingDecision(decision);
		try {
			const response = await fetch("/api/assistant/tools", {
				body: JSON.stringify({
					approvalId: part.approvalId,
					decision,
					toolMode,
					messageId: message.id,
					partId: part.id,
					threadId: thread.id,
				}),
				headers: { "Content-Type": "application/json" },
				method: "POST",
			});
			const body = await response.json();
			if (!response.ok)
				throw new Error(body.error ?? "Could not record approval.");
			setThread((current) => ({
				...current,
				messages: current.messages.map((item) =>
					item.id === message.id
						? {
								...item,
								parts: item.parts.map((candidate) =>
									candidate.id === part.id ? body.part : candidate,
								),
							}
						: item,
				),
			}));
			showToast.success(
				decision !== "deny"
					? "Record action completed."
					: "Record action declined.",
			);
		} catch (error) {
			setApprovalError(
				error instanceof Error
					? error.message
					: "Could not record approval. Try again.",
			);
			const latest = await fetch(
				`/api/assistant/threads/${encodeURIComponent(thread.id)}`,
			)
				.then((response) => response.json())
				.catch(() => null);
			if (latest?.thread) setThread(latest.thread);
		} finally {
			decisionRef.current = false;
			setPendingDecision(null);
		}
	};

	const stop = async () => {
		if (cancellingRef.current) return;
		cancellingRef.current = true;
		setQueuePaused(true);
		try {
			const response = await fetch("/api/assistant/cancel", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ threadId: thread.id }),
			});
			if (!response.ok)
				throw new Error("Could not confirm cancellation. Try again.");
			abortRef.current?.abort();
			const latest = await fetch(
				`/api/assistant/threads/${encodeURIComponent(thread.id)}`,
			).then((response) => response.json());
			if (latest.thread && mounted.current) setThread(latest.thread);
		} finally {
			cancellingRef.current = false;
		}
	};
	const dispatchMessage = async (item: QueuedMessage) => {
		sendingRef.current = true;
		setSendingId(item.id);
		setQueue(queueRef.current.filter((candidate) => candidate.id !== item.id));
		setSubmissionError("");
		const success = await submit(
			item.text,
			item.fixtureScenario,
			item.attachments,
			item.id,
			item.contextReferences,
		);
		if (!success) setQueue([item, ...queueRef.current]);
		sendingRef.current = false;
		setSendingId(undefined);
	};
	const processQueue = React.useEffectEvent(async () => {
		if (
			!mounted.current ||
			messagesLoading ||
			sendingRef.current ||
			cancellingRef.current ||
			busy ||
			queuePaused ||
			approvals.length ||
			decisionPending ||
			!queueRef.current.length
		)
			return;
		const item = queueRef.current[0];
		await dispatchMessage(item);
	});
	// biome-ignore lint/correctness/useExhaustiveDependencies: queue lifecycle transitions intentionally schedule the Effect Event.
	React.useEffect(() => {
		void processQueue();
	}, [
		queue,
		busy,
		queuePaused,
		approvals.length,
		decisionPending,
		messagesLoading,
	]);
	const enqueue = (
		text: string,
		fixtureScenario?: AssistantFixtureScenario,
		contextReferences: AssistantContextReference[] = [],
	) => {
		const item: QueuedMessage = {
			id: crypto.randomUUID(),
			text,
			fixtureScenario: fixtureScenario ?? composerFixture,
			contextReferences,
			attachments,
		};
		const sendImmediately =
			!busy &&
			!sendingRef.current &&
			!cancellingRef.current &&
			!messagesLoading &&
			!decisionPending &&
			!approvals.length &&
			!queueRef.current.length;

		setAttachments([]);
		setSubmissionError("");
		setComposerFixture(undefined);
		setQueuePaused(false);
		if (sendImmediately) void dispatchMessage(item);
		else setQueue([...queueRef.current, item]);
	};
	const sendNow = async (id: string) => {
		setQueuePaused(true);
		try {
			if (busy) await stop();
			const item = queueRef.current.find((candidate) => candidate.id === id);
			if (item)
				setQueue([
					item,
					...queueRef.current.filter((candidate) => candidate.id !== id),
				]);
			setQueuePaused(false);
		} catch (error) {
			setSubmissionError(
				error instanceof Error ? error.message : "Could not stop the response.",
			);
		}
	};
	const duplicate = async () => {
		const response = await fetch(
			`/api/assistant/threads/${encodeURIComponent(thread.id)}`,
			{ method: "POST" },
		);
		const body = await response.json();
		if (!response.ok) {
			showToast.error(body.error);
			return;
		}
		notifySidebar();
		router.push(`/dashboard/chats/${body.thread.id}`);
	};

	const deleteThread = () =>
		openConfirmation({
			confirmLabel: "Delete conversation",
			confirmTone: "danger",
			description: `Delete “${thread.title}” and all of its messages?`,
			onConfirm: async () => {
				const response = await fetch(
					`/api/assistant/threads/${encodeURIComponent(thread.id)}`,
					{ method: "DELETE" },
				);
				if (!response.ok) return false;
				notifySidebar();
				router.replace("/dashboard/chats/conversations");
				return true;
			},
			title: "Delete conversation?",
			warning: "This action cannot be undone.",
		});

	const attachmentSearchKey = attachments.map((file) => file.id).join(",");
	const searchContext = React.useCallback(
		async (query: string, signal: AbortSignal) => {
			const response = await fetch("/api/assistant/context", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				signal,
				body: JSON.stringify({
					threadId: thread.id,
					query,
					attachmentIds: attachmentSearchKey
						? attachmentSearchKey.split(",")
						: [],
				}),
			});
			const body = await response.json();
			if (!response.ok)
				throw new Error(body.error ?? "Could not search context.");
			return body.items;
		},
		[thread.id, attachmentSearchKey],
	);

	return (
		<section
			className="flex h-full min-h-0 flex-col bg-background"
			aria-label="Assistant conversation"
		>
			<Assistant.Conversation
				header={
					<DashboardWorkspaceToolbar>
						<h1 className="sr-only">{thread.title}</h1>
						{renaming ? (
							<form
								className="flex min-w-0 max-w-md flex-wrap items-center gap-1"
								onSubmit={async (event) => {
									event.preventDefault();
									if (renamePending || !titleDraft.trim()) return;
									setRenamePending(true);
									setRenameError("");
									try {
										await patchThread({ title: titleDraft });
										setRenaming(false);
										requestAnimationFrame(() =>
											document
												.querySelector<HTMLButtonElement>(
													'[aria-label="Conversation actions"]',
												)
												?.focus(),
										);
									} catch (error) {
										setRenameError(
											error instanceof Error
												? error.message
												: "Could not rename chat.",
										);
									} finally {
										setRenamePending(false);
									}
								}}
							>
								<InputFrame>
									<input
										ref={(element) => element?.focus()}
										aria-label="Conversation title"
										className="min-w-0 bg-transparent px-2 outline-none"
										value={titleDraft}
										onChange={(event) => setTitleDraft(event.target.value)}
										onKeyDown={(event) => {
											if (event.key === "Escape" && !renamePending) {
												setRenaming(false);
												requestAnimationFrame(() =>
													document
														.querySelector<HTMLButtonElement>(
															'[aria-label="Conversation actions"]',
														)
														?.focus(),
												);
											}
										}}
									/>
								</InputFrame>
								<Button
									size="xs"
									type="submit"
									disabled={renamePending || !titleDraft.trim()}
								>
									Save
								</Button>
								<Button
									size="xs"
									variant="bare"
									disabled={renamePending}
									onClick={() => {
										setRenaming(false);
										requestAnimationFrame(() =>
											document
												.querySelector<HTMLButtonElement>(
													'[aria-label="Conversation actions"]',
												)
												?.focus(),
										);
									}}
								>
									Cancel
								</Button>
								<InlineError open={!!renameError}>{renameError}</InlineError>
							</form>
						) : (
							<Dropdown.Menu
								ariaLabel="Conversation actions"
								openOnHover={false}
								triggerButtonProps={{
									variant: "bare",
									size: "none",
									className: "max-w-md text-sm font-medium",
								}}
								triggerContent={
									<span className="flex min-w-0 items-center gap-2">
										<span className="truncate">{thread.title}</span>
										<Icon name="chevron-down" size="sm" />
									</span>
								}
								options={[
									{
										id: "rename",
										label: "Rename chat",
										leadingIcon: <Icon name="pencil" size="sm" />,
										onSelect: () => {
											setTitleDraft(thread.title);
											setRenaming(true);
										},
									},
									{
										id: "duplicate",
										label: "Duplicate chat",
										leadingIcon: <Icon name="copy" size="sm" />,
										onSelect: () => void duplicate(),
									},
								]}
							/>
						)}

						<div className="ml-auto flex gap-1">
							<Button
								aria-label={
									thread.pinned ? "Unpin conversation" : "Pin conversation"
								}
								onClick={() =>
									void patchThread({ pinned: !thread.pinned }).catch((error) =>
										showToast.error(error.message),
									)
								}
								size="icon-sm"
								variant="bare"
							>
								<Icon name="pin" weight={thread.pinned ? "fill" : "regular"} />
							</Button>
							<Button
								aria-label="View conversations"
								href="/dashboard/chats/conversations"
								leadingIcon="history"
								size="icon-sm"
								variant="bare"
							/>
							<Button
								aria-label="Delete conversation"
								leadingIcon="trash"
								onClick={deleteThread}
								size="icon-sm"
								tone="danger"
								variant="bare"
							/>
						</div>
					</DashboardWorkspaceToolbar>
				}
			>
				{thread.messages.length === 0 ? (
					<AssistantWelcome />
				) : messagesLoading ? (
					<AssistantMessagesLoading />
				) : null}
				{!messagesLoading &&
					thread.messages.map((message) => (
						<Assistant.Message
							decisionPending={decisionPending}
							key={message.id}
							message={message}
							onEdit={
								busy
									? undefined
									: async (text, references) => {
											const response = await fetch(
												`/api/assistant/threads/${encodeURIComponent(thread.id)}`,
												{
													method: "PATCH",
													headers: { "Content-Type": "application/json" },
													body: JSON.stringify({
														messageId: message.id,
														text,
														contextReferences: references,
													}),
												},
											);
											const body = await response.json();
											if (!response.ok) throw new Error(body.error);
											setThread(body.thread);
										}
							}
							streaming={
								busy &&
								message.id === thread.messages.at(-1)?.id &&
								message.role === "assistant"
							}
						/>
					))}
				{!messagesLoading && runPhase === "thinking" ? (
					<Assistant.Thinking />
				) : null}
			</Assistant.Conversation>
			<div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
				{!messagesLoading && approvals[0] && (
					<ApprovalDecision
						key={approvals[0].part.id}
						title={toolLabels[approvals[0].part.name]}
						description={approvalDescription(approvals[0].part)}
						disabledReason="Enable Read & edit with Record write access to allow this action."
						remaining={approvals.length - 1}
						pendingDecision={pendingDecision}
						disabled={busy}
						error={approvalError}
						canAllow={canWrite && toolMode === "read_write"}
						onDecision={(decision) =>
							void decideTool(approvals[0].message, approvals[0].part, decision)
						}
					/>
				)}
				<InlineError variant="card" open={!!submissionError}>
					{submissionError}
					{queue.length > 0 &&
						" Your queued message and attachments are retained."}
				</InlineError>
			</div>
			{showHelp && (
				<section
					className="mx-auto w-full max-w-3xl px-4 pb-3 sm:px-6"
					aria-label="Composer help"
				>
					<Card padding="md" className="text-sm">
						<div className="flex items-center justify-between">
							<strong>Composer help</strong>
							<Button
								aria-label="Close composer help"
								variant="bare"
								size="icon-sm"
								leadingIcon="close"
								onClick={() => setShowHelp(false)}
							/>
						</div>
						<p>
							Enter sends; Shift+Enter adds a line. Type @ to include authorized
							context. Use /new to start a conversation. Messages sent during a
							run join its queue.
						</p>
						<p>
							Current tool permissions:{" "}
							{toolMode === "read_write"
								? "Read & edit"
								: toolMode === "read_only"
									? "Read only"
									: "No tools"}
							. Context never grants permission to run tools.
						</p>
					</Card>
				</section>
			)}
			<div
				ref={composerRef}
				className={`relative z-10 ${!approvals.length && !submissionError ? "-mt-[25px]" : ""}`}
			>
				<Assistant.Composer
					queue={
						<MessageQueue
							disabled={uploading}
							blocked={!!approvals.length || decisionPending}
							running={busy}
							items={queue}
							sendingId={sendingId}
							paused={queuePaused || !!approvals.length}
							onEdit={(id) => {
								if (uploading) return;
								const item = queueRef.current.find(
									(candidate) => candidate.id === id,
								);
								if (!item) return;
								setQueuePaused(true);
								const remaining = queueRef.current.filter(
									(candidate) => candidate.id !== id,
								);
								// Keep an existing unsent draft instead of overwriting it during the transfer.
								if (composerText.trim() || attachments.length)
									remaining.unshift({
										id: crypto.randomUUID(),
										text: composerText,
										fixtureScenario: composerFixture,
										contextReferences: composerReferences,
										attachments,
									});
								setQueue(remaining);
								setComposerText(item.text);
								setComposerReferences(item.contextReferences ?? []);
								setComposerFixture(item.fixtureScenario);
								setAttachments(item.attachments);
								requestAnimationFrame(() =>
									composerRef.current
										?.querySelector<HTMLTextAreaElement>("textarea")
										?.focus(),
								);
							}}
							onChange={(next) => {
								setQueue(next);
								if (!next.length) setSubmissionError("");
							}}
							onSendNow={(id) => void sendNow(id)}
						/>
					}
					contextReferences={composerReferences}
					onReferencesChange={setComposerReferences}
					searchContext={searchContext}
					onCommand={async (command) => {
						if (command === "help") {
							setShowHelp(true);
							return;
						}
						setQueuePaused(true);
						router.push("/dashboard/chats");
					}}
					draftValue={composerText}
					onDraftChange={setComposerText}
					pausedQueue={
						(queuePaused || !!approvals.length) && queue.length
							? {
									blocked: !!approvals.length || decisionPending,
									onResume: () => {
										setSubmissionError("");
										setQueuePaused(false);
									},
								}
							: undefined
					}
					attachments={attachments}
					busy={busy}
					canWrite={canWrite}
					submitDisabled={messagesLoading || decisionPending || uploading}
					attachmentsDisabled={uploading}
					submitting={runPhase === "loading"}
					fixtureEnabled={fixtureEnabled}
					onAddFiles={(files) => void addFiles(files)}
					onRemoveAttachment={(attachment) => void removeAttachment(attachment)}
					onStop={() =>
						void stop().catch((error) => setSubmissionError(error.message))
					}
					onSubmit={enqueue}
					onToolModeChange={(mode) => {
						const previous = toolMode;
						setToolMode(mode);
						void patchThread({ toolMode: mode }).catch((error) => {
							setToolMode(previous);
							showToast.error(error.message);
						});
					}}
					toolMode={toolMode}
				/>
			</div>
		</section>
	);
}

export function AssistantThreadSurfaceSkeleton() {
	const pathname = usePathname();
	const threadId = decodeURIComponent(pathname.split("/").at(-1) ?? "");
	const { text, setText } = useAssistantComposerDraft(threadId);
	return (
		<AssistantWorkspaceLoading
			variant="thread"
			draft={text}
			onDraftChange={setText}
		/>
	);
}
