import { NextResponse } from "next/server";
import { resolveAssistantActor } from "@/lib/assistant/access.server";
import { validateReferences } from "@/lib/assistant/composer-context";
import { hasAssistantRun } from "@/lib/assistant/runs.server";
import { assistantAdapters } from "@/lib/assistant/server";

type Context = { params: Promise<{ threadId: string }> };

export async function GET(_request: Request, context: Context) {
	const access = await resolveAssistantActor();
	if (!access) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const thread = await assistantAdapters.conversations.getThread(
		access.actor,
		(await context.params).threadId,
	);
	return thread
		? NextResponse.json({ thread })
		: NextResponse.json({ error: "Conversation not found" }, { status: 404 });
}

export async function PATCH(request: Request, context: Context) {
	const access = await resolveAssistantActor();
	if (!access) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const body = (await request.json().catch(() => ({}))) as {
		toolMode?: unknown;
		messageId?: unknown;
		text?: unknown;
		contextReferences?: unknown;
		pinned?: unknown;
		title?: unknown;
	};
	if (typeof body.messageId === "string" && typeof body.text === "string") {
		if (hasAssistantRun(access.actor))
			return NextResponse.json(
				{ error: "Stop the current response before editing." },
				{ status: 409 },
			);
		try {
			return NextResponse.json({
				thread: await assistantAdapters.conversations.editMessage(
					access.actor,
					(await context.params).threadId,
					body.messageId,
					body.text,
					body.contextReferences === undefined
						? undefined
						: validateReferences(body.contextReferences, body.text),
				),
			});
		} catch (error) {
			return NextResponse.json(
				{ error: error instanceof Error ? error.message : "Edit failed." },
				{ status: 409 },
			);
		}
	}
	const patch = {
		...(["off", "read_only", "read_write"].includes(String(body.toolMode))
			? {
					toolMode:
						body.toolMode as import("@/lib/assistant/contracts").AssistantToolMode,
				}
			: {}),
		...(typeof body.pinned === "boolean" ? { pinned: body.pinned } : {}),
		...(typeof body.title === "string" ? { title: body.title } : {}),
	};
	const thread = await assistantAdapters.conversations.updateThread(
		access.actor,
		(await context.params).threadId,
		patch,
	);
	return thread
		? NextResponse.json({ thread })
		: NextResponse.json({ error: "Conversation not found" }, { status: 404 });
}

export async function DELETE(_request: Request, context: Context) {
	const access = await resolveAssistantActor();
	if (!access) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const deleted = await assistantAdapters.conversations.deleteThread(
		access.actor,
		(await context.params).threadId,
	);
	return deleted
		? new NextResponse(null, { status: 204 })
		: NextResponse.json({ error: "Conversation not found" }, { status: 404 });
}

export async function POST(_request: Request, context: Context) {
	const access = await resolveAssistantActor();
	if (!access)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	try {
		return NextResponse.json({
			thread: await assistantAdapters.conversations.duplicateThread(
				access.actor,
				(await context.params).threadId,
			),
		});
	} catch {
		return NextResponse.json(
			{ error: "Conversation not found." },
			{ status: 404 },
		);
	}
}
