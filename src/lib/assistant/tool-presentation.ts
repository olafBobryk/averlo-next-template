import type { AssistantToolPart } from "./contracts";

/** Inference's web-capable request/result envelope; independent of executable tool names. */
export type ToolContent = (
	| { type: "text"; text: string }
	| { type: "image" | "audio"; data: string; mimeType: string }
	| { type: "resource_link"; uri: string; name: string; description?: string }
	| {
			type: "resource";
			resource: {
				uri: string;
				text?: string;
				mimeType?: string;
				blob?: string;
			};
	  }
) & { annotations?: { audience?: Array<"user" | "assistant"> } };
export type ToolRequest = {
	id: string;
	toolCall:
		| {
				status: "success";
				value: { name: string; arguments?: Record<string, unknown> };
		  }
		| { status: "error"; error: string };
};
export type ToolResponse = {
	id: string;
	toolResult:
		| {
				status: "success";
				value: {
					content: ToolContent[];
					structuredContent?: unknown;
					isError: boolean;
				};
		  }
		| { status: "error"; error: string };
};
export type ToolPresentation = {
	request: ToolRequest;
	response?: ToolResponse;
	label?: string;
	status: "running" | "approval" | "denied" | "completed" | "error";
};

export const toolLabels = {
	records_list: "Search records",
	record_get: "Read record",
	record_create: "Create record",
	record_update: "Update record",
	record_archive: "Archive record",
	record_delete: "Delete record",
} satisfies Record<AssistantToolPart["name"], string>;

/** Legacy Records adapter. Execution retains its allowlist and authorization contract. */
export function resolveToolPresentation(
	part: AssistantToolPart,
): ToolPresentation {
	const request: ToolRequest = {
		id: part.id,
		toolCall: {
			status: "success",
			value: {
				name: part.name,
				arguments:
					part.input &&
					typeof part.input === "object" &&
					!Array.isArray(part.input)
						? (part.input as Record<string, unknown>)
						: part.input == null
							? {}
							: { input: part.input },
			},
		},
	};
	return {
		request,
		label: toolLabels[part.name],
		status:
			part.state === "approval-requested"
				? "approval"
				: part.state === "denied"
					? "denied"
					: part.state === "error"
						? "error"
						: part.state === "completed"
							? "completed"
							: "running",
		response: part.error
			? { id: part.id, toolResult: { status: "error", error: part.error } }
			: part.output != null
				? { id: part.id, toolResult: normalizeToolResult(part.output) }
				: undefined,
	};
}

function object(value: unknown): Record<string, unknown> | undefined {
	return value !== null && typeof value === "object" && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}
function content(value: unknown): ToolContent | undefined {
	const block = object(value);
	if (!block) return;
	const annotations = object(block.annotations);
	const audience = Array.isArray(annotations?.audience)
		? annotations.audience.filter(
				(role): role is "user" | "assistant" =>
					role === "user" || role === "assistant",
			)
		: undefined;
	const shared = audience ? { annotations: { audience } } : {};
	if (block.type === "text" && typeof block.text === "string")
		return { ...shared, type: "text", text: block.text };
	if (
		(block.type === "image" || block.type === "audio") &&
		typeof block.data === "string" &&
		typeof block.mimeType === "string"
	)
		return {
			...shared,
			type: block.type,
			data: block.data,
			mimeType: block.mimeType,
		};
	if (
		block.type === "resource_link" &&
		typeof block.uri === "string" &&
		typeof block.name === "string"
	)
		return {
			...shared,
			type: "resource_link",
			uri: block.uri,
			name: block.name,
		};
	const resource = object(block.resource);
	if (block.type === "resource" && resource && typeof resource.uri === "string")
		return {
			...shared,
			type: "resource",
			resource: {
				uri: resource.uri,
				...(typeof resource.text === "string" ? { text: resource.text } : {}),
				...(typeof resource.mimeType === "string"
					? { mimeType: resource.mimeType }
					: {}),
			},
		};
}
export function normalizeToolResult(
	output: unknown,
): ToolResponse["toolResult"] {
	const envelope = object(output);
	if (envelope?.status === "error" && typeof envelope.error === "string")
		return { status: "error", error: envelope.error };
	const value =
		envelope?.status === "success" ? object(envelope.value) : envelope;
	if (Array.isArray(value?.content))
		return {
			status: "success",
			value: {
				content: value.content.flatMap((item) => {
					const block = content(item);
					return block ? [block] : [];
				}),
				...(value.structuredContent !== undefined
					? { structuredContent: value.structuredContent }
					: {}),
				isError: value.isError === true,
			},
		};
	return {
		status: "success",
		value: {
			content: [
				{
					type: "text",
					text:
						typeof output === "string"
							? output
							: JSON.stringify(output, null, 2),
				},
			],
			...(typeof output === "object" ? { structuredContent: output } : {}),
			isError: false,
		},
	};
}
