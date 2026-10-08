import "server-only";
import {
	getReferenceRecord,
	listReferenceRecords,
} from "@/app/(site)/dashboard/_lib/fixtures/reference-records.server";
import { rankContextItems } from "./composer-context";
import type {
	AssistantContextAdapter,
	AssistantContextItem,
	AssistantFileAdapter,
} from "./contracts";

export function createAssistantContextAdapter(
	files: AssistantFileAdapter,
): AssistantContextAdapter {
	return {
		async search(scope, query) {
			const items: AssistantContextItem[] = [];
			if (scope.capabilities.has("records.read")) {
				items.push({
					kind: "connection",
					id: "records",
					label: "Records",
					description: "Built-in connection · Current organization",
				});
				items.push(
					...listReferenceRecords(scope.actor.organizationId).map((record) => ({
						kind: "record" as const,
						id: record.id,
						label: record.title,
						description: `Record · ${record.status} · ${record.id}`,
					})),
				);
			}
			for (const id of new Set(scope.fileIds)) {
				const file = await files.get(scope.actor, id);
				if (file?.attachment.status === "ready")
					items.push({
						kind: "file",
						id,
						label: file.attachment.filename,
						description: `Attached file · ${file.attachment.contentType}`,
					});
			}
			return rankContextItems(items, query).slice(0, 100);
		},
		async resolve(scope, reference) {
			if (
				reference.kind === "record" &&
				scope.capabilities.has("records.read")
			) {
				const record = getReferenceRecord(
					scope.actor.organizationId,
					reference.id,
				);
				if (record)
					return {
						text: JSON.stringify({
							kind: "record",
							id: record.id,
							title: record.title,
							status: record.status,
							description: record.descriptionMarkdown,
						}),
					};
			}
			if (
				reference.kind === "connection" &&
				reference.id === "records" &&
				scope.capabilities.has("records.read")
			)
				return {
					text: JSON.stringify({
						kind: "connection",
						id: "records",
						name: "Records",
						account: "Current organization",
						status: "connected",
						capabilities: scope.capabilities.has("records.write")
							? [
									"read",
									"prepare changes subject to current tool mode and approval",
								]
							: ["read"],
					}),
				};
			if (reference.kind === "file" && scope.fileIds.includes(reference.id)) {
				const file = await files.get(scope.actor, reference.id);
				if (
					file?.attachment.status === "ready" &&
					(await files.getAccessUrl(scope.actor, reference.id))
				)
					return {
						text: JSON.stringify({
							kind: "file",
							id: reference.id,
							filename: file.attachment.filename,
							contentType: file.attachment.contentType,
							size: file.attachment.size,
						}),
						attachment: file.attachment,
					};
			}
			throw new Error(
				`Context “${reference.text}” is unavailable or access was revoked. Remove it and select an available item.`,
			);
		},
	};
}
