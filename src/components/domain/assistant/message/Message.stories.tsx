import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import * as Assistant from "@/components/domain/assistant";
import { IconProvider } from "@/components/ui/icons/iconRegistry";
import { openaiIconRegistry } from "@/components/ui/icons/openaiRegistry";
import type {
	AssistantMessage as AssistantMessageContract,
	AssistantResponseMessage,
	AssistantSystemMessage,
	AssistantUserMessage,
} from "@/lib/assistant/contracts";
import { ToolCallView } from "./assistant/tool-call/ToolCall";
import { catalogContract } from "./Message.catalog";

const createdAt = "2026-08-01T09:00:00.000Z";

const userMessage: AssistantUserMessage = {
	createdAt,
	id: "message-user",
	parts: [
		{
			id: "part-user-text",
			text: "Review the attached brief and list the records needing attention.",
			type: "text",
		},
		{
			attachment: {
				contentType: "application/pdf",
				createdAt,
				filename: "launch-brief.pdf",
				id: "attachment-user",
				size: 84_000,
				status: "ready",
			},
			id: "part-user-file",
			type: "file",
		},
	],
	role: "user",
};

const singleLineUserMessage: AssistantUserMessage = {
	createdAt,
	id: "message-user-single-line",
	parts: [
		{
			id: "part-user-single-line",
			text: "A compact one-line message.",
			type: "text",
		},
	],
	role: "user",
};

const assistantMessage: AssistantResponseMessage = {
	createdAt,
	id: "message-assistant",
	parts: [
		{
			id: "part-assistant-text",
			text: "I found one record that needs attention.",
			type: "text",
		},
		{
			attachment: {
				contentType: "text/plain",
				createdAt,
				filename: "record-summary.txt",
				id: "attachment-assistant",
				size: 2_400,
				status: "ready",
			},
			id: "part-assistant-file",
			type: "file",
		},
		{
			approvalId: null,
			error: null,
			id: "part-assistant-tool",
			input: { query: "attention" },
			name: "records_list",
			output: null,
			state: "input-streaming",
			type: "tool",
		},
	],
	role: "assistant",
};

const groupedToolMessage: AssistantResponseMessage = {
	createdAt,
	id: "message-assistant-grouped-tools",
	parts: [
		{
			approvalId: null,
			error: null,
			id: "part-tool-streaming",
			input: { query: "launch" },
			name: "records_list",
			output: null,
			state: "input-streaming",
			type: "tool",
		},
		{
			approvalId: null,
			error: "The fixture could not load this record.",
			id: "part-tool-error",
			input: { id: "north-star" },
			name: "record_get",
			output: null,
			state: "error",
			type: "tool",
		},
	],
	role: "assistant",
};

const completedMarkdownMessage: AssistantResponseMessage = {
	createdAt,
	id: "message-assistant-completed-markdown",
	parts: [
		{
			id: "part-assistant-completed-markdown",
			text: [
				"## Review summary",
				"",
				"A [record link](/dashboard/records) with **strong copy**, <u>underlined copy</u>, `inlineCode`, and @[user:4b533f14-6dd0-4dbf-9f73-212be08f5211].",
				"",
				"- [x] Reviewed task",
				"- Ordinary item",
				"",
				"```ts",
				"const status = 'ready';",
				"```",
				"",
				"![Abstract blue portrait composition](/test/placeholder-portrait.jpg)",
				"",
				"| Record | State |",
				"| --- | --- |",
				"| Launch brief | Ready |",
				"",
				"::button[Open records]{href=/dashboard/records variant=ghost size=sm}",
			].join("\n"),
			type: "text",
		},
	],
	role: "assistant",
};

const streamingMarkdownMessage: AssistantResponseMessage = {
	createdAt,
	id: "message-assistant-streaming-markdown",
	parts: [
		{
			id: "part-assistant-streaming-list",
			text: [
				"## Streaming response",
				"",
				"- First item",
				"- **Second item",
			].join("\n"),
			type: "text",
		},
		{
			id: "part-assistant-streaming-link",
			text: "[Incomplete link](https://example.com",
			type: "text",
		},
		{
			id: "part-assistant-streaming-code",
			text: ["```ts", "const status = 'streaming';"].join("\n"),
			type: "text",
		},
	],
	role: "assistant",
};

