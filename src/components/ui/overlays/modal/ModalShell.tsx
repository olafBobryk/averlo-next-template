// ModalShell.tsx
"use client";

import { motion } from "motion/react";
import {
	type CSSProperties,
	type MouseEvent,
	type ReactNode,
	useEffect,
} from "react";
import Portal from "@/components/ui/overlays/Portal";
import { Panel } from "@/components/ui/primitives/Panel";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type ModalShellProps = {
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
};

const overlayTransition = {
	duration: 0.32,
	ease: [0.2, 0.8, 0.2, 1] as const,
};

const panelTransition = {
	duration: 0.26,
	ease: [0.16, 1, 0.3, 1] as const,
};

const DEFAULT_PANEL =
	"flex will-change-opacity max-w-full w-[450px] max-w-lg overflow-hidden overflow-y-auto";

export function ModalShell({
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
}: ModalShellProps) {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

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
					onClick={onClose}
				/>

				<motion.div
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
					onClick={onClose}
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
						{children}
					</Panel>
				</motion.div>
			</div>
		</Portal>
	);
}
