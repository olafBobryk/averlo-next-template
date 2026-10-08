import assert from "node:assert/strict";
import {
	createReferenceRecord,
	deleteReferenceRecord,
} from "../../src/app/(site)/dashboard/_lib/fixtures/reference-records.core";
import { POST as chat } from "../../src/app/api/assistant/chat/route";
import { POST as approve } from "../../src/app/api/assistant/tools/route";
import {
	claimAssistantApproval,
	createAssistantApprovalId,
	verifyAssistantApprovalId,
} from "../../src/lib/assistant/approval.server";
import {
	completeCommand,
	composerTrigger,
	insertContext,
	rankContextItems,
	reconcileReferences,
	validateReferences,
} from "../../src/lib/assistant/composer-context";
import { createAssistantContextAdapter } from "../../src/lib/assistant/context.server";
import {
	fixtureConversationAdapter as conversations,
	fixtureFileAdapter as files,
} from "../../src/lib/assistant/fixture";
import { fixturePermissionAdapter as permissions } from "../../src/lib/assistant/permissions.server";
import {
	cancelAssistantRun,
	hasAssistantRun,
	startAssistantRun,
} from "../../src/lib/assistant/runs.server";
import { testAccess } from "./assistant-route-test-adapters";

async function verify() {
	const actor = {
		userId: "runtime-test-user",
		organizationId: "runtime-test-org",
	};

	assert.equal(composerTrigger("https://host/path", 17), null);
	assert.equal(composerTrigger("name@example.test", 17), null);
	assert.equal(composerTrigger("a /he", 5)?.query, "he");
	assert.equal(completeCommand(" /help "), "help");
	assert.equal(completeCommand("/help me"), null);
	const item = {
		kind: "record" as const,
		id: "one",
		label: "Same name",
		description: "Record",
	};
	const insertion = insertContext("Review @sa next", 7, 10, item, []);
	assert.equal(insertion.text, "Review @Same name  next");
	assert.equal(insertion.references[0].id, "one");
	const shifted = reconcileReferences(
		insertion.text,
		"Please " + insertion.text,
		insertion.references,
	);
	assert.equal(shifted[0].start, insertion.references[0].start + 7);
	assert.equal(
		reconcileReferences(
			insertion.text,
			insertion.text.replace("Same", "Other"),
			insertion.references,
		).length,
		0,
	);
	assert.throws(() =>
		validateReferences(
			[{ ...insertion.references[0], end: 999 }],
			insertion.text,
		),
	);
	assert.equal(
		rankContextItems(
			[item, { ...item, id: "two", label: "Sometime" }],
			"same",
		)[0].id,
		"one",
	);
	const contextAdapter = createAssistantContextAdapter(files);
	const contextScope = {
		actor,
		capabilities: new Set(["records.read"]),
		fileIds: [] as string[],
	};
	const created = createReferenceRecord(actor.organizationId, {
		title: "Context binding",
		descriptionMarkdown: "Authorized record data",
	});
	assert.ok(created.ok);
	if (!created.ok) throw new Error("Context fixture missing");
	const contextReference = {
		kind: "record" as const,
		id: created.record.id,
		text: "@Context binding",
		start: 0,
		end: 16,
	};
	assert.match(
		(await contextAdapter.resolve(contextScope, contextReference)).text,
		/Authorized record data/,
	);
	await assert.rejects(
		contextAdapter.resolve(
			{ ...contextScope, capabilities: new Set() },
			contextReference,
		),
	);
	await assert.rejects(
		contextAdapter.resolve(
			{ ...contextScope, actor: { ...actor, organizationId: "different-org" } },
			contextReference,
		),
	);
	assert.equal(
		(
			await contextAdapter.search(
				{ ...contextScope, capabilities: new Set() },
				"Context",
			)
		).length,
		0,
	);
	const contextFile = await files.create(
		actor,
		new File(["private"], "context.pdf", { type: "application/pdf" }),
	);
	const fileReference = {
		kind: "file" as const,
		id: contextFile.id,
		text: "@context.pdf",
		start: 0,
		end: 12,
	};
	await assert.rejects(contextAdapter.resolve(contextScope, fileReference));
	await contextAdapter.resolve(
		{ ...contextScope, fileIds: [contextFile.id] },
		fileReference,
	);
	await assert.rejects(
		contextAdapter.resolve(
			{
				...contextScope,
				actor: { ...actor, userId: "other" },
				fileIds: [contextFile.id],
			},
			fileReference,
		),
	);
	deleteReferenceRecord(actor.organizationId, created.record.id);
	await assert.rejects(contextAdapter.resolve(contextScope, contextReference));
	console.log(
		"Composer context: trigger boundaries, exact commands, reference edits/ranges, fresh resolution, revoked access and actor/file isolation passed.",
	);
	const stranger = { ...actor, userId: "other" };
	const otherOrg = { ...actor, organizationId: "other" };
	assert.equal(
		await permissions.allows(actor, "records", "record_update"),
		false,
	);
	await permissions.update(actor, "records", {
		permission: "allow",
		actionIds: ["record_update"],
	});
	assert.equal(
		await permissions.allows(actor, "records", "record_update"),
		true,
	);
	assert.equal(
		await permissions.allows(actor, "records", "record_delete"),
		false,
	);
	assert.equal(
		await permissions.allows(stranger, "records", "record_update"),
		false,
	);
	assert.equal(
		await permissions.allows(otherOrg, "records", "record_update"),
		false,
	);
	await assert.rejects(
		permissions.update(actor, "records", {
			permission: "allow",
			actionIds: ["future_action"],
		}),
	);
	await permissions.update(actor, "records", {
		permission: "ask",
		actionIds: ["record_update"],
	});
	assert.equal(
		await permissions.allows(actor, "records", "record_update"),
		false,
	);
	const original = await conversations.getThread(actor, "assistant-welcome");
	assert.ok(original);
	const duplicate = await conversations.duplicateThread(actor, original.id);
	assert.ok(
		duplicate.messages.every((message) =>
			message.parts.every(
				(part) =>
					part.type !== "tool" ||
					(part.approvalId === null && part.state !== "approval-requested"),
			),
		),
	);
	assert.equal(await conversations.getThread(stranger, duplicate.id), null);
	const user = duplicate.messages.find((message) => message.role === "user")!;
	await conversations.editMessage(actor, duplicate.id, user.id, "Changed text");
	assert.equal(
		(await conversations.getThread(actor, duplicate.id))?.messages[0].parts[0]
			.type,
		"text",
	);
	assert.notEqual(
		(await conversations.getThread(actor, original.id))?.messages[0].parts[0],
		"Changed text",
	);
	const signed = {
		actor,
		threadId: original.id,
		partId: "test-part",
		toolName: "record_update" as const,
	};
	const approvalId = createAssistantApprovalId(signed);
	assert.ok(verifyAssistantApprovalId(approvalId, signed));
	assert.equal(
		verifyAssistantApprovalId(approvalId, { ...signed, actor: stranger }),
		false,
	);
	assert.equal(
		verifyAssistantApprovalId(approvalId, {
			...signed,
			threadId: duplicate.id,
		}),
		false,
	);
	const claimed = await Promise.all(
		Array.from({ length: 20 }, async () => claimAssistantApproval(approvalId)),
	);
	assert.equal(claimed.filter(Boolean).length, 1);
	const controller = new AbortController();
	const finish = startAssistantRun(actor, {
		threadId: original.id,
		controller,
	});
	assert.throws(() => startAssistantRun(actor));
	let acknowledged = false;
	const cancellation = cancelAssistantRun(actor, original.id).then(() => {
		acknowledged = true;
	});
	assert.equal(controller.signal.aborted, true);
	await Promise.resolve();
	assert.equal(acknowledged, false);
	assert.equal(hasAssistantRun(actor), true);
	finish();
	await cancellation;
	assert.equal(acknowledged, true);
	assert.equal(hasAssistantRun(actor), false);
	startAssistantRun(actor)();
	const routeActor = testAccess.actor;
	const routeThread = await conversations.createThread(
		routeActor,
		"Route test",
	);
	await conversations.updateThread(routeActor, routeThread.id, {
		toolMode: "read_write",
	});
	const partId = "route-approval";
	const routeApproval = createAssistantApprovalId({
		actor: routeActor,
		threadId: routeThread.id,
		partId,
		toolName: "record_create",
	});
	await conversations.appendMessage(routeActor, routeThread.id, {
		id: "route-message",
		createdAt: new Date().toISOString(),
		role: "assistant",
		parts: [
			{
				id: partId,
				type: "tool",
				name: "record_create",
				approvalId: routeApproval,
				input: { title: "Exactly once" },
				output: null,
				error: null,
				state: "approval-requested",
			},
		],
	});
	const body = {
		threadId: routeThread.id,
		messageId: "route-message",
		partId,
		approvalId: routeApproval,
		decision: "always_allow",
		toolMode: "read_write",
	};
	const request = (value: unknown) =>
		new Request("http://localhost/api/assistant/tools", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(value),
		});
	testAccess.canWrite = false;
	assert.equal((await approve(request(body))).status, 403);
	testAccess.canWrite = true;
	assert.equal(
		(await approve(request({ ...body, toolMode: "off" }))).status,
		403,
	);
	const decisions = await Promise.all(
		Array.from({ length: 12 }, () => approve(request(body))),
	);
	assert.equal(
		decisions.filter((response) => response.status === 200).length,
		1,
	);
	assert.equal(
		decisions.filter((response) => response.status === 409).length,
		11,
	);
	assert.equal(
		await permissions.allows(routeActor, "records", "record_create"),
		true,
	);
	const oncePart = (await conversations.getThread(routeActor, routeThread.id))
		?.messages[0].parts[0];
	assert.ok(oncePart?.type === "tool" && oncePart.state === "completed");
	const firstId = "deduplicated-submission";
	const chatBody = {
		threadId: routeThread.id,
		text: "Create a record",
		toolMode: "read_write",
		requestId: firstId,
	};
	const submissions = await Promise.all(
		Array.from({ length: 8 }, () => chat(request(chatBody))),
	);
	const accepted = submissions.filter((response) => response.status === 200);
	assert.equal(accepted.length, 1);
	await accepted[0].text();
	const replay = await chat(request(chatBody));
	assert.equal(replay.status, 200);
	await replay.text();
	const afterRun = await conversations.getThread(routeActor, routeThread.id);
	assert.equal(
		afterRun?.messages.filter((message) => message.id === firstId).length,
		1,
	);
	assert.ok(
		afterRun?.messages
			.at(-1)
			?.parts.some(
				(part) => part.type === "tool" && part.state === "completed",
			),
	);
	await permissions.update(routeActor, "records", {
		permission: "ask",
		actionIds: ["record_create"],
	});
	const afterRevoke = await chat(
		request({ ...chatBody, requestId: "revoked-permission-run" }),
	);
	await afterRevoke.text();
	assert.ok(
		(await conversations.getThread(routeActor, routeThread.id))?.messages
			.at(-1)
			?.parts.some(
				(part) => part.type === "tool" && part.state === "approval-requested",
			),
	);
	const blocked = await chat(
		request({ ...chatBody, requestId: "pending-approval-block" }),
	);
	assert.equal(blocked.status, 409);
	const failureThread = await conversations.createThread(
		routeActor,
		"Failed attachment submission",
	);
	const file = await files.create(
		routeActor,
		new File(["%PDF-1.7 test"], "brief.pdf", { type: "application/pdf" }),
	);
	testAccess.failRuntime = true;
	const failureBody = {
		threadId: failureThread.id,
		text: "Keep my attachment",
		attachmentIds: [file.id],
		toolMode: "read_only",
		requestId: "failed-attachment-submission",
	};
	const failedRun = await chat(request(failureBody));
	assert.match(await failedRun.text(), /Recoverable reference failure/);
	assert.ok(await files.get(routeActor, file.id));
	assert.ok(
		(
			await conversations.getThread(routeActor, failureThread.id)
		)?.messages[0].parts.some(
			(part) => part.type === "file" && part.attachment.id === file.id,
		),
	);
	testAccess.failRuntime = false;
	const failureReplay = await chat(request(failureBody));
	assert.equal(failureReplay.status, 200);
	await failureReplay.text();
	assert.equal(
		(
			await conversations.getThread(routeActor, failureThread.id)
		)?.messages.filter((message) => message.role === "user").length,
		1,
	);
	const recovered = (
		await conversations.getThread(routeActor, failureThread.id)
	)?.messages.at(-1);
	assert.equal(recovered?.role, "assistant");
	assert.ok(recovered?.role === "assistant" && !recovered.failure);

	const selectedRecord = createReferenceRecord(routeActor.organizationId, {
		title: "Selected context",
		descriptionMarkdown: "Resolved at execution time",
	});
	assert.ok(selectedRecord.ok);
	if (!selectedRecord.ok) throw new Error("Record creation failed");
	const contextThread = await conversations.createThread(
		routeActor,
		"Context route",
	);
	const selectedText = "Review @Selected context";
	const selectedReferences = [
		{
			kind: "record" as const,
			id: selectedRecord.record.id,
			text: "@Selected context",
			start: 7,
			end: selectedText.length,
		},
	];
	const contextResponse = await chat(
		new Request("http://localhost/api/assistant/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				threadId: contextThread.id,
				text: selectedText,
				contextReferences: selectedReferences,
				toolMode: "read_only",
			}),
		}),
	);
	assert.equal(contextResponse.status, 200);
	await contextResponse.text();
	assert.match(
		JSON.stringify(testAccess.lastMessages),
		/Resolved at execution time/,
	);
	const savedContextThread = await conversations.getThread(
		routeActor,
		contextThread.id,
	);
	assert.doesNotMatch(
		JSON.stringify(savedContextThread),
		/Resolved at execution time/,
	);
	const savedUser = savedContextThread?.messages[0];
	assert.ok(savedUser?.role === "user");
	if (savedUser?.role !== "user")
		throw new Error("Missing referenced user message");
	assert.deepEqual(savedUser.contextReferences, selectedReferences);
	const contextCopy = await conversations.duplicateThread(
		routeActor,
		contextThread.id,
	);
	assert.deepEqual(
		contextCopy.messages[0].role === "user" &&
			contextCopy.messages[0].contextReferences,
		selectedReferences,
	);
	await conversations.editMessage(
		routeActor,
		contextThread.id,
		savedUser.id,
		"Edited without reference",
		[],
	);
	const editedContext = await conversations.getThread(
		routeActor,
		contextThread.id,
	);
	assert.deepEqual(
		editedContext?.messages[0].role === "user" &&
			editedContext.messages[0].contextReferences,
		[],
	);
	deleteReferenceRecord(routeActor.organizationId, selectedRecord.record.id);
	const missingThread = await conversations.createThread(
		routeActor,
		"Unavailable context",
	);
	const unavailable = await chat(
		new Request("http://localhost/api/assistant/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				threadId: missingThread.id,
				text: selectedText,
				contextReferences: selectedReferences,
			}),
		}),
	);
	assert.equal(unavailable.status, 409);
	assert.equal(
		(await conversations.getThread(routeActor, missingThread.id))?.messages
			.length,
		0,
	);
	console.log(
		"Context submission: server resolution, metadata persistence, safe duplication, editing and unavailable-reference recovery passed.",
	);
	console.log(
		"Assistant route concurrency: capability loss, tool-mode checks, single execution, duplicate submission replay and revocation passed.",
	);

	console.log(
		"Assistant runtime: permission isolation/revocation, safe duplication, approval claiming and cancellation acknowledgement passed.",
	);
}
await verify();
