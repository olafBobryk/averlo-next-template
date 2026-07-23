"use client";

import clsx from "clsx";
import Link from "next/link";
import type { MouseEventHandler } from "react";
import { focusRing } from "@/components/ui/foundations/focus";
import {
	CopyStatusIcon,
	useCopyAction,
} from "@/components/ui/helpers/useCopyAction";
import type { DashboardDetailFieldProps } from "./DashboardDetailField.shared";

export function DashboardDetailFieldClient({
	actionLabel,
	className,
	copyLabel = "Copy value",
	copyValue,
	disabled = false,
	href,
	icon,
	label,
	labelClassName,
	onClick,
	truncateValue = true,
	value,
	valueClassName: valueClassNameProp,
}: DashboardDetailFieldProps) {
	const copyTarget = copyValue?.trim() ?? "";
	const isCopyable = copyTarget.length > 0;
	const { copied, handleCopy } = useCopyAction({
		toastMessage: "Copied to clipboard",
		value: copyTarget,
	});
	const interactive = Boolean(href || onClick || isCopyable);
	const valueClassName = clsx(
		"min-w-0 text-sm font-medium text-foreground",
		truncateValue && "truncate",
		valueClassNameProp,
	);
	const controlClassName = clsx(
		"inline-flex max-w-full min-w-0 rounded-sm text-left outline-none transition-opacity motion-interactive hover:opacity-70 disabled:pointer-events-none disabled:opacity-50",
		focusRing.visibleDefault,
		valueClassName,
	);
	return (
		<div
			className={clsx("grid min-w-0 self-start content-start gap-2", className)}
		>
			<dt
				className={clsx(
					"flex items-center gap-2 text-xs font-medium text-muted-foreground",
					labelClassName,
				)}
			>
				{icon}
				{label}
			</dt>
			<dd className="min-w-0">
				{href ? (
					<Link
						aria-label={actionLabel}
						className={controlClassName}
						href={href}
						onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
					>
						{value}
					</Link>
				) : interactive ? (
					<button
						aria-label={actionLabel ?? (isCopyable ? copyLabel : undefined)}
						className={controlClassName}
						disabled={disabled}
						onClick={
							(onClick ?? handleCopy) as MouseEventHandler<HTMLButtonElement>
						}
						type="button"
					>
						<span className="inline-flex min-w-0 items-center gap-2">
							<span className="truncate">{value}</span>
							{isCopyable ? (
								<CopyStatusIcon
									className="size-3.5 shrink-0 text-muted-foreground"
									copied={copied}
								/>
							) : null}
						</span>
					</button>
				) : (
					<span className={valueClassName}>{value}</span>
				)}
			</dd>
		</div>
	);
}
