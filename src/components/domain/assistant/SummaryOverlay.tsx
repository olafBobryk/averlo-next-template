"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
	type CSSProperties,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { Button } from "@/components/ui/primitives/Button";
import { Float } from "@/components/ui/primitives/surfaces";
/** Shared rendered owner: Chat summary and Lab backlog differ only in content. */
export function SummaryOverlay({
	open,
	onOpenChange,
	title,
	label,
	children,
	closeLabel = "Close",
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: ReactNode;
	label: string;
	children: ReactNode;
	closeLabel?: string;
}) {
	const reduced = useReducedMotion();
	const [anchor, setAnchor] = useState<{
		right: number;
		top: number;
		maxWidth: number;
	}>();
	useEffect(() => {
		if (!open) return;
		const pane = document.querySelector("[data-conversation-pane]");
		if (!pane) return;
		const measure = () => {
			const r = pane.getBoundingClientRect();
			setAnchor({
				right: innerWidth - r.right + 12,
				top: Math.max(56, r.top + 8),
				maxWidth: Math.max(200, r.width - 24),
			});
		};
		const observer = new ResizeObserver(measure);
		observer.observe(pane);
		window.addEventListener("resize", measure);
		measure();
		return () => {
			observer.disconnect();
			window.removeEventListener("resize", measure);
		};
	}, [open]);
	const trigger = useRef<HTMLButtonElement>(null),
		panel = useRef<HTMLDivElement>(null),
		manual = useRef(false);
	useEffect(() => {
		if (!open) return;
		if (manual.current) {
			panel.current?.focus();
			manual.current = false;
		}
		const listener = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onOpenChange(false);
				trigger.current?.focus();
			}
		};
		document.addEventListener("keydown", listener);
		return () => document.removeEventListener("keydown", listener);
	}, [open, onOpenChange]);
	return (
		<>
			<Button
				ref={trigger}
				size="icon-sm"
				shape="square"
				variant="ghost"
				leadingIcon="summary"
				aria-label={label}
				title={label}
				aria-expanded={open}
				aria-controls="workspace-summary"
				onClick={() => {
					manual.current = true;
					onOpenChange(!open);
				}}
			/>
			<AnimatePresence>
				{open ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: reduced ? 0 : 0.18 }}
						className="fixed right-3 top-14 z-40 w-[min(440px,calc(100vw-24px))]"
						style={anchor}
						key="summary"
					>
						<Float>
							<div
								ref={panel}
								tabIndex={-1}
								role="dialog"
								aria-label={label}
								id="workspace-summary"
								className="max-h-[calc(100dvh-80px)] overflow-y-auto p-4 outline-none"
							>
								<div className="mb-4 flex items-center justify-between gap-3">
									<div className="flex min-w-0 items-center gap-2">
										<h2 className="min-w-0 truncate text-sm font-medium">
											{title}
										</h2>
									</div>
									<Button
										size="icon-sm"
										variant="ghost"
										leadingIcon="close"
										aria-label={closeLabel}
										onClick={() => {
											onOpenChange(false);
											trigger.current?.focus();
										}}
									/>
								</div>
								{children}
							</div>
						</Float>
					</motion.div>
				) : null}
			</AnimatePresence>
		</>
	);
}

export function summaryColumnStyle(
	open: boolean,
	animated = true,
): CSSProperties {
	return {
		transform: open
			? "translateX(clamp(-234px, calc((768px - 100%) / 2), 0px))"
			: "translateX(0px)",
		transition: animated
			? "transform var(--motion-interaction-duration, 200ms) var(--motion-interaction-ease, ease)"
			: "none",
	};
}