const streamingGeometryMessage: AssistantResponseMessage = {
	createdAt,
	id: "message-assistant-streaming-geometry",
	parts: [
		{
			id: "part-assistant-streaming-geometry",
			text: "A stable one-line Assistant response.",
			type: "text",
		},
	],
	role: "assistant",
};

const systemMessage: AssistantSystemMessage = {
	createdAt,
	id: "message-system",
	parts: [
		{
			id: "part-system-text",
			text: "This prompt state stays internal.",
			type: "text",
		},
	],
	role: "system",
};

function MessageColumn({ messages }: { messages: AssistantMessageContract[] }) {
	return (
		<div className="grid w-full gap-7 py-6">
			{messages.map((message) => (
				<Assistant.Message key={message.id} message={message} />
			))}
		</div>
	);
}

const meta = {
	id: "domain-assistant-message",
	title: "Domain/Assistant/Message",
	component: Assistant.Message,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<IconProvider registry={openaiIconRegistry}>
				<Story />
			</IconProvider>
		),
	],
	parameters: {
		catalogContract,
		layout: "fullscreen",
		a11y: { test: "error" },
		docs: {
			description: {
				component:
					"The public Assistant message dispatcher. Role-specific renderers stay private while user and Assistant messages share one conversation axis. ToolCallView accepts a provider-neutral request (id, toolCall status/value with name and arguments), optional response (id, toolResult success/value with content, structuredContent and isError, or error text), label and lifecycle status. Content blocks support text, images, audio downloads, resource links and embedded text resources. Audience annotations exclude assistant-only content; tool text is displayed as literal monospaced output, matching Inference. Long argument values expand independently. Output grows in 8-line steps to 24 lines, then scrolls. The Records adapter normalizes existing execution parts into this source-shaped envelope without widening executable capabilities. Accordion motion softens its moving bottom edge and releases clipping when settled. Each response groups all tool calls into one initially collapsed summary above the reply. The summary uses the actual call count and lifecycle state, without fabricated duration. A shared Divider stays directly beneath the summary trigger while details expand below it; its gap to the reply matches the reply-to-controls gap (8px).",
			},
		},
	},
	beforeEach: () => {
		const originalFetch = globalThis.fetch;
		globalThis.fetch = fn(
			async (input: RequestInfo | URL, init?: RequestInit) => {
				const url = String(input);
				if (
					url.endsWith("/api/assistant/files/attachment-user/access") ||
					url.endsWith("/api/assistant/files/attachment-assistant/access")
				) {
					const contentType = url.includes("attachment-user")
						? "application/pdf"
						: "text/plain";
					return new Response(
						JSON.stringify({
							expiresAt: "2099-01-01T00:00:00.000Z",
							url: `data:${contentType};base64,`,
						}),
						{ headers: { "Content-Type": "application/json" }, status: 200 },
					);
				}
				return originalFetch(input, init);
			},
		);
		return () => {
			globalThis.fetch = originalFetch;
		};
	},
} satisfies Meta<typeof Assistant.Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RolePresentation: Story = {
	args: { message: userMessage },
	// FileInput owns the existing Uploaded-chip contrast finding; keep it visible
	// here without making the Assistant composition redefine that visual token.
	parameters: { a11y: { test: "todo" } },
	render: () => <MessageColumn messages={[userMessage, assistantMessage]} />,
	play: async ({ canvas }) => {
		const userArticle = canvas.getByRole("article", { name: "You" });
		const assistantArticle = canvas.getByRole("article", {
			name: "Assistant",
		});
		const userBody = userArticle.firstElementChild?.firstElementChild;
		const assistantBody = assistantArticle.firstElementChild?.firstElementChild;

		await expect(userArticle).toBeVisible();
		await expect(assistantArticle).toBeVisible();
		await expect(canvas.queryByText(/^You$/u)).toBeNull();
		await expect(canvas.queryByText(/^Assistant$/u)).toBeNull();
		const userFiles = await within(userArticle).findByRole("group", {
			name: "File list",
		});
		await expect(userFiles).toBeVisible();
		await expect(
			within(userArticle).getByRole("button", {
				name: "Open launch-brief.pdf",
			}),
		).toBeInTheDocument();
		await expect(
			within(userArticle).queryByRole("button", {
				name: "Remove launch-brief.pdf",
			}),
		).toBeNull();
		const userText = userArticle.querySelector("p");
		if (!(userText instanceof HTMLElement)) {
			throw new Error("User message text missing");
		}
		await expect(
			Boolean(
				userText.compareDocumentPosition(userFiles) &
					Node.DOCUMENT_POSITION_FOLLOWING,
			),
		).toBe(true);
		const assistantFiles = await within(assistantArticle).findByRole("group", {
			name: "File list",
		});
		await expect(assistantFiles).toBeVisible();
		await expect(
			within(assistantArticle).getByRole("button", {
				name: "Open record-summary.txt",
			}),
		).toBeInTheDocument();
		await expect(
			within(assistantArticle).queryByRole("button", {
				name: "Remove record-summary.txt",
			}),
		).toBeNull();
		await userEvent.click(
			canvas.getByRole("button", { name: "Working · 1 tool call" }),
		);
		const toolTrigger = canvas.getByRole("button", {
			name: "Search records Running",
		});
		await expect(toolTrigger).toHaveAttribute("aria-expanded", "false");
		await userEvent.click(toolTrigger);
		await expect(toolTrigger).toHaveAttribute("aria-expanded", "true");
		await expect(canvas.getByText("query")).toBeInTheDocument();

		const userRect = userArticle.getBoundingClientRect();
		const assistantRect = assistantArticle.getBoundingClientRect();
		await expect(userRect.left).toBe(assistantRect.left);
		await expect(userRect.width).toBe(assistantRect.width);
		await expect(userBody).not.toBeNull();
		await expect(assistantBody).not.toBeNull();
		if (
			!(userBody instanceof HTMLElement) ||
			!(assistantBody instanceof HTMLElement)
		)
			return;
		const userBodyRect = userBody.getBoundingClientRect();
		const contentRight =
			userArticle.firstElementChild?.getBoundingClientRect().right ??
			userRect.right;
		const userStyle = getComputedStyle(userBody);
		await expect(Math.abs(userBodyRect.right - contentRight)).toBeLessThan(1);
		await expect(userStyle.maxWidth).not.toBe("none");
		await expect(
			getComputedStyle(userText.parentElement!).backgroundColor,
		).not.toBe("rgba(0, 0, 0, 0)");
	},
};

