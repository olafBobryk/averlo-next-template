"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { ErrorState } from "@/components/ui/misc/state/ErrorState";
import { useDashboardToolbarVisible } from "../../_components/layout/DashboardShellContext";
import { AssistantWorkspaceLoading } from "./AssistantWorkspaceLoading";
import { useAssistantComposerDraft } from "./useAssistantComposerDraft";

export function AssistantNewThreadSurface() {
	const router = useRouter();
	const visible = useDashboardToolbarVisible();
	const { transferTo } = useAssistantComposerDraft("new");
	const requestRef = React.useRef<Promise<string> | null>(null);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		if (error || !visible) return;
		let active = true;
		requestRef.current ??= fetch("/api/assistant/threads", {
			body: JSON.stringify({}),
			headers: { "Content-Type": "application/json" },
			method: "POST",
		}).then(async (response) => {
			const body = (await response.json().catch(() => ({}))) as {
				error?: string;
				thread?: { id?: string };
			};
			if (!response.ok || typeof body.thread?.id !== "string") {
				throw new Error(body.error ?? "Could not start a conversation.");
			}
			return body.thread.id;
		});

		void requestRef.current
			.then((threadId) => {
				if (!active) return;
				transferTo(threadId);
				router.replace(`/dashboard/chats/${encodeURIComponent(threadId)}`);
			})
			.catch((caughtError: unknown) => {
				if (!active) return;
				setError(
					caughtError instanceof Error
						? caughtError.message
						: "Could not start a conversation.",
				);
			});

		return () => {
			active = false;
		};
	}, [error, router, visible, transferTo]);

	if (error) {
		return (
			<div className="grid h-full place-items-center px-6">
				<ErrorState
					align="center"
					description={error}
					layout="stacked"
					onAction={() => {
						requestRef.current = null;
						setError(null);
					}}
					title="Could not start a conversation"
				/>
			</div>
		);
	}

	return <AssistantNewThreadSurfaceSkeleton />;
}

export function AssistantNewThreadSurfaceSkeleton() {
	const { text, setText } = useAssistantComposerDraft("new");
	return (
		<AssistantWorkspaceLoading
			variant="new"
			draft={text}
			onDraftChange={setText}
		/>
	);
}
