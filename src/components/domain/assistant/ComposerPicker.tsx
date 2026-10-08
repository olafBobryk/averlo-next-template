"use client";
import { motion } from "motion/react";
import type { KeyboardEvent, RefObject } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { useMotionTransition } from "@/components/ui/foundations/MotionProvider";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import { Icon } from "@/components/ui/icons/Icon";
import { Button } from "@/components/ui/primitives/Button";
import Divider from "@/components/ui/primitives/Divider";
import { Card } from "@/components/ui/primitives/surfaces";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import {
	composerCommands,
	composerTrigger,
	insertContext,
	rankContextItems,
	reconcileReferences,
} from "@/lib/assistant/composer-context";
import type {
	AssistantContextItem,
	AssistantContextReference,
} from "@/lib/assistant/contracts";

export type ContextSearch = (
	query: string,
	signal: AbortSignal,
) => Promise<AssistantContextItem[]>;
type Item = {
	id: string;
	label: string;
	description: string;
	context?: AssistantContextItem;
};
export function useComposerPicker({
	text,
	references,
	onChange,
	textarea,
	search,
	disabled,
}: {
	text: string;
	references: AssistantContextReference[];
	onChange: (text: string, references: AssistantContextReference[]) => void;
	textarea: RefObject<HTMLTextAreaElement | null>;
	search?: ContextSearch;
	disabled?: boolean;
}) {
	const id = useId();
	const [trigger, setTrigger] =
		useState<ReturnType<typeof composerTrigger>>(null);
	const [index, setIndex] = useState(0);
	const [items, setItems] = useState<Item[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [retry, setRetry] = useState(0);
	const container = useRef<HTMLDivElement>(null);
	const transition = useMotionTransition("disclosure");
	const allowed = useMotionAllowed(true);
	const off = useMotionDisableOverride();
	const animate = allowed && !off;
	const close = () => setTrigger(null);
	const update = (value: string, cursor: number) => {
		setTrigger(composerTrigger(value, cursor));
		setIndex(0);
	};
	useEffect(() => {
		if (disabled) setTrigger(null);
	}, [disabled]);
	useEffect(() => {
		setTrigger((current) =>
			current &&
			text.slice(current.start, current.end) ===
				(current.kind === "command" ? "/" : "@") + current.query
				? current
				: null,
		);
	}, [text]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: retry intentionally repeats the same query after a recoverable failure.
	useEffect(() => {
		if (!trigger) return;
		const controller = new AbortController();
		setIndex(0);
		setError("");
		setItems([]);
		if (trigger.kind === "command") {
			setItems(rankContextItems([...composerCommands], trigger.query));
			setLoading(false);
			return;
		}
		setLoading(true);
		const timer = setTimeout(() => {
			(search ? search(trigger.query, controller.signal) : Promise.resolve([]))
				.then((result) => {
					if (!controller.signal.aborted) {
						setItems(
							result.map((context) => ({
								id: `${context.kind}:${context.id}`,
								label: context.label,
								description: context.description,
								context,
							})),
						);
						setLoading(false);
					}
				})
				.catch(() => {
					if (!controller.signal.aborted) {
						setError("Could not load context.");
						setLoading(false);
					}
				});
		}, 100);
		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}, [trigger, search, retry]);
	useEffect(() => {
		if (!trigger) return;
		const dismiss = (event: PointerEvent) => {
			if (
				!container.current?.contains(event.target as Node) &&
				event.target !== textarea.current
			)
				setTrigger(null);
		};
		document.addEventListener("pointerdown", dismiss);
		return () => document.removeEventListener("pointerdown", dismiss);
	}, [trigger, textarea]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: selection changes require scrolling the active option into view.
	useEffect(() => {
		container.current
			?.querySelector('[aria-selected="true"]')
			?.scrollIntoView({ block: "nearest" });
	}, [index, items]);
	const choose = (item: Item) => {
		if (!trigger) return;
		if (item.context) {
			const next = insertContext(
				text,
				trigger.start,
				trigger.end,
				item.context,
				references,
			);
			onChange(next.text, next.references);
			close();
			requestAnimationFrame(() => {
				textarea.current?.focus();
				textarea.current?.setSelectionRange(next.cursor, next.cursor);
			});
		} else {
			const next =
				text.slice(0, trigger.start) +
				item.label +
				" " +
				text.slice(trigger.end);
			// Command text is an ordinary editable token, not an immediate execution.
			const cursor = trigger.start + item.label.length + 1;
			onChange(next, reconcileReferences(text, next, references));
			close();
			requestAnimationFrame(() => {
				textarea.current?.focus();
				textarea.current?.setSelectionRange(cursor, cursor);
			});
		}
	};
	const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (!trigger || event.nativeEvent.isComposing || event.keyCode === 229)
			return false;
		if (
			["ArrowDown", "ArrowUp", "Escape"].includes(event.key) ||
			(event.key === "Enter" && !event.shiftKey && !event.altKey)
		) {
			event.preventDefault();
			if (event.key === "Escape") close();
			else if (event.key === "ArrowDown")
				setIndex((current) =>
					Math.min(current + 1, Math.max(0, items.length - 1)),
				);
			else if (event.key === "ArrowUp")
				setIndex((current) => Math.max(0, current - 1));
			else if (items[index]) choose(items[index]);
			return true;
		}
		return false;
	};
	return {
		update,
		onKeyDown,
		close,
		aria: {
			"aria-autocomplete": "list" as const,
			"aria-haspopup": "listbox" as const,
			"aria-controls": trigger ? id : undefined,
			"aria-activedescendant":
				trigger && items[index] ? `${id}-${index}` : undefined,
		},
		view:
			trigger && !disabled ? (
				<motion.div
					ref={container}
					initial={animate ? { opacity: 0, y: 4 } : false}
					animate={{ opacity: 1, y: 0 }}
					transition={animate ? transition : { duration: 0 }}
					className="absolute inset-x-0 bottom-[calc(100%+8px)] z-50"
				>
					<Card
						padding="none"
						className="w-full !rounded-[25px] max-h-[min(20rem,60vh)] flex flex-col"
					>
						<div
							role="status"
							aria-live="polite"
							className="px-4 py-3 text-xs text-muted-foreground"
						>
							{loading
								? "Loading context…"
								: error ||
									`${items.length} ${trigger.kind === "command" ? "command" : "item"}${items.length === 1 ? "" : "s"} found`}
						</div>
						<div className="px-4">
							<Divider decorative />
						</div>
						{error ? (
							<div className="p-4 text-sm">
								<Button
									variant="bare"
									size="none"
									onClick={() => setRetry((value) => value + 1)}
								>
									Try again
								</Button>
							</div>
						) : null}
						<div
							id={id}
							role="listbox"
							aria-label={trigger.kind === "command" ? "Commands" : "Context"}
							aria-busy={loading}
							className="min-h-0 overflow-y-auto max-h-[280px] p-2 space-y-1"
						>
							{items.map((item, i) => (
								<button
									type="button"
									tabIndex={-1}
									key={item.id}
									id={`${id}-${i}`}
									role="option"
									aria-selected={i === index}
									onMouseDown={(event) => event.preventDefault()}
									onClick={() => choose(item)}
									className={`flex w-full text-left min-h-9 items-center gap-3 rounded-[17px] px-2 py-2 cursor-pointer motion-micro transition-colors ${i === index ? "bg-[var(--button-ghost-hover)]" : "hover:bg-[var(--button-ghost-hover)]"}`}
								>
									<span className="flex size-4 shrink-0 items-center justify-center">
										<Icon
											name={
												item.context?.kind === "file"
													? "paperclip"
													: item.context?.kind === "record"
														? "database"
														: item.context
															? "link"
															: "code"
											}
											size="sm"
										/>
									</span>
									<span className="max-w-[45%] shrink-0 truncate text-sm">
										{item.label}
									</span>
									<span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
										{item.description}
									</span>
								</button>
							))}
							{!loading && !error && !items.length ? (
								<div className="p-4 text-center text-sm text-muted-foreground">
									{trigger.query
										? "No matches found."
										: "No context available."}
								</div>
							) : null}
						</div>
					</Card>
				</motion.div>
			) : null,
	};
}
