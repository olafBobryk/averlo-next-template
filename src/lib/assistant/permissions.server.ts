import "server-only";
import type { AssistantPermissionAdapter } from "./contracts";

const recordActions = new Set([
	"record_create",
	"record_update",
	"record_archive",
	"record_delete",
]);
declare global {
	var __averloAssistantPermissions: Map<string, Set<string>> | undefined;
}

export const fixturePermissionAdapter: AssistantPermissionAdapter = {
	async update(actor, scope, change) {
		if (
			scope !== "records" ||
			change.actionIds.some((id) => !recordActions.has(id))
		) {
			throw new Error("Unknown permission.");
		}
		globalThis.__averloAssistantPermissions ??= new Map();
		const store = globalThis.__averloAssistantPermissions;
		const key = JSON.stringify([actor.organizationId, actor.userId, scope]);
		const allowed = store.get(key) ?? new Set<string>();
		for (const id of change.actionIds) {
			if (change.permission === "allow") allowed.add(id);
			else allowed.delete(id);
		}
		store.set(key, allowed);
	},
	async allows(actor, scope, actionId) {
		if (scope !== "records" || !recordActions.has(actionId)) return false;
		const key = JSON.stringify([actor.organizationId, actor.userId, scope]);
		return (
			globalThis.__averloAssistantPermissions?.get(key)?.has(actionId) ?? false
		);
	},
};
