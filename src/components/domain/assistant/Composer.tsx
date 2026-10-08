"use client";

import * as React from "react";
import { IconSwap } from "@/components/ui/helpers/IconSwap";
import { Icon, type IconName } from "@/components/ui/icons/Icon";
import { FileInput, type FileInputItem } from "@/components/ui/input";
import { Loader } from "@/components/ui/misc/Loader";
import { Button } from "@/components/ui/primitives/Button";
import { Dropdown } from "@/components/ui/primitives/dropdown";
import { InlineError } from "@/components/ui/primitives/InlineError";
import { InputFrame } from "@/components/ui/primitives/InputFrame";
import {
	type ComposerCommand,
	completeCommand,
	reconcileReferences,
} from "@/lib/assistant/composer-context";
import type {
	AssistantContextReference,
	AssistantFixtureScenario,
	AssistantStagedAttachment,
	AssistantToolMode,
} from "@/lib/assistant/contracts";
import { attachmentPreviewUrl } from "./attachment/access";
import { type ContextSearch, useComposerPicker } from "./ComposerPicker";

const fixtureScenarioPresentation: Array<{
	icon: IconName;
	label: string;
	scenario: AssistantFixtureScenario;
}> = [
	{
		icon: "sparkle",
		label: "Random lifecycle turn",
		scenario: "random_turn",
	},
	{
		icon: "pencil",
		label: "Tool call + approval",
		scenario: "tool_approval",
	},
	{
		icon: "chat",
		label: "Plain response",
		scenario: "plain_response",
	},
	{
		icon: "code",
		label: "Markdown stress test",
		scenario: "markdown_stress",
	},
	{ icon: "database", label: "Record list report", scenario: "records_list" },
	{ icon: "eye", label: "Record detail report", scenario: "record_get" },
	{ icon: "warning", label: "Record error", scenario: "record_error" },
	{ icon: "plus", label: "Create Record approval", scenario: "record_create" },
	{
		icon: "pencil",
		label: "Update Record comparison",
		scenario: "record_update",
	},
	{
		icon: "archive",
		label: "Archive Record comparison",
		scenario: "record_archive",
	},
	{
		icon: "trash",
		label: "Delete Record comparison",
		scenario: "record_delete",
	},
];

const toolModePresentation: Record<
	AssistantToolMode,
	{ icon: IconName; label: string }
> = {
	off: {
		icon: "close",
		label: "No tools",
	},
	read_only: {
		icon: "eye",
		label: "Read only",
	},
	read_write: {
		icon: "pencil",
		label: "Read & edit",
	},
};

function ComposerAddMenu({
	disabled = false,
	onAttachFiles,
	onRunFixture,
}: {
	disabled?: boolean;
	onAttachFiles: () => void;
	onRunFixture?: (scenario: AssistantFixtureScenario, label: string) => void;
}) {
	return (
		<Dropdown.Menu
			ariaLabel="Add context"
			disabled={disabled}
			openOnHover={false}
			options={[
				{
					id: "attach-files",
					label: "Attach files",
					leadingIcon: <Icon name="paperclip" size="sm" />,
					onSelect: onAttachFiles,
				},
				...(onRunFixture
					? fixtureScenarioPresentation.map((fixture, index) => ({
							dividerBefore: index === 0,
							id: `assistant-fixture-${fixture.scenario}`,
							label: `Fixture: ${fixture.label}`,
							leadingIcon: <Icon name={fixture.icon} size="sm" />,
							onSelect: () => onRunFixture(fixture.scenario, fixture.label),
						}))
					: []),
			]}
			positionStrategy="fixed"
			triggerContent={<Icon name="plus" />}
		/>
	);
}

function ToolModeMenu({
	disabled = false,
	modes,
	onChange,
	value,
}: {
	disabled: boolean;
	modes: AssistantToolMode[];
	onChange: (mode: AssistantToolMode) => void;
	value: AssistantToolMode;
}) {
	const current = toolModePresentation[value];

	return (
		<Dropdown.Listbox
			ariaLabel={`Tool permissions: ${current.label}`}
			disabled={disabled}
			openOnHover={false}
			onSelect={(mode) => onChange(mode)}
			options={modes.map((mode) => {
				const option = toolModePresentation[mode];
				return {
					content: (
						<span className="flex items-center gap-2">
							<Icon name={option.icon} size="sm" />
							<span>{option.label}</span>
						</span>
					),
					key: `assistant-tool-mode-${mode}`,
					selected: mode === value,
					tone: mode === "read_write" ? "warning" : undefined,
					value: mode,
				};
			})}
			positionStrategy="fixed"
			triggerButtonProps={{
				className: value === "read_write" ? "!text-warning" : undefined,
				variant: "bare",
				size: "icon-sm",
				shape: "square",
			}}
			triggerContent={<Icon name={current.icon} />}
		/>
	);
}

