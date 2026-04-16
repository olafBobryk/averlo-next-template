"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { spring } from "@/components/ui/foundations/spring";
import { IconSwap } from "@/components/ui/helpers/IconSwap";
import { Icon } from "@/components/ui/icons/Icon";
import Portal from "@/components/ui/overlays/Portal";
import { Button } from "@/components/ui/primitives/Button";
import { Panel } from "@/components/ui/primitives/Panel";
import { Text } from "@/components/ui/primitives/Text";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import type { ToastType } from "@/lib/feedback";
import { showToast } from "@/lib/feedback";

type ToastItem = {
	id: string;
	message: string;
	type: ToastType;
	title?: string;
	durationMs?: number;
	endsAt?: number;
};

type ToastEvent =
	| {
			action: "add" | "update";
			id: string;
			message: string;
			type: ToastType;
			title?: string;
			durationMs?: number;
	  }
	| {
			action: "dismiss";
			id?: string;
	  };

type ToastHostProps = {
	targetId?: string;
	position?: "top-right" | "bottom-center" | "bottom-left" | "bottom-right";
	offsetX?: number;
	offsetY?: number;
	disableWhenReducedMotion?: boolean;
};

const EVENT_NAME = "app-toast";
const DEFAULT_DURATION = 3000;

export default function ToastHost({
	targetId,
	position = "bottom-right",
	offsetX = 0,
	offsetY = 0,
	disableWhenReducedMotion = true,
}: ToastHostProps) {
	const [toasts, setToasts] = React.useState<ToastItem[]>([]);
	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const timers = React.useRef<Record<string, number>>({});

	const scheduleDismiss = React.useCallback(
		(id: string, durationMs?: number) => {
			if (!durationMs) return;
			if (timers.current[id]) window.clearTimeout(timers.current[id]);
			timers.current[id] = window.setTimeout(() => {
				setToasts((prev) => prev.filter((toast) => toast.id !== id));
				delete timers.current[id];
			}, durationMs + 40);
		},
		[],
	);

	React.useEffect(() => {
		const handler = (event: Event) => {
			const detail = (event as CustomEvent).detail as ToastEvent;
			if (detail.action === "dismiss") {
				if (!detail.id) {
					setToasts([]);
					Object.values(timers.current).forEach((timer) => {
						window.clearTimeout(timer);
					});
					timers.current = {};
					return;
				}
				if (timers.current[detail.id]) {
					window.clearTimeout(timers.current[detail.id]);
					delete timers.current[detail.id];
				}
				setToasts((prev) => prev.filter((toast) => toast.id !== detail.id));
				return;
			}

			const durationMs =
				detail.durationMs ??
				(detail.type === "loading" ? undefined : DEFAULT_DURATION);
			const endsAt = durationMs ? Date.now() + durationMs : undefined;

			setToasts((prev) => {
				const exists = prev.find((toast) => toast.id === detail.id);
				if (exists) {
					return prev.map((toast) =>
						toast.id === detail.id
							? {
									...toast,
									message: detail.message,
									type: detail.type,
									title: detail.title,
									durationMs,
									endsAt,
								}
							: toast,
					);
				}
				return [
					...prev,
					{
						id: detail.id,
						message: detail.message,
						type: detail.type,
						title: detail.title,
						durationMs,
						endsAt,
					},
				];
			});

			scheduleDismiss(detail.id, durationMs);
		};

		window.addEventListener(EVENT_NAME, handler as EventListener);
		return () =>
			window.removeEventListener(EVENT_NAME, handler as EventListener);
	}, [scheduleDismiss]);

	React.useEffect(() => {
		const interval = window.setInterval(() => {
			const now = Date.now();
			setToasts((prev) =>
				prev.filter((toast) => !toast.endsAt || toast.endsAt > now),
			);
		}, 1000);
		return () => window.clearInterval(interval);
	}, []);

	const containerClassName = clsx(
		"pointer-events-none fixed inset-0 z-[9999] flex w-full flex-col p-4",
		position === "bottom-center"
			? [
					"items-center justify-end gap-2",
					"[mask-image:linear-gradient(to_top,rgba(0,0,0,1)_0,rgba(0,0,0,1)_calc(46px*3+8px*3+16px),rgba(0,0,0,0)_calc(46px*4+8px*3+16px),rgba(0,0,0,0)_100%)]",
					"[mask-repeat:no-repeat]",
					"[mask-size:100%_100%]",
					"[-webkit-mask-image:linear-gradient(to_top,rgba(0,0,0,1)_0,rgba(0,0,0,1)_calc(46px*3+8px*3+16px),rgba(0,0,0,0)_calc(46px*4+8px*3+16px),rgba(0,0,0,0)_100%)]",
					"[-webkit-mask-repeat:no-repeat]",
					"[-webkit-mask-size:100%_100%]",
				].join(" ")
			: position === "bottom-left"
				? "items-start justify-end gap-3"
				: position === "bottom-right"
					? "items-end justify-end gap-3"
					: "items-end justify-start gap-3",
	);

	return (
		<Portal target={targetId}>
			<div
				className={containerClassName}
				style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
			>
				<AnimatePresence initial={false}>
					{toasts.map((toast) => (
						<ToastItemCard
							key={toast.id}
							toast={toast}
							motionAllowed={motionAllowed}
							onDismiss={() => showToast.dismiss(toast.id)}
						/>
					))}
				</AnimatePresence>
			</div>
		</Portal>
	);
}