export const GroupedToolLifecycle: Story = {
	args: { message: groupedToolMessage },
	render: () => <Assistant.Message message={groupedToolMessage} />,
	play: async ({ canvas }) => {
		await userEvent.click(
			canvas.getByRole("button", { name: "Working · 2 tool calls" }),
		);
		const running = canvas.getByRole("button", {
			name: "Search records Running",
		});
		const failed = canvas.getByRole("button", { name: "Read record Failed" });
		await expect(running).toHaveAttribute("aria-expanded", "false");
		await userEvent.click(failed);
		await expect(failed).toHaveAttribute("aria-expanded", "true");
		await expect(running).toHaveAttribute("aria-expanded", "false");
		await waitFor(() =>
			expect(
				canvas.getByText("The fixture could not load this record."),
			).toBeVisible(),
		);
	},
};

export const SystemMessagesStayInternal: Story = {
	args: { message: systemMessage },
	render: () => <MessageColumn messages={[systemMessage]} />,
	play: async ({ canvas }) => {
		await expect(canvas.queryByRole("article")).toBeNull();
		await expect(
			canvas.queryByText("This prompt state stays internal."),
		).toBeNull();
	},
};

export const CompactSingleLineUser: Story = {
	args: { message: singleLineUserMessage },
	render: () => <MessageColumn messages={[singleLineUserMessage]} />,
	play: async ({ canvas }) => {
		const userArticle = canvas.getByRole("article", { name: "You" });
		const messageAxis = userArticle.firstElementChild;
		const userBody = messageAxis?.firstElementChild?.firstElementChild;
		await expect(messageAxis).not.toBeNull();
		await expect(userBody).not.toBeNull();
		if (
			!(messageAxis instanceof HTMLElement) ||
			!(userBody instanceof HTMLElement)
		)
			return;
		const axisRect = messageAxis.getBoundingClientRect();
		const bodyRect = userBody.getBoundingClientRect();
		await expect(bodyRect.height).toBeGreaterThanOrEqual(32);
		await expect(bodyRect.width).toBeLessThan(axisRect.width);
		await expect(Math.abs(bodyRect.right - axisRect.right)).toBeLessThan(1);
		await expect(getComputedStyle(userBody).borderRadius).toBe("14px");
	},
};

