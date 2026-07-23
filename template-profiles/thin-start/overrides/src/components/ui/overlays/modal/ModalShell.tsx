"use client";

import clsx from "clsx";
import * as React from "react";
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

type ModalShellProps = {
	ariaLabel?: string;
	children: React.ReactNode;
	isTopMost?: boolean;
	layerIndex?: number;
	onClose: () => void;
	placement?: "center" | "top";
	portalTargetId?: string;
};

type ModalShellContextValue = { onClose: () => void };
type ModalHeaderContextValue = { leadingIcon?: React.ReactNode };

const ModalShellContext = React.createContext<ModalShellContextValue | null>(
	null,
);
const ModalHeaderContext = React.createContext<ModalHeaderContextValue | null>(
	null,
);

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
			!node.hidden &&
			node.getClientRects().length > 0 &&
			node.getAttribute("aria-hidden") !== "true" &&
			!node.closest("[inert]"),
	);
}

export function ModalShell({
	ariaLabel,
	children,
	isTopMost = true,
	layerIndex,
	onClose,
	placement = "center",
	portalTargetId,
}: ModalShellProps) {
	const wrapperRef = React.useRef<HTMLDivElement | null>(null);
	const previousActiveElementRef = React.useRef<HTMLElement | null>(null);

	React.useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (!isTopMost) return;
			if (event.key === "Escape") {
				event.preventDefault();
				onClose();
				return;
			}
			if (event.key !== "Tab" || !wrapperRef.current) return;
			const focusable = getFocusableElements(wrapperRef.current);
			if (focusable.length === 0) {
				event.preventDefault();
				wrapperRef.current.focus();
				return;
			}
			const first = focusable[0];
			const last = focusable.at(-1);
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last?.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first?.focus();
			}
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isTopMost, onClose]);

	React.useLayoutEffect(() => {
		previousActiveElementRef.current =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;
		const wrapper = wrapperRef.current;
		if (wrapper && isTopMost) {
			(getFocusableElements(wrapper)[0] ?? wrapper).focus();
		}
		return () => previousActiveElementRef.current?.focus();
	}, [isTopMost]);

	React.useEffect(() => {
		const body = document.body;
		const currentCount = Number(body.dataset.modalOpenCount ?? "0");
		if (currentCount === 0) {
			body.dataset.modalPrevOverflow = body.style.overflow;
			body.style.overflow = "hidden";
		}
		body.dataset.modalOpenCount = String(currentCount + 1);
		return () => {
			const nextCount = Number(body.dataset.modalOpenCount ?? "1") - 1;
			if (nextCount <= 0) {
				body.style.overflow = body.dataset.modalPrevOverflow ?? "";
				delete body.dataset.modalOpenCount;
				delete body.dataset.modalPrevOverflow;
			} else {
				body.dataset.modalOpenCount = String(nextCount);
			}
		};
	}, []);

	return (
		<Portal target={portalTargetId}>
			<div
				className={clsx(
					"fixed inset-0 z-50 flex justify-center overflow-hidden overscroll-contain px-4 sm:px-6",
					placement === "top"
						? "items-start py-[9vh]"
						: "items-center py-4 sm:py-6",
				)}
				data-modal-shell=""
				style={layerIndex ? { zIndex: layerIndex } : undefined}
			>
				<button
					aria-label="Close modal"
					className="absolute inset-0 bg-background/20 backdrop-blur-md"
					onClick={onClose}
					type="button"
				/>
				<div
					aria-label={ariaLabel}
					aria-modal="true"
					className="relative flex max-h-[calc(100dvh-2rem)] w-full min-w-0 justify-center sm:max-h-[calc(100dvh-3rem)]"
					ref={wrapperRef}
					role="dialog"
					tabIndex={-1}
				>
					<ModalShellContext.Provider value={{ onClose }}>
						{children}
					</ModalShellContext.Provider>
				</div>
			</div>
		</Portal>
	);
}

type ModalHeaderProps = React.ComponentPropsWithoutRef<"div"> & {
	actions?: React.ReactNode;
	closeDisabled?: boolean;
	closeLabel?: string;
	leadingIcon?: React.ReactNode;
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
							autoFocus
							disabled={closeDisabled}
							onClick={closeHandler}
							size="icon-sm"
							type="button"
							variant="ghost"
						>
							<span aria-hidden>×</span>
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
}: React.ComponentProps<typeof CardTitle> & {
	leadingIcon?: React.ReactNode;
}) {
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