type ToastItemCardProps = {
	toast: ToastItem;
	motionAllowed: boolean;
	onDismiss: () => void;
};

function ToastItemCard({
	toast,
	motionAllowed,
	onDismiss,
}: ToastItemCardProps) {
	const tone =
		toast.type === "success"
			? {
					title: toast.title ?? "Success",
					ringOuter: "bg-success/5",
					ringInner: "bg-success/15",
					iconColor: "text-success",
					barColor: "bg-success",
				}
			: toast.type === "error"
				? {
						title: toast.title ?? "Failed",
						ringOuter: "bg-danger/5",
						ringInner: "bg-danger/15",
						iconColor: "text-danger",
						barColor: "bg-danger",
					}
				: toast.type === "loading"
					? {
							title: toast.title ?? "Loading",
							ringOuter: "bg-foreground/5",
							ringInner: "bg-foreground/15",
							iconColor: "text-foreground",
							barColor: "bg-foreground",
						}
					: {
							title: toast.title ?? "Info",
							ringOuter: "bg-primary/5",
							ringInner: "bg-primary/15",
							iconColor: "text-primary",
							barColor: "bg-primary",
						};

	const showProgress = toast.type !== "loading" && Boolean(toast.durationMs);
	const ringVisibility =
		toast.type === "loading" ? "opacity-0 scale-50" : "opacity-100 scale-100";

	return (
		<Panel
			as={motion.div}
			layout={motionAllowed}
			initial={motionAllowed ? { opacity: 0, y: -8, scale: 0.98 } : false}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={
				motionAllowed
					? { opacity: 0, y: -8, scale: 0.98 }
					: { opacity: 1, y: 0, scale: 1 }
			}
			transition={motionAllowed ? spring.interactive : { duration: 0 }}
			display="flex"
			gap="sm"
			padding="md"
			background="white"
			className={clsx(
				"pointer-events-auto w-full max-w-sm flex-col",
				"transition-colors motion-interactive",
			)}
			aria-live="polite"
		>
			<div className="flex items-start justify-between gap-5">
				<div className="flex items-start gap-5">
					<div className="relative">
						<div
							className={clsx(
								"flex items-center gap-2.5 p-[5px] rounded-full transition-all motion-micro origin-center",
								tone.ringOuter,
							)}
						>
							<div
								className={clsx(
									"flex items-center gap-2.5 rounded-full p-[5px] transition-all motion-micro origin-center",
									tone.ringInner,
									ringVisibility,
								)}
							>
								<div className="w-[15px] h-[15px]" />
							</div>
						</div>
						<div className="absolute inset-0 flex items-center justify-center">
							<IconSwap
								size="md"
								className={clsx(tone.iconColor, "")}
								activeIndex={
									toast.type === "loading"
										? 0
										: toast.type === "success"
											? 1
											: toast.type === "error"
												? 2
												: 1
								}
								items={[
									{ icon: <Icon name="spinner" size="md" animate /> },
									{ icon: <Icon name="check" size="sm" /> },
									{
										icon: (
											<Icon name="close" size="sm" className="h-2.5 w-2.5" />
										),
									},
								]}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-[5px]">
						<Text as="p" variant="bodyStrong">
							{tone.title}
						</Text>
						<Text
							as="p"
							variant="body"
							className="text-left break-words whitespace-normal"
						>
							{toast.message}
						</Text>
					</div>
				</div>
				<Button
					onClick={onDismiss}
					variant="ghost"
					className="transition-colors motion-interactive hover:text-foreground text-foreground/50"
				>
					<Icon name="close" size="sm" />
				</Button>
			</div>
			<div
				className={clsx(
					"transition-all motion-micro overflow-hidden -mt-[15px]",
					showProgress ? "max-h-[18px]" : "max-h-0",
				)}
			>
				<div className="relative h-[3px] w-full mt-[15px]">
					<div className="absolute inset-0 rounded-full bg-foreground/10" />
					{showProgress ? (
						<motion.div
							key={`${toast.id}-${toast.type}`}
							className={clsx(
								"absolute inset-y-0 left-0 rounded-full",
								tone.barColor,
							)}
							initial={{ width: "100%" }}
							animate={{ width: "0%" }}
							transition={{
								duration: (toast.durationMs ?? DEFAULT_DURATION) / 1000,
								ease: "linear",
							}}
						/>
					) : null}
				</div>
			</div>
		</Panel>
	);
}
