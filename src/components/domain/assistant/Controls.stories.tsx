import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { useRef, useState } from "react";
import {
	expect,
	fireEvent,
	fn,
	userEvent,
	waitFor,
	within,
} from "storybook/test";
import { IconProvider } from "@/components/ui/icons/iconRegistry";
import { openaiIconRegistry } from "@/components/ui/icons/openaiRegistry";
import type {
	AssistantApprovalDecision,
	AssistantToolMode,
} from "@/lib/assistant/contracts";
import { ApprovalDecision } from "./ApprovalDecision";
import { Composer } from "./Composer";
import { catalogContract } from "./Controls.catalog";
import { MessageQueue, type QueuedMessage } from "./MessageQueue";

function QueueExample({ running = false }: { running?: boolean } = {}) {
	const composerElement = useRef<HTMLDivElement>(null);
	const [items, setItems] = useState<QueuedMessage[]>([
		{ id: "one", text: "Summarize the results", attachments: [] },
		{ id: "two", text: "Prepare the next steps", attachments: [] },
		{
			id: "three",
			text: "A longer queued message that must remain one row even when its controls are revealed",
			attachments: [],
		},
		{ id: "four", text: "Finish the review", attachments: [] },
	]);
	const [draft, setDraft] = useState("");
	const [paused, setPaused] = useState(true);
	return (
		<div ref={composerElement}>
			<Composer
				draftValue={draft}
				onDraftChange={setDraft}
				attachments={[]}
				busy={running}
				canWrite
				pausedQueue={
					paused && items.length
						? { onResume: () => setPaused(false) }
						: undefined
				}
				onAddFiles={fn()}
				onRemoveAttachment={fn()}
				onStop={fn()}
				onToolModeChange={fn()}
				toolMode="read_write"
				onSubmit={(text) => {
					setItems((current) => [
						...current,
						{ id: crypto.randomUUID(), text, attachments: [] },
					]);
					setPaused(false);
				}}
				queue={
					<MessageQueue
						items={items}
						running={running}
						sendingId={running ? "already-dispatched" : undefined}
						paused={paused}
						onEdit={(id) => {
							const item = items.find((item) => item.id === id);
							if (!item) return;
							const remaining = items.filter((item) => item.id !== id);
							if (draft.trim())
								remaining.unshift({
									id: crypto.randomUUID(),
									text: draft,
									attachments: [],
								});
							setItems(remaining);
							setDraft(item.text);
							setPaused(true);
							requestAnimationFrame(() =>
								composerElement.current?.querySelector("textarea")?.focus(),
							);
						}}
						onChange={setItems}
						onSendNow={(id) => setItems(items.filter((item) => item.id !== id))}
					/>
				}
			/>
		</div>
	);
}

