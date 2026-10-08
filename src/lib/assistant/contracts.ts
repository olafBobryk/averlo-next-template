export const assistantLimits = {
	maxFilesPerMessage: 5,
	maxMessagesPerThread: 500,
	maxThreadBytes: 50 * 1024 * 1024,
	runsPerDay: 200,
	runsPerMinute: 10,
} as const;

export type AssistantToolName =
	| "records_list"
	| "record_get"
	| "record_create"
	| "record_update"
	| "record_archive"
	| "record_delete";
export type AssistantToolMode = "off" | "read_only" | "read_write";
export const assistantFixtureScenarios = [
	"random_turn",
	"tool_approval",
	"plain_response",
	"markdown_stress",
	"records_list",
	"record_get",
	"record_error",
	"record_create",
	"record_update",
	"record_archive",
	"record_delete",
] as const;
export type AssistantFixtureScenario =
	(typeof assistantFixtureScenarios)[number];
export type AssistantToolState =
	| "input-streaming"
	| "input-available"
	| "approval-requested"
	| "approved"
	| "denied"
	| "completed"
	| "error";

export type AssistantRuntimeEvent =
	| { delta: string; type: "text-delta" }
	| {
			name: AssistantToolName;
			toolCallId: string;
			type: "tool-input-start";
	  }
	| {
			delta: string;
			toolCallId: string;
			type: "tool-input-delta";
	  }
	| {
			input: unknown;
			name: AssistantToolName;
			toolCallId: string;
			type: "tool-input-available";
	  }
	| {
			error?: string;
			output?: unknown;
			toolCallId: string;
			type: "tool-result";
	  };

export type AssistantAttachment = {
	contentType: string;
	createdAt: string;
	filename: string;
	id: string;
	size: number;
	status: "pending" | "ready" | "cleanup-required";
};

export type AssistantStagedAttachment = AssistantAttachment & {
	accessUrl: string;
};

export type AssistantTextPart = { id: string; text: string; type: "text" };
export type AssistantFilePart = {
	attachment: AssistantAttachment;
	id: string;
	type: "file";
};
export type AssistantToolPart = {
	approvalId: string | null;
	error: string | null;
	id: string;
	input: unknown;
	name: AssistantToolName;
	output: unknown | null;
	state: AssistantToolState;
	type: "tool";
};
export type AssistantPart =
	| AssistantTextPart
	| AssistantFilePart
	| AssistantToolPart;

type AssistantMessageBase = {
	createdAt: string;
	id: string;
};

export type AssistantUserMessage = AssistantMessageBase & {
	contextReferences?: AssistantContextReference[];
	parts: Array<AssistantTextPart | AssistantFilePart>;
	role: "user";
};

export type AssistantResponseMessage = AssistantMessageBase & {
	failure?: string;
	parts: AssistantPart[];
	role: "assistant";
};

export type AssistantSystemMessage = AssistantMessageBase & {
	parts: AssistantTextPart[];
	role: "system";
};

export type AssistantMessage =
	| AssistantUserMessage
	| AssistantResponseMessage
	| AssistantSystemMessage;

export type AssistantRole = AssistantMessage["role"];

export type AssistantThread = {
	toolMode?: AssistantToolMode;
	createdAt: string;
	id: string;
	messages: AssistantMessage[];
	organizationId: string;
	pinned: boolean;
	title: string;
	updatedAt: string;
	userId: string;
};

export type AssistantThreadSummary = Omit<AssistantThread, "messages"> & {
	lastMessagePreview: string;
};

export type AssistantActor = { organizationId: string; userId: string };

export type AssistantThreadPatch = {
	toolMode?: AssistantToolMode;
	pinned?: boolean;
	title?: string;
};

