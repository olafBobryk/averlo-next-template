// ModalShell.tsx
"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import * as React from "react";
import {
	type CSSProperties,
	type MouseEvent,
	type ReactNode,
	useEffect,
	useRef,
} from "react";
import { resolveMotionTransition } from "@/components/ui/foundations/motionTiming";
import { Icon } from "@/components/ui/icons/Icon";
import Portal from "@/components/ui/overlays/Portal";
import { Button } from "@/components/ui/primitives/Button";
import {
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/primitives/Card";
import { Panel } from "@/components/ui/primitives/Panel";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type ModalShellProps = {
	ariaLabel?: string;
	onClose: () => void;
	children: ReactNode;
	portalTargetId?: string;
	panelDirection?: "down" | "up" | "left" | "right";
	animate?: {
		y?: boolean;
		opacity?: boolean;
		scale?: boolean;
	};
	disableWhenReducedMotion?: boolean;

	// NEW
	panelClassName?: string;
	panelWrapperClassName?: string;
	backdropClassName?: string;
	panelStyle?: CSSProperties;
	isTopMost?: boolean;
};

type ModalShellContextValue = {
	beginSubmission: () => boolean;
	endSubmission: () => void;
	isSubmitting: boolean;
	onClose: () => void;
};
type ModalHeaderContextValue = { leadingIcon?: ReactNode };

const ModalShellContext = React.createContext<ModalShellContextValue | null>(
	null,
);
const ModalHeaderContext = React.createContext<ModalHeaderContextValue | null>(
	null,
);

export function useModalSubmission() {
	const context = React.useContext(ModalShellContext);
	if (!context) {
		throw new Error("useModalSubmission must be used inside ModalShell.");
	}
	return {
		beginSubmission: context.beginSubmission,
		endSubmission: context.endSubmission,
		isSubmitting: context.isSubmitting,
	};
}

type ModalHeaderProps = React.ComponentPropsWithoutRef<"div"> & {
	actions?: ReactNode;
	closeDisabled?: boolean;
	closeLabel?: string;
	leadingIcon?: ReactNode;
	onClose?: () => void;
	showCloseButton?: boolean;
};

export function ModalHeader({
	actions,
	children,
	className,
	closeDisabled = false,
	closeLabel = "Close modal",
	leadingIcon,
	onClose,
	showCloseButton = true,
	...props
}: ModalHeaderProps) {
	const modalContext = React.useContext(ModalShellContext);
	const closeHandler = onClose ?? modalContext?.onClose;
	const resolvedCloseDisabled =
		closeDisabled || Boolean(modalContext?.isSubmitting);

	return (
		<CardHeader className={clsx("border-b px-5 py-4", className)} {...props}>
			<ModalHeaderContext.Provider value={{ leadingIcon }}>
				{children}
			</ModalHeaderContext.Provider>
			{actions || (showCloseButton && closeHandler) ? (
				<CardAction className="inline-flex items-center gap-1">
					{actions}
					{showCloseButton && closeHandler ? (
						<Button
							aria-label={closeLabel}
							className="!h-8 !w-8 !px-0"
							disabled={resolvedCloseDisabled}
							onClick={closeHandler}
							size="icon-sm"
							type="button"
							variant="quiet"
						>
							<Icon name="close" size="sm" />
						</Button>
					) : null}
				</CardAction>
			) : null}
		</CardHeader>
	);
}

export function ModalContent({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return (
		<CardContent
			className={clsx(
				"min-h-0 overflow-y-auto overscroll-contain px-5 py-4",
				className,
			)}
			{...props}
		/>
	);
}

export function ModalFooter({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return (
		<CardFooter
			className={clsx("justify-end gap-2 px-5 py-4", className)}
			{...props}
		/>
	);
}

export function ModalTitle({
	children,
	className,
	leadingIcon,
	...props
}: React.ComponentProps<typeof CardTitle> & { leadingIcon?: ReactNode }) {
	const headerContext = React.useContext(ModalHeaderContext);
	const resolvedLeadingIcon = leadingIcon ?? headerContext?.leadingIcon;
	return (
		<CardTitle
			className={clsx("inline-flex items-center gap-2 text-base", className)}
			{...props}
		>
			{resolvedLeadingIcon ? (
				<span className="inline-flex shrink-0 text-muted-foreground [&_svg]:size-4">
					{resolvedLeadingIcon}
				</span>
			) : null}
			{children}
		</CardTitle>
	);
}

export function ModalDescription(
	props: React.ComponentProps<typeof CardDescription>,
) {
	return <CardDescription {...props} />;
}

const overlayTransition = resolveMotionTransition("overlay");
const panelTransition = resolveMotionTransition("disclosure");

const DEFAULT_PANEL =
	"flex will-change-opacity max-w-full w-[450px] max-w-lg overflow-hidden overflow-y-auto";

const FOCUSABLE_SELECTOR = [
	"a[href]",
	"button:not([disabled])",
	"textarea:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusableElements(root: HTMLElement) {
	return Array.from(
		root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
	).filter(
		(node) =>
			node.tabIndex >= 0 &&
			node.getAttribute("aria-hidden") !== "true" &&
			!node.closest("[inert]"),
	);
}

export function ModalShell({
	ariaLabel,
	onClose,
	children,
	portalTargetId = "modal-root",
	panelDirection = "down",
	animate = { y: true, opacity: true },
	disableWhenReducedMotion = true,
	panelClassName,
	panelWrapperClassName,
	backdropClassName,
	panelStyle,
	isTopMost = true,
}: ModalShellProps) {
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const previousActiveElementRef = useRef<HTMLElement | null>(null);
	const submissionRef = useRef(false);
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	function beginSubmission() {
		if (submissionRef.current) return false;
		submissionRef.current = true;
		setIsSubmitting(true);
		return true;
	}

	function endSubmission() {
		submissionRef.current = false;
		setIsSubmitting(false);
	}

	function requestClose() {
		if (submissionRef.current) return;
		onClose();
	}

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!isTopMost) return;

			if (event.key === "Escape") {
				event.preventDefault();
				event.stopPropagation();
				if (!submissionRef.current) onClose();
				return;
			}

			if (event.key !== "Tab") return;

			const wrapper = wrapperRef.current;
			if (!wrapper) return;

			const focusable = getFocusableElements(wrapper);
			if (focusable.length === 0) {
				event.preventDefault();
				wrapper.focus({ preventScroll: true });
				return;
			}

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const active = document.activeElement;

			if (!active || !wrapper.contains(active)) {
				event.preventDefault();
				(event.shiftKey ? last : first)?.focus({ preventScroll: true });
				return;
			}

			if (event.shiftKey && active === first) {
				event.preventDefault();
				last?.focus({ preventScroll: true });
				return;
			}

			if (!event.shiftKey && active === last) {
				event.preventDefault();
				first?.focus({ preventScroll: true });
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isTopMost, onClose]);

	useEffect(() => {
		previousActiveElementRef.current =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;

		const frame = window.requestAnimationFrame(() => {
			const wrapper = wrapperRef.current;
			if (!wrapper || !isTopMost) return;

			const [firstFocusable] = getFocusableElements(wrapper);
			(firstFocusable ?? wrapper).focus({ preventScroll: true });
		});

		return () => {
			window.cancelAnimationFrame(frame);
			const previous = previousActiveElementRef.current;
			if (previous && document.contains(previous)) {
				previous.focus({ preventScroll: true });
			}
		};
	}, [isTopMost]);

	useEffect(() => {
		const body = document.body;
		const currentCount = Number(body.dataset.modalOpenCount ?? "0");
		if (currentCount === 0) {
			body.dataset.modalPrevOverflow = body.style.overflow;
			body.dataset.modalPrevPaddingRight = body.style.paddingRight;
			const scrollbarWidth =
				window.innerWidth - document.documentElement.clientWidth;
			body.style.overflow = "hidden";
			if (scrollbarWidth > 0) {
				body.style.paddingRight = `${scrollbarWidth}px`;
			}
		}
		body.dataset.modalOpenCount = String(currentCount + 1);

		return () => {
			const nextCount = Number(body.dataset.modalOpenCount ?? "1") - 1;
			if (nextCount <= 0) {
				body.style.overflow = body.dataset.modalPrevOverflow ?? "";
				body.style.paddingRight = body.dataset.modalPrevPaddingRight ?? "";
				delete body.dataset.modalPrevOverflow;
				delete body.dataset.modalPrevPaddingRight;
				delete body.dataset.modalOpenCount;
			} else {
				body.dataset.modalOpenCount = String(nextCount);
			}
		};
	}, []);

	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const animateY = animate?.y ?? true;
	const animateOpacity = animate?.opacity ?? true;
	const animateScale = animate?.scale ?? true;

	const offset = (() => {
		switch (panelDirection) {
			case "up":
				return { x: 0, y: -24 };
			case "left":
				return { x: -24, y: 0 };
			case "right":
				return { x: 24, y: 0 };
			default:
				return { x: 0, y: 24 };
		}
	})();

	const backdropInitial = motionAllowed
		? { ...(animateOpacity ? { opacity: 0 } : {}) }
		: undefined;
	const backdropAnimate = motionAllowed
		? { ...(animateOpacity ? { opacity: 1 } : {}) }
		: undefined;
	const backdropExit = motionAllowed
		? { ...(animateOpacity ? { opacity: 0 } : {}) }
		: undefined;

	const panelWrapperInitial = motionAllowed
		? { ...(animateOpacity ? { opacity: 0 } : {}) }
		: undefined;
	const panelWrapperAnimate = motionAllowed
		? { ...(animateOpacity ? { opacity: 1 } : {}) }
		: undefined;
	const panelWrapperExit = motionAllowed
		? { ...(animateOpacity ? { opacity: 0 } : {}) }
		: undefined;

	const panelInitial = motionAllowed
		? {
				...(animateOpacity ? { opacity: 0 } : {}),
				...(animateY
					? {
							...(offset.x ? { x: offset.x } : {}),
							...(offset.y ? { y: offset.y } : {}),
						}
					: {}),
				...(animateScale ? { scale: 0.98 } : {}),
			}
		: undefined;
	const panelAnimate = motionAllowed
		? {
				...(animateOpacity ? { opacity: 1 } : {}),
				...(animateY ? { x: 0, y: 0 } : {}),
				...(animateScale ? { scale: 1 } : {}),
			}
		: undefined;
	const panelExit = motionAllowed
		? {
				...(animateOpacity ? { opacity: 0 } : {}),
				...(animateY
					? {
							...(offset.x ? { x: offset.x } : {}),
							...(offset.y ? { y: offset.y } : {}),
						}
					: {}),
				...(animateScale ? { scale: 0.98 } : {}),
			}
		: undefined;

	return (
		<Portal target={portalTargetId}>
			<div className="fixed top-0 pointer-events-auto w-full vh-max inset-0 z-80">
				<motion.div
					key="modal-backdrop"
					className={[
						"absolute will-change-opacity inset-0 z-[81] bg-gradient-to-b from-black/25 to-black/70",
						backdropClassName,
					]
						.filter(Boolean)
						.join(" ")}
					initial={backdropInitial}
					animate={backdropAnimate}
					exit={backdropExit}
					transition={motionAllowed ? overlayTransition : undefined}
					onClick={requestClose}
				/>

				<motion.div
					ref={wrapperRef}
					key="modal-panel-wrapper"
					className={[
						"relative z-[82] flex will-change-opacity h-full w-full items-center justify-center p-[50px]",
						panelWrapperClassName,
					]
						.filter(Boolean)
						.join(" ")}
					initial={panelWrapperInitial}
					animate={panelWrapperAnimate}
					exit={panelWrapperExit}
					transition={motionAllowed ? overlayTransition : undefined}
					aria-modal="true"
					role="dialog"
					aria-label={ariaLabel}
					tabIndex={-1}
					onClick={requestClose}
				>
					<Panel
						as={motion.div}
						display="flex"
						columns={1}
						className={[DEFAULT_PANEL, panelClassName]
							.filter(Boolean)
							.join(" ")}
						style={panelStyle}
						// transition={
						// \tmotionAllowed
						// \t\t? { ...panelTransition, delay: 0.04 }
						// \t\t: undefined
						// }
						initial={panelInitial}
						animate={panelAnimate}
						exit={panelExit}
						transition={motionAllowed ? panelTransition : undefined}
						onClick={(event: MouseEvent<HTMLDivElement>) =>
							event.stopPropagation()
						}
					>
						<ModalShellContext.Provider
							value={{
								beginSubmission,
								endSubmission,
								isSubmitting,
								onClose: requestClose,
							}}
						>
							{children}
						</ModalShellContext.Provider>
					</Panel>
				</motion.div>
			</div>
		</Portal>
	);
}
