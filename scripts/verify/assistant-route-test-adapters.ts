import { createAssistantContextAdapter } from "../../src/lib/assistant/context.server";
import type {
	AssistantActor,
	AssistantAdapters,
} from "../../src/lib/assistant/contracts";
import {
	fixtureConversationAdapter,
	fixtureFileAdapter,
} from "../../src/lib/assistant/fixture";
import { fixturePermissionAdapter } from "../../src/lib/assistant/permissions.server";

export * from "../../src/lib/assistant/contracts";
export const testAccess: {
	actor: AssistantActor;
	canWrite: boolean;
	failRuntime?: boolean;
	lastMessages?: import("../../src/lib/assistant/contracts").AssistantMessage[];
} = {
	actor: { userId: "route-test", organizationId: "route-test" },
	canWrite: true,
};
export async function resolveAssistantActor() {
	return {
		actor: testAccess.actor,
		capabilities: new Set(
			testAccess.canWrite
				? ["assistant.use", "records.read", "records.write"]
				: ["assistant.use", "records.read"],
		),
	};
}
export const assistantAdapters: AssistantAdapters = {
	context: createAssistantContextAdapter(fixtureFileAdapter),
	conversations: fixtureConversationAdapter,
	files: fixtureFileAdapter,
	permissions: fixturePermissionAdapter,
	runtime: {
		async stream(input) {
			testAccess.lastMessages = input.messages;
			return (async function* () {
				if (testAccess.failRuntime)
					throw new Error("Recoverable reference failure");
				yield {
					type: "tool-input-available" as const,
					name: "record_create" as const,
					toolCallId: "creation",
					input: { title: "Idempotent test record" },
				};
			})();
		},
	},
};