export const CompletedMarkdownPresentation: Story = {
	args: { message: completedMarkdownMessage },
	render: () => <Assistant.Message message={completedMarkdownMessage} />,
	play: async ({ canvas }) => {
		const article = canvas.getByRole("article", { name: "Assistant" });
		const renderer = article.querySelector<HTMLElement>(
			'[data-slot="markdown-renderer"][data-variant="result"]',
		);

		const response = article.firstElementChild
			?.firstElementChild as HTMLElement;
		await expect(response.getBoundingClientRect().width).toBe(
			article.firstElementChild?.getBoundingClientRect().width,
		);
		const timestamp = article.querySelector("time");
		if (!timestamp) throw new Error("Missing response timestamp");
		await expect(getComputedStyle(timestamp).opacity).toBe("0");
		const copy = within(article).getByRole("button", { name: "Copy response" });
		copy.focus();
		await waitFor(() => expect(getComputedStyle(timestamp).opacity).toBe("1"));
		copy.blur();
		await waitFor(() => expect(getComputedStyle(timestamp).opacity).toBe("0"));
		await expect(renderer).not.toBeNull();
		await expect(renderer).toHaveClass("markdown-content--compact");
		await expect(
			canvas.getByRole("heading", { name: "Review summary" }),
		).toBeVisible();
		await expect(
			canvas.getByRole("link", { name: "record link" }),
		).toBeVisible();
		await expect(canvas.getByText("inlineCode")).toBeVisible();
		await expect(canvas.getByText("const status = 'ready';")).toBeVisible();
		await expect(canvas.getByRole("table")).toBeVisible();
		await expect(canvas.getByRole("checkbox")).toBeChecked();
		await expect(
			canvas.getByRole("img", {
				name: "Abstract blue portrait composition",
			}),
		).toBeVisible();
		await expect(canvas.getByText("@Unknown member")).toBeVisible();
		await expect(canvas.getByText("underlined copy").tagName).toBe("U");
		await expect(
			canvas.getByRole("link", { name: "Open records" }),
		).toBeVisible();
	},
};

export const StreamingIncompleteMarkdown: Story = {
	args: { message: streamingMarkdownMessage, streaming: true },
	render: () => (
		<Assistant.Message message={streamingMarkdownMessage} streaming />
	),
	play: async ({ canvas }) => {
		const article = canvas.getByRole("article", { name: "Assistant" });
		const renderers = article.querySelectorAll<HTMLElement>(
			'[data-slot="markdown-renderer"][data-variant="result"]',
		);

		await expect(renderers).toHaveLength(3);
		for (const renderer of renderers) {
			await expect(renderer).toHaveClass("markdown-content--compact");
		}
		await expect(
			canvas.getByRole("heading", { name: "Streaming response" }),
		).toBeVisible();
		await expect(
			getComputedStyle(
				canvas.getByRole("heading", { name: "Streaming response" }),
			).marginTop,
		).toBe("0px");
		await expect(canvas.getByText("First item")).toBeVisible();
		await expect(canvas.getByText("Second item")).toBeVisible();
		await expect(canvas.getByText(/Incomplete link/u)).toBeVisible();
		await expect(canvas.getByText("const status = 'streaming';")).toBeVisible();
		await expect(article.textContent).not.toContain("**");
		await expect(article.textContent).not.toContain("```");
		await expect(article.textContent).not.toContain("[blocked]");
		await expect(article.querySelector("[data-streamdown-caret]")).toBeNull();
		await expect(article.querySelector("[data-sd-animate]")).toBeNull();
		for (const controlName of ["Copy", "Download", "Fullscreen"]) {
			await expect(
				canvas.queryByRole("button", { name: new RegExp(controlName, "iu") }),
			).toBeNull();
		}
	},
};