function ComposerExample({ busy = false }: { busy?: boolean }) {
	const [mode, setMode] = useState<AssistantToolMode>("read_write");
	const [submitted, setSubmitted] = useState("");
	return (
		<>
			<Composer
				attachments={[]}
				busy={busy}
				canWrite
				onAddFiles={fn()}
				onRemoveAttachment={fn()}
				onStop={() => setSubmitted("Stopped")}
				onSubmit={(text) => setSubmitted(text)}
				onToolModeChange={setMode}
				toolMode={mode}
			/>
			<output aria-label="Submitted message">{submitted}</output>
		</>
	);
}
function ApprovalExample({
	error = false,
	pending = false,
}: {
	error?: boolean;
	pending?: boolean;
}) {
	const [decision, setDecision] = useState<AssistantApprovalDecision>();
	return decision ? (
		<p role="status">
			{decision === "deny"
				? "Denied"
				: decision === "always_allow"
					? "Always allowed"
					: "Allowed once"}
		</p>
	) : (
		<ApprovalDecision
			title="Publish the launch brief?"
			description="Make the updated launch brief visible to everyone in your workspace."
			remaining={2}
			pendingDecision={pending ? "allow_once" : undefined}
			error={error ? "Could not save your decision. Try again." : undefined}
			canAllow
			onDecision={setDecision}
		/>
	);
}
const meta = {
	id: "domain-assistant-controls",
	title: "Domain/Assistant/Controls",
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		a11y: { test: "error" },
		docs: {
			description: {
				component:
					"Composer owns the anchored / and @ picker. searchContext(query, signal) returns authorized context items; contextReferences/onReferencesChange carry stable identities and text ranges with a controlled draft. onCommand handles complete /help and /new submissions locally, separately from onSubmit(text, fixtureScenario, references). Selecting an option never sends. New conversation commands reject attached files. Native multiline textbox focus and aria-activedescendant drive the listbox; escape/outside click dismiss, arrows clamp and IME is preserved. Loading belongs to fetched regions and dependent actions: submitDisabled gates sending without locking the draft; attachmentsDisabled gates file intake; permissionsLoading reserves only the permission control. submitting shows pending send feedback; busy keeps Stop cancellable and supports queueing. The real input frame remains visible throughout. Composer accepts browser files, paste/drop and IME-safe Enter; Shift+Enter adds a line. Drafts submitted during a run enter the conversation queue. Queue dispatch pauses for editing, approvals, cancellation and failures. Recovery retains content and attachments. ApprovalDecision accepts title and description for any action, with onDecision and optional pendingDecision/disabled/error/remaining/canAllow/disabledReason/allowAlways state. Callers describe consequences and retain arguments in tool disclosure. Allow once is primary; deny is bare. Composer-adjacent queue and approvals use shared Card background and elevation. QueueDocked owns the docked shell, 40px underlap, row/reorder/reveal motion and uniform 32px rows. The right pencil removes the queued item and transfers it to the composer for editing and resending; an existing draft is retained as a queued item. Resume belongs to the empty composer as a play action; right actions remain visible; the six-dot drag handle reveals horizontally on hover or keyboard focus. Whole-queue entry/exit includes the header and fixed composer underlap. ApprovalDecision shows the first actionable request; callers own once/always/deny persistence, pending locks and stale reconciliation. Capability-dependent controls require working adapters.",
			},
		},
	},
	decorators: [
		(Story) => (
			<IconProvider registry={openaiIconRegistry}>
				<div className="mx-auto max-w-2xl p-4">
					<Story />
				</div>
			</IconProvider>
		),
	],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const ComposerIdle: Story = {
	render: () => <ComposerExample />,
	play: async ({ canvas }) => {
		const input = canvas.getByRole("textbox", { name: "Message Assistant" });
		await expect(
			canvas.getByRole("button", { name: "Send message" }),
		).toBeDisabled();
		await userEvent.type(input, "First line{shift>}{enter}{/shift}Second line");
		await expect(input).toHaveValue("First line\nSecond line");
		await userEvent.keyboard("{enter}");
		await expect(canvas.getByLabelText("Submitted message")).toHaveTextContent(
			"Second line",
		);
		await expect(input).toHaveValue("");
	},
};
export const StreamingComposer: Story = {
	render: () => <ComposerExample busy />,
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("button", { name: "Stop" })).toBeEnabled();
		await userEvent.type(
			canvas.getByRole("textbox", { name: "Message Assistant" }),
			"Next turn",
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Queue message" }),
		);
		await expect(canvas.getByLabelText("Submitted message")).toHaveTextContent(
			"Next turn",
		);
	},
};
export const QueueEditing: Story = {
	render: () => <QueueExample />,
	play: async ({ canvas }) => {
		const region = canvas.getByRole("region", { name: "Message queue" });
		const queue = within(region);
		const input = canvas.getByRole("textbox", { name: "Message Assistant" });
		await expect(
			canvas.getByRole("button", { name: "Resume queued messages" }),
		).toBeEnabled();
		await expect(queue.queryByRole("button", { name: "Resume" })).toBeNull();
		await userEvent.type(input, "Unsent draft");
		await userEvent.click(
			queue.getByRole("button", { name: "Edit queued message 1" }),
		);
		await waitFor(() =>
			expect(queue.queryByText("Summarize the results")).toBeNull(),
		);
		await expect(input).toHaveValue("Summarize the results");
		await waitFor(() => expect(queue.getByText("Unsent draft")).toBeVisible());
		await expect(canvas.queryByRole("button", { name: "Save" })).toBeNull();
		await userEvent.clear(input);
		await userEvent.type(input, "Updated next turn");
		await userEvent.click(canvas.getByRole("button", { name: "Send message" }));
		await waitFor(() =>
			expect(queue.getByText("Updated next turn")).toBeVisible(),
		);
		await expect(input).toHaveValue("");
		await userEvent.hover(queue.getAllByRole("listitem")[0]);
		await userEvent.click(
			queue.getByRole("button", {
				name: "Reorder queued message 1; use arrow keys",
			}),
		);
		await userEvent.keyboard("{ArrowDown}");
		await expect(queue.getAllByRole("listitem")[0]).toHaveTextContent(
			"Prepare the next steps",
		);
	},
};
export const ResumeFromComposer: Story = {
	render: () => <QueueExample />,
	play: async ({ canvas }) => {
		await userEvent.click(
			canvas.getByRole("button", { name: "Resume queued messages" }),
		);
		await expect(canvas.queryByText("Paused")).toBeNull();
		await expect(
			canvas.getByRole("button", { name: "Send message" }),
		).toBeDisabled();
	},
};
export const ApprovalOrder: Story = {
	render: () => <ApprovalExample />,
	play: async ({ canvas }) => {
		await expect(canvas.getByText("+2 pending")).toBeVisible();
		await userEvent.click(canvas.getByRole("button", { name: "Allow always" }));
		await expect(canvas.getByRole("status")).toHaveTextContent(
			"Always allowed",
		);
	},
};
export const ApprovalRetry: Story = {
	render: () => <ApprovalExample error />,
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("alert")).toBeVisible();
		await userEvent.click(canvas.getByRole("button", { name: "Deny" }));
		await expect(canvas.getByRole("status")).toHaveTextContent("Denied");
	},
};
export const PendingApproval: Story = {
	render: () => <ApprovalExample pending />,
	play: async ({ canvas }) => {
		for (const button of canvas.getAllByRole("button"))
			await expect(button).toBeDisabled();
	},
};

