// ModalShell.tsx
"use client";

import { motion } from "framer-motion";
import { type CSSProperties, type ReactNode, useEffect } from "react";
import { Panel } from "@/components/layout/primitives/Panel";
import Portal from "@/components/Portal";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type ModalShellProps = {
	onClose: () => void;
	children: ReactNode;
	portalTargetId?: string;
	animate?: {
		y?: boolean;
		opacity?: boolean;
		scale?: boolean;
	};
	disableWhenReducedMotion?: boolean;

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
	"flex will-change-opacity max-w-full w-[450px] max-w-lg overflow-hidden overflow-y-auto rounded-[20px] border border-border/15 bg-white";

export function ModalShell({
	onClose,
	children,
	portalTargetId = "modal-root",
	animate = { y: true, opacity: true },
	disableWhenReducedMotion = true,
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

	const motionAllowed = useMotionAllowed(disableWhenReducedMotion);
	const animateY = animate?.y ?? true;
	const animateOpacity = animate?.opacity ?? true;
	const animateScale = animate?.scale ?? true;

	const backdropInitial = motionAllowed
		? { ...(animateOpacity ? { opacity: 0 } : {}) }
		: undefined;
	const backdropAnimate = motionAllowed
		? { ...(animateOpacity ? { opacity: 1 } : {}) }
		: undefined;
	const backdropExit = motionAllowed
		? { ...(animateOpacity ? { opacity: 0 } : {}) }
		: undefined;

	const wrapperInitial = motionAllowed
		? { ...(animateOpacity ? { opacity: 0 } : {}) }
		: undefined;
	const wrapperAnimate = motionAllowed
		? { ...(animateOpacity ? { opacity: 1 } : {}) }
		: undefined;
	const wrapperExit = motionAllowed
		? { ...(animateOpacity ? { opacity: 0 } : {}) }
		: undefined;

	const wrapperPanelInitial = motionAllowed
		? {
				...(animateOpacity ? { opacity: 0 } : {}),
				...(animateY ? { y: 24 } : {}),
				...(animateScale ? { scale: 0.98 } : {}),
			}
		: undefined;
	const wrapperPanelAnimate = motionAllowed
		? {
				...(animateOpacity ? { opacity: 1 } : {}),
				...(animateY ? { y: 0 } : {}),
				...(animateScale ? { scale: 1 } : {}),
			}
		: undefined;
	const wrapperPanelExit = motionAllowed
		? {
				...(animateOpacity ? { opacity: 0 } : {}),
				...(animateY ? { y: 24 } : {}),
				...(animateScale ? { scale: 0.98 } : {}),
			}
		: undefined;

	return (
		<Portal target={portalTargetId}>
			<div className="fixed top-0 w-full vh-max inset-0 z-80">
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
					onClick={onClose}
				/>

				<motion.div
					key="modal-panel-wrapper"
					className={[
						"relative z-[82] flex will-change-opacity h-full w-full items-center justify-center px-section-x py-10",
						wrapperClassName,
					]
						.filter(Boolean)
						.join(" ")}
					initial={wrapperPanelInitial}
					animate={wrapperPanelAnimate}
					exit={wrapperPanelExit}
					transition={motionAllowed ? panelTransition : undefined}
					aria-modal="true"
					role="dialog"
				>
					<Panel
						as={motion.div}
						display="flex"
						columns={1}
						className={[DEFAULT_PANEL, panelClassName]
							.filter(Boolean)
							.join(" ")}
						style={
							panelStyle ?? { boxShadow: "2px 4px 15px 0 rgba(2,2,2,0.03)" }
						}
						transition={
							motionAllowed ? { ...panelTransition, delay: 0.04 } : undefined
						}
						onClick={(e) => e.stopPropagation()}
					>
						{children}
					</Panel>
				</motion.div>
			</div>
		</Portal>
	);
}
