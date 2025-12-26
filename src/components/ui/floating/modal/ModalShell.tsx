// ModalShell.tsx
"use client";

import { motion } from "framer-motion";
import { type CSSProperties, type ReactNode, useEffect } from "react";
import Portal from "@/components/Portal";

type ModalShellProps = {
	onClose: () => void;
	children: ReactNode;
	portalTargetId?: string;

	// NEW
	panelClassName?: string;
	wrapperClassName?: string;
	backdropClassName?: string;
	panelStyle?: CSSProperties;
};

const overlayTransition = {
	duration: 0.32,
	ease: [0.2, 0.8, 0.2, 1] as const,
};

const panelTransition = {
	duration: 0.26,
	ease: [0.16, 1, 0.3, 1] as const,
};

// TODO: Swap the default panel classes below to match your project's design tokens.
const DEFAULT_PANEL =
	"flex max-w-full w-[450px] max-h-full overflow-hidden overflow-y-auto rounded-[20px] border border-border/15 bg-white";

export function ModalShell({
	onClose,
	children,
	portalTargetId = "modal-root",
	panelClassName,
	wrapperClassName,
	backdropClassName,
	panelStyle,
}: ModalShellProps) {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	return (
		<Portal target={portalTargetId}>
			<div className="sticky top-0 w-full h-screen inset-0 z-80">
				<motion.div
					key="modal-backdrop"
					className={[
						"absolute inset-0 z-[81] bg-gradient-to-b from-black/25 to-black/70",
						backdropClassName,
					]
						.filter(Boolean)
						.join(" ")}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={overlayTransition}
					onClick={onClose}
				/>

				<motion.div
					key="modal-panel-wrapper"
					className={[
						"relative z-[82] flex h-full w-full items-center justify-center px-4 py-10",
						wrapperClassName,
					]
						.filter(Boolean)
						.join(" ")}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={panelTransition}
					aria-modal="true"
					role="dialog"
				>
					<motion.div
						className={[DEFAULT_PANEL, panelClassName].filter(Boolean).join(" ")}
						style={
							panelStyle ?? { boxShadow: "2px 4px 15px 0 rgba(2,2,2,0.03)" }
						}
						initial={{ opacity: 0, y: 24, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 24, scale: 0.98 }}
						transition={{ ...panelTransition, delay: 0.04 }}
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex w-full flex-col">{children}</div>
					</motion.div>
				</motion.div>
			</div>
		</Portal>
	);
}