export const QueueDocked: Story = {
	render: () => <QueueExample />,
	play: async ({ canvas }) => {
		const queue = canvas.getByRole("region", { name: "Message queue" });
		const composer = canvas
			.getByRole("textbox", { name: "Message Assistant" })
			.closest('[data-slot="input-frame"]');
		await expect(composer).not.toBeNull();
		await waitFor(() =>
			expect(
				Math.abs(
					queue.getBoundingClientRect().bottom -
						(composer?.getBoundingClientRect().top ?? 0) -
						40,
				),
			).toBeLessThan(2),
		);
		await expect(getComputedStyle(queue).backgroundColor).not.toBe(
			"rgba(0, 0, 0, 0)",
		);
	},
};
export const SimpleApproval: Story = {
	render: () => (
		<ApprovalDecision
			title="Send this invitation?"
			description="Invite Sam to review this project. They will receive an email with a link."
			allowAlways={false}
			onDecision={fn()}
		/>
	),
	play: async ({ canvas }) => {
		const card = canvas.getByRole("region", { name: "Action approval" });
		await expect(
			canvas.queryByRole("button", { name: "Allow always" }),
		).toBeNull();
		const style = getComputedStyle(card);
		await expect(style.paddingTop).toBe(style.paddingBottom);
		const button = canvas.getByRole("button", { name: "Allow once" });
		const first = card.firstElementChild;
		if (!first) throw new Error("Approval heading missing");
		const top =
			first.getBoundingClientRect().top - card.getBoundingClientRect().top;
		const bottom =
			card.getBoundingClientRect().bottom -
			button.getBoundingClientRect().bottom;
		await expect(Math.abs(top - bottom)).toBeLessThan(2);
		const heading = canvas.getByRole("heading").getBoundingClientRect();
		const description = canvas
			.getByText(
				"Invite Sam to review this project. They will receive an email with a link.",
			)
			.getBoundingClientRect();
		await expect(description.top - heading.bottom).toBeLessThan(
			button.getBoundingClientRect().top - description.bottom,
		);
	},
};

