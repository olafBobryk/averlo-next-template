import { resolveAssistantActor } from "@/lib/assistant/access.server";
import { assistantAdapters } from "@/lib/assistant/server";
export async function POST(request: Request) {
	const access = await resolveAssistantActor();
	if (!access) return Response.json({ error: "Unauthorized" }, { status: 401 });
	const body = await request.json().catch(() => null);
	if (
		!body ||
		typeof body.threadId !== "string" ||
		typeof body.query !== "string" ||
		body.query.length > 200 ||
		(body.attachmentIds !== undefined &&
			(!Array.isArray(body.attachmentIds) ||
				body.attachmentIds.length > 5 ||
				body.attachmentIds.some((id: unknown) => typeof id !== "string")))
	)
		return Response.json({ error: "Invalid context search." }, { status: 400 });
	const thread = await assistantAdapters.conversations.getThread(
		access.actor,
		body.threadId,
	);
	if (!thread)
		return Response.json({ error: "Conversation not found." }, { status: 404 });
	const fileIds = [
		...(body.attachmentIds ?? []),
		...thread.messages.flatMap((message) =>
			message.parts.flatMap((part) =>
				part.type === "file" ? [part.attachment.id] : [],
			),
		),
	];
	try {
		const items = await assistantAdapters.context.search(
			{ actor: access.actor, capabilities: access.capabilities, fileIds },
			body.query,
		);
		return Response.json(
			{ items },
			{ headers: { "Cache-Control": "no-store" } },
		);
	} catch {
		return Response.json(
			{ error: "Could not load context. Try again." },
			{ status: 503 },
		);
	}
}