export function Composer({
	queue,
	contextReferences,
	onReferencesChange,
	searchContext,
	onCommand,
	draftValue,
	onDraftChange,
	pausedQueue,
	attachments,
	busy,
	canWrite,
	disabled = false,
	submitDisabled = false,
	attachmentsDisabled = false,
	permissionsLoading = false,
	submitting = false,
	fixtureEnabled = false,
	onAddFiles,
	onRemoveAttachment,
	onStop,
	onSubmit,
	onToolModeChange,
	toolMode,
}: {
	queue?: React.ReactNode;
	contextReferences?: AssistantContextReference[];
	onReferencesChange?: (references: AssistantContextReference[]) => void;
	searchContext?: ContextSearch;
	onCommand?: (command: ComposerCommand) => void | Promise<void>;
	draftValue?: string;
	onDraftChange?: (value: string) => void;
	pausedQueue?: { blocked?: boolean; onResume: () => void };
	attachments: AssistantStagedAttachment[];
	busy: boolean;
	canWrite: boolean;
	disabled?: boolean;
	/** Block submission while dependencies are pending, retaining editable drafts. */
	submitDisabled?: boolean;
	attachmentsDisabled?: boolean;
	permissionsLoading?: boolean;
	/** Pending send request; streaming remains cancellable and drafts remain editable. */
	submitting?: boolean;
	fixtureEnabled?: boolean;
	onAddFiles: (files: File[]) => void;
	onRemoveAttachment: (attachment: AssistantStagedAttachment) => void;
	onStop: () => void;
	onSubmit: (
		text: string,
		fixtureScenario?: AssistantFixtureScenario,
		references?: AssistantContextReference[],
	) => void;
	onToolModeChange: (mode: AssistantToolMode) => void;
	toolMode: AssistantToolMode;
}) {
	const [localDraft, setLocalDraft] = React.useState("");
	const text = draftValue ?? localDraft;
	const rawSetText = onDraftChange ?? setLocalDraft;
	const [localReferences, setLocalReferences] = React.useState<
		AssistantContextReference[]
	>([]);
	const references = contextReferences ?? localReferences;
	const setReferences = onReferencesChange ?? setLocalReferences;
	const setText = (value: string) => {
		setReferences(reconcileReferences(text, value, references));
		rawSetText(value);
	};
	const [commandError, setCommandError] = React.useState("");
	const [commandPending, setCommandPending] = React.useState(false);
	const commandLock = React.useRef(false);
	const stopAvailable = busy && !text.trim() && !attachments.length;
	const resume = !!pausedQueue && !busy && !text.trim() && !attachments.length;
	const textareaRef = React.useRef<HTMLTextAreaElement>(null);
	React.useLayoutEffect(() => {
		const element = textareaRef.current;
		if (!element || element.value !== text) return;
		element.style.height = "auto";
		element.style.height = `${Math.min(element.scrollHeight, 240)}px`;
	}, [text]);
	const picker = useComposerPicker({
		text,
		references,
		textarea: textareaRef,
		search: searchContext,
		disabled: disabled || commandPending,
		onChange: (value, refs) => {
			rawSetText(value);
			setReferences(refs);
		},
	});
	const fileRef = React.useRef<HTMLInputElement>(null);
	const submit = async () => {
		if (
			(!text.trim() && attachments.length === 0) ||
			disabled ||
			submitDisabled ||
			(submitting && !busy) ||
			commandLock.current
		)
			return;
		setCommandError("");
		const command = completeCommand(text);
		if (command && onCommand) {
			if (command === "new" && attachments.length) {
				setCommandError(
					"Remove attached files before starting a new conversation.",
				);
				return;
			}
			commandLock.current = true;
			setCommandPending(true);
			try {
				await onCommand(command);
				// Do not erase a draft edited while the command was pending.
				if (textareaRef.current?.value === text) {
					rawSetText("");
					setReferences([]);
					picker.close();
				}
			} catch (error) {
				setCommandError(
					error instanceof Error ? error.message : "Could not run command.",
				);
			} finally {
				commandLock.current = false;
				setCommandPending(false);
			}
			return;
		}
		onSubmit(text, undefined, references);
		rawSetText("");
		setReferences([]);
		picker.close();
	};

	const modes: AssistantToolMode[] = canWrite
		? ["read_write", "read_only", "off"]
		: ["read_only", "off"];
	const fileItems: FileInputItem[] = attachments.map((attachment) => ({
		key: attachment.id,
		name: attachment.filename,
		status: "uploaded",
		type: attachment.contentType,
		unoptimized: true,
		url: attachment.accessUrl,
		resolveUrl: attachmentPreviewUrl(attachment.id),
	}));
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: file drop supplements the keyboard-accessible Attach files control.
		<div
			className="mx-auto w-full max-w-3xl px-4 pb-4 sm:px-6"
			role="presentation"
			onDragOver={(event) => {
				if (event.dataTransfer.types.includes("Files")) event.preventDefault();
			}}
			onDrop={(event) => {
				if (!event.dataTransfer.files.length) return;
				event.preventDefault();
				if (!disabled && !attachmentsDisabled) {
					onAddFiles(Array.from(event.dataTransfer.files));
				}
			}}
		>
			<InlineError variant="card" open={!!commandError}>
				{commandError}
			</InlineError>
			<div className="group/composer relative">
				{queue}
				<InputFrame
					className="relative h-auto"
					contentClassName="grid w-full min-w-0 gap-2 p-2"
					fullWidth
					presentation="composer"
				>
					{picker.view}
					{attachments.length > 0 ? (
						<FileInput
							className="px-1 pt-1"
							items={fileItems}
							label={null}
							onItemsChange={(nextItems) => {
								const retainedIds = new Set(
									nextItems.flatMap((item) =>
										item.status === "uploaded" && item.key ? [item.key] : [],
									),
								);
								for (const attachment of attachments) {
									if (!retainedIds.has(attachment.id)) {
										onRemoveAttachment(attachment);
									}
								}
							}}
							showAddControl={false}
						/>
					) : null}
					<textarea
						{...picker.aria}
						aria-label="Message Assistant"
						className="max-h-60 min-h-12 w-full resize-none bg-transparent px-2 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
						disabled={disabled}
						onChange={(event) => {
							setText(event.target.value);
							if (!(event.nativeEvent as InputEvent).isComposing)
								picker.update(event.target.value, event.target.selectionStart);
						}}
						onClick={(event) =>
							picker.update(
								event.currentTarget.value,
								event.currentTarget.selectionStart,
							)
						}
						onCompositionEnd={(event) =>
							picker.update(
								event.currentTarget.value,
								event.currentTarget.selectionStart,
							)
						}
						onKeyUp={(event) => {
							if (
								["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
							)
								picker.update(
									event.currentTarget.value,
									event.currentTarget.selectionStart,
								);
						}}
						onKeyDown={(event) => {
							if (picker.onKeyDown(event)) return;
							if (
								event.key === "Enter" &&
								!event.shiftKey &&
								!event.altKey &&
								!event.nativeEvent.isComposing &&
								event.keyCode !== 229
							) {
								event.preventDefault();
								submit();
							}
						}}
						placeholder="Ask about your records…"
						ref={textareaRef}
						onPaste={(event) => {
							const files = Array.from(event.clipboardData.files);
							if (files.length) {
								event.preventDefault();
								if (!disabled && !attachmentsDisabled) onAddFiles(files);
							}
						}}
						rows={1}
						value={text}
					/>
					<div className="flex items-center gap-1">
						<input
							accept="application/pdf,image/jpeg,image/png,image/webp"
							aria-label="Attach files"
							tabIndex={-1}
							className="sr-only"
							multiple
							disabled={disabled || attachmentsDisabled}
							onChange={(event) => {
								onAddFiles(Array.from(event.target.files ?? []));
								event.target.value = "";
							}}
							ref={fileRef}
							type="file"
						/>
						<ComposerAddMenu
							disabled={disabled || attachmentsDisabled}
							onAttachFiles={() => fileRef.current?.click()}
							onRunFixture={
								fixtureEnabled && !submitDisabled
									? (scenario, label) => onSubmit(`Fixture: ${label}`, scenario)
									: undefined
							}
						/>
						{permissionsLoading ? (
							<Button.Skeleton size="icon-sm" variant="bare" />
						) : (
							<ToolModeMenu
								disabled={busy || disabled}
								modes={modes}
								onChange={onToolModeChange}
								value={toolMode}
							/>
						)}
						<div className="ml-auto flex items-center gap-2">
							<Button
								aria-label={
									resume
										? "Resume queued messages"
										: busy && !text.trim() && !attachments.length
											? "Stop"
											: busy
												? "Queue message"
												: "Send message"
								}
								loading={commandPending || (submitting && !busy)}
								disabled={
									disabled ||
									(submitDisabled && !stopAvailable) ||
									commandPending ||
									(resume
										? pausedQueue?.blocked
										: !busy && !text.trim() && !attachments.length)
								}
								onClick={
									resume
										? pausedQueue?.onResume
										: busy && !text.trim() && !attachments.length
											? onStop
											: submit
								}
								size="icon-sm"
								shape="round"
								variant="primary"
							>
								{submitting && busy && !text.trim() && !attachments.length ? (
									<span className="relative inline-flex size-5 items-center justify-center">
										<span className="sr-only" role="status">
											Sending message…
										</span>
										<Loader className="absolute inset-0" size="md" />
										<Icon
											name="stop"
											size="sm"
											className="scale-50"
											weight="fill"
										/>
									</span>
								) : (
									<IconSwap
										activeIndex={
											resume
												? 1
												: busy && !text.trim() && !attachments.length
													? 2
													: 0
										}
										items={[
											{
												icon: <Icon name="arrow-up" size="sm" />,
												key: "send",
											},
											{ icon: <Icon name="play" size="sm" />, key: "resume" },
											{
												icon: <Icon name="stop" size="sm" weight="fill" />,
												key: "stop",
											},
										]}
										size="sm"
									/>
								)}
							</Button>
						</div>
					</div>
				</InputFrame>
			</div>
			<p className="mt-2 text-center text-muted-foreground text-xs">
				Assistant can make mistakes. Record changes follow your connection
				permissions.
			</p>
		</div>
	);
}
