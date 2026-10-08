import clsx from "clsx";
import type * as React from "react";
import { Icon, type IconName } from "@/components/ui/icons/Icon";
import type { AccentTone } from "./accent";
import { Button } from "./Button";

export type StatusMessageTone = Exclude<AccentTone, "neutral">;
export type StatusMessageProps = React.HTMLAttributes<HTMLDivElement> & {
	tone?: StatusMessageTone;
	heading?: React.ReactNode;
	iconName?: IconName;
	action?: React.ReactNode;
	onDismiss?: () => void;
	dismissLabel?: string;
	descriptionOnNewLine?: boolean;
};
const toneIcons: Record<StatusMessageTone, IconName> = {
	danger: "warning",
	warning: "warning",
	info: "info",
	success: "check",
};
const toneColors: Record<StatusMessageTone, string> = {
	danger: "var(--button-danger)",
	warning: "var(--button-warning)",
	info: "var(--primary)",
	success: "var(--success)",
};

export function StatusMessageSurface({
	children,
	className,
	style,
	tone = "info",
	heading,
	iconName,
	action,
	onDismiss,
	dismissLabel = "Dismiss notice",
	descriptionOnNewLine = false,
	role,
	...rest
}: StatusMessageProps) {
	return (
		<div
			{...rest}
			role={role ?? (tone === "danger" ? "alert" : "status")}
			data-slot="status-message"
			data-accent={tone}
			data-solid-accent-background
			className={clsx(
				"min-w-0 rounded-lg border p-3 text-sm leading-5",
				className,
			)}
			style={{
				backgroundColor: `color-mix(in srgb, var(--popover) 92%, ${toneColors[tone]} 8%)`,
				borderColor: `color-mix(in srgb, ${toneColors[tone]} 30%, transparent)`,
				...style,
			}}
		>
			<div className="flex min-w-0 flex-wrap items-start gap-x-3 gap-y-2">
				<div
					className={clsx(
						"flex min-w-0 flex-1 basis-48 items-start gap-2",
						(action || onDismiss) && "pt-1",
					)}
				>
					<Icon
						name={iconName ?? toneIcons[tone]}
						aria-hidden="true"
						className="mt-0.5 shrink-0 text-foreground"
						style={{ width: 16, height: 16 }}
					/>
					<div className="min-w-0 [overflow-wrap:anywhere]">
						{heading && (
							<span className="font-medium text-foreground">{heading}</span>
						)}
						{!descriptionOnNewLine && (
							<div
								className={clsx(
									"inline text-muted-foreground [overflow-wrap:anywhere]",
									heading && "ms-2",
								)}
							>
								{children}
							</div>
						)}
					</div>
				</div>
				{(action || onDismiss) && (
					<div className="flex max-w-full flex-wrap items-start gap-2">
						{action}
						{onDismiss && (
							<Button
								variant="ghost"
								size="compact"
								shape="square"
								aria-label={dismissLabel}
								onClick={onDismiss}
								leadingIcon={<Icon name="close" />}
							/>
						)}
					</div>
				)}
			</div>
			{descriptionOnNewLine && (
				<div className="mt-1 text-muted-foreground [overflow-wrap:anywhere]">
					{children}
				</div>
			)}
		</div>
	);
}