export interface AssistantConversationAdapter {
	replaceToolPart(
		actor: AssistantActor,
		threadId: string,
		messageId: string,
		part: AssistantToolPart,
	): Promise<void>;
	duplicateThread(
		actor: AssistantActor,
		threadId: string,
	): Promise<AssistantThread>;
	editMessage(
		actor: AssistantActor,
		threadId: string,
		messageId: string,
		text: string,
		references?: AssistantContextReference[],
	): Promise<AssistantThread>;
	appendMessage(
		actor: AssistantActor,
		threadId: string,
		message: AssistantMessage,
	): Promise<AssistantThread>;
	createThread(actor: AssistantActor, title?: string): Promise<AssistantThread>;
	deleteThread(actor: AssistantActor, threadId: string): Promise<boolean>;
	getThread(
		actor: AssistantActor,
		threadId: string,
	): Promise<AssistantThread | null>;
	listThreads(actor: AssistantActor): Promise<AssistantThreadSummary[]>;
	replaceMessage(
		actor: AssistantActor,
		threadId: string,
		message: AssistantMessage,
	): Promise<AssistantThread>;
	updateThread(
		actor: AssistantActor,
		threadId: string,
		patch: AssistantThreadPatch,
	): Promise<AssistantThread | null>;
}

export interface AssistantFileAdapter {
	create(actor: AssistantActor, file: File): Promise<AssistantAttachment>;
	delete(actor: AssistantActor, fileId: string): Promise<boolean>;
	get(
		actor: AssistantActor,
		fileId: string,
	): Promise<{ attachment: AssistantAttachment; bytes: Uint8Array } | null>;
	getAccessUrl(
		actor: AssistantActor,
		fileId: string,
	): Promise<{ expiresAt: string; url: string } | null>;
}

export interface AssistantRuntimeAdapter {
	stream(input: {
		actor: AssistantActor;
		canWrite: boolean;
		fixtureScenario?: AssistantFixtureScenario;
		messages: AssistantMessage[];
		signal?: AbortSignal;
		toolMode: AssistantToolMode;
	}): Promise<AsyncIterable<AssistantRuntimeEvent>>;
}

export function isAssistantFixtureScenario(
	value: unknown,
): value is AssistantFixtureScenario {
	return assistantFixtureScenarios.includes(value as AssistantFixtureScenario);
}

export type AssistantAdapters = {
	context: AssistantContextAdapter;
	permissions: AssistantPermissionAdapter;
	conversations: AssistantConversationAdapter;
	files: AssistantFileAdapter;
	runtime: AssistantRuntimeAdapter;
};

export function isAssistantToolName(
	value: unknown,
): value is AssistantToolName {
	return [
		"records_list",
		"record_get",
		"record_create",
		"record_update",
		"record_archive",
		"record_delete",
	].includes(String(value));
}

export function isAssistantWriteTool(name: AssistantToolName) {
	return !["records_list", "record_get"].includes(name);
}

export type AssistantApprovalDecision = "allow_once" | "always_allow" | "deny";
export type AssistantPermission = "ask" | "allow";
export interface AssistantPermissionAdapter {
	update(
		actor: AssistantActor,
		scope: string,
		change: {
			actionIds: string[];
			permission: AssistantPermission;
		},
	): Promise<void>;
	allows(
		actor: AssistantActor,
		scope: string,
		actionId: string,
	): Promise<boolean>;
}

export type AssistantContextKind = "record" | "connection" | "file";
export type AssistantContextItem = {
	kind: AssistantContextKind;
	id: string;
	label: string;
	description: string;
};
export type AssistantContextReference = {
	kind: AssistantContextKind;
	id: string;
	text: string;
	start: number;
	end: number;
};
export type AssistantContextScope = {
	actor: AssistantActor;
	capabilities: ReadonlySet<string>;
	fileIds: string[];
};
export interface AssistantContextAdapter {
	search(
		scope: AssistantContextScope,
		query: string,
	): Promise<AssistantContextItem[]>;
	resolve(
		scope: AssistantContextScope,
		reference: AssistantContextReference,
	): Promise<{ text: string; attachment?: AssistantAttachment }>;
}