function ActionLoadingExample() {
	const [pending, setPending] = useState<AssistantApprovalDecision | null>(
		null,
	);
	return (
		<>
			<ApprovalDecision
				title="Apply this change?"
				description="Update the selected workspace item."
				pendingDecision={pending}
				onDecision={setPending}
			/>
			<button type="button" onClick={() => setPending(null)}>
				Finish reference request
			</button>
		</>
	);
}
export const ClickedActionLoading: Story = {
	render: () => <ActionLoadingExample />,
	play: async ({ canvas }) => {
		for (const name of ["Allow once", "Allow always", "Deny"]) {
			const clicked = canvas.getByRole("button", { name });
			await userEvent.click(clicked);
			await expect(clicked).toHaveAttribute("aria-busy", "true");
			const region = within(
				canvas.getByRole("region", { name: "Action approval" }),
			);
			for (const button of region.getAllByRole("button")) {
				await expect(button).toBeDisabled();
				if (button !== clicked)
					await expect(button).not.toHaveAttribute("aria-busy", "true");
			}
			await expect(region.queryByText("Saving decision…")).toBeNull();
			await userEvent.click(
				canvas.getByRole("button", { name: "Finish reference request" }),
			);
			await expect(clicked).toBeEnabled();
		}
	},
};
export const UniformQueueRows: Story = {
	render: () => <QueueExample />,
	play: async ({ canvas }) => {
		const queue = canvas.getByRole("region", { name: "Message queue" });
		const rows = within(queue).getAllByRole("listitem");
		for (const row of rows) {
			await expect(
				within(row).getByRole("button", { name: /Remove queued message/ }),
			).toBeVisible();
			await expect(
				within(row).getByRole("button", { name: /Send queued message/ }),
			).toBeVisible();
			await userEvent.hover(row);
			await waitFor(() =>
				expect(Math.abs(row.getBoundingClientRect().height - 32)).toBeLessThan(
					1,
				),
			);
		}
		await userEvent.click(
			within(queue).getByRole("button", { name: "Edit queued message 2" }),
		);
		await expect(within(queue).queryByRole("textbox")).toBeNull();
		await expect(
			canvas.getByRole("textbox", { name: "Message Assistant" }),
		).toHaveFocus();
		await waitFor(() =>
			expect(within(queue).getAllByRole("listitem")).toHaveLength(3),
		);
		for (const row of within(queue).getAllByRole("listitem"))
			await expect(
				Math.abs(row.getBoundingClientRect().height - 32),
			).toBeLessThan(1);
	},
};

function QueueBoundaryExample() {
	const [items, setItems] = useState<QueuedMessage[]>([]);
	return (
		<>
			<button
				type="button"
				onClick={() =>
					setItems([
						{
							id: "boundary",
							text: "Review the launch brief",
							attachments: [],
						},
					])
				}
			>
				Add first queued message
			</button>
			<Composer
				attachments={[]}
				busy={false}
				canWrite
				onAddFiles={fn()}
				onRemoveAttachment={fn()}
				onStop={fn()}
				onSubmit={fn()}
				onToolModeChange={fn()}
				toolMode="read_write"
				queue={
					<MessageQueue
						items={items}
						paused
						onEdit={fn()}
						onChange={setItems}
						onSendNow={fn()}
					/>
				}
			/>
		</>
	);
}
export const QueueFirstAndLast: Story = {
	render: () => <QueueBoundaryExample />,
	play: async ({ canvas }) => {
		const input = canvas.getByRole("textbox", { name: "Message Assistant" });
		const baseline = input.getBoundingClientRect().top;
		await userEvent.click(
			canvas.getByRole("button", { name: "Add first queued message" }),
		);
		const queue = canvas.getByRole("region", { name: "Message queue" });
		await waitFor(() =>
			expect(
				Math.abs(input.getBoundingClientRect().top - baseline - 65),
			).toBeLessThan(1),
		);
		await userEvent.click(
			within(queue).getByRole("button", { name: "Remove queued message 1" }),
		);
		await waitFor(() =>
			expect(
				canvas.queryByRole("region", { name: "Message queue" }),
			).toBeNull(),
		);
		await expect(
			Math.abs(input.getBoundingClientRect().top - baseline),
		).toBeLessThan(1);
		await userEvent.click(
			canvas.getByRole("button", { name: "Add first queued message" }),
		);
		await waitFor(() =>
			expect(
				Math.abs(input.getBoundingClientRect().top - baseline - 65),
			).toBeLessThan(1),
		);
	},
};

export const QueueContentAlignment: Story = {
	render: () => <QueueExample />,
	play: async ({ canvas }) => {
		const queue = canvas.getByRole("region", { name: "Message queue" });
		const input = canvas.getByRole("textbox", { name: "Message Assistant" });
		const edge =
			input.getBoundingClientRect().left +
			parseFloat(getComputedStyle(input).paddingLeft);
		const right =
			input.getBoundingClientRect().right -
			parseFloat(getComputedStyle(input).paddingRight);
		const label = canvas.getByText("Queue · 4");
		const prompt = canvas.getByText("Summarize the results");
		await expect(
			Math.abs(label.getBoundingClientRect().left - edge),
		).toBeLessThan(1);
		await expect(
			Math.abs(prompt.getBoundingClientRect().left - edge),
		).toBeLessThan(1);
		const clear = within(queue).getByRole("button", { name: "Clear all" });
		await expect(getComputedStyle(clear).paddingLeft).toBe("0px");
		await expect(
			Math.abs(clear.getBoundingClientRect().right - right),
		).toBeLessThan(1);
		await userEvent.hover(within(queue).getAllByRole("listitem")[0]);
		const grip = within(queue).getByRole("button", {
			name: "Reorder queued message 1; use arrow keys",
		});
		await waitFor(() =>
			expect(Math.abs(grip.getBoundingClientRect().left - edge)).toBeLessThan(
				1,
			),
		);
		await expect(grip.getBoundingClientRect().width).toBe(12);
	},
};

