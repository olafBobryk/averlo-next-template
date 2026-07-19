"use client";

import type { ReactNode } from "react";
import Portal from "@/components/ui/overlays/Portal";

type ModalShellProps = {
	backdropClassName?: string;
	children: ReactNode;
	isTopMost?: boolean;
	onClose: () => void;
	panelClassName?: string;
	panelStyle?: React.CSSProperties;
	panelWrapperClassName?: string;
	portalTargetId?: string;
};

export function ModalShell({
	backdropClassName,
	children,
	isTopMost: _isTopMost,
	onClose,
	panelClassName,
	panelStyle,
	panelWrapperClassName,
	portalTargetId,
}: ModalShellProps) {
	return (
		<Portal target={portalTargetId}>
			<div
				className={[
					"fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4",
					backdropClassName,
				]
					.filter(Boolean)
					.join(" ")}
			>
				<button
					type="button"
					aria-label="Close modal"
					className="absolute inset-0"
					onClick={onClose}
				/>
				<div
					className={["relative w-full max-w-lg", panelWrapperClassName]
						.filter(Boolean)
						.join(" ")}
				>
					<div
						className={[
							"relative rounded-md border border-border bg-background p-6 shadow-xl",
							panelClassName,
						]
							.filter(Boolean)
							.join(" ")}
						style={panelStyle}
					>
						{children}
					</div>
				</div>
			</div>
		</Portal>
	);
}
