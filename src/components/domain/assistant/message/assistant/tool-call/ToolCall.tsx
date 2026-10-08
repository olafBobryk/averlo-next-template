"use client";

import { useEffect, useRef, useState } from "react";
import { Accordion } from "@/components/ui/misc";
import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/surfaces";
import type { AssistantToolPart } from "@/lib/assistant/contracts";
import {
	resolveToolPresentation,
	type ToolContent,
	type ToolPresentation,
} from "@/lib/assistant/tool-presentation";

export function ToolArguments({ input }: { input: unknown }) {
	const [expanded, setExpanded] = useState<Record<string, boolean>>({});
	const entries =
		input && typeof input === "object" && !Array.isArray(input)
			? Object.entries(input)
			: [];
	return (
		<dl className="grid gap-1.5" aria-label="Tool details">
			{entries.map(([key, value]) => {
				const text = (
					typeof value === "string"
						? value
						: (JSON.stringify(value, null, 2) ?? String(value))
				).trim();
				const expandable = text.length > 60 || text.includes("\n");
				return (
					<div
						key={key}
						className="grid min-w-0 grid-cols-[minmax(5rem,8rem)_minmax(0,1fr)] gap-x-3 text-sm"
					>
						<dt className="min-w-0 break-words text-muted-foreground">{key}</dt>
						<dd className="min-w-0 font-mono text-muted-foreground">
							{expandable ? (
								<Button
									variant="bare"
									size="none"
									align="left"
									className="max-w-full text-left"
									aria-label={`Toggle ${key} argument`}
									aria-expanded={!!expanded[key]}
									onClick={() =>
										setExpanded((current) => ({
											...current,
											[key]: !current[key],
										}))
									}
								>
									{expanded[key] ? (
										<pre className="whitespace-pre-wrap break-words">
											{text}
										</pre>
									) : (
										<span className="block truncate">
											{text.split("\n")[0]}
										</span>
									)}
								</Button>
							) : (
								<span className="break-words">{text}</span>
							)}
						</dd>
					</div>
				);
			})}
		</dl>
	);
}

function Content({ block }: { block: ToolContent }) {
	if (
		block.annotations?.audience &&
		!block.annotations.audience.includes("user")
	)
		return null;
	if (block.type === "text")
		return (
			<pre className="whitespace-pre-wrap break-words font-mono text-sm text-muted-foreground">
				{block.text.trim()}
			</pre>
		);
	if (
		block.type === "image" &&
		/^image\/(png|jpeg|webp|gif)$/.test(block.mimeType)
	) {
		return (
			// biome-ignore lint/performance/noImgElement: in-memory tool images have no remote optimization source.
			<img
				src={`data:${block.mimeType};base64,${block.data}`}
				alt="Tool result"
				className="my-2 h-auto max-w-full rounded-md"
			/>
		);
	}
	if (
		block.type === "audio" &&
		/^audio\/(mpeg|wav|ogg|webm|mp4)$/.test(block.mimeType)
	)
		return (
			<a
				download="tool-audio"
				href={`data:${block.mimeType};base64,${block.data}`}
				className="underline"
			>
				Download audio result
			</a>
		);
	if (block.type === "resource_link")
		return /^https?:\/\//i.test(block.uri) ? (
			<a
				href={block.uri}
				target="_blank"
				rel="noopener noreferrer"
				className="underline"
			>
				{block.name}
			</a>
		) : (
			<span>{block.name}</span>
		);
	if (block.type === "resource")
		return (
			<pre className="whitespace-pre-wrap break-words text-sm">
				{block.resource.text ??
					`${block.resource.uri}${block.resource.mimeType ? ` (${block.resource.mimeType})` : ""}`}
			</pre>
		);
	return null;
}