const pickerResults: import("@/lib/assistant/contracts").AssistantContextItem[] =
	[
		{
			kind: "record",
			id: "launch",
			label: "Launch brief",
			description: "Record · draft · launch",
		},
		{
			kind: "connection",
			id: "records",
			label: "Records",
			description: "Built-in connection · Current organization",
		},
		{
			kind: "file",
			id: "brief",
			label: "Brief.pdf",
			description: "Attached file · application/pdf",
		},
	];
const searchPickerResults = async (query: string) =>
	pickerResults.filter((item) =>
		`${item.label} ${item.description}`
			.toLowerCase()
			.includes(query.toLowerCase()),
	);
function PickerExample({
	failure = false,
	withAttachment = false,
}: {
	failure?: boolean;
	withAttachment?: boolean;
}) {
	const [draft, setDraft] = useState("");
	const [references, setReferences] = useState<
		import("@/lib/assistant/contracts").AssistantContextReference[]
	>([]);
	const [result, setResult] = useState("");
	const attempts = useRef(0);
	const search = React.useCallback(
		async (query: string) => {
			if (failure && attempts.current++ === 0) throw new Error("Offline");
			return searchPickerResults(query);
		},
		[failure],
	);
	return (
		<div className="pt-72">
			<Composer
				draftValue={draft}
				onDraftChange={setDraft}
				contextReferences={references}
				onReferencesChange={setReferences}
				searchContext={search}
				attachments={
					withAttachment
						? [
								{
									id: "brief",
									filename: "Brief.pdf",
									contentType: "application/pdf",
									createdAt: "2026-01-01",
									size: 20,
									status: "ready",
									accessUrl: "data:application/pdf;base64,",
								},
							]
						: []
				}
				busy={false}
				canWrite
				toolMode="read_only"
				onToolModeChange={fn()}
				onAddFiles={fn()}
				onRemoveAttachment={fn()}
				onStop={fn()}
				onCommand={(command) => setResult(`Command: ${command}`)}
				onSubmit={(text, _scenario, refs) =>
					setResult(JSON.stringify({ text, references: refs }))
				}
			/>
			<output aria-label="Picker result">{result}</output>
			<output aria-label="Selected references">
				{JSON.stringify(references)}
			</output>
		</div>
	);
}
export const SlashCommands: Story = {
	render: () => <PickerExample />,
	play: async ({ canvas }) => {
		const input = canvas.getByRole("textbox", { name: "Message Assistant" });
		await userEvent.type(input, "/");
		await waitFor(() =>
			expect(canvas.getByRole("listbox", { name: "Commands" })).toBeVisible(),
		);
		await expect(canvas.getAllByRole("option")).toHaveLength(2);
		await userEvent.keyboard("{Enter}");
		await expect(input).toHaveValue("/help ");
		await expect(canvas.getByLabelText("Picker result")).toHaveTextContent("");
		await userEvent.keyboard("{Enter}");
		await expect(canvas.getByLabelText("Picker result")).toHaveTextContent(
			"Command: help",
		);
		await userEvent.type(input, "/ne");
		await canvas.findByRole("option");
		await userEvent.keyboard("{Enter}{Enter}");
		await expect(canvas.getByLabelText("Picker result")).toHaveTextContent(
			"Command: new",
		);
		await userEvent.type(input, "https://example.test/path");
		await expect(canvas.queryByRole("listbox")).toBeNull();
	},
};
export const ContextPicker: Story = {
	render: () => <PickerExample />,
	play: async ({ canvas }) => {
		const input = canvas.getByRole("textbox", { name: "Message Assistant" });
		await userEvent.type(input, "Review @lau");
		await expect(
			await canvas.findByRole("option", { name: /Launch brief/ }),
		).toBeVisible();
		await userEvent.keyboard("{Enter}");
		await expect(input).toHaveValue("Review @Launch brief ");
		await expect(
			canvas.getByLabelText("Selected references"),
		).toHaveTextContent('"id":"launch"');
		await userEvent.keyboard("{Backspace}{Backspace}");
		await expect(
			canvas.getByLabelText("Selected references"),
		).toHaveTextContent("[]");
		await userEvent.clear(input);
		await userEvent.type(input, "@");
		await canvas.findByRole("option", { name: /Records/ });
		await userEvent.keyboard("{Escape}");
		await expect(canvas.queryByRole("listbox")).toBeNull();
		await userEvent.clear(input);
		await userEvent.type(input, "name@example.test");
		await expect(canvas.queryByRole("listbox")).toBeNull();
	},
};
export const PickerRecovery: Story = {
	render: () => <PickerExample failure withAttachment />,
	play: async ({ canvas }) => {
		const input = canvas.getByRole("textbox", { name: "Message Assistant" });
		await userEvent.type(input, "@");
		await userEvent.click(
			await canvas.findByRole("button", { name: "Try again" }),
		);
		await expect(
			await canvas.findByRole("option", { name: /Launch brief/ }),
		).toBeVisible();
		await userEvent.click(canvas.getByRole("option", { name: /Launch brief/ }));
		await userEvent.clear(input);
		await userEvent.type(input, "/new ");
		await userEvent.keyboard("{Enter}");
		await expect(await canvas.findByRole("alert")).toHaveTextContent(
			"Remove attached files",
		);
		await expect(input).toHaveValue("/new ");
	},
};

