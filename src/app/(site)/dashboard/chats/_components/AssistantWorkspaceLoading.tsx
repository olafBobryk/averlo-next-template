"use client";

import { Composer } from "@/components/domain/assistant/Composer";
import { Conversation } from "@/components/domain/assistant/Conversation";
import { Skeleton } from "@/components/ui/misc/Skeleton";
import { Button } from "@/components/ui/primitives/Button";
import { DashboardWorkspaceToolbar } from "../../_components/layout/DashboardWorkspaceToolbar";

export function AssistantWelcome() {
	return (
		<div className="mx-auto grid max-w-xl gap-2 px-6 py-20 text-center">
			<div className="text-lg font-semibold">
				What would you like to work on?
			</div>
			<p className="text-muted-foreground text-sm">
				Ask about Records, attach a private file, or prepare a change for
				approval.
			</p>
		</div>
	);
}

export function AssistantMessagesLoading() {
	return (
		<section
			className="mx-auto grid w-full max-w-3xl gap-7 px-4 sm:px-6"
			aria-busy="true"
			aria-label="Loading conversation messages"
			data-assistant-messages-loading
		>
			<span className="sr-only" role="status">
				Loading conversation messages…
			</span>
			<div className="ml-auto grid w-2/3 gap-2 rounded-xl bg-input p-3">
				<Skeleton className="h-3 w-full" />
				<Skeleton className="h-3 w-3/5" />
			</div>
			<div className="grid gap-2 py-3">
				<Skeleton className="h-3 w-full" />
				<Skeleton className="h-3 w-5/6" />
				<Skeleton className="h-3 w-2/5" />
			</div>
		</section>
	);
}

export function AssistantWorkspaceLoading({
	variant,
	draft,
	onDraftChange,
}: {
	variant: "new" | "thread";
	draft: string;
	onDraftChange: (value: string) => void;
}) {
	return (
		<section className="flex h-full min-h-0 flex-col">
			<Conversation
				header={
					<DashboardWorkspaceToolbar>
						{variant === "new" ? (
							<span className="text-base font-semibold">New conversation</span>
						) : (
							<Skeleton className="h-5 w-56" />
						)}
						{variant === "thread" ? (
							<div className="ml-auto flex gap-1">
								<Button.Skeleton size="icon-sm" variant="bare" />
								<Button.Skeleton size="icon-sm" variant="bare" />
								<Button.Skeleton size="icon-sm" variant="bare" />
							</div>
						) : null}
					</DashboardWorkspaceToolbar>
				}
			>
				{variant === "new" ? (
					<AssistantWelcome />
				) : (
					<AssistantMessagesLoading />
				)}
			</Conversation>
			<div className="relative z-10 -mt-[25px]">
				<Composer
					attachments={[]}
					busy={false}
					canWrite={false}
					draftValue={draft}
					onDraftChange={onDraftChange}
					submitDisabled
					attachmentsDisabled
					permissionsLoading
					onAddFiles={() => {}}
					onRemoveAttachment={() => {}}
					onStop={() => {}}
					onSubmit={() => {}}
					onToolModeChange={() => {}}
					toolMode="off"
				/>
			</div>
		</section>
	);
}