export const StreamingCompletionGeometry: Story = {
	args: { message: streamingGeometryMessage },
	render: () => (
		<div className="grid gap-7 py-6">
			<div data-state="streaming">
				<Assistant.Message message={streamingGeometryMessage} streaming />
			</div>
			<div data-state="complete">
				<Assistant.Message message={streamingGeometryMessage} />
			</div>
		</div>
	),
	play: async ({ canvasElement }) => {
		const streaming = canvasElement.querySelector<HTMLElement>(
			'[data-state="streaming"] [data-slot="markdown-renderer"]',
		);
		const complete = canvasElement.querySelector<HTMLElement>(
			'[data-state="complete"] [data-slot="markdown-renderer"]',
		);
		await expect(streaming).not.toBeNull();
		await expect(complete).not.toBeNull();
		if (!streaming || !complete) return;
		await expect(streaming.getBoundingClientRect().height).toBe(
			complete.getBoundingClientRect().height,
		);
		const streamingTopInset =
			(streaming.firstElementChild?.getBoundingClientRect().top ?? 0) -
			streaming.getBoundingClientRect().top;
		const completeTopInset =
			(complete.firstElementChild?.getBoundingClientRect().top ?? 0) -
			complete.getBoundingClientRect().top;
		await expect(Math.abs(streamingTopInset - completeTopInset)).toBeLessThan(
			0.2,
		);
	},
};

function EditableUserExample() {
	const [message, setMessage] = useState(singleLineUserMessage);
	return (
		<Assistant.Message
			message={message}
			onEdit={async (text) => {
				setMessage({
					...message,
					parts: [{ type: "text", id: "editable-text", text }],
				});
			}}
		/>
	);
}
export const EditUserInPlace: Story = {
	args: { message: singleLineUserMessage },
	render: () => <EditableUserExample />,
	play: async ({ canvas }) => {
		const user = userEvent.setup();
		await user.click(canvas.getByRole("button", { name: "Edit message" }));
		const input = canvas.getByRole("textbox", {
			name: "Edit message",
		});
		await expect(
			input.closest('[data-slot="input-frame"]')?.getBoundingClientRect()
				.height,
		).toBeGreaterThanOrEqual(98);
		await user.clear(input);
		await user.click(
			canvas.getByRole("button", { name: "Save message in place" }),
		);
		await expect(canvas.getByRole("alert")).toHaveTextContent(
			"Message cannot be empty",
		);
		await user.type(input, "Revised in place");
		await user.keyboard("{Control>}{Enter}{/Control}");
		await expect(canvas.getByText("Revised in place")).toBeVisible();
		await waitFor(() =>
			expect(
				canvas.getByRole("button", { name: "Edit message" }),
			).toHaveFocus(),
		);
		const copy = canvas.getByRole("button", { name: "Copy message" });
		const bubble = canvas.getByText("Revised in place").getBoundingClientRect();
		await expect(
			Math.abs(copy.getBoundingClientRect().right - bubble.right),
		).toBeLessThan(1);
		await expect(copy.getBoundingClientRect().width).toBe(14);
		await user.click(copy);
		await expect(
			canvas.getByRole("button", { name: "Copied message" }),
		).toBeVisible();
		await user.click(canvas.getByRole("button", { name: "Edit message" }));
		await user.type(
			canvas.getByRole("textbox", { name: "Edit message" }),
			" discarded",
		);
		await user.keyboard("{Escape}");
		await expect(canvas.getByText("Revised in place")).toBeVisible();
	},
};