export const PickerKeyboardAndComposition: Story = {
	render: () => <PickerExample />,
	play: async ({ canvas }) => {
		const input = canvas.getByRole("textbox", { name: "Message Assistant" });
		await userEvent.type(input, "/");
		await canvas.findByRole("option", { name: /help/ });
		fireEvent.compositionStart(input);
		fireEvent.keyDown(input, {
			key: "Enter",
			code: "Enter",
			isComposing: true,
			keyCode: 229,
		});
		await expect(input).toHaveValue("/");
		await expect(canvas.getByLabelText("Picker result")).toHaveTextContent("");
		fireEvent.compositionEnd(input);
		await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
		await expect(canvas.getByRole("option", { name: /new/ })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		await userEvent.keyboard("{Escape}");
		await expect(canvas.queryByRole("listbox")).toBeNull();
		await userEvent.clear(input);
		await userEvent.type(input, "/unknown ");
		await userEvent.keyboard("{Enter}");
		await expect(canvas.getByLabelText("Picker result")).toHaveTextContent(
			"/unknown ",
		);
		await userEvent.type(input, "@");
		await canvas.findByRole("listbox");
		await userEvent.click(canvas.getByLabelText("Picker result"));
		await expect(canvas.queryByRole("listbox")).toBeNull();
	},
};

function ComposerLoadingExample({
	waitingForData = false,
	busy = false,
}: {
	waitingForData?: boolean;
	busy?: boolean;
}) {
	const [draft, setDraft] = useState("");
	const [result, setResult] = useState("");
	return (
		<>
			<Composer
				attachments={[]}
				canWrite
				busy={busy}
				submitting={!waitingForData}
				submitDisabled={waitingForData}
				attachmentsDisabled={waitingForData}
				permissionsLoading={waitingForData}
				draftValue={draft}
				onDraftChange={setDraft}
				onAddFiles={fn()}
				onRemoveAttachment={fn()}
				onToolModeChange={fn()}
				onStop={() => setResult("Stopped")}
				onSubmit={(text) => setResult(text)}
				toolMode="read_write"
			/>
			<output aria-label="Loading example result">{result}</output>
		</>
	);
}
export const ComposerDependenciesLoading: Story = {
	render: () => <ComposerLoadingExample waitingForData />,
	play: async ({ canvas }) => {
		const input = canvas.getByRole("textbox", { name: "Message Assistant" });
		await expect(input).toBeEnabled();
		await userEvent.type(input, "Keep this draft{enter}");
		await expect(input).toHaveValue("Keep this draft");
		await expect(
			canvas.getByRole("button", { name: "Send message" }),
		).toBeDisabled();
		await expect(
			canvas.getByRole("button", { name: "Add context" }),
		).toBeDisabled();
		await expect(
			canvas.queryByRole("button", { name: /Tool permissions/ }),
		).toBeNull();
		await expect(
			canvas.getByLabelText("Loading example result"),
		).toHaveTextContent("");
	},
};
export const PendingSend: Story = {
	render: () => <ComposerLoadingExample />,
	play: async ({ canvas }) => {
		const input = canvas.getByRole("textbox", { name: "Message Assistant" });
		await userEvent.type(input, "Next draft{enter}");
		await expect(input).toHaveValue("Next draft");
		await expect(input).toBeEnabled();
		const send = canvas.getByRole("button", { name: "Send message" });
		await expect(send).toBeDisabled();
		await expect(send).toHaveAttribute("aria-busy", "true");
		await expect(
			canvas.getByLabelText("Loading example result"),
		).toHaveTextContent("");
	},
};
export const CancellablePendingSend: Story = {
	render: () => <ComposerLoadingExample busy />,
	play: async ({ canvas }) => {
		const stop = canvas.getByRole("button", { name: "Stop" });
		await expect(stop).toBeEnabled();
		await expect(within(stop).getByRole("status")).toHaveTextContent(
			"Sending message…",
		);
		await userEvent.click(stop);
		await expect(
			canvas.getByLabelText("Loading example result"),
		).toHaveTextContent("Stopped");
		await userEvent.type(
			canvas.getByRole("textbox", { name: "Message Assistant" }),
			"Next turn",
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Queue message" }),
		);
		await expect(
			canvas.getByLabelText("Loading example result"),
		).toHaveTextContent("Next turn");
	},
};

function PendingCommandExample() {
	const finish = useRef<() => void>(() => {});
	return (
		<>
			<Composer
				attachments={[]}
				busy={false}
				canWrite
				toolMode="read_only"
				onCommand={() =>
					new Promise<void>((resolve) => {
						finish.current = resolve;
					})
				}
				onAddFiles={fn()}
				onRemoveAttachment={fn()}
				onStop={fn()}
				onSubmit={fn()}
				onToolModeChange={fn()}
			/>
			<button type="button" onClick={() => finish.current()}>
				Finish command
			</button>
		</>
	);
}
export const PendingCommandDraft: Story = {
	render: () => <PendingCommandExample />,
	play: async ({ canvas }) => {
		const input = canvas.getByRole("textbox", { name: "Message Assistant" });
		await userEvent.type(input, "/help ");
		await userEvent.keyboard("{Enter}");
		await expect(
			canvas.getByRole("button", { name: "Send message" }),
		).toHaveAttribute("aria-busy", "true");
		await expect(input).toBeEnabled();
		await userEvent.clear(input);
		await userEvent.type(input, "A new draft");
		await userEvent.click(
			canvas.getByRole("button", { name: "Finish command" }),
		);
		await waitFor(() =>
			expect(
				canvas.getByRole("button", { name: "Send message" }),
			).toBeEnabled(),
		);
		await expect(input).toHaveValue("A new draft");
	},
};

export const CancellationDuringDependencyLoading: Story = {
	render: () => <ComposerLoadingExample waitingForData busy />,
	play: async ({ canvas }) => {
		const stop = canvas.getByRole("button", { name: "Stop" });
		await expect(stop).toBeEnabled();
		await userEvent.click(stop);
		await expect(
			canvas.getByLabelText("Loading example result"),
		).toHaveTextContent("Stopped");
		const input = canvas.getByRole("textbox", { name: "Message Assistant" });
		await userEvent.type(input, "Wait for the upload{enter}");
		await expect(input).toHaveValue("Wait for the upload");
		await expect(
			canvas.getByRole("button", { name: "Queue message" }),
		).toBeDisabled();
	},
};

export const ClearQueueDuringResponse: Story = {
	render: () => <QueueExample running />,
	play: async ({ canvas }) => {
		const queue = canvas.getByRole("region", { name: "Message queue" });
		const clear = within(queue).getByRole("button", { name: "Clear all" });
		await expect(clear).toBeEnabled();
		await expect(
			within(queue).getByRole("button", { name: "Remove queued message 1" }),
		).toBeEnabled();
		await userEvent.click(clear);
		await waitFor(() =>
			expect(
				canvas.queryByRole("region", { name: "Message queue" }),
			).toBeNull(),
		);
		await expect(canvas.getByRole("button", { name: "Stop" })).toBeEnabled();
	},
};
