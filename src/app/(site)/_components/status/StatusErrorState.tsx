"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/primitives/Button";
import { StatusContent } from "./StatusContent";

type StatusErrorStateProps = {
	error: globalThis.Error & { digest?: string };
	reset: () => void;
	href: string;
	hrefLabel: string;
	enableRevealMotion?: boolean;
};

export function StatusErrorState({
	error,
	reset,
	href,
	hrefLabel,
	enableRevealMotion = true,
}: StatusErrorStateProps) {
	const [showDetails, setShowDetails] = useState(false);
	const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
		"idle",
	);
	const errorDetails = `${String(error.message || "Unknown error")}${
		error.digest ? `\n\nDigest: ${error.digest}` : ""
	}`;

	useEffect(() => {
		console.error(error);
	}, [error]);

	useEffect(() => {
		if (copyStatus === "idle") {
			return;
		}

		const timeout = window.setTimeout(() => setCopyStatus("idle"), 1600);

		return () => window.clearTimeout(timeout);
	}, [copyStatus]);

	async function handleCopyDetails() {
		try {
			await navigator.clipboard.writeText(errorDetails);
			setCopyStatus("copied");
		} catch {
			setCopyStatus("failed");
		}
	}

	return (
		<StatusContent
			heading="Something went wrong"
			body="The page failed to render. You can try again or go back."
			enableRevealMotion={enableRevealMotion}
			actions={
				<>
					<Button variant="primary" onClick={() => reset()}>
						Try again
					</Button>
					<Button variant="outline" href={href}>
						{hrefLabel}
					</Button>
					<Button
						variant="ghost"
						onClick={() => setShowDetails((value) => !value)}
					>
						{showDetails ? "Hide details" : "Show details"}
					</Button>
				</>
			}
			details={
				showDetails ? (
					<div className="mt-4 flex w-full flex-col items-center gap-3">
						<pre className="max-h-48 w-full overflow-auto rounded-lg border border-border/15 bg-surface p-4 text-left text-xs leading-relaxed text-foreground/80">
							{errorDetails}
						</pre>
						<Button variant="outline" onClick={handleCopyDetails}>
							{copyStatus === "copied"
								? "Copied"
								: copyStatus === "failed"
									? "Copy failed"
									: "Copy error"}
						</Button>
					</div>
				) : null
			}
		/>
	);
}
