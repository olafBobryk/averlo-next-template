"use client";

import clsx from "clsx";
import * as React from "react";
import { Chip, type ChipTone } from "@/components/ui/misc/Chip";
import { Loader } from "@/components/ui/misc/Loader";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";

type HealthServiceStatus = {
	status: "healthy" | "unhealthy";
	message: string;
	latencyMs?: number;
};

type AppHealthResponse = {
	status: "healthy" | "degraded";
	checkedAt: string;
	services: {
		app: HealthServiceStatus;
		supabase: HealthServiceStatus;
	};
};

type HealthCheckIndicatorProps = {
	endpoint?: string;
	label?: string;
	className?: string;
	variant?: "default" | "sm";
};

type IndicatorState = "checking" | "operational" | "unavailable";

const statusStyles: Record<IndicatorState, { dot: string; tone: ChipTone }> = {
	checking: {
		dot: "text-muted",
		tone: "neutral",
	},
	operational: {
		dot: "bg-success",
		tone: "success",
	},
	unavailable: {
		dot: "bg-danger",
		tone: "danger",
	},
};

function getIndicatorState(
	response: AppHealthResponse | null,
	isChecking: boolean,
): IndicatorState {
	if (isChecking) return "checking";
	if (response?.services.supabase.status === "healthy") return "operational";
	return "unavailable";
}

function getStatusLabel(state: IndicatorState) {
	switch (state) {
		case "checking":
			return "Checking";
		case "operational":
			return "Operational";
		case "unavailable":
			return "Unavailable";
	}
}

function withRefreshParam(endpoint: string, requestIndex: number) {
	const separator = endpoint.includes("?") ? "&" : "?";
	return `${endpoint}${separator}refresh=${requestIndex}`;
}

export function HealthCheckIndicator({
	endpoint = "/api/health",
	label = "Service",
	className,
	variant = "default",
}: HealthCheckIndicatorProps) {
	const [response, setResponse] = React.useState<AppHealthResponse | null>(
		null,
	);
	const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
	const [isChecking, setIsChecking] = React.useState(true);
	const [requestIndex, setRequestIndex] = React.useState(0);

	React.useEffect(() => {
		let isActive = true;

		async function checkHealth() {
			setIsChecking(true);
			setErrorMessage(null);

			try {
				const healthResponse = await fetch(
					withRefreshParam(endpoint, requestIndex),
					{
						cache: "no-store",
					},
				);
				const payload = (await healthResponse.json()) as AppHealthResponse;

				if (!isActive) return;

				setResponse(payload);
				if (!healthResponse.ok) {
					setErrorMessage(payload.services.supabase.message);
				}
			} catch (error) {
				if (!isActive) return;

				setResponse(null);
				setErrorMessage(
					error instanceof Error ? error.message : "Unable to check health.",
				);
			} finally {
				if (isActive) {
					setIsChecking(false);
				}
			}
		}

		checkHealth();

		return () => {
			isActive = false;
		};
	}, [endpoint, requestIndex]);

	const state = getIndicatorState(response, isChecking);
	const statusLabel = getStatusLabel(state);
	const styles = statusStyles[state];
	const message =
		response?.services.supabase.message ?? errorMessage ?? "Checking health.";
	const latency =
		typeof response?.services.supabase.latencyMs === "number"
			? `${response.services.supabase.latencyMs}ms`
			: null;

	if (variant === "sm") {
		return (
			<Chip
				as="div"
				contentMode="contents"
				size="none"
				tone={styles.tone}
				className={clsx(
					"min-w-0 gap-2 px-3 py-1.5 shadow-[0_8px_24px_rgb(0_0_0_/_0.04)] backdrop-blur",
					className,
				)}
				aria-live="polite"
				title={latency ? `${message} ${latency}` : message}
			>
				<span className="flex h-3 w-3 shrink-0 items-center justify-center">
					{state === "checking" ? (
						<Loader size="sm" className={styles.dot} />
					) : (
						<span className={clsx("h-2 w-2 rounded-full", styles.dot)} />
					)}
				</span>
				<Text
					as="span"
					variant="caption"
					theme="inherit"
					tone="inherit"
					className="truncate"
				>
					{label}: {statusLabel}
				</Text>
			</Chip>
		);
	}

	return (
		<Chip
			as="div"
			contentMode="contents"
			size="none"
			tone={styles.tone}
			className={clsx(
				"overflow-hidden gap-2 px-3 py-1.5 shadow-[0_8px_24px_rgb(0_0_0_/_0.04)] backdrop-blur",
				className,
			)}
			aria-live="polite"
			title={latency ? `${message} ${latency}` : message}
		>
			<span className="flex h-3 w-3 items-center justify-center">
				{state === "checking" ? (
					<Loader size="sm" className={styles.dot} />
				) : (
					<span className={clsx("h-2 w-2 rounded-full", styles.dot)} />
				)}
			</span>
			<Text
				as="span"
				variant="caption"
				theme="inherit"
				tone="inherit"
				className="whitespace-nowrap"
			>
				{label}: {statusLabel}
			</Text>
			<Button
				type="button"
				variant="ghost"
				textVariant={"caption"}
				size="none"
				className="text-2xs font-medium text-foreground/80 hover:text-foreground"
				disabled={isChecking}
				onClick={() => setRequestIndex((current) => current + 1)}
			>
				Refresh
			</Button>
		</Chip>
	);
}
