import "server-only";
import { createAssistantContextAdapter } from "./context.server";
import type { AssistantAdapters } from "./contracts";
import { fixtureConversationAdapter, fixtureFileAdapter } from "./fixture";
import { fixturePermissionAdapter } from "./permissions.server";
import { assistantRuntimeAdapter } from "./runtime.server";

export const assistantAdapters: AssistantAdapters = {
	context: createAssistantContextAdapter(fixtureFileAdapter),
	conversations: fixtureConversationAdapter,
	permissions: fixturePermissionAdapter,
	files: fixtureFileAdapter,
	runtime: assistantRuntimeAdapter,
};

export * from "./contracts";
