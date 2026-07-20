"use client";

import * as React from "react";
import Portal from "@/components/ui/overlays/Portal";

type ModalShellProps = {
	ariaLabel?: string;
	backdropClassName?: string;
	children: React.ReactNode;
	isTopMost?: boolean;
	onClose: () => void;
	panelClassName?: string;
	panelStyle?: React.CSSProperties;
	panelWrapperClassName?: string;
	portalTargetId?: string;
};

type ModalShellContextValue = {
	beginSubmission: () => boolean;
	endSubmission: () => void;
	isSubmitting: boolean;
	onClose: () => void;
};

const ModalShellContext = React.createContext<ModalShellContextValue | null>(
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

export function ModalShell({
	ariaLabel,
	backdropClassName,
	children,
	isTopMost = true,
	onClose,
	panelClassName,
	panelStyle,
	panelWrapperClassName,
	portalTargetId,
}: ModalShellProps) {
	const submissionRef = React.useRef(false);
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

	React.useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (!isTopMost || event.key !== "Escape") return;
			event.preventDefault();
			event.stopPropagation();
			if (!submissionRef.current) onClose();
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isTopMost, onClose]);

	return (
		<Portal target={portalTargetId}>
			<div
				className={[
					"fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-4 backdrop-blur-[2px]",
					backdropClassName,
				]
					.filter(Boolean)
					.join(" ")}
			>
				<button
					type="button"
					aria-label="Close modal"
					className="absolute inset-0"
					onClick={requestClose}
				/>
				<div
					aria-label={ariaLabel}
					aria-modal="true"
					className={["relative w-full max-w-lg", panelWrapperClassName]
						.filter(Boolean)
						.join(" ")}
					role="dialog"
				>
					<div
						className={[
							"relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl",
							panelClassName,
						]
							.filter(Boolean)
							.join(" ")}
						style={panelStyle}
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
					</div>
				</div>
			</div>
		</Portal>
	);
}
