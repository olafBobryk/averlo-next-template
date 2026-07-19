"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { instantTransition } from "@/components/ui/foundations/motionTiming";
import { spring } from "@/components/ui/foundations/spring";
import { IconSwap } from "@/components/ui/helpers/IconSwap";
import { Icon } from "@/components/ui/icons/Icon";
import Portal from "@/components/ui/overlays/Portal";
import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
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
					indicatorColor: "text-success",
					fillColor: "bg-success",
					iconColor: "text-white",
					iconIndex: 1,
				}
			: toast.type === "error"
				? {
						title: toast.title ?? "Failed",
						indicatorColor: "text-danger",
						fillColor: "bg-danger",
						iconColor: "text-white",
						iconIndex: 2,
					}
				: toast.type === "loading"
					? {
							title: toast.title ?? "Loading",
							indicatorColor: "text-foreground/70",
							fillColor: "bg-foreground/70",
							iconColor: "text-transparent",
							iconIndex: 0,
						}
					: {
							title: toast.title ?? "Info",
							indicatorColor: "text-primary",
							fillColor: "bg-primary",
							iconColor: "text-primary-foreground",
							iconIndex: 1,
						};

	return (
		<Card
			as={motion.div}
			layout={motionAllowed}
			initial={motionAllowed ? { opacity: 0, y: -8, scale: 0.98 } : false}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={
				motionAllowed
					? { opacity: 0, y: -8, scale: 0.98 }
					: { opacity: 1, y: 0, scale: 1 }
			}
			transition={motionAllowed ? spring.interactive : instantTransition}
			display="flex"
			gap="none"
			padding="sm"
			background="white"
			className={clsx(
				"pointer-events-auto w-full max-w-[22rem]",
				"transition-colors motion-interactive",
			)}
			aria-live="polite"
		>
			<div className="flex min-w-0 items-start gap-3">
				<ToastStatusIndicator
					type={toast.type}
					motionAllowed={motionAllowed}
					indicatorColor={tone.indicatorColor}
					fillColor={tone.fillColor}
					iconColor={tone.iconColor}
					iconIndex={tone.iconIndex}
				/>
				<div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-[1px]">
					<Text as="p" variant="bodyStrong">
						{tone.title}
					</Text>
					<Text
						as="p"
						variant="caption"
						tone="muted"
						className="text-left break-words whitespace-normal"
					>
						{toast.message}
					</Text>
				</div>
				<Button
					onClick={onDismiss}
					variant="ghost"
					size="icon-sm"
					aria-label="Dismiss toast"
					className="transition-colors motion-interactive hover:text-foreground text-foreground/50"
				>
					<Icon name="close" size="sm" />
				</Button>
			</div>
		</Card>
	);
}

type ToastStatusIndicatorProps = {
	type: ToastType;
	motionAllowed: boolean;
	indicatorColor: string;
	fillColor: string;
	iconColor: string;
	iconIndex: number;
};

function ToastStatusIndicator({
	type,
	motionAllowed,
	indicatorColor,
	fillColor,
	iconColor,
	iconIndex,
}: ToastStatusIndicatorProps) {
	const isLoading = type === "loading";
	const ringStyle = isLoading
		? {
				background:
					"conic-gradient(currentColor 0deg 112deg, transparent 112deg 360deg)",
			}
		: undefined;

	return (
		<div
			className={clsx(
				"relative h-8 w-8 shrink-0 overflow-hidden rounded-full",
				indicatorColor,
			)}
			aria-hidden="true"
		>
			<div className="absolute inset-0 rounded-full bg-foreground/10" />
			<div
				className={clsx(
					"absolute inset-0 rounded-full transition-all motion-component",
					isLoading ? indicatorColor : fillColor,
					isLoading && motionAllowed ? "animate-spin-smooth" : "",
				)}
				style={ringStyle}
			/>
			<div
				className={clsx(
					"absolute inset-[4px] rounded-full bg-surface transition-all motion-component",
					isLoading ? "scale-100 opacity-100" : "scale-50 opacity-0",
				)}
			/>
			<div className="absolute inset-0 flex items-center justify-center">
				<IconSwap
					size="sm"
					className={clsx(
						"transition-colors motion-micro",
						isLoading ? "text-transparent" : iconColor,
					)}
					activeIndex={iconIndex}
					items={[
						{ key: "empty", icon: <span className="h-3 w-3" /> },
						{ key: "check", icon: <Icon name="check" size="sm" /> },
						{
							key: "close",
							icon: <Icon name="close" size="sm" className="h-2.5 w-2.5" />,
						},
					]}
				/>
			</div>
		</div>
	);
}
