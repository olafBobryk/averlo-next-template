// components/ui/helpers/useCopyAction.tsx
"use client";

import * as React from "react";
import { IconSwap } from "@/components/ui/helpers/IconSwap";
import { Icon } from "@/components/ui/icons/Icon";
import { showToast } from "@/lib/feedback";

type CopyActionOptions = {
	value?: string;
	getValue?: () => string;
	onCopy?: (value: string) => void | Promise<void>;
	copiedDurationMs?: number;
	toastMessage?: string | false;
};

type CopyActionResult = {
	copied: boolean;
	handleCopy: () => Promise<void>;
};

type CopyStatusIconProps = {
	copied?: boolean;
	size?: "sm" | "md" | "lg";
	className?: string;
};

export function CopyStatusIcon({
	copied = false,
	size = "sm",
	className,
}: CopyStatusIconProps) {
	return (
		<IconSwap
			size={size}
			className={className}
			activeIndex={copied ? 1 : 0}
			items={[
				{ icon: <Icon name="copy" size={size} animate /> },
				{ icon: <Icon name="check" size={size} animate /> },
			]}
		/>
	);
}

export function useCopyAction({
	value,
	getValue,
	onCopy,
	copiedDurationMs = 1500,
	toastMessage = "Copied to clipboard",
}: CopyActionOptions): CopyActionResult {
	const [copied, setCopied] = React.useState(false);
	const timeoutRef = React.useRef<number | null>(null);

	React.useEffect(
		() => () => {
			if (timeoutRef.current) {
				window.clearTimeout(timeoutRef.current);
			}
		},
		[],
	);

	const resolveValue = React.useCallback(() => {
		if (typeof getValue === "function") return getValue();
		return value ?? "";
	}, [getValue, value]);

	const handleCopy = React.useCallback(async () => {
		const resolvedValue = resolveValue();
		try {
			if (onCopy) {
				await onCopy(resolvedValue);
			} else if (navigator?.clipboard?.writeText) {
				await navigator.clipboard.writeText(resolvedValue);
			} else {
				return;
			}

			if (toastMessage !== false) {
				showToast.success(toastMessage);
			}
			setCopied(true);
			if (timeoutRef.current) {
				window.clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = window.setTimeout(
				() => setCopied(false),
				copiedDurationMs,
			);
		} catch {
			// no-op
		}
	}, [copiedDurationMs, onCopy, resolveValue, toastMessage]);

	return { copied, handleCopy };
}