export const SourceToolEnvelope: Story = {
	args: { message: groupedToolMessage },
	render: () => (
		<ToolCallView
			status="completed"
			request={{
				id: "search-1",
				toolCall: {
					status: "success",
					value: {
						name: "search_documents",
						arguments: {
							query:
								"Find the launch plan and summarize all milestones for the next quarter, including dependencies and owners.",
							limit: 40,
						},
					},
				},
			}}
			response={{
				id: "search-1",
				toolResult: {
					status: "success",
					value: {
						isError: false,
						content: [
							{
								type: "text",
								text: Array.from(
									{ length: 40 },
									(_, i) => `Document ${i + 1}: launch milestone and owner`,
								).join("\n"),
							},
							{
								type: "text",
								text: "Assistant-only internal detail",
								annotations: { audience: ["assistant"] },
							},
						],
					},
				},
			}}
		/>
	),
	play: async ({ canvas }) => {
		await userEvent.click(
			canvas.getByRole("button", { name: "search documents" }),
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Toggle query argument" }),
		);
		await expect(
			canvas.getByRole("button", { name: "Toggle query argument" }),
		).toHaveAttribute("aria-expanded", "true");
		const output = canvas.getByRole("region", { name: "Tool output" });
		await expect(output).toHaveTextContent("Document 40");
		await expect(
			canvas.queryByText("Assistant-only internal detail"),
		).toBeNull();
		await expect(getComputedStyle(output).maxHeight).toBe("160px");
		await userEvent.click(
			await canvas.findByRole("button", { name: "View more" }),
		);
		await expect(getComputedStyle(output).maxHeight).toBe("320px");
		await userEvent.click(canvas.getByRole("button", { name: "View more" }));
		await expect(getComputedStyle(output).maxHeight).toBe("480px");
		await expect(
			canvas.getByText("Scroll to see the remaining output"),
		).toBeVisible();
	},
};
export const SourceToolError: Story = {
	args: { message: groupedToolMessage },
	render: () => (
		<ToolCallView
			status="error"
			request={{
				id: "fetch-1",
				toolCall: {
					status: "success",
					value: {
						name: "fetch_document",
						arguments: { document_id: "launch-plan" },
					},
				},
			}}
			response={{
				id: "fetch-1",
				toolResult: {
					status: "error",
					error: "The connection is unavailable. Reconnect and try again.",
				},
			}}
		/>
	),
	play: async ({ canvas }) => {
		await userEvent.click(
			canvas.getByRole("button", { name: "fetch document Failed" }),
		);
		await expect(canvas.getByRole("status")).toHaveTextContent(
			"Reconnect and try again",
		);
	},
};

export const ToolSummarySpacing: Story = {
	args: {
		message: {
			...assistantMessage,
			parts: [
				{
					...assistantMessage.parts[2],
					state: "completed",
					output: { total: 3 },
				} as AssistantResponseMessage["parts"][number],
				{
					id: "summary-reply",
					type: "text",
					text: "I found three records that need your attention.",
				},
			],
		},
	},
	play: async ({ canvas }) => {
		const summary = canvas.getByRole("button", {
			name: "Finished · 1 tool call",
		});
		await expect(summary).toHaveAttribute("aria-expanded", "false");
		await expect(
			canvas.queryByRole("button", { name: "Search records" }),
		).toBeNull();
		const article = canvas.getByRole("article", { name: "Assistant" });
		const divider = article.querySelector("hr");
		const reply = article.querySelector('[data-slot="assistant-reply"]');
		const controls = canvas.getByRole("button", {
			name: "Copy response",
		}).parentElement;
		if (!divider || !reply || !controls)
			throw new Error("Missing response structure");
		await expect(
			reply.getBoundingClientRect().top -
				divider.getBoundingClientRect().bottom,
		).toBe(8);
		await expect(
			controls.getBoundingClientRect().top -
				reply.getBoundingClientRect().bottom,
		).toBe(8);
		const dividerOffset =
			divider.getBoundingClientRect().top -
			summary.getBoundingClientRect().bottom;
		await userEvent.click(summary);
		await expect(
			await canvas.findByRole("button", { name: "Search records" }),
		).toBeVisible();
		await expect(
			divider.getBoundingClientRect().top -
				summary.getBoundingClientRect().bottom,
		).toBe(dividerOffset);
		await userEvent.click(summary);
		await waitFor(() =>
			expect(
				canvas.queryByRole("button", { name: "Search records" }),
			).toBeNull(),
		);
	},
};