export function ToolCallView({
	request,
	response,
	label,
	status,
}: ToolPresentation) {
	const [lines, setLines] = useState(8);
	const [hasMore, setHasMore] = useState(false);
	const viewport = useRef<HTMLDivElement>(null);
	const result = response?.toolResult;
	const error =
		request.toolCall.status === "error"
			? request.toolCall.error
			: result?.status === "error"
				? result.error
				: undefined;
	const blocks =
		result?.status === "success"
			? result.value.content.filter(
					(block) =>
						!block.annotations?.audience ||
						block.annotations.audience.includes("user"),
				)
			: [];
	const structured =
		result?.status === "success" && result.value.content.length === 0
			? result.value.structuredContent
			: undefined;
	const suffix =
		status === "approval"
			? "Needs approval"
			: status === "denied"
				? "Denied"
				: status === "error" ||
						(result?.status === "success" && result.value.isError)
					? "Failed"
					: status === "running"
						? "Running"
						: "";
	const title =
		label ??
		(request.toolCall.status === "success"
			? request.toolCall.value.name.replaceAll("_", " ")
			: "Tool call");
	const [open, setOpen] = useState(false);
	// biome-ignore lint/correctness/useExhaustiveDependencies: disclosure mounts and result changes require reattaching the size observer.
	useEffect(() => {
		const node = viewport.current;
		if (!node) return;
		const measure = () => setHasMore(node.scrollHeight > node.clientHeight + 1);
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(node);
		if (node.firstElementChild) observer.observe(node.firstElementChild);
		return () => observer.disconnect();
	}, [open, lines, response]);
	return (
		<Accordion
			className="my-2"
			title={title}
			open={open}
			onOpenChange={setOpen}
			contentClassName="!px-0 !py-1"
			renderTrigger={(props) => (
				<Button
					{...props}
					variant="bare"
					size="none"
					align="left"
					className="w-full py-0.5 text-sm text-muted-foreground"
					contentClassName="w-full gap-2"
				>
					<span className="min-w-0 flex-1 truncate">{title}</span>
					{suffix && <span className="shrink-0 text-xs">{suffix}</span>}
				</Button>
			)}
		>
			<Card
				padding="xs"
				gap="none"
				elevation="panel"
				border="subtle"
				className="space-y-2 text-sm"
			>
				{request.toolCall.status === "success" &&
					Object.keys(request.toolCall.value.arguments ?? {}).length > 0 && (
						<ToolArguments input={request.toolCall.value.arguments} />
					)}
				{error && (
					<p role="status" className="text-danger text-sm">
						{error}
					</p>
				)}
				{(blocks.length > 0 || structured !== undefined) && (
					<div className="grid gap-1.5">
						<div className="text-sm font-medium text-muted-foreground">
							Output
						</div>
						<section
							ref={viewport}
							className="overflow-y-auto"
							style={{ maxHeight: `${lines * 1.25}rem` }}
							aria-label="Tool output"
							// biome-ignore lint/a11y/noNoninteractiveTabindex: keyboard users must be able to scroll tool output.
							tabIndex={0}
						>
							<div className="space-y-2 pr-3">
								{blocks.map((block, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: result content blocks have stable ordered positions and no IDs or local state.
									<Content key={`${block.type}-${index}`} block={block} />
								))}
								{structured !== undefined && (
									<pre className="whitespace-pre-wrap break-words font-mono text-sm">
										{JSON.stringify(structured, null, 2)}
									</pre>
								)}
							</div>
						</section>
						{hasMore && lines < 24 && (
							<Button
								variant="bare"
								size="none"
								align="left"
								className="w-fit py-1 text-sm"
								onClick={() => setLines((current) => Math.min(current + 8, 24))}
							>
								View more
							</Button>
						)}
						{hasMore && lines === 24 && (
							<p className="text-xs text-muted-foreground">
								Scroll to see the remaining output
							</p>
						)}
					</div>
				)}
			</Card>
		</Accordion>
	);
}

/** Keeps the executable Records contract out of the provider-neutral renderer. */
export function ToolCall({
	part,
}: {
	part: AssistantToolPart;
	disabled?: boolean;
	onDecision?: (approved: boolean) => void;
}) {
	return <ToolCallView {...resolveToolPresentation(part)} />;
}
