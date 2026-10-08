"use client";
import {
	AnimatePresence,
	type HTMLMotionProps,
	motion,
	useIsPresent,
} from "motion/react";
import { useState } from "react";
import { useMotionTransition } from "@/components/ui/foundations/MotionProvider";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import { ContentPresence } from "@/components/ui/motion/presence/ContentPresence";
import { Card } from "@/components/ui/primitives/surfaces";
import { Button } from "@/components/ui/primitives/Button";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import type {
	AssistantContextReference,
	AssistantFixtureScenario,
	AssistantStagedAttachment,
} from "@/lib/assistant/contracts";

function QueueRow(props: HTMLMotionProps<"li">) {
	const present = useIsPresent();
	return (
		<motion.li
			{...props}
			inert={!present || undefined}
			aria-hidden={!present || undefined}
		/>
	);
}

export type QueuedMessage = {
	contextReferences?: AssistantContextReference[];
	id: string;
	text: string;
	attachments: AssistantStagedAttachment[];
	fixtureScenario?: AssistantFixtureScenario;
};
export function MessageQueue({
	items,
	sendingId,
	paused,
	onEdit,
	onChange,
	onSendNow,
	blocked = false,
	disabled = false,
	running = false,
}: {
	items: QueuedMessage[];
	blocked?: boolean;
	disabled?: boolean;
	running?: boolean;
	sendingId?: string;
	paused: boolean;
	onEdit: (id: string) => void;
	onChange: (items: QueuedMessage[]) => void;
	onSendNow: (id: string) => void;
}) {
	const sendingQueuedItem = items.some((item) => item.id === sendingId);
	const locked = disabled || sendingQueuedItem;
	const motionAllowed = useMotionAllowed(true);
	const motionDisabled = useMotionDisableOverride();
	const duration = useMotionTransition("disclosure").duration;
	const transition =
		motionAllowed && !motionDisabled
			? { type: "spring" as const, bounce: 0, duration }
			: { duration: 0 };
	const [hovered, setHovered] = useState<string | null>(null);
	const [focused, setFocused] = useState<string | null>(null);
	const [dragged, setDragged] = useState<string | null>(null);
	const move = (from: number, to: number) => {
		if (locked || from < 0 || to < 0 || to >= items.length) return;
		const next = [...items];
		const [item] = next.splice(from, 1);
		next.splice(to, 0, item);
		onChange(next);
	};
	return (
		<AnimatePresence initial={false}>
			{items.length > 0 && (
				<motion.div
					key="queue"
					initial={{ height: 40, opacity: 0 }}
					animate={{
						height: 40 + 33 + Math.min(items.length, 8) * 32,
						opacity: 1,
					}}
					exit={{ height: 40, opacity: 0 }}
					transition={transition}
					style={{ marginBottom: -40, overflow: "hidden" }}
				>
					<Card
						as="section"
						padding="none"
						aria-label="Message queue"
						width="full"
						className="relative !rounded-t-[18px] !rounded-b-none !border-b-0 pb-10 text-xs"
					>
						<div className="flex h-8 items-center gap-2 px-[15px] text-xs text-muted-foreground">
							<span>Queue · {items.length}</span>
							<span role="status">
								{paused ? "Paused" : sendingQueuedItem ? "Sending…" : ""}
							</span>
							<div className="ml-auto flex gap-2">
								<Button
									variant="bare"
									size="none"
									className="min-h-7 py-1 text-xs"
									disabled={locked}
									onClick={() => {
										onChange([]);
									}}
								>
									Clear all
								</Button>
							</div>
						</div>
						<ol className="max-h-64 overflow-y-auto overscroll-contain">
							<AnimatePresence initial={false}>
								{items.map((item, index) => (
									<QueueRow
										key={item.id}
										onMouseEnter={() => setHovered(item.id)}
										onMouseLeave={() => setHovered(null)}
										onFocusCapture={() => setFocused(item.id)}
										onBlurCapture={(event) => {
											if (!event.currentTarget.contains(event.relatedTarget))
												setFocused(null);
										}}
										layout="position"
										initial={{ height: 0, minHeight: 0, opacity: 0 }}
										animate={{ height: 32, minHeight: 32, opacity: 1 }}
										exit={{ height: 0, minHeight: 0, opacity: 0 }}
										transition={transition}
										className="group/row flex min-w-0 items-center overflow-hidden border-t border-border px-[15px]"
										draggable={!locked && items.length > 1}
										onDragStart={() => setDragged(item.id)}
										onDragOver={(event) => event.preventDefault()}
										onDrop={(event) => {
											event.preventDefault();
											move(
												items.findIndex(
													(candidate) => candidate.id === dragged,
												),
												index,
											);
											setDragged(null);
										}}
									>
										<ContentPresence
											axis="x"
											open={
												items.length > 1 &&
												(hovered === item.id || focused === item.id)
											}
										>
											<Button
												size="none"
												iconSize={12}
												shape="round"
												variant="bare"
												aria-label={`Reorder queued message ${index + 1}; use arrow keys`}
												disabled={locked}
												onKeyDown={(event) => {
													if (
														event.key === "ArrowUp" ||
														event.key === "ArrowDown"
													) {
														event.preventDefault();
														move(
															index,
															index + (event.key === "ArrowUp" ? -1 : 1),
														);
													}
												}}
												className="mr-2 min-h-7 py-1 cursor-grab active:cursor-grabbing"
												leadingIcon="drag-handle"
											/>
										</ContentPresence>
										{index === 0 && !paused && (
											<span className="mr-3 font-medium">Next</span>
										)}
										<span className="min-w-0 flex-1 truncate">
											{item.text || "Attachments"}
											{item.attachments.length > 0 && (
												<span className="ml-2 text-muted-foreground">
													{item.attachments
														.map((file) => file.filename)
														.join(", ")}
												</span>
											)}
										</span>
										<Button
											aria-label={`Edit queued message ${index + 1}`}
											className="ml-3 min-h-7 py-1"
											variant="bare"
											size="none"
											iconSize={12}
											shape="round"
											leadingIcon="pencil"
											disabled={locked}
											onClick={() => onEdit(item.id)}
										/>

										<div className="flex w-max items-center gap-3 pl-3">
											{sendingId === item.id ? (
												<span role="status">Sending…</span>
											) : (
												<>
													<Button
														aria-label={`${running ? "Stop and send" : "Send"} queued message ${index + 1} now`}
														disabled={blocked || locked}
														variant="bare"
														size="none"
														iconSize={12}
														shape="round"
														className="min-h-7 py-1"
														leadingIcon="arrow-up"
														onClick={() => onSendNow(item.id)}
													/>
													<Button
														aria-label={`Remove queued message ${index + 1}`}
														variant="bare"
														size="none"
														iconSize={12}
														shape="round"
														className="min-h-7 py-1"
														leadingIcon="close"
														disabled={locked}
														onClick={() => {
															onChange(
																items.filter(
																	(candidate) => candidate.id !== item.id,
																),
															);
														}}
													/>
												</>
											)}
										</div>
									</QueueRow>
								))}
							</AnimatePresence>
						</ol>
					</Card>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
