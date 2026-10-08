import { resolveAssistantActor } from "@/lib/assistant/access.server";
import { cancelAssistantRun } from "@/lib/assistant/runs.server";
export async function POST(request: Request) {
	const access = await resolveAssistantActor();
	if (!access) return Response.json({ error: "Unauthorized" }, { status: 401 });
	const body = await request.json().catch(() => null);
	if (typeof body?.threadId !== "string")
		return Response.json(
			{ error: "Conversation is required." },
			{ status: 400 },
		);
	await cancelAssistantRun(access.actor, body.threadId);
	return Response.json({ stopped: true });
}
