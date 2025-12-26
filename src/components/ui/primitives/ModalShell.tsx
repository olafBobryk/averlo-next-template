// components/ui/ModalShell.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useEffect } from "react";
import Portal from "@/components/Portal";

type ModalShellProps = {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	/** Optional override, defaults to "modal-root" */
	portalTargetId?: string;
};

const overlayTransition = {
	duration: 0.32, // motion-macro
	ease: [0.2, 0.8, 0.2, 1] as const,
};

const panelTransition = {
	duration: 0.26, // motion-component
	ease: [0.16, 1, 0.3, 1] as const,
};

export function ModalShell({
	isOpen,
	onClose,
	children,
	portalTargetId = "modal-root",
}: ModalShellProps) {
	// Close on Esc
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	return (
		<Portal target={portalTargetId}>
			{/* Always mounted – just toggling visibility & interactivity */}
			<div
				className={`absolute top-0 left-0 z-80 w-full h-full ${
					isOpen ? "pointer-events-auto" : "pointer-events-none"
				}`}
			>
				{/* <div className="relative w-full h-full">
					<div className="sticky top-0 h-full w-full max-h-screen overflow-hidden"> */}
				<AnimatePresence>
					{isOpen && (
						<>
							{/* Backdrop / blurred background */}
							<motion.div
								key="modal-backdrop"
								className="absolute inset-0 z-[81] bg-gradient-to-b from-black/25 to-black/70"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={overlayTransition}
								onClick={onClose}
							/>

							{/* Panel wrapper to center the modal */}
							<motion.div
								key="modal-panel-wrapper"
								className="relative z-[82] flex h-full w-full pointer-events-none items-center justify-center px-4 py-10"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={panelTransition}
								aria-modal="true"
								role="dialog"
							>
								{/* Inner container using your style, but empty for reusable content */}
								<motion.div
									className="flex max-w-full w-[450px] max-h-full overflow-hidden overflow-y-auto pointer-events-auto rounded-[20px] border border-[#020202]/[0.15] bg-white"
									style={{
										boxShadow: "2px 4px 15px 0 rgba(2,2,2,0.03)",
									}}
									initial={{ opacity: 0, y: 24, scale: 0.98 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: 24, scale: 0.98 }}
									transition={{ ...panelTransition, delay: 0.04 }} // slight delay after backdrop
								>
									{/* Content shell – just padding, you control everything inside */}
									<div className="flex w-full flex-col">
										{/*
                      You can pass onClose down to your content component, e.g.:

                      <ModalShell ...>
                        <JobNotesContent onClose={onClose} />
                      </ModalShell>
                    */}
										{children}
									</div>
								</motion.div>
							</motion.div>
						</>
					)}
				</AnimatePresence>
			</div>
			{/* </div>
			</div> */}
		</Portal>
	);
}
